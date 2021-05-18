import React from 'react';
import {
  Button,
  Form as BForm,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { ErrorMessage, Field, FieldArray, useFormikContext } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAddressRevealCheck from '../../hooks/useAddressRevealCheck';

const OwnersFields = () => {
  const {
    values,
    touched,
    errors,
    handleBlur,
    setFieldValue,
    validateForm,
    validateField,
    setFieldError,
  } = useFormikContext();
  const { testIsAddressRevealed } = useAddressRevealCheck();

  return (
    <>
      {typeof errors.entities === 'string' ? (
        <BForm.Control.Feedback style={{ display: 'block' }} type="invalid">
          {errors.entities}
        </BForm.Control.Feedback>
      ) : null}

      <FieldArray name="entities" validateOnChange={false}>
        {(arrayHelpers) => (
          <div>
            {values.entities.map((entity, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <BForm.Group key={index} style={{ marginBottom: '10px' }}>
                <InputGroup>
                  <Field
                    type="text"
                    name={`entities[${index}].value`}
                    id={`entities[${index}].value`}
                    aria-label={`entities[${index}].value`}
                    placeholder={
                      entity.isPubKey ? 'Public key (base58 or hex)' : 'tz1...'
                    }
                    as={BForm.Control}
                    size="sm"
                    autoComplete="off"
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
                    onBlur={async (e) => {
                      handleBlur(e);
                      const res = await testIsAddressRevealed(e.target.value);
                      if (res === false) {
                        await setFieldError(
                          `entities[${index}].value`,
                          'Address is unrevealed',
                        );
                        validateField(`entities[${index}].value`);
                      }
                    }}
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

                    {values.entities.length > 1 ? (
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
            <div style={{ maxWidth: '500px', textAlign: 'center' }}>
              <Button
                variant="link"
                onClick={() =>
                  arrayHelpers.push({
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
    </>
  );
};

export default OwnersFields;
