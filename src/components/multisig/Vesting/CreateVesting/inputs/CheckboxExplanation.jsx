import React from 'react';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import { Form as BForm } from 'react-bootstrap';
import styled from 'styled-components';

const WarningBox = styled.div`
  color: ${({ theme }) => theme.yellow};
  font-size: 12px;
`;

const Check = styled(BForm.Check)`
  font-size: 12px;
  cursor: pointer;

  .custom-control-label {
    cursor: pointer;

    &:before,
    &:after {
      top: 0.05rem;
    }
  }
`;

const CheckboxExplanation = () => {
  const { errors, touched, handleChange, handleBlur } = useFormikContext();

  return (
    <BForm.Group controlId="check">
      <WarningBox>
        Attention! To avoid any problems with your vesting contract check the
        following points:
        <ul>
          <li>
            Make sure the balance on your vesting contract has not a greater
            number of decimals as your &quot;XTZ per tick&quot; field.
            Otherwise, you will not be able to withdraw all the tokens from the
            contract.
          </li>
          <li>
            Make sure the balance on your vesting contract is not less than your
            &quot;XTZ per tick&quot; field. Otherwise, you will not be able to
            withdraw any tokens from the contract.
          </li>
          <li>
            The least number of tokens you can withdraw from your vesting
            contract equals the &quot;XTZ per tick&quot; field. You cannot
            withdraw less.
          </li>
        </ul>
      </WarningBox>
      <Field
        as={Check}
        type="checkbox"
        name="check"
        custom
        id="check"
        aria-label="check"
      >
        <BForm.Check.Input
          id="check"
          type="checkbox"
          isInvalid={!!errors.check && touched.check}
          isValid={!errors.check && touched.check}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <BForm.Check.Label>
          I have read and understood all the points above.
        </BForm.Check.Label>
        <ErrorMessage
          component={BForm.Control.Feedback}
          name="check"
          type="invalid"
        />
      </Field>
    </BForm.Group>
  );
};

export default CheckboxExplanation;
