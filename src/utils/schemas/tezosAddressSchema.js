import * as Yup from 'yup';
import { bs58Validation } from '../helpers';

const tezosAddressSchema = Yup.string()
  .required('Required')
  .matches(
    'tz1|tz2|tz3|KT1',
    'Tezos address must start with tz1, tz2, tz3 or KT1',
  )
  .matches(/^\S+$/, 'No spaces are allowed')
  .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
  .length(36, 'Tezos address must be 36 characters long')
  .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val));

const tezosAddressTzSchema = Yup.string()
  .required('Required')
  .matches('tz1|tz2|tz3', 'Tezos address must start with tz1, tz2 or tz3')
  .matches(/^\S+$/, 'No spaces are allowed')
  .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
  .length(36, 'Tezos address must be 36 characters long')
  .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val));

export { tezosAddressSchema, tezosAddressTzSchema };
