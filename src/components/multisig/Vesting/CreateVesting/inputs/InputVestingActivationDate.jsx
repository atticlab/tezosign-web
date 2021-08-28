import React from 'react';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import { Form as BForm } from 'react-bootstrap';
import FormLabelWithTooltip from '../../../../FormLabelWithTooltip';
import { DatePickerWrapper } from '../../../../styled/DatePickerStyles';

const handleDateChangeRaw = (e) => {
  e.preventDefault();
};
const today = dayjs().toDate();

const VestingActivationDate = () => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
  } = useFormikContext();

  return (
    <BForm.Group>
      <FormLabelWithTooltip
        labelTxt="Vesting activation date"
        tooltipTxt="Vesting start date."
      />

      <DatePickerWrapper>
        <Field
          name="startDate"
          aria-label="startDate"
          as={DatePicker}
          dateFormat="yyyy/MM/dd h:mm aa"
          minDate={today}
          wrapperClassName={
            // eslint-disable-next-line no-nested-ternary
            !!errors.startDate && touched.startDate
              ? 'is-invalid'
              : !errors.startDate && touched.startDate
              ? 'is-valid'
              : ''
          }
          onChangeRaw={handleDateChangeRaw}
          selected={values.startDate}
          autoComplete="off"
          customInput={
            <BForm.Control
              isInvalid={!!errors.startDate && touched.startDate}
              isValid={!errors.startDate && touched.startDate}
            />
          }
          onChange={(date) => {
            const now = new Date();
            date.setHours(now.getHours());
            date.setMinutes(now.getMinutes());
            date.setSeconds(now.getSeconds());

            setFieldTouched('startDate', true);
            setFieldValue('startDate', date);
          }}
        />

        <ErrorMessage
          component={BForm.Control.Feedback}
          name="startDate"
          type="invalid"
        />
      </DatePickerWrapper>
    </BForm.Group>
  );
};

export default VestingActivationDate;
