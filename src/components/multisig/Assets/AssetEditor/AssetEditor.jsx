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
  address,
  contractType,
  tokenID,
  name,
  scale,
  onSubmit,
  onCancel,
  ticker,
}) => {
  const { addAsset, editAsset } = useAPI();
  const { setAssets } = useAssetsDispatchContext();
  const { contractAddress } = useContractStateContext();

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
      <AssetEditorFields
        isEdit={isEdit}
        address={address}
        contractType={contractType}
        onCancel={onCancel}
      />
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
