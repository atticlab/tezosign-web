import * as Yup from 'yup';

const signaturesSchema = Yup.number()
  .moreThan(0, 'The number of signatures must be greater than 0')
  .required('Required');

export default signaturesSchema;
