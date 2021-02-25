import { toast } from 'react-toastify';

const errorNotifications = {
  ERR_SERVICE: 'Service error. Please, try later or contact support.',
  ERR_BAD_REQUEST: 'Bad request.',
  ERR_BAD_PARAM: 'Invalid param.',
  'ERR_BAD_PARAM:address': 'Invalid address. Try another one.',
  'ERR_BAD_REQUEST:wrong pubKey format': 'Wrong public key format.',
  ERR_NOT_FOUND: 'Not found.',
  ERR_NOT_ALLOWED: 'Not allowed.',
  ERR_BAD_AUTH: 'Login failed.',
};
const availableCodes = Object.keys(errorNotifications);

const handleError = (error) => {
  console.error(error);

  if (
    error.name === 'UnknownBeaconError' ||
    error.response.data.error === 'ERR_BAD_JWT'
  )
    return;

  const { error: code, value: desc } = error.response.data;

  const msgKey = desc ? `${code}:${desc}` : code;
  const errorText =
    errorNotifications[
      availableCodes.includes(msgKey) ? msgKey : 'ERR_SERVICE'
    ];

  toast.error(errorText);
};

// eslint-disable-next-line import/prefer-default-export
export { handleError };
