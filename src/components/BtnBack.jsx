import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ButtonTransparent = styled(Button).attrs({
  className: 'btn btn-primary',
})`
  background-color: rgba(34, 211, 105, 0.15);
  color: ${({ theme }) => theme.lightGreen};
  border: 0;

  &:hover {
    background-color: rgba(34, 211, 105, 0.25);
    color: ${({ theme }) => theme.lightGreen};
  }
  &:focus {
    background-color: rgba(34, 211, 105, 0.35);
    color: ${({ theme }) => theme.lightGreen};
  }
  &:not(:disabled):not(.disabled):active {
    background-color: rgba(34, 211, 105, 0.45);
    color: ${({ theme }) => theme.lightGreen};
  }
`;

const BtnBack = () => (
  <div style={{ marginBottom: '36px' }}>
    <ButtonTransparent as={Link} to="/select-multisig">
      <FontAwesomeIcon icon="arrow-left" style={{ marginRight: '10px' }} />
      Back
    </ButtonTransparent>
  </div>
);

export default BtnBack;
