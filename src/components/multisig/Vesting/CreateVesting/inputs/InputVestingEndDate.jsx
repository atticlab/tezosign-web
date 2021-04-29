import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import { Form as BForm } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { FormLabel } from '../../../../styled/Forms';
import { DatePickerWrapper } from '../../../../styled/DatePickerStyles';

const handleDateChangeRaw = (e) => {
  e.preventDefault();
};
const calcEndDate = (startDateTimestamp, parts, secondsPerTick) => {
  if (
    typeof startDateTimestamp !== 'number' ||
    typeof parts !== 'number' ||
    typeof secondsPerTick !== 'number'
  ) {
    return null;
  }
  return dayjs
    .unix(startDateTimestamp)
    .add(parts * secondsPerTick, 'second')
    .toDate();
};

const InputVestingEndDate = () => {
  const { values, errors, touched, setFieldValue } = useFormikContext();

  useEffect(() => {
    const endDate =
      calcEndDate(
        values.startDate && dayjs(values.startDate).unix(),
        values.parts,
        values.secondsPerTick,
      ) || '';
    setFieldValue('endDate', endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.startDate, values.parts, values.secondsPerTick]);

  return (
    <BForm.Group>
      <FormLabel>Vesting end date</FormLabel>
      <DatePickerWrapper>
        <Field
          name="endDate"
          aria-label="endDate"
          as={DatePicker}
          dateFormat="yyyy/MM/dd HH:mm:ss"
          // minDate={today}
          wrapperClassName={
            // eslint-disable-next-line no-nested-ternary
            !!errors.endDate && touched.endDate
              ? 'is-invalid'
              : !errors.endDate && touched.endDate
              ? 'is-valid'
              : ''
          }
          disabled
          onChangeRaw={handleDateChangeRaw}
          selected={values.endDate}
          autoComplete="off"
          customInput={
            <BForm.Control
              isInvalid={!!errors.endDate && touched.endDate}
              isValid={!errors.endDate && touched.endDate}
            />
          }
          // onChange={(date) => setFieldValue('endDate', date)}
        />

        <ErrorMessage
          component={BForm.Control.Feedback}
          name="endDate"
          type="invalid"
        />
      </DatePickerWrapper>
    </BForm.Group>
  );
};

export default InputVestingEndDate;
