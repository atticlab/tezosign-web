import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

// ${({ variant }) =>
//   variant === 'halved'
//     ? css`
//         background-size: 21px 2px, 100% 2px;
//       `
//     : ''}

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
    background: ${({ variant, theme }) => {
      switch (variant) {
        case 'success':
          return theme.lightGreen;
        case 'danger':
          return theme.red;
        case 'halved':
          return `linear-gradient(90deg, ${theme.lightGreen} 50%, ${theme.red} 50%)`;
        // return `linear-gradient(to left, ${theme.lightGreen}, ${theme.lightGreen} 50%, ${theme.red} 50%, ${theme.red});`;
        // return `linear-gradient(180deg, ${theme.lightGreen} 50%, ${theme.red} 50%);`;
        default:
          return theme.lightGray2;
      }
    }};
  }

  &:after {
    content: '';
    display: block;
    height: 15%;
    position: absolute;
    background-color: ${({ theme }) => theme.lightGray2};
    width: 2px;
    right: 0;
  }

  ${({ isVertical }) =>
    isVertical
      ? css`
          flex-direction: row;
          height: 100px;

          &:before {
            height: 100%;
            width: 4px;
            left: 5px;
          }
        `
      : css`
          flex-direction: column;
          padding: 0 20px;

          &:before {
            height: 4px;
            width: 100%;
            top: 5px;
          }
        `}
`;

StepperStyled.Point = styled.div`
  background: ${({ variant, theme }) => {
    switch (variant) {
      case 'success':
        return theme.lightGreen;
      case 'danger':
        return theme.red;
      case 'halved':
        return `linear-gradient(90deg, ${theme.lightGreen} 50%, ${theme.red} 50%)`;
      default:
        return theme.lightGray2;
    }
  }};
  width: 13px;
  height: 13px;
  border-radius: 50%;
  position: relative;
  z-index: 1;
  margin: ${({ isVertical }) => (isVertical ? '0 20px 0 0 ' : '0 0 20px 0 ')};
`;

const Stepper = ({ steps, isVertical, style }) => {
  const [isVerticalLocal] = useState(isVertical);

  return (
    <StepperStyled isVertical={isVertical} style={style}>
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
  style: PropTypes.objectOf(PropTypes.any),
};

Stepper.defaultProps = {
  isVertical: false,
  style: {},
};

export default Stepper;
