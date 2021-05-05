import { toast } from 'react-toastify';

const errorNotifications = {
  ERR_SERVICE: 'Service error. Please, try later or contact support.',
  ERR_BAD_REQUEST: 'Bad request.',
  'ERR_BAD_REQUEST:token_metadata':
    'Cannot get meta info for the asset contact address.',
  ERR_BAD_PARAM: 'Invalid param.',
  'ERR_BAD_PARAM:address': 'Invalid address. Try another one.',
  'ERR_BAD_PARAM:not FA asset':
    'Contract address is not an FA asset. Try another one.',
  'ERR_BAD_PARAM:wrong contract type': 'Wrong contract type',
  'ERR_BAD_REQUEST:wrong pubKey format': 'Wrong public key format.',
  'ERR_ALREADY_EXISTS:asset': 'Asset with the same address already exists.',
  'ERR_NOT_ALLOWED:global asset': 'Global assets cannot be edited.',
  ERR_NOT_FOUND: 'Not found.',
  'ERR_NOT_FOUND:contract':
    "Contract is not found. It probably doesn't exist in the current network.",
  'ERR_NOT_FOUND:big_map value':
    'Invalid token ID for the asset contract address.',
  ERR_NOT_ALLOWED: 'Not allowed.',
  'ERR_NOT_ALLOWED:not enough balance': 'Insufficient funds on the wallet.',
  ERR_BAD_AUTH: 'Login failed.',
  'No matching peer found.': 'No matching peer found. Try reconnect, please.',
};
const availableCodes = Object.keys(errorNotifications);

const handleError = (error) => {
  // eslint-disable-next-line no-console
  console.error(error);

  const {
    name,
    message,
    response: { data: { error: code, value: desc } = {} } = {},
  } = error;

  if (name === 'UnknownBeaconError' || code === 'ERR_BAD_JWT') {
    return null;
  }

  const msgKey = desc ? `${code}:${desc}` : code || message;
  const errorText =
    errorNotifications[
      availableCodes.includes(msgKey) ? msgKey : 'ERR_SERVICE'
    ];

  return toast.error(errorText);
};

// eslint-disable-next-line import/prefer-default-export
export { handleError };
