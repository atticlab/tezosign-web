import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BtnTransparent } from '../../../styled/Btns';
import Modal from '../../../styled/Modal';
import { Title } from '../../../styled/Text';
import CreateVestingForm from './CreateVestingForm';
import CreateVestingFormSimple from './CreateVestingFormSimple';

const CreateVesting = () => {
  const [show, setShow] = useState(false);
  const [isAdvanced, setIsAdvanced] = useState(false);
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

            <Title as="h3">Create vesting</Title>

            <BtnTransparent onClick={() => setIsAdvanced((prev) => !prev)}>
              {isAdvanced
                ? 'Switch to standard mode'
                : 'Switch to advanced mode'}
            </BtnTransparent>
          </div>
        </Modal.Header>

        <Modal.Body style={{ padding: '15px 30px' }}>
          {isAdvanced ? (
            <CreateVestingForm onSubmit={handleClose} onCancel={handleClose} />
          ) : (
            <CreateVestingFormSimple
              onSubmit={handleClose}
              onCancel={handleClose}
            />
          )}
        </Modal.Body>
      </Modal>

      <Button variant="info" onClick={handleShow}>
        Create vesting
      </Button>
    </>
  );
};

export default CreateVesting;
