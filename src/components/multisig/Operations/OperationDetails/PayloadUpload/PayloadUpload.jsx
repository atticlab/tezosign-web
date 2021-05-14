import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import Modal from '../../../../styled/Modal';
import { Title } from '../../../../styled/Text';
import PayloadUploadForm from './PayloadUploadForm';
import useModal from '../../../../../hooks/useModal';

const PayloadUpload = ({
  operationID,
  approveDisabled,
  rejectDisabled,
  onUpload,
}) => {
  const { show, handleShow, handleClose } = useModal();

  return (
    <>
      <Button
        size="sm"
        disabled={approveDisabled && rejectDisabled}
        onClick={handleShow}
      >
        Upload signature
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

            <Title as="h3">Upload signature</Title>
          </div>
        </Modal.Header>

        <Modal.Body style={{ padding: '15px 30px' }}>
          <PayloadUploadForm
            operationID={operationID}
            approveDisabled={approveDisabled}
            rejectDisabled={rejectDisabled}
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
  approveDisabled: PropTypes.bool.isRequired,
  rejectDisabled: PropTypes.bool.isRequired,
  onUpload: PropTypes.func.isRequired,
};

export default PayloadUpload;
