import * as Yup from 'yup';
import { tezosAddressTzSchema } from './tezosAddressSchema';
import pubKeySchema from './pubKeySchema';
// eslint-disable-next-line func-names
Yup.addMethod(Yup.array, 'unique', function (message, mapper = (a) => a) {
  return this.test('unique', message, (list) => {
    return list.length === new Set(list.map(mapper)).size;
  });
});

const ownersSchema = Yup.array()
  .of(
    Yup.object().shape({
      id: Yup.number(),
      value: Yup.string().when('isPubKey', {
        is: false,
        then: tezosAddressTzSchema,
        otherwise: pubKeySchema,
      }),
      isPubKey: Yup.boolean(),
    }),
  )
  .ensure()
  .required('Must have addresses')
  .min(1, 'Minimum of 1 addresses')
  .max(20, 'Maximum of 20 addresses')
  .unique('Addresses must be unique', (entity) => entity.value);

// eslint-disable-next-line import/prefer-default-export
export { ownersSchema };
