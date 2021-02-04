import React from 'react';
import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import logo from '../../assets/img/logo.svg';
import UserDropdown from '../UserDropdown';
import {
  useUserStateContext,
  useUserDispatchContext,
} from '../../store/userContext';

const TheHeader = styled.header`
  ${({ theme: { border, borderShadow, smDown } }) => css`
    display: flex;
    align-items: center;
    padding: 12px 46px;
    justify-content: space-between;
    border-bottom: ${border};
    box-shadow: ${borderShadow};

    @media (${smDown}) {
      padding: 15px;
    }
  `}
`;

const AppHeader = () => {
  // isPermissionsLoading
  const { isLoggedIn, address } = useUserStateContext();
  const { connect } = useUserDispatchContext();

  return (
    <TheHeader>
      <NavLink to={isLoggedIn ? '/select-multisig' : '/'}>
        <img src={logo} alt="TzSign" />
      </NavLink>

      <div>
        {isLoggedIn ? (
          <UserDropdown address={address} />
        ) : (
          <Button
            variant="primary"
            onClick={() => connect()}
            // disabled={isPermissionsLoading}
          >
            Connect
          </Button>
        )}
      </div>
    </TheHeader>
  );
};

export default AppHeader;
