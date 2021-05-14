import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Form as BForm } from 'react-bootstrap';
import { FormLabel } from '../../../../styled/Forms';
import SelectCustom from '../../../../SelectCustom';

const schema = Yup.object({
  payloadType: Yup.string()
    .required('Required')
    .matches(
      'approve|reject',
      `Payload type can be either "approve" or "reject"`,
    ),
});

const options = [
  { value: 'approve', label: 'Approve' },
  { value: 'reject', label: 'Reject' },
];

const PayloadType = ({ onSelect }) => {
  return (
    <Formik
      initialValues={{ payloadType: 'approve' }}
      schema={schema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
      }}
    >
      {({ touched, errors, setFieldValue, setFieldTouched }) => (
        <Form>
          <BForm.Group>
            <FormLabel>Select payload type</FormLabel>

            <SelectCustom
              options={options}
              isSearchable={false}
              isTouched={touched.payloadType}
              isValid={!errors.payloadType && touched.payloadType}
              isInvalid={!!errors.payloadType && touched.payloadType}
              menuWidth="100%"
              onChange={(value) => {
                setFieldValue('payloadType', value.value);
                setFieldTouched('payloadType', true);
                onSelect(value.value);
              }}
              onBlur={() => {
                setFieldTouched('payloadType', true);
              }}
            />
          </BForm.Group>
        </Form>
      )}
    </Formik>
  );
};

PayloadType.propTypes = {
  onSelect: PropTypes.func,
};

PayloadType.defaultProps = {
  onSelect: () => null,
};

export default PayloadType;
