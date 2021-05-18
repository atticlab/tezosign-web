import { useHistory, useLocation } from 'react-router-dom';
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-cycle
import useAPI from '../hooks/useApi';
import {
  getActiveAccount,
  initClient,
  requestPermissions,
  requestSignPayload,
  clearActiveAccount,
} from '../plugins/beacon';
import { handleError } from '../utils/errorsHandler';
import { convertHexToPrefixedBase58, isHex } from '../utils/helpers';

// Default values
const initialState = {
  permissions: undefined,
  isPermissionsLoading: false,
  isRestoreLoading: true,
  redirectToReferrer: false,
  tokens: null,
  tokensRef: null,
};
const initialDispatch = {
  setPermissions() {
    throw new Error('setPermissions() is not implemented');
  },
  setIsPermissionsLoading() {
    throw new Error('setIsPermissionsLoading() is not implemented');
  },
  setIsRestoreLoading() {
    throw new Error('setIsRestoreLoading() is not implemented');
  },
  setRedirectToReferrer() {
    throw new Error('setRedirectToReferrer() is not implemented');
  },
  setTokens() {
    throw new Error('setTokens() is not implemented');
  },
};

// State context
const UserStateContext = createContext(initialState);
UserStateContext.displayName = 'UserStateContext';
const useUserStateContext = () => {
  const context = useContext(UserStateContext);

  if (!context) {
    throw new Error(`useUserStateContext must be used within a UserProvider`);
  }
  return context;
};

// Dispatch context
const UserDispatchContext = createContext(initialDispatch);
UserDispatchContext.displayName = 'UserDispatchContext';
const useUserDispatchContext = () => {
  const context = useContext(UserDispatchContext);

  if (!context) {
    throw new Error(
      `useUserDispatchContext must be used within a UserProvider`,
    );
  }
  return context;
};

const UserProvider = ({ children }) => {
  // TODO: useReducer()
  const history = useHistory();
  const { state: location } = useLocation();
  const [permissions, setPermissions] = useState(undefined);
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(undefined);
  const [isRestoreLoading, setIsRestoreLoading] = useState(true);
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
  const [tokens, setTokens] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [authRequestToken, setAuthRequestToken] = useState('');
  const {
    loginRequest,
    login,
    refreshSession,
    restoreSession,
    logout,
    getAddressBalance,
  } = useAPI();
  const isLoggedIn = useMemo(() => {
    return Boolean(
      permissions &&
        Object.keys(permissions).length &&
        tokens &&
        Object.keys(tokens).length,
    );
  }, [permissions, tokens]);

  const getAcc = async () => {
    try {
      const res = await getActiveAccount();
      setPermissions(res);
      return res;
    } catch (e) {
      handleError(e);
      return Promise.reject(e);
    }
  };

  const disconnect = async (withRedirect) => {
    try {
      await clearActiveAccount();
      await getAcc();
      await logout();
      await setTokens(() => null);

      if (withRedirect) {
        history.push('/');
      }
    } catch (e) {
      handleError(e);
    }
  };

  const restore = async () => {
    try {
      setIsRestoreLoading(true);

      const acc = await getAcc();
      if (acc && Object.keys(acc).length) {
        await initClient();
        const resTokens = await restoreSession();
        setTokens(() => resTokens.data.tokens);
      } else {
        await disconnect();
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      await disconnect();
    } finally {
      setIsRestoreLoading(false);
    }
  };

  const connect = async (onAuthRequest, onSuccess) => {
    try {
      // setIsPermissionsLoading(true);
      const perms = await requestPermissions();
      setPermissions(perms);
      const { publicKey } = perms;

      const payload = await loginRequest({
        pub_key: isHex(publicKey)
          ? convertHexToPrefixedBase58(publicKey)
          : publicKey,
      });
      const { token } = payload.data;
      setAuthRequestToken(token);
      onAuthRequest();

      const signature = await requestSignPayload(token);

      const resTokens = await login({
        payload: token,
        pub_key: isHex(publicKey)
          ? convertHexToPrefixedBase58(publicKey)
          : publicKey,
        signature: signature.signature,
      });
      setTokens(() => resTokens.data);
      onSuccess();

      setRedirectToReferrer(true);
    } catch (e) {
      handleError(e);
      await disconnect();
    } finally {
      setIsPermissionsLoading(false);
    }
  };

  const refreshTokens = async (token) => {
    try {
      const resTokens = await refreshSession({
        refresh_token: token,
      });
      setTokens(() => resTokens.data);
      return resTokens.data;
    } catch (e) {
      handleError(e);
      await disconnect();
      return Promise.reject(e);
    }
  };

  const getBalance = async (address) => {
    try {
      setIsBalanceLoading(true);
      const resp = await getAddressBalance(address);
      setBalance(resp.data);
    } catch (e) {
      handleError(e);
    } finally {
      setIsBalanceLoading(false);
    }
  };

  useEffect(() => {
    restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const to = (location && location.from) || '/select-multisig';
    if (redirectToReferrer) {
      history.replace(to);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectToReferrer]);

  const stateValue = useMemo(() => {
    const { publicKey, address } = isLoggedIn ? permissions : {};

    return {
      permissions,
      isPermissionsLoading,
      isLoggedIn,
      isRestoreLoading,
      address,
      publicKey: isHex(publicKey)
        ? convertHexToPrefixedBase58(publicKey)
        : publicKey,
      tokens,
      balance,
      isBalanceLoading,
      authRequestToken,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    permissions,
    isPermissionsLoading,
    isRestoreLoading,
    isLoggedIn,
    tokens,
    balance,
    isBalanceLoading,
    authRequestToken,
  ]);

  const dispatchValue = useMemo(
    () => ({
      setPermissions,
      setIsPermissionsLoading,
      getAcc,
      connect,
      disconnect,
      refreshTokens,
      getBalance,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <UserStateContext.Provider value={stateValue}>
      <UserDispatchContext.Provider value={dispatchValue}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const UserStateConsumer = ({ children }) => {
  return <UserStateContext.Consumer>{children}</UserStateContext.Consumer>;
};

UserStateConsumer.propTypes = {
  children: PropTypes.func.isRequired,
};

export {
  UserProvider,
  useUserStateContext,
  useUserDispatchContext,
  UserStateConsumer,
};
