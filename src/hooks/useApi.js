import axios from 'axios';
import queryString from 'querystring';
// eslint-disable-next-line import/no-cycle
import {
  useUserStateContext,
  useUserDispatchContext,
} from '../store/userContext';

const network = process.env.REACT_APP_TEZOS_NETWORK;
const formatParams = (params) =>
  params && Object.keys(params).length
    ? `?${queryString.stringify(params)}`
    : '';
let currentTokens = null;

const useAPI = () => {
  const { tokens } = useUserStateContext();
  const { refreshTokens } = useUserDispatchContext();

  const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 30000,
    withCredentials: true,
    // responseType: 'json',
  });

  // {pub_key: 'sdsdsd'};
  const loginRequest = (payload) => {
    return API.post(`/${network}/auth/request`, payload);
  };
  // {
  //   pub_key: 'Beacon account public key',
  //   payload: 'string from sendOperation()',
  //   signature: 'signature from Beacon',
  // };
  const login = (payload) => {
    return API.post(`/${network}/auth`, payload);
  };

  // {
  //   refresh_token: "refresh_token"
  // }
  const refreshSession = (payload) => {
    return API.post(`/${network}/auth/refresh`, payload);
  };
  const restoreSession = () => {
    return API.get(`/${network}/auth/restore`);
  };
  const logout = () => {
    return API.get(`/${network}/logout`);
  };
  const getContractCode = () => {
    return API.get('/static/contract.json');
  };
  // {
  //   threshold: 1,
  //   entities: [
  //     'tz1NkT6YCFS3mDo6kfaMFKFrRiA7w2o5dkWp',
  //     'tz1dBT7PKeSDbPK1No7KNhTvrr3XoLe8vKLH',
  //     'tz1To9r8GZZr5n7JeXEKxVNk7UkQfVrV4d3i',
  //   ],
  // };
  const initStorage = (payload) => {
    return API.post(`/${network}/contract/storage/init`, payload);
  };
  // {
  //   threshold: 1,
  //   entities: [
  //     'tz1NkT6YCFS3mDo6kfaMFKFrRiA7w2o5dkWp',
  //     'tz1dBT7PKeSDbPK1No7KNhTvrr3XoLe8vKLH',
  //     'tz1To9r8GZZr5n7JeXEKxVNk7UkQfVrV4d3i',
  //   ],
  // };
  const updateStorage = (contractID, payload) => {
    return API.post(
      `/${network}/contract/${contractID}/storage/update`,
      payload,
    );
  };
  // {
  //   contract_id: 'contract address',
  //   type: 'transfer' || 'fa_transfer' || 'fa2_transfer' || 'delegation',
  //   amount: 1 // for transfers only: mutez
  //   to: 'tezos address',
  //   asset_id: 'asset contract address', // for asset transfers only
  //   transfer_list: [
  //   {
  //     // from
  //     txs: [
  //       {
  //         amount: 1 // amount * 10 ** scale
  //         to: 'tezos address',
  //         token_id: 123,
  //       },
  //     ],
  //   },
  // ], // for asset transfers only
  // };
  const sendOperation = (payload) => {
    return API.post(`/${network}/contract/operation`, payload);
  };
  const getOperationPayload = (operationID, params = {}) => {
    const { type = 'approve' } = params;
    return API.get(
      `/${network}/contract/operation/${operationID}/payload${formatParams({
        type,
        ...params,
      })}`,
    );
  };
  // {
  //   contract_id: 'contract address',
  //   pub_key: 'Beacon account public key',
  //   signature: 'signature from Beacon',
  //   type: 'reject' || 'approve',
  // };
  const sendSignature = (operationID, payload) => {
    return API.post(
      `/${network}/contract/operation/${operationID}/signature`,
      payload,
    );
  };
  const buildOperation = (operationID, params = {}) => {
    const { type = 'approve' } = params;
    return API.get(
      `/${network}/contract/operation/${operationID}/build${formatParams({
        type,
        ...params,
      })}`,
    );
  };
  const getOperations = (contractID) => {
    return API.get(`/${network}/contract/${contractID}/operations`);
  };
  const getContractInfo = (contractID) => {
    return API.get(`/${network}/contract/${contractID}/info`);
  };
  const isAddressRevealed = (address) => {
    return API.get(`/${network}/${address}/revealed`);
  };
  const getAssets = (contractID) => {
    return API.get(`/${network}/contract/${contractID}/assets`);
  };
  const getAssetsRates = (contractID) => {
    return API.get(`/${network}/contract/${contractID}/assets_rates`);
  };
  // {
  //   name: 'asdas';
  //   contract_type: 'FA1.2' || 'FA2';
  //   address: 'contract address';
  //   scale: 0;
  //   ticker: 'asd';
  // }
  const createAsset = (contractID, payload) => {
    return API.post(`/${network}/contract/${contractID}/asset`, payload);
  };
  // {
  //   name: 'asdas';
  //   contract_type: 'FA1.2' || 'FA2';
  //   address: 'contract address';
  //   scale: 0;
  //   ticker: 'asd';
  // }
  const editAsset = (contractID, payload) => {
    return API.post(`/${network}/contract/${contractID}/asset/edit`, payload);
  };
  // {
  //   address: 'contract address';
  // }
  const deleteAsset = (contractID, payload) => {
    return API.post(`/${network}/contract/${contractID}/asset/delete`, payload);
  };

  currentTokens = { ...tokens };

  API.interceptors.request.use(
    (config) => {
      if (currentTokens && currentTokens.access_token) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${currentTokens.access_token}`;
      }
      return config;
    },
    (e) => Promise.reject(e),
  );

  let refreshPromise;
  let isRefreshing = false;

  const getRefreshToken = async (refreshToken) => {
    if (isRefreshing) {
      return refreshPromise;
    }
    isRefreshing = true;
    // eslint-disable-next-line no-async-promise-executor
    refreshPromise = new Promise(async (resolve) => {
      try {
        resolve(await refreshTokens(refreshToken));
      } finally {
        isRefreshing = false;
      }
    });
    return refreshPromise;
  };

  API.interceptors.response.use(
    (config) => {
      return config;
    },
    async (e) => {
      const originalRequest = e.config;

      if (
        e.response.data.error === 'ERR_BAD_JWT' &&
        // eslint-disable-next-line no-underscore-dangle
        !originalRequest._retry
      ) {
        // eslint-disable-next-line no-underscore-dangle
        originalRequest._retry = true;
        const newTokens = await getRefreshToken(currentTokens.refresh_token);
        currentTokens = { ...newTokens };
        return API(originalRequest);
      }
      return Promise.reject(e);
    },
  );

  return {
    loginRequest,
    login,
    refreshSession,
    restoreSession,
    logout,
    getContractInfo,
    getContractCode,
    initStorage,
    updateStorage,
    sendOperation,
    getOperationPayload,
    sendSignature,
    buildOperation,
    getOperations,
    isAddressRevealed,
    getAssets,
    getAssetsRates,
    createAsset,
    editAsset,
    deleteAsset,
  };
};

export default useAPI;
