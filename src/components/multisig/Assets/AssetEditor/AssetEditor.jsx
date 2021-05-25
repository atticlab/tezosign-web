import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import AssetEditorFields from './AssetEditorFields';
import { useAssetsDispatchContext } from '../../../../store/assetsContext';
import { useContractStateContext } from '../../../../store/contractContext';
import useAPI from '../../../../hooks/useApi';
import { handleError } from '../../../../utils/errorsHandler';
import { schema } from './assetEditorSchemas';
import { contractTypes } from '../../../../utils/constants';

const formAssetPayload = ({
  name,
  contractType,
  address,
  scale,
  ticker,
  tokenID,
}) => {
  const payload = {
    name,
    contract_type: contractType,
    address,
    scale: Number(scale),
    ticker,
  };

  if (
    typeof tokenID !== 'undefined' &&
    tokenID !== '' &&
    contractType !== 'FA1.2'
  ) {
    payload.token_id = tokenID;
  }

  return payload;
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
  const { addAsset, editAsset } = useAPI();
  const { setAssets } = useAssetsDispatchContext();
  const { contractAddress } = useContractStateContext();

  const addAssetReq = async (contractID, assetFields, resetForm) => {
    try {
      const resp = await addAsset(contractID, formAssetPayload(assetFields));
      setAssets((prev) => [resp.data, ...prev]);

      resetForm();
      onSubmit();
    } catch (e) {
      handleError(e);
    }
  };

  const editAssetReq = async (contractID, assetFields, resetForm) => {
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

      resetForm();
      onSubmit();
    } catch (e) {
      handleError(e);
    }
  };

  const addOrEditAsset = (contractID, assetFields, resetForm) => {
    if (!isEdit) {
      return addAssetReq(contractID, assetFields, resetForm);
    }

    return editAssetReq(contractID, assetFields, resetForm);
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
      onSubmit={async (values, { resetForm }) => {
        await addOrEditAsset(contractAddress, values, resetForm);
      }}
    >
      <AssetEditorFields
        isEdit={isEdit}
        address={address}
        contractType={contractType}
        name={name}
        scale={scale}
        ticker={ticker}
        onCancel={onCancel}
      />
    </Formik>
  );
};

AssetEditor.propTypes = {
  isEdit: PropTypes.bool,
  address: PropTypes.string,
  contractType: PropTypes.string,
  tokenID: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
