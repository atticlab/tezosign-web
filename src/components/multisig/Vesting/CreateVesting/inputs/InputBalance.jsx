import React from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import { Form as BForm, InputGroup } from 'react-bootstrap';
import FormLabelWithTooltip from '../../../../FormLabelWithTooltip';
import { BtnMax } from '../../../../styled/Btns';
import {
  convertMutezToXTZ,
  convertXTZToMutez,
  limitInputDecimals,
  calcMaxAllowedBalance,
} from '../../../../../utils/helpers';

const InputBalance = ({ maxBalance }) => {
  const {
    values,
    errors,
    touched,
    handleBlur,
    setFieldValue,
    setFieldTouched,
  } = useFormikContext();

  return (
    <BForm.Group controlId="balance">
      <FormLabelWithTooltip
        labelTxt="Balance"
        tooltipTxt="The amount that is going to be vested. Takes into account Vesting
            activation/end date, Vested parts number and Vesting interval to
            make sure the funds can be evenly unvested and distributed on each
            time interval."
      />

      <InputGroup>
        <Field
          as={BForm.Control}
          type="number"
          name="balance"
          aria-label="balance"
          autoComplete="off"
          isInvalid={!!errors.balance && touched.balance}
          isValid={!errors.balance && touched.balance}
          step={values.tokensPerTick || 0.000001}
          min={values.tokensPerTick || 0.000001}
          onKeyPress={(event) => limitInputDecimals(event, 6)}
          onBlur={(e) => {
            handleBlur(e);

            const tokensInMutez = Number(
              convertXTZToMutez(values.tokensPerTick),
            );
            const balanceInMutez = Number(convertXTZToMutez(e.target.value));

            if (balanceInMutez && tokensInMutez) {
              const maxAllowedBalanceInXTZ = convertMutezToXTZ(
                calcMaxAllowedBalance(balanceInMutez, tokensInMutez),
              );
              setFieldValue('balance', maxAllowedBalanceInXTZ);
            }
          }}
        />

        <InputGroup.Append>
          <InputGroup.Text
            style={{
              paddingTop: 0,
              paddingBottom: 0,
              borderTopRightRadius: '5px',
              borderBottomRightRadius: '5px',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <BtnMax
                onClick={() => {
                  setFieldValue('balance', maxBalance);
                  setFieldTouched('balance', true, true);
                }}
              >
                MAX
              </BtnMax>
              <span style={{ fontSize: '12px', marginBottom: '2px' }}>
                {maxBalance}
              </span>
            </span>
          </InputGroup.Text>
        </InputGroup.Append>

        <ErrorMessage
          component={BForm.Control.Feedback}
          name="balance"
          type="invalid"
        />
      </InputGroup>
    </BForm.Group>
  );
};

InputBalance.propTypes = {
  maxBalance: PropTypes.number.isRequired,
};

export default InputBalance;
