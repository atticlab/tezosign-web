import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Form as BForm,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { FormLabel, FormSubmit } from '../../../styled/Forms';
import { sendTx } from '../../../../plugins/beacon';
import useAPI from '../../../../hooks/useApi';
import {
  convertMutezToXTZ,
  limitInputDecimals,
} from '../../../../utils/helpers';
import { handleError } from '../../../../utils/errorsHandler';

const schema = Yup.object({
  batches: Yup.number()
    .required('Required')
    .integer('Ticks must be an integer')
    .min(1, `Minimum number of batches is 1`),
});

const VestingVestForm = ({
  vestingAddress,
  tokensPerTick,
  onSubmit,
  onCancel,
}) => {
  const { sendVestingOperation } = useAPI();
  const tokensPerTickInXTZ = useMemo(() => {
    return convertMutezToXTZ(tokensPerTick);
  }, [tokensPerTick]);

  const sendVestingOperationRequest = async (type, { batches }, resetForm) => {
    try {
      const resp = await sendVestingOperation({
        type,
        ticks: batches,
      });

      const params = {
        ...resp.data,
        value: JSON.parse(resp.data.value),
      };

      await sendTx(0, vestingAddress, params);

      resetForm();
      onSubmit();
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <Formik
      initialValues={{
        batches: '',
        amount: '',
      }}
      validationSchema={schema}
      onSubmit={async (values, { resetForm }) => {
        await sendVestingOperationRequest('vesting_vest', values, resetForm);
      }}
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        setFieldValue,
        setFieldTouched,
        handleBlur,
      }) => (
        <Form>
          <BForm.Group controlId="batches">
            <OverlayTrigger
              overlay={
                <Tooltip>
                  Single unlock iteration of a certain amount of XTZ. The period
                  is defined by &quot;Seconds per tick&quot;, the amount of XTZ
                  is defined by &quot;XTZ per tick&quot;.
                </Tooltip>
              }
            >
              <FormLabel>Ticks</FormLabel>
            </OverlayTrigger>
            <Field
              as={BForm.Control}
              type="number"
              name="batches"
              aria-label="batches"
              min="0"
              isInvalid={!!errors.batches && touched.batches}
              isValid={!errors.batches && touched.batches}
              onBlur={(e) => {
                handleBlur(e);
                setFieldValue(
                  'amount',
                  convertMutezToXTZ(values.batches * tokensPerTick),
                );
                setFieldTouched('amount', true, false);
              }}
            />

            <ErrorMessage
              component={BForm.Control.Feedback}
              name="batches"
              type="invalid"
            />
          </BForm.Group>

          <BForm.Group controlId="amount">
            <OverlayTrigger
              overlay={
                <Tooltip>
                  Withdrawal amount. It must be evenly divided by &quot;XTZ per
                  tick&quot;, so that ticks are always an integer. The minimum
                  equals &quot;XTZ per tick&quot;. Usually, the maximum equals
                  the withdrawal limit. In case the withdrawal limit is greater
                  than the balance on the vesting contract, the allowed maximum
                  is the closest to the balance number which is evenly divided
                  by &quot;XTZ per tick&quot;.
                </Tooltip>
              }
            >
              <FormLabel>Amount</FormLabel>
            </OverlayTrigger>

            <Field
              as={BForm.Control}
              type="number"
              name="amount"
              aria-label="amount"
              step={tokensPerTickInXTZ}
              min={tokensPerTickInXTZ}
              autoComplete="off"
              isInvalid={!!errors.amount && touched.amount}
              isValid={!errors.amount && touched.amount}
              onKeyPress={(event) => limitInputDecimals(event, 8)}
              disabled
            />

            <ErrorMessage
              component={BForm.Control.Feedback}
              name="amount"
              type="invalid"
            />
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
  tokensPerTick: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default VestingVestForm;
