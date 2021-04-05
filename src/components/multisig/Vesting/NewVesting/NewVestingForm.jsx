import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Button, Form as BForm, InputGroup } from 'react-bootstrap';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DatePickerWrapper } from '../../../styled/DatePickerStyles';
import { FormLabel, FormSubmit } from '../../../styled/Forms';
import useAPI from '../../../../hooks/useApi';
import {
  bs58Validation,
  convertMutezToXTZ,
  convertXTZToMutez,
  limitInputDecimals,
  toHHMMSS,
} from '../../../../utils/helpers';
import { handleError } from '../../../../utils/errorsHandler';
import { sendOrigination } from '../../../../plugins/beacon';
import { BtnMax } from '../../../styled/Btns';
import {
  useUserDispatchContext,
  useUserStateContext,
} from '../../../../store/userContext';

dayjs.extend(utc);

const schema = (maxAmount = 30000) =>
  Yup.object({
    vestingAddress: Yup.string()
      .required('Required')
      .matches(
        'tz1|tz2|tz3|KT1',
        'Tezos address must start with tz1, tz2, tz3 or KT1',
      )
      .matches(/^\S+$/, 'No spaces are allowed')
      .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
      .length(36, 'Tezos address must be 36 characters long')
      .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
    delegateAddress: Yup.string()
      .required('Required')
      .matches(
        'tz1|tz2|tz3|KT1',
        'Tezos address must start with tz1, tz2, tz3 or KT1',
      )
      .matches(/^\S+$/, 'No spaces are allowed')
      .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
      .length(36, 'Tezos address must be 36 characters long')
      .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
    timestamp: Yup.string().required('Required'),
    secondsPerTick: Yup.string()
      .required('Required')
      .test('secondsCheck', 'Seconds cannot be 0', (val) => {
        return val !== '0:00';
      }),
    tokensPerTick: Yup.number()
      .required('Required')
      .min(0.000001, `Minimum amount is ${0.000001} XTZ`),
    balance: Yup.number()
      .required('Required')
      .max(maxAmount, `Maximum amount is ${maxAmount} XTZ`)
      .min(0.000001, `Minimum amount is 0.000001 XTZ`),
  });

const handleDateChangeRaw = (e) => {
  e.preventDefault();
};

const getSecondsFromHHMMSS = (value) => {
  const [str1, str2, str3] = value.split(':');

  const val1 = Number(str1);
  const val2 = Number(str2);
  const val3 = Number(str3);

  const isVal1NaN = Number.isNaN(val1);
  const isVal2NaN = Number.isNaN(val2);
  const isVal3NaN = Number.isNaN(val3);

  if (!isVal1NaN && isVal2NaN && isVal3NaN) {
    // seconds
    return val1;
  }

  if (!isVal1NaN && !isVal2NaN && isVal3NaN) {
    // minutes * 60 + seconds
    return val1 * 60 + val2;
  }

  if (!isVal1NaN && !isVal2NaN && !isVal3NaN) {
    // hours * 60 * 60 + minutes * 60 + seconds
    return val1 * 60 * 60 + val2 * 60 + val3;
  }

  return 0;
};

const convertInputToTime = (e) => {
  return toHHMMSS(Math.max(0, getSecondsFromHHMMSS(e.target.value)));
};

