import React, { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import useAPI from '../hooks/useApi';
import useRequest from '../hooks/useRequest';
import { useUserStateContext } from './userContext';

const initialState = {
  contractInfo: undefined,
  contractAddress: '',
  isContractInfoLoading: true,
};
const initialDispatch = {
  setContractInfo() {
    throw new Error('setContractInfo() is not implemented');
  },
  setContractAddress() {
    throw new Error('setContractAddress() is not implemented');
  },
};

const ContractStateContext = createContext(initialState);
ContractStateContext.displayName = 'ContractStateContext';
const useContractStateContext = () => {
  const context = useContext(ContractStateContext);

  if (!context) {
    throw new Error(
      `useContractStateContext must be used within a ContractProvider`,
    );
  }
  return context;
};

// Dispatch context
const ContractDispatchContext = createContext(initialDispatch);
ContractDispatchContext.displayName = 'ContractDispatchContext';
const useContractDispatchContext = () => {
  const context = useContext(ContractDispatchContext);

  if (!context) {
    throw new Error(
      `useContractDispatchContext must be used within a ContractProvider`,
    );
  }
  return context;
};

const ContractProvider = ({ children }) => {
  const { address: userAddress } = useUserStateContext();
  const [contractAddress, setContractAddress] = useState('');
  const { getContractInfo } = useAPI();
  const {
    request: getContract,
    resp: contractInfo,
    setResp: setContractInfo,
    isLoading: isContractInfoLoading,
    setIsLoading: setIsContractInfoLoading,
  } = useRequest(getContractInfo, contractAddress, true);
  const isUserOwner = useMemo(() => {
    return (
      contractInfo &&
      contractInfo.owners.some((signature) => signature.address === userAddress)
    );
  }, [userAddress, contractInfo]);

  const stateValue = useMemo(() => {
    return {
      contractAddress,
      contractInfo,
      isContractInfoLoading,
      isUserOwner,
    };
  }, [contractAddress, contractInfo, isContractInfoLoading, isUserOwner]);

  const dispatchValue = useMemo(() => {
    return {
      setContractAddress,
      getContract,
      setContractInfo,
      setIsContractInfoLoading,
    };
  }, [
    setContractAddress,
    getContract,
    setContractInfo,
    setIsContractInfoLoading,
  ]);

  return (
    <ContractStateContext.Provider value={stateValue}>
      <ContractDispatchContext.Provider value={dispatchValue}>
        {children}
      </ContractDispatchContext.Provider>
    </ContractStateContext.Provider>
  );
};

ContractProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export {
  ContractProvider,
  useContractStateContext,
  useContractDispatchContext,
};
