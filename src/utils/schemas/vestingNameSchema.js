import * as Yup from 'yup';

const vestingNameSchema = Yup.string()
  .required('Required')
  .max(32, 'At most 32 characters')
  .matches(/^[\w ]*$/, 'Only latin characters and numbers are allowed')
  .matches(/^[\w]+( [\w]+)*$/, 'Unnecessary spaces');

export default vestingNameSchema;
