import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Form as BForm, InputGroup } from 'react-bootstrap';
import AccentText from '../../styled/AccentText';
import { FormLabel, FormSubmit } from '../../styled/Forms';
import useAPI from '../../../hooks/useApi';
import {
  bs58Validation,
  convertXTZToMutez,
  convertMutezToXTZ,
} from '../../../utils/helpers';
import XTZ from '../../../assets/img/assets/xtz.png';
import { useContractStateContext } from '../../../store/contractContext';
import { useOperationsDispatchContext } from '../../../store/operationsContext';

const Check = styled(BForm.Check)`
  padding-left: 0;
  display: inline-block;

  input {
    display: none;
  }

  label {
    border: 2px solid transparent;
    padding: 3px;
    cursor: pointer;
    transition: transform 0.15s;

    &:hover {
      transform: scale(1.2);
    }
  }

  input:checked ~ label {
    border: 2px solid ${({ theme }) => theme.lightGreen};
    border-radius: 50%;
    transform: scale(1.2);
  }
`;

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
    asset: Yup.string().required('Required'),
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

const assets = [
  { key: 'xtz', name: 'XTZ', logo: XTZ },
  // { key: 'tzBtc', name: 'tzBTC', logo: tzBTC },
  // { key: 'stakerDao', name: 'Staker DAO', logo: stakerDAO },
  // { key: 'usdTz', name: 'USDtz', logo: USDtz },
];

const CreateTx = ({ contractAddress, onCreate }) => {
  const { sendOperation } = useAPI();
  const { contractInfo } = useContractStateContext();
  const balances = useMemo(() => {
    return {
      xtz: convertMutezToXTZ(contractInfo.balance),
      // tzBtc: 11.32,
      // stakerDao: 54.23,
      // usdTz: 32.54,
    };
  }, [contractInfo]);
  const { setOps } = useOperationsDispatchContext();

  return (
    <Formik
      initialValues={{ asset: 'xtz', amount: '', to: '' }}
      enableReinitialize
      validationSchema={Yup.lazy((values) =>
        schema(
          balances[values.asset],
          assets.find((asset) => asset.key === values.asset).name,
        ),
      )}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const newTx = await sendOperation({
            contract_id: contractAddress,
            type: 'transfer',
            amount: Number(convertXTZToMutez(values.amount)),
            to: values.to,
          });
          await setOps((prev) => {
            return [newTx.data, ...prev];
          });
          onCreate();
        } catch (e) {
          console.error(e);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        values,
        setFieldValue,
        setFieldTouched,
        handleChange,
        isSubmitting,
        errors,
        touched,
      }) => (
        <Form>
          <BForm.Group>
            <FormLabel>Select Asset</FormLabel>
            <div>
              {assets.map((asset) => (
                <Check
                  key={asset.key}
                  type="radio"
                  label={<img src={asset.logo} alt={asset.key} width="35px" />}
                  name="asset"
                  id={asset.key}
                  value={asset.key}
                  checked={values.asset === asset.key}
                  onChange={handleChange}
                />
              ))}
            </div>
            <AccentText as="div" style={{ marginTop: '10px' }}>
              {assets.find((asset) => asset.key === values.asset).name}
            </AccentText>
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
              />

              <InputGroup.Append>
                <InputGroup.Text style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <BtnMax
                      onClick={() => {
                        setFieldValue('amount', balances[values.asset]);
                        setFieldTouched('amount', true, false);
                      }}
                    >
                      MAX
                    </BtnMax>
                    <span style={{ fontSize: '12px', marginBottom: '2px' }}>
                      {balances[values.asset]}
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
  contractAddress: PropTypes.string.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default CreateTx;
