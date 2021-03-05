import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Form as BForm, InputGroup, Button } from 'react-bootstrap';
import { Formik, Form, ErrorMessage } from 'formik';
// TODO: Research import variants
import * as Yup from 'yup';
import Card from '../styled/Card';
import Text from '../styled/Text';
import SelectCustom from '../SelectCustom';

const schema = Yup.object({
  signatures: Yup.number()
    .moreThan(0, 'The number of signatures must be greater than 0')
    .required('Required'),
});

const Thresholds = ({ addresses, onSubmit, onBack }) => {
  const options = useMemo(
    () =>
      addresses.map((address, index) => ({
        value: index + 1,
        label: index + 1,
      })),
    [addresses],
  );

  return (
    <Card.Body>
      <Text modifier="md">
        Next, provide the number of signatures required in order to confirm a
        transaction.
      </Text>

      {options && options.length && (
        <Formik
          enableReinitialize
          initialValues={{ signatures: options[0].value }}
          validationSchema={schema}
          onSubmit={(values, { setSubmitting }) => {
            onSubmit(values.signatures);
            setSubmitting(false);
          }}
        >
          {({
            isSubmitting,
            errors,
            touched,
            setFieldValue,
            setFieldTouched,
          }) => (
            <Form>
              <BForm.Group style={{ maxWidth: '264px', margin: '40px auto' }}>
                <InputGroup>
                  <SelectCustom
                    options={options}
                    defaultValue={options[0]}
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
                    <Text
                      modifier="md"
                      style={{ marginBottom: '0', padding: '2px 10px' }}
                    >
                      {`out of ${addresses.length} owners`}
                    </Text>
                  </InputGroup.Append>
                  <ErrorMessage
                    name="signatures"
                    component={BForm.Control.Feedback}
                    type="invalid"
                  />
                </InputGroup>
              </BForm.Group>

              <div style={{ textAlign: 'right' }}>
                <Button
                  variant="outline-primary"
                  size="lg"
                  style={{ marginRight: '24px' }}
                  onClick={onBack}
                >
                  Back
                </Button>
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Card.Body>
  );
};

Thresholds.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default Thresholds;
