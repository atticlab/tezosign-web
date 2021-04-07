import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Form as BForm, InputGroup } from 'react-bootstrap';
import { FormLabel, FormSubmit } from '../../../styled/Forms';
import { BtnMax } from '../../../styled/Btns';
import { sendTx } from '../../../../plugins/beacon';
import useAPI from '../../../../hooks/useApi';
import {
  convertMutezToXTZ,
  convertXTZToMutez,
  limitInputDecimals,
} from '../../../../utils/helpers';
import { handleError } from '../../../../utils/errorsHandler';

const schema = (maxAmount = 0) => {
  return Yup.object({
    amount: Yup.number()
      .required('Required')
      .max(maxAmount, `Maximum amount is ${maxAmount} XTZ`)
      .min(0.000001, `Minimum amount is 0.000001 XTZ`),
  });
};

const VestingVestForm = ({
  vestingAddress,
  vestingBalance,
  onSubmit,
  onCancel,
}) => {
  const { sendVestingOperation } = useAPI();
  const balance = useMemo(() => {
    return convertMutezToXTZ(vestingBalance);
  }, [vestingBalance]);

  const sendVestingOperationRequest = async (
    type,
    { amount },
    setSubmitting,
  ) => {
    try {
      setSubmitting(true);
      const resp = await sendVestingOperation({
        type,
        amount: Number(convertXTZToMutez(amount)),
      });

      const params = {
        ...resp.data,
        value: JSON.parse(resp.data.value),
      };

      await sendTx(0, vestingAddress, params);
      onSubmit();
    } catch (e) {
      handleError(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        amount: '',
      }}
      validationSchema={Yup.lazy(() => schema(balance))}
      onSubmit={(values, { setSubmitting }) => {
        sendVestingOperationRequest('vesting_vest', values, setSubmitting);
      }}
    >
      {({ errors, touched, isSubmitting, setFieldValue, setFieldTouched }) => (
        <Form>
          <BForm.Group controlId="amount">
            <FormLabel>Enter amount</FormLabel>
            <InputGroup>
              <Field
                as={BForm.Control}
                type="number"
                name="amount"
                aria-label="amount"
                isInvalid={!!errors.amount && touched.amount}
                isValid={!errors.amount && touched.amount}
                step="0.000001"
                min="0"
                onKeyPress={(event) => limitInputDecimals(event, 6)}
              />

              <InputGroup.Append>
                <InputGroup.Text style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <BtnMax
                      onClick={() => {
                        setFieldValue('amount', balance);
                        setFieldTouched('amount', true, false);
                      }}
                    >
                      MAX
                    </BtnMax>
                    <span style={{ fontSize: '12px', marginBottom: '2px' }}>
                      {balance}
                    </span>
                  </span>
                </InputGroup.Text>
              </InputGroup.Append>

              <ErrorMessage
                component={BForm.Control.Feedback}
                name="amount"
                type="invalid"
              />
            </InputGroup>
          </BForm.Group>

          <FormSubmit>
            <Button
              variant="danger"
              style={{ marginRight: '10px' }}
              onClick={onCancel}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              Confirm
            </Button>
          </FormSubmit>
        </Form>
      )}
    </Formik>
  );
};

VestingVestForm.propTypes = {
  vestingAddress: PropTypes.string.isRequired,
  vestingBalance: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default VestingVestForm;
