/* eslint-disable no-unreachable */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Button, Form as BForm, InputGroup } from 'react-bootstrap';
import styled from 'styled-components';
// import AccentText from '../../styled/AccentText';
import { FormLabel, FormSubmit } from '../../styled/Forms';
import useAPI from '../../../hooks/useApi';
import {
  bs58Validation,
  convertXTZToMutez,
  convertMutezToXTZ,
  limitInputDecimals,
} from '../../../utils/helpers';
import SelectCustom from '../../SelectCustom';
// eslint-disable-next-line no-unused-vars
import XTZ from '../../../assets/img/assets/xtz.png';
import { useContractStateContext } from '../../../store/contractContext';
import { useOperationsDispatchContext } from '../../../store/operationsContext';
import { useAssetsStateContext } from '../../../store/assetsContext';
import { handleError } from '../../../utils/errorsHandler';

// const Check = styled(BForm.Check)`
//   padding-left: 0;
//   display: inline-block;
//
//   input {
//     display: none;
//   }
//
//   label {
//     border: 2px solid transparent;
//     padding: 3px;
//     cursor: pointer;
//     transition: transform 0.15s;
//
//     &:hover {
//       transform: scale(1.2);
//     }
//   }
//
//   input:checked ~ label {
//     border: 2px solid ${({ theme }) => theme.lightGreen};
//     border-radius: 50%;
//     transform: scale(1.2);
//   }
// `;

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

// const assets = [
//   { key: 'xtz', name: 'XTZ', logo: XTZ },
//   // { key: 'tzBtc', name: 'tzBTC', logo: tzBTC },
//   // { key: 'stakerDao', name: 'Staker DAO', logo: stakerDAO },
//   // { key: 'usdTz', name: 'USDtz', logo: USDtz },
// ];

const xtzAsset = {
  value: 'xtz',
  label: 'XTZ',
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
    if (!assets || !assets.length)
      return [xtzAsset, { value: 'hui', label: 'Hui', scale: 2 }];

    return assets
      .map((asset) => ({
        ...asset,
        value: asset.name,
        label: asset.name,
      }))
      .shift(xtzAsset);
  }, [assets]);

  const createTx = async ({ asset, amount, to }, setSubmitting) => {
    const isXtz = asset.value === 'xtz';
    try {
      const payload = {
        contract_id: contractAddress,
        type: isXtz ? 'transfer' : 'fa_transfer',
        amount: isXtz
          ? Number(convertXTZToMutez(amount))
          : amount * asset.scale,
        to,
      };

      console.log(payload);
      return;

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
        schema(
          balances[values.asset.value],
          // assets.find((asset) => asset.value === values.asset.value),
          values.asset.label,
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
            {/* <div> */}
            {/*  {assets.map((asset) => ( */}
            {/*    <Check */}
            {/*      key={asset.key} */}
            {/*      type="radio" */}
            {/*      label={<img src={asset.logo} alt={asset.key} width="35px" />} */}
            {/*      name="asset" */}
            {/*      id={asset.key} */}
            {/*      value={asset.key} */}
            {/*      checked={values.asset === asset.key} */}
            {/*      onChange={handleChange} */}
            {/*    /> */}
            {/*  ))} */}
            {/* </div> */}
            {/* <AccentText as="div" style={{ marginTop: '10px' }}> */}
            {/*  {assets.find((asset) => asset.key === values.asset).name} */}
            {/* </AccentText> */}

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
