import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import Modal from '../../styled/Modal';
import { Title } from '../../styled/Text';
import VestingEditor from './VestingEditor';

const Edit = styled(Button).attrs({ variant: 'link' })`
  color: ${({ theme }) => theme.gray};
  &:hover {
    color: ${({ theme }) => theme.green};
  }
`;

const ChangeVesting = ({ vesting }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header style={{ padding: '15px 30px' }}>
          <div style={{ width: '100%' }}>
            <Modal.Close onClick={handleClose}>
              <FontAwesomeIcon icon="times" />
            </Modal.Close>

            <Title as="h3" style={{ marginBottom: 0 }}>
              Edit vesting
            </Title>
          </div>
        </Modal.Header>

        <Modal.Body style={{ padding: '15px 30px' }}>
          <VestingEditor
            name={vesting.name}
            address={vesting.address}
            balance={vesting.balance}
            onCancel={handleClose}
          />
        </Modal.Body>
      </Modal>

      <Edit onClick={handleShow}>
        <FontAwesomeIcon icon="pen" />
      </Edit>
    </>
  );
};

ChangeVesting.propTypes = {
  vesting: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ChangeVesting;
