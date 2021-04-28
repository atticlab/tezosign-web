import React from 'react';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import { Form as BForm } from 'react-bootstrap';
import { FormLabel } from '../../../../styled/Forms';
import { DatePickerWrapper } from '../../../../styled/DatePickerStyles';

const handleDateChangeRaw = (e) => {
  e.preventDefault();
};
const today = dayjs().startOf('day').toDate();

const VestingActivationDate = () => {
  const { values, errors, touched, setFieldValue } = useFormikContext();

  return (
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
  );
};

export default VestingActivationDate;
