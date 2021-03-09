import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Button, Form as BForm, InputGroup } from 'react-bootstrap';
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

  &:hover,
  &:focus {
    text-decoration: none;
  }
`;

const schema = (maxAmount = 30000, asset = 'XTZ') => {
  return Yup.object({
    asset: Yup.object().required('Required'),
    amount: Yup.number()
      .required('Required')
      .max(maxAmount, `Maximum amount is ${maxAmount} ${asset}`)
      .min(0.000001, `Minimum amount is 0.000001 ${asset}`),
    to: Yup.string()
      .trim()
      .required('Required')
      .matches(
        'tz1|tz2|tz3',
        'Tezos baker address must start with tz1, tz2, tz3',
      )
      .matches(/^\S+$/, 'No spaces are allowed')
      .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
      .length(36, 'Tezos address must be 36 characters long')
      .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
  });
};

const xtzAsset = {
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

const CreateTx = ({ onCreate }) => {
  const { sendOperation } = useAPI();
  const { assets } = useAssetsStateContext();
  const { contractAddress, contractInfo } = useContractStateContext();
  const { setOps } = useOperationsDispatchContext();

  const balances = useMemo(() => {
    return {
      xtz: convertMutezToXTZ(contractInfo.balance),
      // tzBtc: 11.32,
      // stakerDao: 54.23,
      // usdTz: 32.54,
    };
  }, [contractInfo]);

  const assetsOptions = useMemo(() => {
    if (!assets || !assets.length) return [xtzAsset];

    return [xtzAsset].concat(
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

  const createTx = async ({ asset, amount, to }, setSubmitting) => {
    const isXTZ = asset.value === 'xtz';
    try {
      const payload = {
        contract_id: contractAddress,
        type: isXTZ ? 'transfer' : 'fa_transfer',
        amount: isXTZ
          ? Number(convertXTZToMutez(amount))
          : amount * 10 ** asset.scale,
        to,
        asset_id: isXTZ ? undefined : asset.address,
      };

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
      initialValues={{ asset: xtzAsset, amount: '', to: '' }}
      enableReinitialize
      validationSchema={Yup.lazy((values) =>
        schema(balances[values.asset.value], values.asset.ticker),
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
              defaultValue={xtzAsset}
              isSearchable={false}
              isTouched={touched.asset}
              isValid={!errors.asset && touched.asset}
              isInvalid={!!errors.asset && touched.asset}
              menuWidth="100%"
              height="38px"
              onChange={(value) => {
                setFieldValue('asset', value);
                setFieldValue('amount', '');
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

              {values.asset.value === 'xtz' && (
                <InputGroup.Append>
                  <InputGroup.Text style={{ paddingTop: 0, paddingBottom: 0 }}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <BtnMax
                        onClick={() => {
                          setFieldValue('amount', balances[values.asset.value]);
                          setFieldTouched('amount', true, false);
                        }}
                      >
                        MAX
                      </BtnMax>
                      <span style={{ fontSize: '12px', marginBottom: '2px' }}>
                        {balances[values.asset.value]}
                      </span>
                    </span>
                  </InputGroup.Text>
                </InputGroup.Append>
              )}

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
            <Button type="submit" size="lg" disabled={isSubmitting}>
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
};

export default CreateTx;
