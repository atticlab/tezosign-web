import React, { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import useRequest from '../hooks/useRequest';
import useAPI from '../hooks/useApi';
import { useContractStateContext } from './contractContext';

const AssetsStateContext = createContext(undefined);
AssetsStateContext.displayName = 'AssetsStateContext';
const AssetsDispatchContext = createContext(undefined);
AssetsDispatchContext.displayName = 'AssetsDispatchContext';

const AssetsProvider = ({ children }) => {
  const { getAssets } = useAPI();
  const { contractAddress } = useContractStateContext();
  const {
    request: getAssetsReq,
    resp: assets,
    setResp: setAssets,
    isLoading: isAssetsLoading,
  } = useRequest(getAssets, contractAddress);

  const stateValue = useMemo(
    () => ({
      assets,
      isAssetsLoading,
    }),
    [assets, isAssetsLoading],
  );

  const dispatchValue = useMemo(
    () => ({
      getAssetsReq,
      setAssets,
    }),
    [getAssetsReq, setAssets],
  );

  return (
    <AssetsStateContext.Provider value={stateValue}>
      <AssetsDispatchContext.Provider value={dispatchValue}>
        {children}
      </AssetsDispatchContext.Provider>
    </AssetsStateContext.Provider>
  );
};

AssetsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useAssetsStateContext = () => {
  const context = useContext(AssetsStateContext);
  if (!context) {
    throw new Error('useAssetsStateContext must be in AssetsProvider');
  }
  return context;
};

const useAssetsDispatchContext = () => {
  const context = useContext(AssetsDispatchContext);
  if (!context) {
    throw new Error('useAssetsDispatchContext must be in AssetsProvider');
  }
  return context;
};

export { AssetsProvider, useAssetsStateContext, useAssetsDispatchContext };
