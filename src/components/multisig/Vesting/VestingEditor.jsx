import React from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Form as BForm } from 'react-bootstrap';
import { FormLabel, FormSubmit } from '../../styled/Forms';
import useAPI from '../../../hooks/useApi';
import { useContractStateContext } from '../../../store/contractContext';
import { bs58Validation } from '../../../utils/helpers';
import { handleError } from '../../../utils/errorsHandler';

const schema = Yup.object({
  name: Yup.string()
    .required('Required')
    .max(32, 'At most 32 characters')
    .matches(/^[\w ]*$/, 'Only latin characters and numbers are allowed')
    .matches(/^[\w]+( [\w]+)*$/, 'Unnecessary spaces'),
  address: Yup.string()
    .required('Required')
    .matches(
      'tz1|tz2|tz3|KT1',
      'Tezos contract address must start with tz1, tz2, tz3 or KT1',
    )
    .matches(/^\S+$/, 'No spaces are allowed')
    .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
    .length(36, 'Tezos address must be 36 characters long')
    .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
});

const VestingEditor = ({ isEdit, name, address, onCancel }) => {
  const { addVesting, editVesting } = useAPI();
  const { contractAddress } = useContractStateContext();

  const manageVesting = async (values, setSubmitting) => {
    try {
      let resp;

      if (!isEdit) {
        resp = await addVesting(contractAddress, values);
      } else {
        resp = await editVesting(contractAddress, values);
      }
      console.log(resp);
    } catch (e) {
      handleError(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        name,
        address,
      }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        manageVesting(values, setSubmitting);
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <BForm.Group>
            <FormLabel>Vesting contract name</FormLabel>
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
              disabled={isEdit}
            />

            <ErrorMessage
              component={BForm.Control.Feedback}
              name="address"
              type="invalid"
            />
          </BForm.Group>

          <FormSubmit>
            <Button
              variant="danger"
              style={{ marginRight: '10px' }}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Confirm
            </Button>
          </FormSubmit>
        </Form>
      )}
    </Formik>
  );
};

VestingEditor.propTypes = {
  isEdit: PropTypes.bool,
  name: PropTypes.string,
  address: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
};
VestingEditor.defaultProps = {
  isEdit: false,
  name: '',
  address: '',
};

export default VestingEditor;
