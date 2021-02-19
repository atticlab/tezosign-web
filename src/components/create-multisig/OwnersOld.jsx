import React from 'react';
import PropTypes from 'prop-types';
import { Form as BForm, InputGroup, Button } from 'react-bootstrap';
import { Formik, Form, FieldArray, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from '../styled/Card';
import Text from '../styled/Text';
import { bs58Validation } from '../../utils/helpers';

// Research fn declaration necessity
// eslint-disable-next-line func-names
Yup.addMethod(Yup.array, 'unique', function (message, mapper = (a) => a) {
  return this.test('unique', message, (list) => {
    return list.length === new Set(list.map(mapper)).size;
  });
});

const schema = Yup.object().shape({
  addresses: Yup.array()
    .of(
      Yup.string()
        .trim()
        .required('Required')
        .matches('tz1|tz2|tz3', 'Tezos address must start with tz1, tz2 or tz3')
        .matches(/^\S+$/, 'No spaces are allowed')
        .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
        .length(36, 'Tezos address must be 36 characters long')
        .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
    )
    .ensure()
    .required('Must have addresses')
    .min(2, 'Minimum of 2 addresses')
    .max(20, 'Maximum of 20 addresses')
    .unique('Addresses must be unique'),
});

const Owners = ({ onSubmit }) => (
  <Card.Body>
    <Text modifier="md">
      First, provide the accounts that will be controlling and administering the
      funds associated with this multisig wallet.
    </Text>

    <Formik
      // initialValues={{ addresses: ['', ''] }}
      initialValues={{ addresses: ['', ''] }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values.addresses);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, values, errors, touched, validateForm }) => (
        <Form>
          {typeof errors.addresses === 'string' ? (
            <BForm.Control.Feedback style={{ display: 'block' }} type="invalid">
              {errors.addresses}
            </BForm.Control.Feedback>
          ) : null}
          <FieldArray name="addresses">
            {(arrayHelpers) => (
              <div>
                {values.addresses.map((address, index) => (
                  /* eslint-disable react/no-array-index-key */
                  <BForm.Group key={index} style={{ marginBottom: '10px' }}>
                    <InputGroup>
                      <Field
                        type="text"
                        name={`addresses[${index}]`}
                        id={`addresses[${index}]`}
                        aria-label={`addresses[${index}]`}
                        placeholder="tz1..."
                        as={BForm.Control}
                        size="sm"
                        isInvalid={
                          errors.addresses &&
                          touched.addresses &&
                          !!errors.addresses[index] &&
                          touched.addresses[index]
                        }
                        isValid={
                          errors.addresses &&
                          touched.addresses &&
                          !errors.addresses[index] &&
                          touched.addresses[index]
                        }
                        style={{ maxWidth: '500px' }}
                      />
                      <InputGroup.Append>
                        {index > 1 ? (
                          <Button
                            variant="link"
                            style={{ paddingTop: 0, paddingBottom: 0 }}
                            onClick={() => {
                              arrayHelpers.remove(index);
                              setTimeout(() => {
                                validateForm();
                              });
                            }}
                          >
                            <FontAwesomeIcon icon="trash-alt" />
                          </Button>
                        ) : (
                          ''
                        )}
                        <Button
                          variant="link"
                          style={{ paddingTop: 0, paddingBottom: 0 }}
                          onClick={() => console.log('change input type')}
                        >
                          <FontAwesomeIcon icon="retweet" />
                        </Button>
                      </InputGroup.Append>
                      {typeof errors.addresses !== 'string' ? (
                        <ErrorMessage
                          name={`addresses[${index}]`}
                          component={BForm.Control.Feedback}
                          type="invalid"
                        />
                      ) : null}
                    </InputGroup>
                  </BForm.Group>
                ))}
                <div style={{ maxWidth: '500px' }}>
                  <Button
                    variant="link"
                    block
                    onClick={() => arrayHelpers.push('')}
                  >
                    <FontAwesomeIcon icon="plus" />
                  </Button>
                </div>
              </div>
            )}
          </FieldArray>

          <div style={{ textAlign: 'right' }}>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              Submit
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  </Card.Body>
);

Owners.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Owners;
