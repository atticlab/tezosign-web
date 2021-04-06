import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../../styled/Modal';
import { Title } from '../../../styled/Text';
import { Dropdown } from '../../../styled/Dropdown';
import CreateTx from './CreateTx';
import CreateDelegation from './CreateDelegation';
import ContractEditor from './ContractEditor';
import CreateVestingVest from './CreateVestingVest';
import CreateVestingSetDelegate from './CreateVestingSetDelegate';

const WalletActions = () => {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
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
            onClick={() => handleShow('transaction')}
          >
            Create transaction
          </Dropdown.Item>
          <Dropdown.Item
            className="dropdown-item"
            onClick={() => handleShow('delegation')}
          >
            Create delegation
          </Dropdown.Item>
          <Dropdown.Item
            className="dropdown-item"
            onClick={() => handleShow('edit')}
          >
            Create contract update
          </Dropdown.Item>
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
              {opType === 'transaction'
                ? 'New transaction'
                : // eslint-disable-next-line no-nested-ternary
                opType === 'delegation'
                ? 'New delegation'
                : // eslint-disable-next-line no-nested-ternary
                opType === 'edit'
                ? 'New contract update'
                : // eslint-disable-next-line no-nested-ternary
                opType === 'vesting_vest'
                ? 'Vesting_vest'
                : opType === 'vesting_set_delegate'
                ? 'Vesting_set_delegate'
                : ''}
            </Title>
          </div>
        </Modal.Header>

        <Modal.Body style={{ padding: '15px 30px' }}>
          {(() => {
            if (opType === 'transaction') {
              return <CreateTx onCreate={handleClose} onCancel={handleClose} />;
            }

            if (opType === 'delegation') {
              return (
                <CreateDelegation
                  onCreate={handleClose}
                  onCancel={handleClose}
                />
              );
            }

            if (opType === 'edit') {
              return (
                <ContractEditor onCreate={handleClose} onCancel={handleClose} />
              );
            }

            if (opType === 'vesting_vest') {
              return (
                <CreateVestingVest
                  onCreate={handleClose}
                  onCancel={handleClose}
                />
              );
            }

            if (opType === 'vesting_set_delegate') {
              return (
                <CreateVestingSetDelegate
                  onCreate={handleClose}
                  onCancel={handleClose}
                />
              );
            }

            return '';
          })()}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WalletActions;
