import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import Modal from '../../styled/Modal';
import Title from '../../styled/Title';
import AssetEditor from './AssetEditor';

const NewAsset = () => {
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
        <Modal.Header>
          <div style={{ width: '100%' }}>
            <Modal.Close onClick={handleClose}>
              <FontAwesomeIcon icon="times" />
            </Modal.Close>

            <div style={{ textAlign: 'center' }}>
              <Title as="h3" modifier="sm" fw={400} style={{ marginBottom: 0 }}>
                New Asset
              </Title>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body>
          <Modal.Content>
            <AssetEditor onSubmit={handleClose} />
          </Modal.Content>
        </Modal.Body>
      </Modal>

      <Button onClick={handleShow}>New Asset</Button>
    </>
  );
};

export default NewAsset;
