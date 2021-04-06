import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import {
  Button,
  Form as BForm,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import styled from 'styled-components';
import { FormLabel, FormSubmit } from '../../styled/Forms';
import { FlexAlignItemsCenter } from '../../styled/Flex';
import SelectCustom from '../../SelectCustom';
import IdentIcon from '../../IdentIcon';
import useAPI from '../../../hooks/useApi';
import {
  bs58Validation,
  convertXTZToMutez,
  convertMutezToXTZ,
  limitInputDecimals,
  convertAssetSubunitToAssetAmount,
  convertAssetAmountToAssetSubunit,
} from '../../../utils/helpers';
import { useContractStateContext } from '../../../store/contractContext';
import { useOperationsDispatchContext } from '../../../store/operationsContext';
import { useAssetsStateContext } from '../../../store/assetsContext';
import { handleError } from '../../../utils/errorsHandler';
import XTZ from '../../../assets/img/assets/xtz-256.svg';

const BtnMax = styled(Button).attrs({ variant: 'link' })`
  padding: 0;
  margin-right: 5px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.blue};

  &:hover,
  &:focus {
    text-decoration: none;
    color: #249ac2;
  }
`;

const schema = (maxAmount = 30000, minAmount = 0.000001, asset = 'XTZ') => {
  return Yup.object({
    asset: Yup.object().required('Required'),
    tokenID: Yup.number().when('asset', {
      is: (assetField) => assetField.contract_type === 'FA2',
      then: Yup.number()
        .required('Required')
        .integer('Value must be an integer')
        .max(
          Number.MAX_SAFE_INTEGER,
          `Maximum value is ${Number.MAX_SAFE_INTEGER}`,
        )
        .min(0, `Minimum amount is 0.000001 ${asset}`),
      otherwise: Yup.number().max(0, 'Token ID is allowed only for FA2 assets'),
    }),
    amount: Yup.number()
      .required('Required')
      .max(maxAmount, `Maximum amount is ${maxAmount} ${asset}`)
      .min(minAmount, `Minimum amount is ${minAmount} ${asset}`),
    to: Yup.string()
      .required('Required')
      .matches(
        'tz1|tz2|tz3|KT1',
        'Tezos address must start with tz1, tz2, tz3, KT1',
      )
      .matches(/^\S+$/, 'No spaces are allowed')
      .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
      .length(36, 'Tezos address must be 36 characters long')
      .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
  });
};

const formXTZAsset = (balance) => ({
  value: 'xtz',
  label: (
    <FlexAlignItemsCenter>
      <img
        src={XTZ}
        width="24px"
        alt="XTZ"
        style={{ marginRight: '5px', display: 'inline-block' }}
      />
      XTZ
    </FlexAlignItemsCenter>
  ),
  scale: 6,
  balance: convertMutezToXTZ(balance),
});

const CreateTx = ({ onCreate, onCancel }) => {
  const { sendOperation } = useAPI();
  const { assets } = useAssetsStateContext();
  const { contractAddress, contractInfo } = useContractStateContext();
  const { setOps } = useOperationsDispatchContext();

  const XTZAsset = useMemo(() => {
    return formXTZAsset(contractInfo.balance);
  }, [contractInfo]);

  const assetsOptions = useMemo(() => {
    if (!assets || !assets.length) return [XTZAsset];

    return [XTZAsset].concat(
      assets.map((asset) => ({
        ...asset,
        value: asset.name,
        label: (
          <FlexAlignItemsCenter>
            <div style={{ marginRight: '5px', display: 'inline-block' }}>
              <IdentIcon address={asset.address} scale={3} />
            </div>
            {asset.name}
          </FlexAlignItemsCenter>
        ),
        balance:
          asset.balances && asset.balances.length
            ? Number(
                convertAssetSubunitToAssetAmount(
                  asset.balances[0].balance,
                  asset.scale,
                ),
              )
            : 0,
      })),
    );
  }, [assets, XTZAsset]);

  const createTx = async ({ asset, tokenID, amount, to }, setSubmitting) => {
    try {
      const isXTZ = asset.value === 'xtz';

      const payload = {
        contract_id: contractAddress,
        // eslint-disable-next-line no-nested-ternary
        type: isXTZ
          ? 'transfer'
          : asset.contract_type === 'FA1.2'
          ? 'fa_transfer'
          : 'fa2_transfer',
      };

      if (isXTZ) {
        payload.amount = Number(convertXTZToMutez(amount));
        payload.to = to;
      } else {
        payload.asset_id = asset.address;
        payload.transfer_list = [
          {
            // from
            txs: [
              {
                amount: Number(
                  convertAssetAmountToAssetSubunit(amount, asset.scale),
                ),
                to,
                token_id: tokenID || undefined,
              },
            ],
          },
        ];
      }

      const newTx = await sendOperation(payload);
      await setOps((prev) => {
        return [newTx.data, ...prev];
      });
      onCreate();
    } catch (e) {
      handleError(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ asset: XTZAsset, tokenID: '', amount: '', to: '' }}
      enableReinitialize
      validationSchema={Yup.lazy((values) =>
        schema(
          values.asset.balance,
          convertAssetSubunitToAssetAmount(1, values.asset.scale),
          values.asset.ticker,
        ),
      )}
      onSubmit={async (values, { setSubmitting }) =>
        createTx(values, setSubmitting)
      }
    >
      {({
        values,
        isSubmitting,
        errors,
        touched,
        setFieldValue,
        setFieldTouched,
      }) => (
        <Form>
          <BForm.Group>
            <FormLabel>Select Asset</FormLabel>
            <SelectCustom
              options={assetsOptions}
              defaultValue={XTZAsset}
              isSearchable={false}
              isTouched={touched.asset}
              isValid={!errors.asset && touched.asset}
              isInvalid={!!errors.asset && touched.asset}
              menuWidth="100%"
              height="38px"
              onChange={(value) => {
                setFieldValue('asset', value);
                setFieldValue('amount', '');
                setFieldValue('tokenID', '');
                setFieldTouched('asset', true);
              }}
              onBlur={() => {
                setFieldTouched('asset', true);
              }}
            />
            <ErrorMessage
              name="asset"
              component={BForm.Control.Feedback}
              type="invalid"
            />
          </BForm.Group>

          <BForm.Group controlId="tokenID">
            <OverlayTrigger
              overlay={
                <Tooltip>
                  Token ID is needed for transferring FA2 assets.
                </Tooltip>
              }
            >
              <FormLabel>Enter Token ID</FormLabel>
            </OverlayTrigger>
            <Field
              as={BForm.Control}
              type="number"
              name="tokenID"
              aria-label="tokenID"
              isInvalid={!!errors.tokenID && touched.tokenID}
              isValid={!errors.tokenID && touched.tokenID}
              step="1"
              min="0"
              disabled={values.asset.contract_type !== 'FA2'}
            />
            <ErrorMessage
              component={BForm.Control.Feedback}
              name="tokenID"
              type="invalid"
            />
          </BForm.Group>

          <BForm.Group controlId="amount">
            <FormLabel>Enter Amount</FormLabel>
            <InputGroup>
              <Field
                as={BForm.Control}
                type="number"
                name="amount"
                aria-label="amount"
                isInvalid={!!errors.amount && touched.amount}
                isValid={!errors.amount && touched.amount}
                step="0.001"
                min="0"
                onKeyPress={(event) =>
                  limitInputDecimals(event, values.asset.scale)
                }
              />

              <InputGroup.Append>
                <InputGroup.Text style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <BtnMax
                      onClick={() => {
                        setFieldValue('amount', values.asset.balance);
                        setFieldTouched('amount', true, false);
                      }}
                    >
                      MAX
                    </BtnMax>
                    <span style={{ fontSize: '12px', marginBottom: '2px' }}>
                      {values.asset.balance}
                    </span>
                  </span>
                </InputGroup.Text>
              </InputGroup.Append>

              <ErrorMessage
                component={BForm.Control.Feedback}
                name="amount"
                type="invalid"
              />
            </InputGroup>
          </BForm.Group>

          <BForm.Group controlId="to">
            <FormLabel>Recipient</FormLabel>
            <Field
              as={BForm.Control}
              type="text"
              name="to"
              aria-label="to"
              isInvalid={!!errors.to && touched.to}
              isValid={!errors.to && touched.to}
            />
            <ErrorMessage
              component={BForm.Control.Feedback}
              name="to"
              type="invalid"
            />
          </BForm.Group>

          <FormSubmit>
            <Button
              variant="danger"
              style={{ marginRight: '10px' }}
              onClick={onCancel}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              Confirm
            </Button>
          </FormSubmit>
        </Form>
      )}
    </Formik>
  );
};

CreateTx.propTypes = {
  onCreate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CreateTx;
