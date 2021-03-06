import * as Yup from 'yup';

const signaturesSchema = Yup.number()
  .moreThan(0, 'The number of signatures must be greater than 0')
  .when('entities', (entities, schema) => {
    return (
      entities &&
      entities.length &&
      schema.max(
        entities.length,
        `Thresholds cannot be greater than ${entities.length}`,
      )
    );
  })
  .required('Required');

export default signaturesSchema;
