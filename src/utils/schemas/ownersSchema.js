import * as Yup from 'yup';
import { bs58Validation, isHex } from '../helpers';

// eslint-disable-next-line func-names
Yup.addMethod(Yup.array, 'unique', function (message, mapper = (a) => a) {
  return this.test('unique', message, (list) => {
    return list.length === new Set(list.map(mapper)).size;
  });
});
// eslint-disable-next-line func-names
Yup.addMethod(Yup.string, 'specificLength', function (message) {
  return this.test('specificLength', message, (val) => {
    return val?.length === 54 || val?.length === 55 || val?.length === 64;
  });
});
// eslint-disable-next-line func-names
Yup.addMethod(Yup.string, 'bs58OrHexCheck', function (message) {
  return this.test('bs58OrHexCheck', message, (val) => {
    if (val?.length === 64) return isHex(val);
    return bs58Validation(val);
  });
});

const cacheTest = (asyncValidate) => {
  let valid = false;
  let valueCached = '';

  return async (value) => {
    if (value !== valueCached) {
      const response = await asyncValidate(value);
      valueCached = value;
      valid = response;
      return response;
    }
    return valid;
  };
};

const ownersSchema = (testAddress) =>
  Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number(),
        value: Yup.string().when('isPubKey', {
          is: false,
          then: Yup.string()
            .required('Required')
            .matches(
              'tz1|tz2|tz3',
              'Tezos address must start with tz1, tz2 or tz3',
            )
            .matches(/^\S+$/, 'No spaces are allowed')
            .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
            .length(36, 'Tezos address must be 36 characters long')
            .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val))
            .test('sad', 'Address is unrevealed', testAddress.current),
          otherwise: Yup.string()
            .required('Required')
            .matches(/^\S+$/, 'No spaces are allowed')
            .specificLength(
              'The string must be either 54-55 (base58) or 64(hex) characters long',
            )
            .bs58OrHexCheck('The string must be base58 or hex format'),
        }),
        isPubKey: Yup.boolean(),
      }),
    )
    .ensure()
    .required('Must have addresses')
    .min(1, 'Minimum of 1 addresses')
    .max(20, 'Maximum of 20 addresses')
    .unique('Addresses must be unique', (entity) => entity.value);

export { ownersSchema, cacheTest };
