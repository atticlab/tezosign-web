import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Button, Form as BForm, InputGroup } from 'react-bootstrap';
import FormLabelWithTooltip from '../../../FormLabelWithTooltip';
import { FormLabel, FormSubmit } from '../../../styled/Forms';
import { FlexAlignItemsCenter } from '../../../styled/Flex';
import SelectCustom from '../../../SelectCustom';
import IdentIcon from '../../../IdentIcon';
import useAPI from '../../../../hooks/useApi';
import {
  bs58Validation,
  convertXTZToMutez,
  limitInputDecimals,
  convertAssetSubunitToAssetAmount,
  convertAssetAmountToAssetSubunit,
} from '../../../../utils/helpers';
import { useContractStateContext } from '../../../../store/contractContext';
import { useOperationsDispatchContext } from '../../../../store/operationsContext';
import { useAssetsStateContext } from '../../../../store/assetsContext';
import { handleError } from '../../../../utils/errorsHandler';
import XTZ from '../../../../assets/img/assets/xtz-256.svg';

const schema = (minAmount = 0.000001, asset = 'XTZ') => {
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
        .min(0, 'Minimum value is 0'),
      otherwise: Yup.number().max(0, 'Token ID is allowed only for FA2 assets'),
    }),
    amount: Yup.number()
      .required('Required')
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

const XTZAsset = {
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
};

const CreateTx = ({ onCreate, onCancel }) => {
  const { createOperation } = useAPI();
  const { assets } = useAssetsStateContext();
  const { contractAddress } = useContractStateContext();
  const { setOps } = useOperationsDispatchContext();

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
      })),
    );
  }, [assets]);

  const createTx = async ({ asset, tokenID, amount, to }, resetForm) => {
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
                token_id:
                  typeof tokenID !== 'undefined' && tokenID !== ''
                    ? tokenID
                    : undefined,
              },
            ],
          },
        ];
      }

      // eslint-disable-next-line no-unreachable
      const newTx = await createOperation(payload);
      await setOps((prev) => {
        return [newTx.data, ...prev];
      });

      resetForm();
      onCreate();
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <Formik
      initialValues={{ asset: XTZAsset, tokenID: '', amount: '', to: '' }}
      enableReinitialize
      validationSchema={Yup.lazy((values) =>
        schema(
          convertAssetSubunitToAssetAmount(1, values.asset.scale),
          values.asset.ticker,
        ),
      )}
      onSubmit={async (values, { resetForm }) => {
        await createTx(values, resetForm);
      }}
    >
      {({
        values,
        isSubmitting,
        errors,
        touched,
        setFieldValue,
        setFieldTouched,
        handleChange,
      }) => (
        <Form>
          <BForm.Group>
            <FormLabel>Select asset</FormLabel>
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
                setFieldValue('tokenID', value.token_id ?? '');
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
            <FormLabelWithTooltip
              labelTxt="Enter token ID"
              tooltipTxt="Token ID is needed for transferring FA2 assets."
            />

            <Field
              as={BForm.Control}
              type="number"
              name="tokenID"
              aria-label="tokenID"
              step="1"
              min="0"
              autoComplete="off"
              disabled
              isInvalid={!!errors.tokenID && touched.tokenID}
              isValid={!errors.tokenID && touched.tokenID}
              onChange={(e) => {
                handleChange(e);
                setFieldValue('amount', '');
                setFieldValue('tokenID', values.asset.token_id ?? '');
              }}
            />
            <ErrorMessage
              component={BForm.Control.Feedback}
              name="tokenID"
              type="invalid"
            />
          </BForm.Group>

          <BForm.Group controlId="amount">
            <FormLabel>Enter amount</FormLabel>
            <InputGroup>
              <Field
                as={BForm.Control}
                type="number"
                name="amount"
                aria-label="amount"
                autoComplete="off"
                isInvalid={!!errors.amount && touched.amount}
                isValid={!errors.amount && touched.amount}
                step={1 / 10 ** values.asset.scale}
                min="0"
                onKeyPress={(event) =>
                  limitInputDecimals(event, values.asset.scale)
                }
              />

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
              autoComplete="off"
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