const NewVestingForm = ({ onSubmit, onCancel }) => {
  const { getVestingContractCode, initVesting } = useAPI();
  const { balance: balanceRaw, address } = useUserStateContext();
  const { getBalance } = useUserDispatchContext();
  useEffect(() => {
    getBalance(address);
  }, [getBalance, address]);

  const balanceConverted = useMemo(() => {
    return convertMutezToXTZ(balanceRaw?.balance);
  }, [balanceRaw]);

  const createVesting = async (
    {
      vestingAddress,
      delegateAddress,
      timestamp,
      secondsPerTick,
      tokensPerTick,
      balance,
    },
    setSubmitting,
  ) => {
    try {
      const respCode = await getVestingContractCode();

      const payload = {
        vesting_address: vestingAddress,
        delegate_admin: delegateAddress,
        timestamp: dayjs.utc(timestamp).valueOf(),
        seconds_per_tick: getSecondsFromHHMMSS(secondsPerTick),
        tokens_per_tick: Number(convertXTZToMutez(tokensPerTick)),
      };
      const respStorage = await initVesting(payload);

      const script = { code: respCode.data, storage: respStorage.data };
      await sendOrigination(balance.toString(), script);
      onSubmit();
    } catch (e) {
      handleError(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        vestingAddress: '',
        delegateAddress: '',
        timestamp: '',
        secondsPerTick: '',
        tokensPerTick: '',
        balance: 0,
      }}
      validationSchema={Yup.lazy(() => schema(balanceConverted))}
      onSubmit={(values, { setSubmitting }) => {
        createVesting(values, setSubmitting);
      }}
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        setFieldValue,
        setFieldTouched,
        handleBlur,
      }) => (
        <Form>
          <BForm.Group>
            <FormLabel>Vesting address</FormLabel>
            <Field
              as={BForm.Control}
              type="text"
              name="vestingAddress"
              aria-label="vestingAddress"
              isInvalid={!!errors.vestingAddress && touched.vestingAddress}
              isValid={!errors.vestingAddress && touched.vestingAddress}
            />

            <ErrorMessage
              component={BForm.Control.Feedback}
              name="vestingAddress"
              type="invalid"
            />
          </BForm.Group>

          <BForm.Group>
            <FormLabel>Delegate address</FormLabel>
            <Field
              as={BForm.Control}
              type="text"
              name="delegateAddress"
              aria-label="delegateAddress"
              isInvalid={!!errors.delegateAddress && touched.delegateAddress}
              isValid={!errors.delegateAddress && touched.delegateAddress}
            />

            <ErrorMessage
              component={BForm.Control.Feedback}
              name="delegateAddress"
              type="invalid"
            />
          </BForm.Group>

          <BForm.Group>
            <FormLabel>Vesting activation date</FormLabel>
            <DatePickerWrapper>
              <Field
                name="timestamp"
                aria-label="timestamp"
                as={DatePicker}
                dateFormat="yyyy/MM/dd"
                wrapperClassName={
                  // eslint-disable-next-line no-nested-ternary
                  !!errors.timestamp && touched.timestamp
                    ? 'is-invalid'
                    : !errors.timestamp && touched.timestamp
                    ? 'is-valid'
                    : ''
                }
                onChangeRaw={handleDateChangeRaw}
                selected={values.timestamp}
                autoComplete="off"
                customInput={
                  <BForm.Control
                    isInvalid={!!errors.timestamp && touched.timestamp}
                    isValid={!errors.timestamp && touched.timestamp}
                  />
                }
                onChange={(date) => setFieldValue('timestamp', date)}
              />

              <ErrorMessage
                component={BForm.Control.Feedback}
                name="timestamp"
                type="invalid"
              />
            </DatePickerWrapper>
          </BForm.Group>

          <BForm.Group>
            <FormLabel>Seconds per tick</FormLabel>
            <Field
              as={BForm.Control}
              type="text"
              name="secondsPerTick"
              aria-label="secondsPerTick"
              autoComplete="off"
              isInvalid={!!errors.secondsPerTick && touched.secondsPerTick}
              isValid={!errors.secondsPerTick && touched.secondsPerTick}
              onBlur={(e) => {
                handleBlur(e);
                setFieldValue('secondsPerTick', convertInputToTime(e));
              }}
            />

            <ErrorMessage
              component={BForm.Control.Feedback}
              name="secondsPerTick"
              type="invalid"
            />
          </BForm.Group>

          <BForm.Group>
            <FormLabel>XTZ per tick</FormLabel>
            <Field
              as={BForm.Control}
              type="number"
              name="tokensPerTick"
              aria-label="tokensPerTick"
              isInvalid={!!errors.tokensPerTick && touched.tokensPerTick}
              isValid={!errors.tokensPerTick && touched.tokensPerTick}
            />

            <ErrorMessage
              component={BForm.Control.Feedback}
              name="tokensPerTick"
              type="invalid"
            />
          </BForm.Group>

          <BForm.Group controlId="balance">
            <FormLabel>Balance</FormLabel>
            <InputGroup>
              <Field
                as={BForm.Control}
                type="number"
                name="balance"
                aria-label="balance"
                isInvalid={!!errors.balance && touched.balance}
                isValid={!errors.balance && touched.balance}
                step="0.000001"
                min="0"
                onKeyPress={(event) => limitInputDecimals(event, 6)}
              />

              <InputGroup.Append>
                <InputGroup.Text style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <BtnMax
                      onClick={() => {
                        setFieldValue('balance', balanceConverted);
                        setFieldTouched('balance', true, false);
                      }}
                    >
                      MAX
                    </BtnMax>
                    <span style={{ fontSize: '12px', marginBottom: '2px' }}>
                      {balanceConverted}
                    </span>
                  </span>
                </InputGroup.Text>
              </InputGroup.Append>

              <ErrorMessage
                component={BForm.Control.Feedback}
                name="balance"
                type="invalid"
              />
            </InputGroup>
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

NewVestingForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default NewVestingForm;
