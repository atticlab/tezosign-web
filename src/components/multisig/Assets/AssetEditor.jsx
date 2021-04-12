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
    .required('Required')
    .matches('KT1', 'Tezos contract address must start with KT1')
    .matches(/^\S+$/, 'No spaces are allowed')
    .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
    .length(36, 'Tezos address must be 36 characters long')
    .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
  contractType: Yup.string().required('Required'),
  scale: Yup.number()
    .required('Required')
    .integer('Decimals must be an integer')
    .min(0, 'Minimum scale is 0')
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

const formAssetPayload = ({ name, contractType, address, scale, ticker }) => {
  return {
    name,
    contract_type: contractType,
    address,
    scale,
    ticker,
  };
};

const AssetEditor = ({
  isEdit,
  name,
  address,
  contractType,
  scale,
  ticker,
  onSubmit,
  onCancel,
}) => {
  const { contractAddress } = useContractStateContext();
  const { addAsset, editAsset } = useAPI();
  const { setAssets } = useAssetsDispatchContext();

  const addAssetReq = async (contractID, assetFields, setSubmitting) => {
    try {
      const resp = await addAsset(contractID, formAssetPayload(assetFields));
      setAssets((prev) => [...prev, resp.data]);
      onSubmit();
    } catch (e) {
      handleError(e);
    } finally {
      setSubmitting(false);
    }
  };

  const editAssetReq = async (contractID, assetFields, setSubmitting) => {
    try {
      const resp = await editAsset(contractID, formAssetPayload(assetFields));
      setAssets((prev) => {
        const indexToModify = prev.indexOf(
          prev.find((asset) => asset.address === resp.data.address),
        );
        const res = [...prev];
        res[indexToModify] = resp.data;
        return res;
      });
      onSubmit();
    } catch (e) {
      handleError(e);
    } finally {
      setSubmitting(false);
    }
  };

  const addOrCreateAsset = (contractID, assetFields, setSubmitting) => {
    if (!isEdit) {
      return addAssetReq(contractID, assetFields, setSubmitting);
    }

    return editAssetReq(contractID, assetFields, setSubmitting);
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
        return addOrCreateAsset(contractAddress, values, setSubmitting);
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
              autoComplete="off"
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
            <FormLabel>Asset contract address</FormLabel>

            <Field
              as={BForm.Control}
              type="text"
              name="address"
              aria-label="address"
              disabled={isEdit}
              autoComplete="off"
              isInvalid={!!errors.address && touched.address}
              isValid={!errors.address && touched.address}
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

          <BForm.Group>
            <FormLabel>Asset contract type</FormLabel>

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
                if (isEdit) {
                  setFieldValue('contractType', contractType);
                }
              }}
            />

            <ErrorMessage
              name="contractType"
              component={BForm.Control.Feedback}
              type="invalid"
            />
          </BForm.Group>
          <BForm.Group>
            <FormLabel>Decimals</FormLabel>

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
            <FormLabel>Symbol</FormLabel>

            <Field
              as={BForm.Control}
              type="text"
              name="ticker"
              aria-label="ticker"
              autoComplete="off"
              isInvalid={!!errors.ticker && touched.ticker}
              isValid={!errors.ticker && touched.ticker}
            />

            <ErrorMessage
              component={BForm.Control.Feedback}
              name="ticker"
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

AssetEditor.propTypes = {
  isEdit: PropTypes.bool,
  name: PropTypes.string,
  address: PropTypes.string,
  contractType: PropTypes.string,
  scale: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ticker: PropTypes.string,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

AssetEditor.defaultProps = {
  isEdit: false,
  name: '',
  address: '',
  contractType: '',
  scale: '',
  ticker: '',
  onSubmit: () => null,
  onCancel: () => null,
};

export default AssetEditor;
