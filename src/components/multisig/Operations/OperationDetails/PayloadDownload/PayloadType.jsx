import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage, useFormikContext } from 'formik';
import { Form as BForm } from 'react-bootstrap';
import { FormLabel } from '../../../../styled/Forms';
import SelectCustom from '../../../../SelectCustom';

const PayloadType = ({ approveDisabled, rejectDisabled, onSelect }) => {
  const {
    errors,
    touched,
    setFieldTouched,
    setFieldValue,
  } = useFormikContext();

  const options = useMemo(
    () => [
      { value: 'approve', label: 'Approve', isDisabled: approveDisabled },
      { value: 'reject', label: 'Reject', isDisabled: rejectDisabled },
    ],
    [approveDisabled, rejectDisabled],
  );

  return (
    <BForm.Group>
      <FormLabel>Select payload type</FormLabel>

      <SelectCustom
        options={options}
        isSearchable={false}
        isTouched={touched.payloadType}
        isValid={!errors.payloadType && touched.payloadType}
        isInvalid={!!errors.payloadType && touched.payloadType}
        menuWidth="100%"
        height="38px"
        onChange={async (value) => {
          await setFieldTouched('payloadType', true);
          setFieldValue('payloadType', value.value);
          onSelect(value.value);
        }}
        onBlur={() => {
          setFieldTouched('payloadType', true);
        }}
      />

      <ErrorMessage
        name="payloadType"
        component={BForm.Control.Feedback}
        type="invalid"
      />
    </BForm.Group>
  );
};

PayloadType.propTypes = {
  onSelect: PropTypes.func,
  approveDisabled: PropTypes.bool.isRequired,
  rejectDisabled: PropTypes.bool.isRequired,
};

PayloadType.defaultProps = {
  onSelect: () => null,
};

export default PayloadType;
