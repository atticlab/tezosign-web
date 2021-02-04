import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Dropdown, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import beaconLogo from '../assets/img/beacon-logo.svg';
import IdentIcon from './IdentIcon';
import { useUserDispatchContext } from '../store/userContext';

const DDwnToggle = styled(Dropdown.Toggle)`
  color: ${({ theme }) => theme.black};
  text-align: left;
  padding: 0;
  &:after {
    display: none;
  }
  &:hover,
  &:focus {
    text-decoration: none;
    color: ${({ theme }) => theme.lightGreen};
  }
`;

const DDwnToggleContent = styled.div`
  display: flex;
  font-size: 10px;
  font-weight: 700;
  align-items: center;
`;

const DDwnMenu = styled(Dropdown.Menu)`
  padding: 16px 34px;
  box-shadow: ${({ theme }) => theme.borderShadow};
  text-align: center;
`;

const Address = styled.span`
  display: inline-block;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserDropdown = ({ address }) => {
  const [open, setOpen] = useState(false);
  const { disconnect } = useUserDispatchContext();

  return (
    <Dropdown onToggle={() => setOpen(!open)}>
      <DDwnToggle variant="link">
        <DDwnToggleContent>
          <div style={{ marginRight: '5px' }}>
            <IdentIcon address={address} />
          </div>
          <div style={{ marginRight: '5px' }}>
            <div>Connected as:</div>
            <Address>{address}</Address>
          </div>
          <div style={{ fontSize: '14px' }}>
            <FontAwesomeIcon
              icon="chevron-down"
              flip={open ? 'vertical' : 'horizontal'}
            />
          </div>
        </DDwnToggleContent>
      </DDwnToggle>

      <DDwnMenu align="right">
        <div style={{ marginBottom: '20px' }}>
          <img src={beaconLogo} alt="Beacon" width="123px" />
        </div>
        <Button variant="danger" size="sm" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </DDwnMenu>
    </Dropdown>
  );
};

UserDropdown.propTypes = {
  address: PropTypes.string.isRequired,
};

export default UserDropdown;
