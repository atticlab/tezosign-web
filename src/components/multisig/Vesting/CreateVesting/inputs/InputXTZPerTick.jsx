import React from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import {
  Form as BForm,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { FormLabel } from '../../../../styled/Forms';
import { BtnMax } from '../../../../styled/Btns';
import {
  convertMutezToXTZ,
  convertXTZToMutez,
  limitInputDecimals,
} from '../../../../../utils/helpers';

const calcMaxAllowedBalance = (balance, tokensPerTick) => {
  return Math.floor(balance / tokensPerTick) * tokensPerTick;
};

const InputXTZPerTick = ({ balanceInXTZ, onChange }) => {
  const {
    values,
    errors,
    touched,
    handleBlur,
    setFieldValue,
    setFieldTouched,
  } = useFormikContext();

  return (
    <BForm.Group>
      <OverlayTrigger
        overlay={
          <Tooltip>
            Amount to become unvested and the smallest unit that can be
            withdrawn.
          </Tooltip>
        }
      >
        <FormLabel>XTZ per tick</FormLabel>
      </OverlayTrigger>
      <InputGroup>
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

        <InputGroup.Append>
          <InputGroup.Text style={{ paddingTop: 0, paddingBottom: 0 }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <BtnMax
                onClick={() => {
                  setFieldValue('tokensPerTick', balanceInXTZ);
                  onChange(Number(convertXTZToMutez(balanceInXTZ)));
                  setFieldTouched('tokensPerTick', true, false);
                }}
              >
                MAX
              </BtnMax>
              <span style={{ fontSize: '12px', marginBottom: '2px' }}>
                {balanceInXTZ}
              </span>
            </span>
          </InputGroup.Text>
        </InputGroup.Append>

        <ErrorMessage
          component={BForm.Control.Feedback}
          name="tokensPerTick"
          type="invalid"
        />
      </InputGroup>
    </BForm.Group>
  );
};

InputXTZPerTick.propTypes = {
  balanceInXTZ: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default InputXTZPerTick;
