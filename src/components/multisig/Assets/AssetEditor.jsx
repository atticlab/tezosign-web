import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Button, Form as BForm } from 'react-bootstrap';
import { FormLabel, FormSubmit } from '../../styled/Forms';
import SelectCustom from '../../SelectCustom';
import useAPI from '../../../hooks/useApi';
import { bs58Validation } from '../../../utils/helpers';
import { useContractStateContext } from '../../../store/contractContext';
import { useAssetsDispatchContext } from '../../../store/assetsContext';
import { handleError } from '../../../utils/errorsHandler';

const schema = Yup.object({
  name: Yup.string()
    .required('Required')
    .max(32, 'At most 32 characters')
    .matches(/^[\w ]*$/, 'Only latin characters and numbers are allowed')
    .matches(/^[\w]+( [\w]+)*$/, 'Unnecessary spaces'),
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

const AssetEditor = ({
  isEdit,
  name,
  address,
  contractType,
  scale,
  ticker,
  onSubmit,
}) => {
  const { contractAddress } = useContractStateContext();
  const { createAsset, editAsset } = useAPI();
  const { setAssets } = useAssetsDispatchContext();

  const addAsset = async (contractID, assetFields, setSubmitting) => {
    try {
      setSubmitting(true);
      const payload = {
        name: assetFields.name,
        contract_type: assetFields.contractType,
        address: assetFields.address,
        scale: assetFields.scale,
        ticker: assetFields.ticker,
      };
      let resp;

      if (!isEdit) {
        resp = await createAsset(contractID, payload);
        setAssets((prev) => [...prev, resp.data]);
      } else {
        resp = await editAsset(contractID, payload);
        setAssets((prev) => {
          const indexToModify = prev.indexOf(
            prev.find((asset) => asset.address === resp.data.address),
          );
          const res = [...prev];
          res[indexToModify] = resp.data;
          return res;
        });
      }

      onSubmit();
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
        contractType,
        scale,
        ticker,
      }}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting }) => {
        return addAsset(contractAddress, values, setSubmitting);
      }}
    >
      {({ errors, touched, setFieldValue, setFieldTouched, isSubmitting }) => (
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
              disabled={isEdit}
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
              options={contractTypes}
              defaultValue={contractTypes.find(
                (contractTypeObj) => contractTypeObj.value === contractType,
              )}
              isSearchable={false}
              isInvalid={!!errors.contractType && touched.contractType}
              isValid={!errors.contractType && touched.contractType}
              isTouched={touched.contractType}
              menuWidth="100%"
              height="38px"
              disabled={isEdit}
              onChange={(value) => {
                setFieldValue('contractType', value.value);
                setFieldTouched('contractType', true);
              }}
              onBlur={() => {
                setFieldTouched('contractType', true);
              }}
            />

            <ErrorMessage
              name="contractType"
              component={BForm.Control.Feedback}
              type="invalid"
            />
          </BForm.Group>

          <BForm.Group>
            <FormLabel>Scale</FormLabel>

            <Field
              as={BForm.Control}
              type="number"
              max="10"
              min="0"
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
  isEdit: PropTypes.bool,
  name: PropTypes.string,
  address: PropTypes.string,
  contractType: PropTypes.string,
  scale: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ticker: PropTypes.string,
  onSubmit: PropTypes.func,
};

AssetEditor.defaultProps = {
  isEdit: false,
  name: '',
  address: '',
  contractType: '',
  scale: '',
  ticker: '',
  onSubmit: () => null,
};

export default AssetEditor;
