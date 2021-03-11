import React from 'react';
import PropTypes from 'prop-types';
import { Form as BForm, InputGroup } from 'react-bootstrap';
import { ErrorMessage } from 'formik';
import SelectCustom from '../SelectCustom';
import Text from '../styled/Text';

const ThresholdsFields = ({
  touched,
  errors,
  setFieldValue,
  setFieldTouched,
  options,
  defaultValue,
}) => (
  <BForm.Group style={{ maxWidth: '264px', margin: '0 auto 40px' }}>
    <InputGroup>
      <SelectCustom
        options={options}
        defaultValue={defaultValue}
        isSearchable={false}
        isTouched={touched.signatures}
        isValid={!errors.signatures && touched.signatures}
        isInvalid={!!errors.signatures && touched.signatures}
        menuWidth="100%"
        onChange={(value) => {
          setFieldValue('signatures', value.value);
          setFieldTouched('signatures', true);
        }}
        onBlur={() => {
          setFieldTouched('signatures', true);
        }}
      />
      <InputGroup.Append>
        <Text modifier="sm" style={{ marginBottom: '0', padding: '2px 10px' }}>
          {`out of ${options.length} owners`}
        </Text>
      </InputGroup.Append>
      <ErrorMessage
        name="signatures"
        component={BForm.Control.Feedback}
        type="invalid"
      />
    </InputGroup>
  </BForm.Group>
);

ThresholdsFields.propTypes = {
  touched: PropTypes.objectOf(PropTypes.any).isRequired,
  errors: PropTypes.objectOf(PropTypes.any).isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  defaultValue: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ThresholdsFields;
