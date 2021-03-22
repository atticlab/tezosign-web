import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BtnTransparent from './styled/BtnTransparent';

const BtnBack = () => (
  <div style={{ marginBottom: '36px' }}>
    <BtnTransparent as={Link} to="/select-multisig">
      <FontAwesomeIcon icon="arrow-left" style={{ marginRight: '10px' }} />
      Back
    </BtnTransparent>
  </div>
);

export default BtnBack;
