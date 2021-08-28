import React from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import { Form as BForm } from 'react-bootstrap';
import FormLabelWithTooltip from '../../../../FormLabelWithTooltip';
import {
  convertMutezToXTZ,
  convertXTZToMutez,
  limitInputDecimals,
} from '../../../../../utils/helpers';

const calcMaxAllowedBalance = (balance, tokensPerTick) => {
  return Math.floor(balance / tokensPerTick) * tokensPerTick;
};

const InputXTZPerTick = ({ onChange }) => {
  const {
    values,
    errors,
    touched,
    handleBlur,
    setFieldValue,
  } = useFormikContext();

  return (
    <BForm.Group>
      <FormLabelWithTooltip
        labelTxt="XTZ per tick"
        tooltipTxt="Amount to become unvested and the smallest unit that can be
            withdrawn."
      />
      <Field
        as={BForm.Control}
        type="number"
        name="tokensPerTick"
        aria-label="tokensPerTick"
        min="0"
        step="0.000001"
        autoComplete="off"
        isInvalid={!!errors.tokensPerTick && touched.tokensPerTick}
        isValid={!errors.tokensPerTick && touched.tokensPerTick}
        onKeyPress={(event) => limitInputDecimals(event, 6)}
        onBlur={(e) => {
          handleBlur(e);

          const tokensInMutez = Number(convertXTZToMutez(e.target.value));
          const balanceInMutez = Number(convertXTZToMutez(values.balance));
          onChange(tokensInMutez);

          if (tokensInMutez && balanceInMutez) {
            const maxAllowedBalanceInXTZ = convertMutezToXTZ(
              calcMaxAllowedBalance(balanceInMutez, tokensInMutez),
            );
            setFieldValue('balance', maxAllowedBalanceInXTZ);
          }
        }}
      />
      <ErrorMessage
        component={BForm.Control.Feedback}
        name="tokensPerTick"
        type="invalid"
      />
    </BForm.Group>
  );
};

InputXTZPerTick.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default InputXTZPerTick;
