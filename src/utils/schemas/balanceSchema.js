import * as Yup from 'yup';

const balanceSchema = (maxAmount, minAmount) =>
  Yup.number()
    .required('Required')
    .max(maxAmount, `Maximum amount is ${maxAmount} XTZ`)
    .min(minAmount, `Minimum amount is ${minAmount} XTZ`);

export default balanceSchema;
