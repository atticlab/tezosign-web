import * as Yup from 'yup';

const secondsPerTickSchema = Yup.string()
  .required('Required')
  .test('secondsCheck', 'Seconds cannot be 0', (val) => {
    return val !== '0:00';
  });

// eslint-disable-next-line import/prefer-default-export
export { secondsPerTickSchema };
