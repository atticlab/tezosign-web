import * as Yup from 'yup';

const payloadTypeSchema = Yup.string()
  .required('Required')
  .matches(
    'approve|reject',
    `Payload type can be either "approve" or "reject"`,
  );

export default payloadTypeSchema;
