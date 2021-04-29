import React from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage, useFormikContext } from 'formik';
import { Form as BForm } from 'react-bootstrap';
import { FormLabel } from '../../../../styled/Forms';
import SelectCustom from '../../../../SelectCustom';
import { unvestingIntervals } from '../../../../../utils/constants';

const SelectUnvestingInterval = ({ defaultValue }) => {
  const {
    errors,
    touched,
    setFieldTouched,
    setFieldValue,
  } = useFormikContext();

  return (
    <BForm.Group>
      <FormLabel>Unvesting interval</FormLabel>

      <SelectCustom
        options={unvestingIntervals}
        defaultValue={defaultValue}
        isSearchable={false}
        isInvalid={!!errors.secondsPerTick && touched.secondsPerTick}
        isValid={!errors.secondsPerTick && touched.secondsPerTick}
        isTouched={touched.secondsPerTick}
        menuWidth="100%"
        height="38px"
        styles={{
          singleValue: (provided) => ({
            ...provided,
            fontSize: '1rem',
          }),
        }}
        onChange={(value) => {
          setFieldValue('secondsPerTick', value.value);
          setFieldTouched('secondsPerTick', true);
        }}
        onBlur={() => {
          setFieldTouched('secondsPerTick', true);
        }}
      />

      <ErrorMessage
        name="secondsPerTick"
        component={BForm.Control.Feedback}
        type="invalid"
      />
    </BForm.Group>
  );
};

SelectUnvestingInterval.propTypes = {
  defaultValue: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default SelectUnvestingInterval;
