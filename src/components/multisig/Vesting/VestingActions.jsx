import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown } from '../../styled/Dropdown';
import Modal from '../../styled/Modal';
import { Title } from '../../styled/Text';
import VestingOperationForm from './VestingOperationForm';

const VestingActions = () => {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  // vesting_vest
  // vesting_set_delegate
  const [opType, setOpType] = useState('');

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = (type) => {
    setOpen(!open);
    setOpType(type);
    setShow(true);
  };

  return (
    <>
      <Dropdown onToggle={() => setOpen(!open)}>
        <Dropdown.Toggle>
          <span style={{ marginRight: '5px' }}>Actions</span>
          <FontAwesomeIcon
            icon="chevron-down"
            rotation={open ? 180 : 0}
            style={{ transition: 'all 0.15s ease' }}
          />
        </Dropdown.Toggle>

        <Dropdown.Menu align="right">
          <Dropdown.Item
            className="dropdown-item"
            onClick={() => handleShow('vesting_vest')}
          >
            Create vesting_vest
          </Dropdown.Item>
          <Dropdown.Item
            className="dropdown-item"
            onClick={() => handleShow('vesting_set_delegate')}
          >
            Create vesting_set_delegate
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

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
              {/* eslint-disable-next-line no-nested-ternary */}
              {opType === 'vesting_vest'
                ? 'New vesting_vest'
                : // eslint-disable-next-line no-nested-ternary
                opType === 'vesting_set_delegate'
                ? 'New vesting_set_delegate'
                : ''}
            </Title>
          </div>
        </Modal.Header>

        <Modal.Body style={{ padding: '15px 30px' }}>
          <VestingOperationForm
            operationType={opType}
            onSubmit={handleClose}
            onCancel={handleClose}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default VestingActions;
