import React, { useState, useEffect, useMemo } from 'react';
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
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { DatePickerWrapper } from '../../../styled/DatePickerStyles';
import { FormLabel, FormSubmit } from '../../../styled/Forms';
import InputVestingAddress from './InputVestingAddress';
import InputBalance from './InputBalance';
import InputDelegateAdmin from './InputDelegateAdmin';
import useAPI from '../../../../hooks/useApi';
import {
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
import tezosAddressSchema from '../../../../utils/schemas/tezosAddressSchema';
import balanceSchema from '../../../../utils/schemas/balanceSchema';

dayjs.extend(utc);

const WarningBox = styled.div`
  color: ${({ theme }) => theme.yellow};
  font-size: 12px;
`;

const Check = styled(BForm.Check)`
  font-size: 12px;
  cursor: pointer;

  .custom-control-label {
    cursor: pointer;

    &:before,
    &:after {
      top: 0.05rem;
    }
  }
`;

const schema = (maxAmount = 30000, maxTokensPerTick, minAmount = 0.000001) =>
  Yup.object({
    vestingAddress: tezosAddressSchema,
    delegateAddress: tezosAddressSchema,
    timestamp: Yup.string().required('Required'),
    secondsPerTick: Yup.string()
      .required('Required')
      .test('secondsCheck', 'Seconds cannot be 0', (val) => {
        return val !== '0:00';
      }),
    tokensPerTick: Yup.number()
      .required('Required')
      .max(maxTokensPerTick, `Maximum amount is ${maxTokensPerTick} XTZ`)
      .min(0.000001, `Minimum amount is ${0.000001} XTZ`),
    check: Yup.bool().oneOf([true], 'The terms must be accepted'),
    balance: balanceSchema(maxAmount, minAmount),
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

const today = dayjs().startOf('day').toDate();

const calcMaxAllowedBalance = (balance, tokensPerTick) => {
  return Math.floor(balance / tokensPerTick) * tokensPerTick;
};

const CreateVestingForm = ({ onSubmit, onCancel }) => {
  const { getVestingContractCode, initVesting } = useAPI();
  const { balance: balanceRaw, address } = useUserStateContext();
  const { getBalance } = useUserDispatchContext();
  const [currentTokensPerTick, setCurrentTokensPerTick] = useState(null);

  useEffect(() => {
    getBalance(address);
  }, [getBalance, address]);

  const balanceInXTZ = useMemo(() => {
    return convertMutezToXTZ(balanceRaw?.balance);
  }, [balanceRaw]);

  const balanceConverted = useMemo(() => {
    const bal = balanceRaw?.balance;
    if (!currentTokensPerTick || currentTokensPerTick > bal) {
      return balanceInXTZ;
    }

    return convertMutezToXTZ(calcMaxAllowedBalance(bal, currentTokensPerTick));
  }, [balanceRaw, currentTokensPerTick, balanceInXTZ]);

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
        timestamp: dayjs.utc(timestamp).unix().valueOf(),
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
        check: false,
        balance: '',
      }}
      validationSchema={Yup.lazy((values) =>
        schema(balanceConverted, balanceInXTZ, values.tokensPerTick),
      )}
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
        handleChange,
      }) => (
        <Form>
          <InputVestingAddress />
          <InputDelegateAdmin />

          <BForm.Group>
            <FormLabel>Vesting activation date</FormLabel>
            <DatePickerWrapper>
              <Field
                name="timestamp"
                aria-label="timestamp"
                as={DatePicker}
                dateFormat="yyyy/MM/dd"
                minDate={today}
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
            <OverlayTrigger
              overlay={
                <Tooltip>
                  The interval of time needed for a certain amount of XTZ (XTZ
                  per tick) to become available for a withdrawal.
                </Tooltip>
              }
            >
              <FormLabel>Seconds per tick</FormLabel>
            </OverlayTrigger>
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
            <OverlayTrigger
              overlay={
                <Tooltip>
                  The amount of XTZ that becomes available for a withdrawal
                  every tick.
                </Tooltip>
              }
            >
              <FormLabel>XTZ per tick</FormLabel>
            </OverlayTrigger>
            <InputGroup>
              <Field
                as={BForm.Control}
                type="number"
                name="tokensPerTick"
                aria-label="tokensPerTick"
                min="0"
                step="0.000001"
                autoComplete="off"
                isInvalid={!!errors.tokensPerTick && touched.tokensPerTick}
                isValid={!errors.tokensPerTick && touched.tokensPerTick}
                onKeyPress={(event) => limitInputDecimals(event, 6)}
                onBlur={(e) => {
                  handleBlur(e);

                  const tokensInMutez = Number(
                    convertXTZToMutez(e.target.value),
                  );
                  const balanceInMutez = Number(
                    convertXTZToMutez(values.balance),
                  );
                  setCurrentTokensPerTick(tokensInMutez);

                  if (tokensInMutez && balanceInMutez) {
                    const maxAllowedBalanceInXTZ = convertMutezToXTZ(
                      calcMaxAllowedBalance(balanceInMutez, tokensInMutez),
                    );
                    setFieldValue('balance', maxAllowedBalanceInXTZ);
                  }
                }}
              />

              <InputGroup.Append>
                <InputGroup.Text style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <BtnMax
                      onClick={() => {
                        setFieldValue('tokensPerTick', balanceInXTZ);
                        setCurrentTokensPerTick(
                          Number(convertXTZToMutez(balanceInXTZ)),
                        );
                        setFieldTouched('tokensPerTick', true, false);
                      }}
                    >
                      MAX
                    </BtnMax>
                    <span style={{ fontSize: '12px', marginBottom: '2px' }}>
                      {balanceInXTZ}
                    </span>
                  </span>
                </InputGroup.Text>
              </InputGroup.Append>

              <ErrorMessage
                component={BForm.Control.Feedback}
                name="tokensPerTick"
                type="invalid"
              />
            </InputGroup>
          </BForm.Group>

          <BForm.Group controlId="check">
            <WarningBox>
              Attention! To avoid any problems with your vesting contract check
              the following points:
              <ul>
                <li>
                  Make sure the balance on your vesting contract has not a
                  greater number of decimals as your &quot;XTZ per tick&quot;
                  field. Otherwise, you will not be able to withdraw all the
                  tokens from the contract.
                </li>
                <li>
                  Make sure the balance on your vesting contract is not less
                  than your &quot;XTZ per tick&quot; field. Otherwise, you will
                  not be able to withdraw any tokens from the contract.
                </li>
                <li>
                  The least number of tokens you can withdraw from your vesting
                  contract equals the &quot;XTZ per tick&quot; field. You cannot
                  withdraw less.
                </li>
              </ul>
            </WarningBox>
            <Field
              as={Check}
              type="checkbox"
              name="check"
              custom
              id="check"
              aria-label="check"
            >
              <BForm.Check.Input
                id="check"
                type="checkbox"
                isInvalid={!!errors.check && touched.check}
                isValid={!errors.check && touched.check}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <BForm.Check.Label>
                I have read and understood all the points above.
              </BForm.Check.Label>
              <ErrorMessage
                component={BForm.Control.Feedback}
                name="check"
                type="invalid"
              />
            </Field>
          </BForm.Group>

          <InputBalance />

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

CreateVestingForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateVestingForm;
