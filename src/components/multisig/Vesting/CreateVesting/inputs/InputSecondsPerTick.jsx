import React from 'react';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import { Form as BForm, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FormLabel } from '../../../../styled/Forms';
import { toHHMMSS, getSecondsFromHHMMSS } from '../../../../../utils/helpers';

const convertInputToTime = (e) => {
  return toHHMMSS(Math.max(0, getSecondsFromHHMMSS(e.target.value)));
};

const InputSecondsPerTick = () => {
  const { errors, touched, handleBlur, setFieldValue } = useFormikContext();

  return (
    <BForm.Group>
      <OverlayTrigger
        overlay={
          <Tooltip>
            Time interval at which a portion of XTZ becomes unvested and
            available for withdrawal.
          </Tooltip>
        }
      >
        <FormLabel>Time per tick</FormLabel>
      </OverlayTrigger>
      <Field
        as={BForm.Control}
        type="text"
        name="secondsPerTick"
        aria-label="secondsPerTick"
        autoComplete="off"
        isInvalid={!!errors.secondsPerTick && touched.secondsPerTick}
        isValid={!errors.secondsPerTick && touched.secondsPerTick}
        onBlur={(e) => {
          handleBlur(e);
          setFieldValue('secondsPerTick', convertInputToTime(e));
        }}
      />

      <ErrorMessage
        component={BForm.Control.Feedback}
        name="secondsPerTick"
        type="invalid"
      />
    </BForm.Group>
  );
};

export default InputSecondsPerTick;
