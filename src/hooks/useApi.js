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
  //   type: 'transfer' || 'fa_transfer' || 'fa2_transfer' || 'income_transfer' || 'delegation' || 'storage_update',
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
  const getOperations = (contractID, params = {}) => {
    const { limit = 10, offset = 0 } = params;
    return API.get(
      `/${network}/contract/${contractID}/operations${formatParams({
        limit,
        offset,
      })}`,
    );
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
  const addAsset = (contractID, payload) => {
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
  const getOriginatedContract = (txID) => {
    return API.get(`/${network}/origination/${txID}`);
  };
  const getVestingContractCode = () => {
    return API.get('/static/vesting.json');
  };
  // {
  //   vesting_address: 'KT1' || 'tz1' || 'tz2' || 'tz3',
  //   delegate_admin: 'KT1' || 'tz1' || 'tz2' || 'tz3',
  //   timestamp: 1616678669,
  //   seconds_per_tick: 10,
  //   tokens_per_tick: 1,
  // }
  const initVesting = (payload) => {
    return API.post(`/${network}/contract/vesting/storage/init`, payload);
  };
  // {
  //   contract_id: 'KT1...',
  //   // type: type: 'transfer' || 'fa_transfer' || 'fa2_transfer' || 'income_transfer' || 'delegation' || 'storage_update',
  //   amount: 0,
  //   to: 'tz1...',
  //   // from: 'tz1...',
  //   asset_id: 'KT1...', // for asset transfers only
  //   transfer_list: [
  //     {
  //       // from: 'tz1...',
  //       txs: [
  //         {
  //           to: 'tz1...', // ?
  //           token_id: 0,
  //           amount: 0,
  //         },
  //       ],
  //     },
  //   ],
  //   vesting_id: 'string',
  //   custom_payload: 'string',
  // }
  const sendVestingOperation = (payload) => {
    return API.post(`/${network}/contract/vesting/operation`, payload);
  };
  const getVestingInfo = (contractID) => {
    return API.get(`/${network}}/contract/vesting/${contractID}/info`);
  };
  const getVestings = (contractID) => {
    return API.get(`/${network}/contract/${contractID}/vestings`);
  };
  // {
  //   address: 'KT1' || 'tz1' || 'tz2' || 'tz3',
  //   name: 'Name',
  // }
  const addVesting = (contractID, payload) => {
    return API.post(`/${network}/contract/${contractID}/vesting`, payload);
  };
  // {
  //   address: 'KT1' || 'tz1' || 'tz2' || 'tz3',
  //   name: 'Name',
  //   balance: 0, // ?
  // }
  const editVesting = (contractID) => {
    return API.post(`/${network}/contract/${contractID}/vesting/edit`);
  };
  // {
  //   address: 'KT1' || 'tz1' || 'tz2' || 'tz3',
  //   name: 'Name',
  //   balance: 0, // ?
  // }
  const deleteVesting = (contractID) => {
    return API.post(`/${network}/contract/${contractID}/vesting/delete`);
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
    addAsset,
    editAsset,
    deleteAsset,
    getOriginatedContract,
    getVestingContractCode,
    initVesting,
    sendVestingOperation,
    getVestingInfo,
    getVestings,
    addVesting,
    editVesting,
    deleteVesting,
  };
};

export default useAPI;
