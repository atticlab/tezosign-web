import * as Yup from 'yup';
import { bs58Validation } from '../../../../utils/helpers';

const addressSchema = Yup.string()
  .required('Required')
  .matches('KT1', 'Tezos contract address must start with KT1')
  .matches(/^\S+$/, 'No spaces are allowed')
  .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
  .length(36, 'Tezos address must be 36 characters long')
  .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val));

const tokenIDSchema = Yup.number()
  .required('Required')
  .integer('Value must be an integer')
  .max(Number.MAX_SAFE_INTEGER, `Maximum value is ${Number.MAX_SAFE_INTEGER}`)
  .min(0, 'Minimum value is 0');

const schema = Yup.object({
  address: addressSchema,
  contractType: Yup.string()
    .required('Required')
    .matches('FA1.2|FA2', 'Invalid asset type. Asset types are FA1.2 or FA2'),
  tokenID: Yup.number().when('contractType', {
    is: (assetField) => {
      return assetField === 'FA2';
    },
    then: tokenIDSchema,
    otherwise: Yup.number(),
  }),
  name: Yup.string()
    .required('Required')
    .max(32, 'At most 32 characters')
    .matches(/^[\w ]*$/, 'Only latin characters and numbers are allowed')
    .matches(/^[\w]+( [\w]+)*$/, 'Unnecessary spaces'),
  scale: Yup.number()
    .required('Required')
    .integer('Decimals must be an integer')
    .min(0, 'Minimum scale is 0')
    .max(10, 'Maximum scale is 10'),
  ticker: Yup.string()
    .required('Required')
    .max(5, 'At most 5 characters')
    .matches(/^\S+$/, 'No spaces are allowed')
    .matches(/^[a-zA-Z0-9]*$/, 'Only latin characters and numbers are allowed'),
});

export { schema, addressSchema, tokenIDSchema };
