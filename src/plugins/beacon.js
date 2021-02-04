import {
  DAppClient,
  NetworkType,
  TezosOperationType,
} from '@airgap/beacon-sdk';
import { convertXTZToMutez } from '../utils/helpers';

const networkTypesMap = {
  delphinet: NetworkType.DELPHINET,
  mainnet: NetworkType.MAINNET,
};

const defNetwork = networkTypesMap[process.env.REACT_APP_TEZOS_NETWORK];

const client = new DAppClient({
  name: 'TzSign',
});

const initClient = () => {
  return client.init();
};

// The method can work with and without the Beacon extension.
// If the dApp is not paired with a wallet the pairing window appears (the SDK init() method).
// BUT! If a user works with the extension and doesn't set it up (pair with their wallet),
// this method tries to pair the extension with the wallet first and ends its execution there.
// Therefore the user has to call this method again to actually receive their permissions.
const requestPermissions = (network = defNetwork) => {
  return client.requestPermissions({
    network: {
      type: network,
    },
  });
};

// Remove the account from the local storage
// eslint-disable-next-line consistent-return
const clearActiveAccount = () => {
  return client.clearActiveAccount();
};

// Get the account from the local storage
const getActiveAccount = () => {
  return client.getActiveAccount();
};

const resetPeer = () => {
  return client.setActivePeer(undefined);
};

const sendOrigination = async (balance = '0', script) => {
  return client.requestOperation({
    operationDetails: [
      {
        kind: TezosOperationType.ORIGINATION,
        balance,
        // delegate,
        script,
      },
    ],
  });
};

const requestSignPayload = (payload) => {
  // edsig signature
  return client.requestSignPayload({
    payload,
    // sourceAddress
  });
};

// Amount is accepted in mutez. The min value is '1'.
const sendTx = (amount, destination, parameters) => {
  return client.requestOperation({
    operationDetails: [
      {
        kind: TezosOperationType.TRANSACTION,
        amount: convertXTZToMutez(amount).toString(),
        destination,
        // eslint-disable-next-line object-shorthand
        parameters: parameters,
      },
    ],
  });
};

const sendDelegation = (delegate = '') => {
  const payload = {
    kind: TezosOperationType.DELEGATION,
  };
  if (delegate) payload.delegate = delegate;

  return client.requestOperation({
    operationDetails: [payload],
  });
};

export {
  client,
  initClient,
  requestPermissions,
  clearActiveAccount,
  resetPeer,
  getActiveAccount,
  sendOrigination,
  requestSignPayload,
  sendTx,
  sendDelegation,
};
