import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Formik, Form } from 'formik';
// TODO: Research import variants
import * as Yup from 'yup';
import Card from '../styled/Card';
import Text from '../styled/Text';
import ThresholdsFields from './ThresholdsFields';
import signaturesSchema from '../../utils/schemas/signaturesSchema';

const schema = Yup.object({
  signatures: signaturesSchema,
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
              <ThresholdsFields
                options={options}
                defaultValue={options[0]}
                touched={touched}
                errors={errors}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
              />

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
