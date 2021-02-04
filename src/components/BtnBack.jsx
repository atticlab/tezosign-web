import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { TitleStyles } from './styled/Title';

const LinkStyled = styled(Link)`
  ${TitleStyles};
  transition: color 0.15s;
  display: inline-flex;
  align-items: center;

  &:hover {
    text-decoration: none;
    color: ${({ theme }) => theme.lightGreen};
  }
`;

const BtnBack = ({ pageName }) => (
  <div style={{ marginBottom: '36px' }}>
    <LinkStyled to="/select-multisig" style={{ marginLeft: '-45px' }}>
      <FontAwesomeIcon
        icon="arrow-left"
        style={{ marginRight: '20px', fontSize: '25px' }}
      />
      {pageName}
    </LinkStyled>
  </div>
);

BtnBack.propTypes = {
  pageName: PropTypes.string.isRequired,
};

export default BtnBack;
