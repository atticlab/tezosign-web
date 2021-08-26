import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import { Form as BForm, OverlayTrigger, Tooltip } from 'react-bootstrap';
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

  const res = dayjs
    .unix(startDateTimestamp)
    .add(parts * secondsPerTick, 'second');

  return res.isValid() ? res.toDate() : null;
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
      <OverlayTrigger
        overlay={
          <Tooltip>
            The date when all the vested funds become available.
          </Tooltip>
        }
      >
        <FormLabel>Vesting end date</FormLabel>
      </OverlayTrigger>

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
