/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Button, Form as BForm } from 'react-bootstrap';
import { FormLabel, FormSubmit } from '../../styled/Forms';
import SelectCustom from '../../SelectCustom';
import { bs58Validation } from '../../../utils/helpers';

const schema = Yup.object({
  name: Yup.string()
    .required('Required')
    .max(32, 'At most 32 characters')
    .matches(/^\S+$/, 'No spaces are allowed')
    .matches(/^[a-zA-Z0-9]*$/, 'Only latin characters and numbers are allowed'),
  address: Yup.string()
    .trim()
    .required('Required')
    .matches('KT1', 'Tezos contract address must start with KT1')
    .matches(/^\S+$/, 'No spaces are allowed')
    .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
    .length(36, 'Tezos address must be 36 characters long')
    .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
  contractType: Yup.string().required('Required'),
  scale: Yup.number()
    .required('Required')
    .min(1, 'Minimum scale is 1')
    .max(10, 'Maximum scale is 10'),
  ticker: Yup.string()
    .required('Required')
    .max(5, 'At most 5 characters')
    .matches(/^\S+$/, 'No spaces are allowed')
    .matches(/^[a-zA-Z0-9]*$/, 'Only latin characters and numbers are allowed'),
});

const contractTypes = [
  { value: 'FA1.2', label: 'FA1.2' },
  { value: 'FA2', label: 'FA2' },
];

const AssetEditor = ({ name, scale, ticker }) => {
  return (
    <Formik
      initialValues={{
        name,
        address: '',
        contractType: '',
        scale,
        ticker,
      }}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        console.log(values);
        setSubmitting(false);
      }}
    >
      {({
        values,
        errors,
        touched,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
      }) => (
        <Form>
          <BForm.Group>
            <FormLabel>Asset name</FormLabel>

            <Field
              as={BForm.Control}
              type="text"
              name="name"
              aria-label="name"
              isInvalid={!!errors.name && touched.name}
              isValid={!errors.name && touched.name}
            />

            <ErrorMessage
              component={BForm.Control.Feedback}
              name="name"
              type="invalid"
            />
          </BForm.Group>

          <BForm.Group>
            <FormLabel>Contract address</FormLabel>

            <Field
              as={BForm.Control}
              type="text"
              name="address"
              aria-label="address"
              isInvalid={!!errors.address && touched.address}
              isValid={!errors.address && touched.address}
            />

            <ErrorMessage
              component={BForm.Control.Feedback}
              name="address"
              type="invalid"
            />
          </BForm.Group>

          <BForm.Group>
            <FormLabel>Contract type</FormLabel>

            <SelectCustom
              isSearchable={false}
              options={contractTypes}
              isInvalid={!!errors.contractType && touched.contractType}
              isValid={!errors.contractType && touched.contractType}
              isTouched={touched.contractType}
              menuWidth="100%"
              value={
                contractTypes
                  ? contractTypes.find((option) => {
                      return option.value === values.contractType;
                    })
                  : ''
              }
              onChange={(value) => {
                setFieldValue('contractType', value.value);
                setFieldTouched('contractType', true);
              }}
              onBlur={() => {
                setFieldTouched('contractType', true);
              }}
            />

            {!!errors.contractType && touched.contractType && (
              <div style={{ color: 'red', fontSize: '12px' }}>
                {errors.contractType}
              </div>
            )}
          </BForm.Group>

          <BForm.Group>
            <FormLabel>Scale</FormLabel>

            <Field
              as={BForm.Control}
              type="number"
              max="6"
              name="scale"
              aria-label="scale"
              isInvalid={!!errors.scale && touched.scale}
              isValid={!errors.scale && touched.scale}
            />

            <ErrorMessage
              component={BForm.Control.Feedback}
              name="scale"
              type="invalid"
            />
          </BForm.Group>

          <BForm.Group>
            <FormLabel>Ticker</FormLabel>

            <Field
              as={BForm.Control}
              type="text"
              name="ticker"
              aria-label="ticker"
              isInvalid={!!errors.ticker && touched.ticker}
              isValid={!errors.ticker && touched.ticker}
            />

            <ErrorMessage
              component={BForm.Control.Feedback}
              name="ticker"
              type="invalid"
            />
          </BForm.Group>

          <FormSubmit style={{ marginTop: '30px' }}>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              Submit
            </Button>
          </FormSubmit>
        </Form>
      )}
    </Formik>
  );
};

AssetEditor.propTypes = {
  name: PropTypes.string,
  scale: PropTypes.string,
  ticker: PropTypes.string,
};

AssetEditor.defaultProps = {
  name: '',
  scale: '',
  ticker: '',
};

export default AssetEditor;
