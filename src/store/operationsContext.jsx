import React, { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import useRequest from '../hooks/useRequest';
import useAPI from '../hooks/useApi';
import { useContractStateContext } from './contractContext';

const OperationsStateContext = createContext(undefined);
OperationsStateContext.displayName = 'OperationsStateContext';
const OperationsDispatchContext = createContext(undefined);
OperationsDispatchContext.displayName = 'OperationsDispatchContext';

const OperationsProvider = ({ children }) => {
  const { getOperations } = useAPI();
  const { contractAddress } = useContractStateContext();
  const {
    request: getOps,
    resp: ops,
    setResp: setOps,
    isLoading: isOpsLoading,
  } = useRequest(getOperations, contractAddress);

  const stateValue = useMemo(
    () => ({
      ops,
      isOpsLoading,
    }),
    [ops, isOpsLoading],
  );

  const dispatchValue = useMemo(
    () => ({
      getOps,
      setOps,
    }),
    [getOps, setOps],
  );

  return (
    <OperationsStateContext.Provider value={stateValue}>
      <OperationsDispatchContext.Provider value={dispatchValue}>
        {children}
      </OperationsDispatchContext.Provider>
    </OperationsStateContext.Provider>
  );
};

OperationsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useOperationsStateContext = () => {
  const context = useContext(OperationsStateContext);
  if (!context) {
    throw new Error('useOperationsStateContext must be in OperationsProvider');
  }
  return context;
};

const useOperationsDispatchContext = () => {
  const context = useContext(OperationsDispatchContext);
  if (!context) {
    throw new Error(
      'useOperationsDispatchContext must be in OperationsProvider',
    );
  }
  return context;
};

export {
  OperationsProvider,
  useOperationsStateContext,
  useOperationsDispatchContext,
};
