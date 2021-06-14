import React from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Form as BForm } from 'react-bootstrap';
import { FormLabel, FormSubmit } from '../../styled/Forms';
import InputVestingName from './InputVestingName';
import useAPI from '../../../hooks/useApi';
import { useContractStateContext } from '../../../store/contractContext';
import { bs58Validation } from '../../../utils/helpers';
import { handleError } from '../../../utils/errorsHandler';
import { useVestingsDispatchContext } from '../../../store/vestingsContext';
import vestingNameSchema from '../../../utils/schemas/vestingNameSchema';

const schema = Yup.object({
  name: vestingNameSchema.required('Required'),
  address: Yup.string()
    .required('Required')
    .matches('KT1', 'Tezos contract address must start with KT1')
    .matches(/^\S+$/, 'No spaces are allowed')
    .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
    .length(36, 'Tezos address must be 36 characters long')
    .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
});

const VestingEditor = ({ isEdit, name, address, onSubmit, onCancel }) => {
  const { addVesting, editVesting } = useAPI();
  const { contractAddress } = useContractStateContext();
  const { setVestings } = useVestingsDispatchContext();

  const addVestingReq = async (values, resetForm) => {
    try {
      const resp = await addVesting(contractAddress, values);
      setVestings((prev) => [resp.data, ...prev]);

      resetForm();
      onSubmit();
    } catch (e) {
      handleError(e);
    }
  };

  const editVestingReq = async (values, resetForm) => {
    try {
      const resp = await editVesting(contractAddress, values);
      setVestings((prev) => {
        const indexToModify = prev.indexOf(
          prev.find((asset) => asset.address === resp.data.address),
        );
        const res = [...prev];
        res[indexToModify] = resp.data;
        return res;
      });

      resetForm();
      onSubmit();
    } catch (e) {
      handleError(e);
    }
  };

  const addOrEditVesting = async (values, resetForm) => {
    if (!isEdit) {
      return addVestingReq(values, resetForm);
    }

    return editVestingReq(values, resetForm);
  };

  return (
    <Formik
      initialValues={{
        name,
        address,
      }}
      validationSchema={schema}
      onSubmit={async (values, { resetForm }) => {
        await addOrEditVesting(values, resetForm);
      }}
    >
      {({ errors, touched, isSubmitting, setFieldTouched, setFieldValue }) => (
        <Form>
          <InputVestingName />

          <BForm.Group>
            <FormLabel>Vesting contract address</FormLabel>

            <Field
              as={BForm.Control}
              type="text"
              name="address"
              aria-label="address"
              autoComplete="off"
              isInvalid={!!errors.address && touched.address}
              isValid={!errors.address && touched.address}
              disabled={isEdit}
              onBlur={() => {
                setFieldTouched('address', true);
                if (isEdit) {
                  setFieldValue('address', address);
                }
              }}
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
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
VestingEditor.defaultProps = {
  isEdit: false,
  name: '',
  address: '',
};

export default VestingEditor;
