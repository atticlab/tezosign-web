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
  'No matching peer found.': 'No matching peer found. Try reconnect, please.',
};
const availableCodes = Object.keys(errorNotifications);

const handleError = (error) => {
  console.error(error);
  let errorText;

  if (
    error.name === 'UnknownBeaconError' ||
    error.response?.data.error === 'ERR_BAD_JWT'
  ) {
    return null;
  }

  if (!error.response && error.message) {
    errorText =
      errorNotifications[
        availableCodes.includes(error.message) ? error.message : 'ERR_SERVICE'
      ];

    return toast.error(errorText);
  }

  const { error: code, value: desc } = error.response.data;

  const msgKey = desc ? `${code}:${desc}` : code;
  errorText =
    errorNotifications[
      availableCodes.includes(msgKey) ? msgKey : 'ERR_SERVICE'
    ];
  console.log(errorText);

  return toast.error(errorText);
};

// eslint-disable-next-line import/prefer-default-export
export { handleError };
