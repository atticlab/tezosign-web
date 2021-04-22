import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import {
  Button,
  Form as BForm,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { FormLabel, FormSubmit } from '../../styled/Forms';
import SelectCustom from '../../SelectCustom';
import useAPI from '../../../hooks/useApi';
import { bs58Validation } from '../../../utils/helpers';
import { useContractStateContext } from '../../../store/contractContext';
import { useAssetsDispatchContext } from '../../../store/assetsContext';
import { handleError } from '../../../utils/errorsHandler';

const addressSchema = Yup.string()
  .required('Required')
  .matches('KT1', 'Tezos contract address must start with KT1')
  .matches(/^\S+$/, 'No spaces are allowed')
  .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
  .length(36, 'Tezos address must be 36 characters long')
  .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val));

const tokenIDSchema = Yup.number()
  .required('Required')
  .integer('Value must be an integer')
  .max(Number.MAX_SAFE_INTEGER, `Maximum value is ${Number.MAX_SAFE_INTEGER}`)
  .min(0, 'Minimum value is 0');

const schema = Yup.object({
  address: addressSchema,
  contractType: Yup.string()
    .required('Required')
    .matches('FA1.2|FA2', 'Invalid asset type. Asset types are FA1.2 or FA2'),
  tokenID: Yup.number().when('contractType', {
    is: (assetField) => {
      return assetField === 'FA2';
    },
    then: tokenIDSchema,
    otherwise: Yup.number().max(0, 'Token ID is allowed only for FA2 assets'),
  }),
  name: Yup.string()
    .required('Required')
    .max(32, 'At most 32 characters')
    .matches(/^[\w ]*$/, 'Only latin characters and numbers are allowed')
    .matches(/^[\w]+( [\w]+)*$/, 'Unnecessary spaces'),
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

const handleAssetMeta = async ({
  address,
  addressValidator,
  contractType,
  tokenID,
  tokenIDValidator,
  request,
}) => {
  const isAddressValid = await addressValidator.isValid(address);
  const isTokenIDValid = await tokenIDValidator.isValid(tokenID);

  if (!isAddressValid) return null;
  if (contractType === 'FA2' && !isTokenIDValid) return null;
  if (contractType === 'FA2' && isTokenIDValid) {
    request(address, tokenID);
    return null;
  }
  request(address);
  return null;
};

const AssetEditor = ({
  isEdit,
  address,
  contractType,
  tokenID,
  name,
  scale,
  ticker,
  onSubmit,
  onCancel,
}) => {
  const { contractAddress } = useContractStateContext();
  const { addAsset, editAsset, getAssetMetaData } = useAPI();
  const { setAssets } = useAssetsDispatchContext();
  const [assetMeta, setAssetMeta] = useState({});
  const [isAssetMetaLoading, setIssAssetMetaLoading] = useState(false);
  const [observableFields, setObservableFields] = useState({
    address: null,
    contractType: null,
    tokenID: null,
  });

  const getAssetMeta = async (assetContractID, tokenIdentifier) => {
    try {
      setIssAssetMetaLoading(true);
      const params = {};
      if (typeof tokenIdentifier !== 'undefined') {
        params.token_id = tokenIdentifier;
      }
      const resp = await getAssetMetaData(assetContractID, params);
      setAssetMeta(resp.data);
    } catch (e) {
      handleError(e);
    } finally {
      setIssAssetMetaLoading(false);
    }
  };

  useEffect(() => {
    handleAssetMeta({
      address: observableFields.address,
      addressValidator: addressSchema,
      contractType: observableFields.contractType,
      tokenID: observableFields.tokenID,
      tokenIDValidator: tokenIDSchema,
      request: getAssetMeta,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    observableFields.address,
    observableFields.contractType,
    observableFields.tokenID,
  ]);

  const isFieldDisabled = useMemo(() => {
    return Boolean(Object.keys(assetMeta).length) || isAssetMetaLoading;
  }, [assetMeta, isAssetMetaLoading]);

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

  const addOrEditAsset = (contractID, assetFields, setSubmitting) => {
    if (!isEdit) {
      return addAssetReq(contractID, assetFields, setSubmitting);
    }

    return editAssetReq(contractID, assetFields, setSubmitting);
  };

  return (
    <Formik
      initialValues={{
        address,
        contractType,
        tokenID,
        name,
        scale,
        ticker,
      }}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting }) => {
        return addOrEditAsset(contractAddress, values, setSubmitting);
      }}
    >
      {({
        values,
        errors,
        touched,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
        handleBlur,
      }) => (
        <Form>
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
                setFieldTouched('address', true, true);
                if (isEdit) {
                  setFieldValue('address', address);
                }
                setObservableFields((prev) => ({
                  ...prev,
                  address: values.address,
                }));
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

                setObservableFields((prev) => ({
                  ...prev,
                  contractType: values.contractType,
                }));
              }}
            />

            <ErrorMessage
              name="contractType"
              component={BForm.Control.Feedback}
              type="invalid"
            />
          </BForm.Group>

          <BForm.Group controlId="tokenID">
            <OverlayTrigger
              overlay={
                <Tooltip>
                  Token ID is an identifier of the token in FA2 asset contract.
                </Tooltip>
              }
            >
              <FormLabel>Token ID</FormLabel>
            </OverlayTrigger>
            <Field
              as={BForm.Control}
              type="number"
              name="tokenID"
              aria-label="tokenID"
              step="1"
              min="0"
              autoComplete="off"
              disabled={values.contractType !== 'FA2'}
              isInvalid={!!errors.tokenID && touched.tokenID}
              isValid={!errors.tokenID && touched.tokenID}
              onBlur={(e) => {
                handleBlur(e);
                setObservableFields((prev) => ({
                  ...prev,
                  tokenID: values.tokenID,
                }));
              }}
            />
            <ErrorMessage
              component={BForm.Control.Feedback}
              name="tokenID"
              type="invalid"
            />
          </BForm.Group>

          <BForm.Group>
            <FormLabel>Asset name</FormLabel>
            <Field
              as={BForm.Control}
              type="text"
              name="name"
              aria-label="name"
              autoComplete="off"
              disabled={assetMeta.name || isFieldDisabled}
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
            <FormLabel>Decimals</FormLabel>

            <Field
              as={BForm.Control}
              type="number"
              max="10"
              min="0"
              name="scale"
              aria-label="scale"
              autoComplete="off"
              disabled={assetMeta.decimals || isFieldDisabled}
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
              disabled={assetMeta.symbol || isFieldDisabled}
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
  address: PropTypes.string,
  contractType: PropTypes.string,
  tokenID: PropTypes.string,
  name: PropTypes.string,
  scale: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ticker: PropTypes.string,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

AssetEditor.defaultProps = {
  isEdit: false,
  address: '',
  contractType: contractTypes[0].value,
  tokenID: '',
  name: '',
  scale: '',
  ticker: '',
  onSubmit: () => null,
  onCancel: () => null,
};

export default AssetEditor;
