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
        Please read and confirm before confirming the creation of a vesting
        contract. To avoid any problems with your vesting contract check the
        following points:
        <ul>
          <li>
            Tick is a composition unit of the funds under vesting. It has
            attributes of both time and amount of XTZ.
          </li>
          <li>
            Tick defines the lowest amount of XTZ that gets unvested and can be
            subsequently withdrawn. Please make sure the balance you have can be
            divided evenly without remainders based on the time/XTZ per tick.
            E.g. If your balance is 1.2 XTZ and your XTZ per tick is .5 XTZ, you
            won’t be able to withdraw the remaining .2 XTZ since it’s less than
            the preferred XTZ per tick amount.
          </li>
          <li>
            Make sure the balance on your vesting contract is not less than your
            &quot;XTZ per tick&quot; field. Otherwise, you will not be able to
            withdraw any tokens from the contract.
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
