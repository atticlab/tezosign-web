import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import Modal from '../../styled/Modal';
import { Title } from '../../styled/Text';
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
        <Modal.Header style={{ padding: '15px 30px' }}>
          <div style={{ width: '100%' }}>
            <Modal.Close onClick={handleClose}>
              <FontAwesomeIcon icon="times" />
            </Modal.Close>

            <Title as="h3" style={{ marginBottom: 0 }}>
              New Asset
            </Title>
          </div>
        </Modal.Header>

        <Modal.Body style={{ padding: '15px 30px' }}>
          <AssetEditor onSubmit={handleClose} onCancel={handleClose} />
        </Modal.Body>
      </Modal>

      <Button onClick={handleShow}>New Asset</Button>
    </>
  );
};

export default NewAsset;
