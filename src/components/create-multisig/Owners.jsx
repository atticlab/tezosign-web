import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Form as BForm,
  InputGroup,
  Button,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { Formik, Form, FieldArray, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from '../styled/Card';
import Text from '../styled/Text';
import { bs58Validation, isHex } from '../../utils/helpers';
import useAPI from '../../hooks/useApi';

// eslint-disable-next-line func-names
Yup.addMethod(Yup.array, 'unique', function (message, mapper = (a) => a) {
  return this.test('unique', message, (list) => {
    return list.length === new Set(list.map(mapper)).size;
  });
});
// eslint-disable-next-line func-names
Yup.addMethod(Yup.string, 'specificLength', function (message) {
  return this.test('specificLength', message, (val) => {
    return val?.length === 54 || val?.length === 55 || val?.length === 64;
  });
});
// eslint-disable-next-line func-names
Yup.addMethod(Yup.string, 'bs58OrHexCheck', function (message) {
  return this.test('bs58OrHexCheck', message, (val) => {
    if (val?.length === 64) return isHex(val);
    return bs58Validation(val);
  });
});

const cacheTest = (asyncValidate) => {
  let valid = false;
  let valueCached = '';

  return async (value) => {
    if (value !== valueCached) {
      const response = await asyncValidate(value);
      valueCached = value;
      valid = response;
      return response;
    }
    return valid;
  };
};

const Owners = ({ onSubmit }) => {
  const { isAddressRevealed } = useAPI();
  const testIsAddressRevealed = async (val) => {
    if (!val || val.length !== 36 || !bs58Validation(val)) return false;
    const resp = await isAddressRevealed(val);
    return resp.data.revealed;
  };
  const testAddress = useRef(cacheTest(testIsAddressRevealed));

  const schema = Yup.object().shape({
    entities: Yup.array()
      .of(
        Yup.object().shape({
          id: Yup.number(),
          value: Yup.string().when('isPubKey', {
            is: false,
            then: Yup.string()
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
              )
              .test('sad', 'Address is unrevealed', testAddress.current),
            otherwise: Yup.string()
              .required('Required')
              .matches(/^\S+$/, 'No spaces are allowed')
              .specificLength(
                'The string must be either 54-55 (base58) or 64(hex) characters long',
              )
              .bs58OrHexCheck('The string must be base58 or hex format'),
          }),
          isPubKey: Yup.boolean(),
        }),
      )
      .ensure()
      .required('Must have addresses')
      .min(1, 'Minimum of 1 addresses')
      .max(20, 'Maximum of 20 addresses')
      .unique('Addresses must be unique', (entity) => entity.value),
  });

  return (
    <Card.Body>
      <Text modifier="md">
        First, provide the accounts that will be controlling and administering
        the funds associated with this multisig wallet. <br />
        You can provide either Tezos addresses or accounts&#39; public keys.
        Public keys may be convenient to use if account&#39;s address is
        unrevealed. A public key must be either base58 or ED25519 hex format.
      </Text>

      <Formik
        initialValues={{
          entities: [{ id: 0, value: '', isPubKey: false }],
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
              <BForm.Control.Feedback
                style={{ display: 'block' }}
                type="invalid"
              >
                {errors.entities}
              </BForm.Control.Feedback>
            ) : null}
            <FieldArray name="entities" validateOnChange={false}>
              {(arrayHelpers) => (
                <div>
                  {values.entities.map((entity, index) => (
                    <BForm.Group
                      key={entity.id}
                      style={{ marginBottom: '10px' }}
                    >
                      <InputGroup>
                        <Field
                          type="text"
                          name={`entities[${index}].value`}
                          id={`entities[${index}].value`}
                          aria-label={`entities[${index}].value`}
                          placeholder={
                            entity.isPubKey
                              ? 'Public key (base58 or hex)'
                              : 'tz1...'
                          }
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
                          <OverlayTrigger
                            overlay={
                              <Tooltip>
                                Switch to accept{' '}
                                {values.entities[index].isPubKey
                                  ? 'an address'
                                  : 'a public key'}
                              </Tooltip>
                            }
                          >
                            <Button
                              variant="link"
                              style={{ paddingTop: 0, paddingBottom: 0 }}
                              onClick={() => {
                                setFieldValue(
                                  `entities[${index}].isPubKey`,
                                  !values.entities[index].isPubKey,
                                );
                              }}
                            >
                              <FontAwesomeIcon icon="retweet" />
                            </Button>
                          </OverlayTrigger>

                          {index > 0 ? (
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
};

Owners.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Owners;
