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
    background: ${({ variant, theme, isVertical }) => {
      switch (variant) {
        case 'success':
          return theme.green;
        case 'danger':
          return theme.red;
        case 'halved':
          return isVertical
            ? `linear-gradient(180deg, ${theme.green} 50%, ${theme.red} 50%)`
            : `linear-gradient(90deg, ${theme.green} 50%, ${theme.red} 50%)`;
        default:
          return theme.gray;
      }
    }};
  }

  &:after {
    content: '';
    display: block;
    height: 14px;
    position: absolute;
    background-color: ${({ theme }) => theme.gray};
    width: 2px;
    right: 0;
    ${({ isVertical }) =>
      isVertical
        ? css`
            left: 0;
            bottom: 0;
            width: 14px;
            height: 2px;
          `
        : ''}
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
  background: ${({ variant, theme, isVertical }) => {
    switch (variant) {
      case 'success':
        return theme.green;
      case 'danger':
        return theme.red;
      case 'halved':
        return isVertical
          ? `linear-gradient(180deg, ${theme.green} 50%, ${theme.red} 50%)`
          : `linear-gradient(90deg, ${theme.green} 50%, ${theme.red} 50%)`;
      default:
        return theme.gray;
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
