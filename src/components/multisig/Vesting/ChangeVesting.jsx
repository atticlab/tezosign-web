import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BtnIcon } from '../../styled/Btns';
import Modal from '../../styled/Modal';
import { Title } from '../../styled/Text';
import VestingEditor from './VestingEditor';

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
            isEdit
            name={vesting.name}
            address={vesting.address}
            onSubmit={handleClose}
            onCancel={handleClose}
          />
        </Modal.Body>
      </Modal>

      <BtnIcon
        onClick={() => {
          handleShow();
        }}
      >
        <FontAwesomeIcon icon="pen" />
      </BtnIcon>
    </>
  );
};

ChangeVesting.propTypes = {
  vesting: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ChangeVesting;
