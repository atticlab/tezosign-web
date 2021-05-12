import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import Modal from '../../../../styled/Modal';
import { Title } from '../../../../styled/Text';
import PayloadUploadForm from './PayloadUploadForm';

const PayloadUpload = ({ operationID, onUpload }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  return (
    <>
      <Button size="sm" onClick={handleShow}>
        Upload payload
      </Button>

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

            <Title as="h3">Upload payload</Title>
          </div>
        </Modal.Header>

        <Modal.Body style={{ padding: '15px 30px' }}>
          <PayloadUploadForm
            operationID={operationID}
            onUpload={onUpload}
            onCancel={handleClose}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

PayloadUpload.propTypes = {
  operationID: PropTypes.string.isRequired,
  onUpload: PropTypes.func.isRequired,
};

export default PayloadUpload;
