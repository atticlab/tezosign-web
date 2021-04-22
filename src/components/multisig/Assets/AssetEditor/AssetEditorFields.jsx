import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Form as BForm,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { ErrorMessage, Field, Form, useFormikContext } from 'formik';
import styled from 'styled-components';
import { FormLabel, FormSubmit } from '../../../styled/Forms';
import SelectCustom from '../../../SelectCustom';
import Spinner from '../../../Spinner';
import useAPI from '../../../../hooks/useApi';
import { handleError } from '../../../../utils/errorsHandler';
import { addressSchema, tokenIDSchema } from './assetEditorSchemas';
import { contractTypes } from '../../../../utils/constants';

const Overlay = styled.div`
  position: relative;
`;

Overlay.Item = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 70%);
`;

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

const AssetEditorFields = ({ isEdit, address, contractType, onCancel }) => {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    setFieldTouched,
    // validateForm,
    // validateField,
    handleChange,
    handleBlur,
  } = useFormikContext();
  const [observableFields, setObservableFields] = useState({
    address: null,
    contractType: null,
    tokenID: null,
  });
  const [assetMeta, setAssetMeta] = useState({});
  const [isAssetMetaLoading, setIsAssetMetaLoading] = useState(false);
  const { getAssetMetaData } = useAPI();

  const getAssetMeta = async (assetContractID, tokenIdentifier) => {
    try {
      setIsAssetMetaLoading(true);
      const params = {};
      if (typeof tokenIdentifier !== 'undefined') {
        params.token_id = tokenIdentifier;
      }
      const resp = await getAssetMetaData(assetContractID, params);
      setAssetMeta(resp.data);
    } catch (e) {
      handleError(e);
      setAssetMeta({});
    } finally {
      setIsAssetMetaLoading(false);
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

  const resetDependantFields = async () => {
    await setFieldValue('name', '');
    await setFieldValue('scale', '');
    await setFieldValue('ticker', '');
  };

  useEffect(() => {
    // if (assetMeta.symbol) {
    //   setFieldValue('ticker', assetMeta.symbol);
    // }
    // if (assetMeta.name) {
    //   setFieldValue('name', assetMeta.name);
    // }
    // if (assetMeta.decimals) {
    //   setFieldValue('scale', assetMeta.decimals);
    // }
    (async () => {
      await setFieldValue('name', assetMeta.name || '');
      await setFieldValue('scale', assetMeta.decimals || '');
      await setFieldValue('ticker', assetMeta.symbol || '');
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetMeta]);

  const isFieldDisabled = useMemo(() => {
    return Boolean(Object.keys(assetMeta).length) || isAssetMetaLoading;
  }, [assetMeta, isAssetMetaLoading]);

  return (
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
          onChange={async (e) => {
            handleChange(e);
            resetDependantFields();
          }}
          onBlur={(e) => {
            handleBlur(e);
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
            resetDependantFields();

            setObservableFields((prev) => ({
              ...prev,
              contractType: values.contractType,
            }));
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
          onChange={(e) => {
            handleChange(e);
            resetDependantFields();
          }}
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

      <Overlay isLoading={isAssetMetaLoading}>
        {isAssetMetaLoading ? (
          <Overlay.Item>
            <Spinner />
          </Overlay.Item>
        ) : (
          ''
        )}

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
            onBlur={(e) => {
              handleBlur(e);
              if (assetMeta.name || isFieldDisabled) {
                setFieldValue('name', assetMeta.name);
              }
            }}
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
            onBlur={(e) => {
              handleBlur(e);
              if (assetMeta.decimals || isFieldDisabled) {
                setFieldValue('scale', assetMeta.decimals);
              }
            }}
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
            onBlur={(e) => {
              handleBlur(e);
              if (assetMeta.symbol || isFieldDisabled) {
                setFieldValue('ticker', assetMeta.symbol);
              }
            }}
          />

          <ErrorMessage
            component={BForm.Control.Feedback}
            name="ticker"
            type="invalid"
          />
        </BForm.Group>
      </Overlay>

      <FormSubmit>
        <Button
          variant="danger"
          style={{ marginRight: '10px' }}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isAssetMetaLoading}>
          Confirm
        </Button>
      </FormSubmit>
    </Form>
  );
};

AssetEditorFields.propTypes = {
  isEdit: PropTypes.bool,
  address: PropTypes.string,
  contractType: PropTypes.string,
  onCancel: PropTypes.func,
};

AssetEditorFields.defaultProps = {
  isEdit: false,
  address: '',
  contractType: contractTypes[0].value,
  onCancel: () => null,
};

export default AssetEditorFields;
