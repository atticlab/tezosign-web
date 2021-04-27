import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Button, Form as BForm } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { FormLabel, FormSubmit } from '../../../styled/Forms';
import InputVestingAddress from './InputVestingAddress';
import InputBalance from './InputBalance';
import InputDelegateAdmin from './InputDelegateAdmin';
import useBalances from './useBalances';
import useAPI from '../../../../hooks/useApi';
import { handleError } from '../../../../utils/errorsHandler';
import tezosAddressSchema from '../../../../utils/schemas/tezosAddressSchema';
import balanceSchema from '../../../../utils/schemas/balanceSchema';
import { DatePickerWrapper } from '../../../styled/DatePickerStyles';

const schema = (maxAmount = 30000, maxTokensPerTick, minAmount = 0.000001) =>
  Yup.object({
    vestingAddress: tezosAddressSchema,
    delegateAddress: tezosAddressSchema,
    range: Yup.string().required('Required'),
    balance: balanceSchema(maxAmount, minAmount),
  });

const today = dayjs().startOf('day').toDate();
const handleDateChangeRaw = (e) => {
  e.preventDefault();
};

const CreateVestingFormSimple = ({ onSubmit, onCancel }) => {
  const { getVestingContractCode, initVesting } = useAPI();
  const { balanceConverted, balanceInXTZ } = useBalances(10);

  const createVesting = async (fields, setSubmitting) => {
    try {
      setSubmitting(true);
      // eslint-disable-next-line no-unused-vars
      const respCode = await getVestingContractCode();
      await initVesting();
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
        balance: '',
        startDate: '',
        endDate: '',
      }}
      validationSchema={Yup.lazy(() => schema(balanceConverted, balanceInXTZ))}
      onSubmit={(values, { setSubmitting }) => {
        createVesting(values, setSubmitting);
      }}
    >
      {({ values, errors, touched, isSubmitting, setFieldValue }) => (
        <Form>
          <InputVestingAddress />
          <InputBalance />
          <InputDelegateAdmin />

          <BForm.Group>
            <FormLabel>Vesting activation date</FormLabel>
            <DatePickerWrapper>
              <Field
                name="startDate"
                aria-label="startDate"
                as={DatePicker}
                dateFormat="yyyy/MM/dd"
                minDate={today}
                wrapperClassName={
                  // eslint-disable-next-line no-nested-ternary
                  (!!errors.startDate && touched.startDate) ||
                  (!!errors.endDate && touched.endDate)
                    ? 'is-invalid'
                    : (!errors.startDate && touched.startDate) ||
                      (!errors.endDate && touched.endDate)
                    ? 'is-valid'
                    : ''
                }
                onChangeRaw={handleDateChangeRaw}
                selected={values.startDate}
                startDate={values.startDate}
                endDate={values.endDate}
                selectsRange
                autoComplete="off"
                customInput={
                  <BForm.Control
                    isInvalid={
                      (!!errors.startDate && touched.startDate) ||
                      (!!errors.endDate && touched.endDate)
                    }
                    isValid={
                      (!errors.startDate && touched.startDate) ||
                      (!errors.endDate && touched.endDate)
                    }
                  />
                }
                onChange={(dates) => {
                  const [start, end] = dates;
                  setFieldValue('startDate', start);
                  setFieldValue('endDate', end);
                }}
              />

              <ErrorMessage
                component={BForm.Control.Feedback}
                name="range"
                type="invalid"
              />
            </DatePickerWrapper>
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

CreateVestingFormSimple.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateVestingFormSimple;
