import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import useAPI from '../hooks/useApi';
import { useContractStateContext } from './contractContext';
import { handleError } from '../utils/errorsHandler';

const OperationsStateContext = createContext(undefined);
OperationsStateContext.displayName = 'OperationsStateContext';
const OperationsDispatchContext = createContext(undefined);
OperationsDispatchContext.displayName = 'OperationsDispatchContext';

const OperationsProvider = ({ children }) => {
  const { getOperations } = useAPI();
  const { contractAddress } = useContractStateContext();
  const [ops, setOps] = useState([]);
  const [isOpsLoading, setIsOpsLoading] = useState(false);

  const getOps = useCallback(
    async (limit, offset) => {
      try {
        setIsOpsLoading(true);
        const resp = await getOperations(contractAddress, { limit, offset });
        setOps((prev) => [...prev, ...resp.data]);
        return resp.data;
      } catch (e) {
        return handleError(e);
      } finally {
        setIsOpsLoading(false);
      }
    },
    [contractAddress, getOperations],
  );

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
