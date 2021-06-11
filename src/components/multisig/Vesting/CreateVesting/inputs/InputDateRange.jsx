import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import { Field, useFormikContext } from 'formik';
import { Form as BForm } from 'react-bootstrap';
import { FormLabel } from '../../../../styled/Forms';
import { DatePickerWrapper } from '../../../../styled/DatePickerStyles';
import { dateFormatNoTime } from '../../../../../utils/constants';

const today = dayjs().toDate();
const handleDateChangeRaw = (e) => {
  e.preventDefault();
};
const handleDateRange = (start, end) => {
  const startFormatted = start ? dayjs(start).format(dateFormatNoTime) : '';
  const endFormatted = end ? dayjs(end).format(dateFormatNoTime) : '';
  return `${startFormatted ? `${startFormatted} -` : ''} ${endFormatted}`;
};

const InputDateRange = () => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
  } = useFormikContext();
  const isInvalid = useMemo(() => {
    return (!!errors.startDate || !!errors.endDate) && touched.startDate;
  }, [errors.startDate, touched.startDate, errors.endDate]);
  const isValid = useMemo(() => {
    return (!errors.startDate || !errors.endDate) && touched.startDate;
  }, [errors.startDate, touched.startDate, errors.endDate]);

  return (
    <BForm.Group>
      <FormLabel>Vesting period</FormLabel>
      <DatePickerWrapper>
        <Field
          name="startDate"
          aria-label="startDate"
          as={DatePicker}
          dateFormat="yyyy/MM/dd"
          minDate={today}
          wrapperClassName={
            // eslint-disable-next-line no-nested-ternary
            isInvalid ? 'is-invalid' : isValid ? 'is-valid' : ''
          }
          onChangeRaw={handleDateChangeRaw}
          selected={null}
          value={handleDateRange(values.startDate, values.endDate)}
          startDate={values.startDate}
          endDate={values.endDate}
          selectsRange
          shouldCloseOnSelect={false}
          autoComplete="off"
          customInput={
            <BForm.Control isInvalid={isInvalid} isValid={isValid} />
          }
          onChange={(dates) => {
            const [start, end] = dates;
            setFieldTouched('startDate', true);
            setFieldTouched('endDate', true);
            setFieldValue('startDate', start ?? '');
            setFieldValue('endDate', end ?? '');
          }}
        />

        <span className="invalid-feedback">
          {errors.startDate || errors.endDate}
        </span>
      </DatePickerWrapper>
    </BForm.Group>
  );
};

export default InputDateRange;
