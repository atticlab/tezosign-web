/* eslint-disable no-unused-vars */
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
  entities: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number(),
        value: Yup.string().when('isPubKey', {
          is: false,
          then: Yup.string()
            .trim()
            .required('Required')
            .matches(
              'tz1|tz2|tz3',
              'Tezos address must start with tz1, tz2 or tz3',
            )
            .matches(/^\S+$/, 'No spaces are allowed')
            .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
            .length(36, 'Tezos address must be 36 characters long')
            .test('bs58check', 'Invalid checksum', (val) =>
              bs58Validation(val),
            ),
          otherwise: Yup.string().matches('edpk', 'New valids'),
        }),
        isPubKey: Yup.boolean(),
      }),
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
      initialValues={{
        entities: [
          { id: 0, value: '', isPubKey: false },
          { id: 1, value: '', isPubKey: false },
        ],
      }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values.entities.map((entity) => entity.value));
        setSubmitting(false);
      }}
    >
      {({
        setFieldValue,
        isSubmitting,
        values,
        errors,
        touched,
        validateForm,
      }) => (
        <Form>
          {typeof errors.entities === 'string' ? (
            <BForm.Control.Feedback style={{ display: 'block' }} type="invalid">
              {errors.entities}
            </BForm.Control.Feedback>
          ) : null}
          <FieldArray name="entities">
            {(arrayHelpers) => (
              <div>
                {values.entities.map((entity, index) => (
                  <BForm.Group key={entity.id} style={{ marginBottom: '10px' }}>
                    <InputGroup>
                      <Field
                        type="text"
                        name={`entities[${index}].value`}
                        id={`entities[${index}].value`}
                        aria-label={`entities[${index}].value`}
                        placeholder={entity.isPubKey ? 'Public key' : 'tz1...'}
                        as={BForm.Control}
                        size="sm"
                        isInvalid={
                          errors.entities &&
                          touched.entities &&
                          errors.entities[index] &&
                          touched.entities[index] &&
                          !!errors.entities[index].value &&
                          touched.entities[index].value
                        }
                        isValid={
                          errors.entities &&
                          touched.entities &&
                          errors.entities[index] &&
                          touched.entities[index] &&
                          !errors.entities[index].value &&
                          touched.entities[index].value
                        }
                        style={{ maxWidth: '500px' }}
                      />
                      <InputGroup.Append>
                        <Button
                          variant="link"
                          style={{ paddingTop: 0, paddingBottom: 0 }}
                          onClick={() => {
                            console.log('change input type');
                            setFieldValue(
                              `entities[${index}].isPubKey`,
                              !values.entities[index].isPubKey,
                            );
                          }}
                        >
                          <FontAwesomeIcon icon="retweet" />
                        </Button>

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
                      </InputGroup.Append>
                      {typeof errors.entities !== 'string' ? (
                        <ErrorMessage
                          name={`entities[${index}].value`}
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
                    onClick={() =>
                      arrayHelpers.push({
                        id: values.entities.length,
                        value: '',
                        isPubKey: false,
                      })
                    }
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
