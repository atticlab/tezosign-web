import React, { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import useAPI from '../hooks/useApi';
import useRequest from '../hooks/useRequest';
import { useContractStateContext } from './contractContext';

const VestingsStateContext = createContext(undefined);
VestingsStateContext.displayName = 'VestingsStateContext';
const VestingsDispatchContext = createContext(undefined);
VestingsDispatchContext.displayName = 'VestingsDispatchContext';

const VestingsProvider = ({ children }) => {
  const { getVestings } = useAPI();
  const { contractAddress } = useContractStateContext();
  const {
    request: getVestingsReq,
    resp: vestings,
    setResp: setVestings,
    isLoading: isVestingsLoading,
  } = useRequest(getVestings, contractAddress);

  const stateValue = useMemo(
    () => ({
      vestings,
      isVestingsLoading,
    }),
    [vestings, isVestingsLoading],
  );

  const dispatchValue = useMemo(
    () => ({
      getVestingsReq,
      setVestings,
    }),
    [getVestingsReq, setVestings],
  );

  return (
    <VestingsStateContext.Provider value={stateValue}>
      <VestingsDispatchContext.Provider value={dispatchValue}>
        {children}
      </VestingsDispatchContext.Provider>
    </VestingsStateContext.Provider>
  );
};

VestingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useVestingsStateContext = () => {
  const context = useContext(VestingsStateContext);
  if (!context) {
    throw new Error('useVestingsStateContext must be in VestingsProvider');
  }
  return context;
};

const useVestingsDispatchContext = () => {
  const context = useContext(VestingsDispatchContext);
  if (!context) {
    throw new Error('useVestingsDispatchContext must be in VestingsProvider');
  }
  return context;
};

export {
  VestingsProvider,
  useVestingsStateContext,
  useVestingsDispatchContext,
};
