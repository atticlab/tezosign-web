import * as Yup from 'yup';
import { bs58Validation, isHex } from '../helpers';

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

const pubKeySchema = Yup.string()
  .required('Required')
  .matches(/^\S+$/, 'No spaces are allowed')
  .specificLength(
    'The string must be either 54-55 (base58) or 64(hex) characters long',
  )
  .bs58OrHexCheck('The string must be base58 or hex format');

export default pubKeySchema;
