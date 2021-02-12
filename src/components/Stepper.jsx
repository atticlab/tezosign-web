import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

const StepperStyled = styled.ul`
  padding: 0;
  list-style-type: none;
  display: flex;
  margin-bottom: 0;
  flex-direction: ${({ isVertical }) => (isVertical ? 'column' : 'row')};
  flex-wrap: wrap;
`;

StepperStyled.Step = styled.li`
  display: flex;
  align-items: center;
  position: relative;

  &:before {
    display: block;
    content: '';
    position: absolute;
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
  }

  ${({ isVertical }) =>
    isVertical
      ? css`
          flex-direction: row;
          height: 100px;

          &:before {
            height: 100%;
            width: 3px;
            left: 5px;
          }
        `
      : css`
          flex-direction: column;
          padding: 0 20px;

          &:before {
            height: 3px;
            width: 100%;
            top: 5px;
          }
        `}
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
  margin: ${({ isVertical }) => (isVertical ? '0 20px 0 0 ' : '0 0 20px 0 ')};
`;

const Stepper = ({ steps, isVertical }) => {
  const [isVerticalLocal] = useState(isVertical);

  return (
    <StepperStyled isVertical={isVertical}>
      {steps.map((step, index) => (
        <StepperStyled.Step
          key={step.id}
          variant={step.variant}
          isLast={index === steps.length - 1}
          isVertical={isVerticalLocal}
        >
          <StepperStyled.Point
            variant={step.variant}
            isVertical={isVerticalLocal}
          />
          <div>{step.content}</div>
        </StepperStyled.Step>
      ))}
    </StepperStyled>
  );
};

Stepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.any).isRequired,
  isVertical: PropTypes.bool,
};

Stepper.defaultProps = {
  isVertical: false,
};

export default Stepper;
