import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prop-types
// const Step = ({ content }) => (
//   <li>
//     <Point status/>
//     <div>{content}</div>
//   </li>
// );

const StepperStyled = styled.ul`
  padding: 0;
  list-style-type: none;
  display: flex;
  //justify-content: space-between;
`;

StepperStyled.Step = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 0 20px;

  &:before {
    background-color: ${({ variant, theme }) => {
      switch (variant) {
        case 'success':
          return theme.lightGreen;
        case 'danger':
          return theme.red;
        default:
          return theme.lightGray2;
      }
    }};
    display: block;
    content: '';
    height: 3px;
    width: 100%;
    position: absolute;
    top: 5px;
  }
`;

StepperStyled.Point = styled.div`
  background-color: ${({ variant, theme }) => {
    switch (variant) {
      case 'success':
        return theme.lightGreen;
      case 'danger':
        return theme.red;
      default:
        return theme.lightGray2;
    }
  }};
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-bottom: 20px;
`;

const Stepper = ({ steps }) => (
  <StepperStyled>
    {steps.map((step, index) => (
      <StepperStyled.Step
        key={step.id}
        variant={step.variant}
        isLast={index === steps.length - 1}
      >
        <StepperStyled.Point variant={step.variant} />
        <div>{step.content}</div>
      </StepperStyled.Step>
    ))}
  </StepperStyled>
);

Stepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default Stepper;
