import * as Yup from 'yup';

const signaturesSchema = Yup.number()
  .moreThan(0, 'The number of signatures must be greater than 0')
  .when('entities', (entities, schema) => {
    return entities.length
      ? schema.max(
          entities.length,
          `Thresholds cannot be greater than ${entities.length}`,
        )
      : schema.max(0, 'Signatures cannot be greater than 0');
  })
  .required('Required');

export default signaturesSchema;
