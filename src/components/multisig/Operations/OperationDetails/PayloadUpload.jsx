import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import ModalPayload from './ModalPayload';
import useModal from '../../../../hooks/useModal';
import { handleError } from '../../../../utils/errorsHandler';
import useAPI from '../../../../hooks/useApi';

const PayloadUpload = ({ style, operationID }) => {
  const { show, handleShow, handleClose } = useModal();
  const { getOperationPayload } = useAPI();
  const [signingPayload, setSigningPayload] = useState({});
  const [isSigningPayloadLoading, setIsSigningPayloadLoading] = useState(false);

  const handleGetOperationPayload = async (opID) => {
    try {
      setIsSigningPayloadLoading(true);
      const payload = await getOperationPayload(opID, {
        type: 'approve',
      });

      setSigningPayload(() => payload.data);
      handleShow();
    } catch (e) {
      handleError(e);
    } finally {
      setIsSigningPayloadLoading(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        style={style}
        disabled={isSigningPayloadLoading}
        onClick={() => handleGetOperationPayload(operationID)}
      >
        Upload payload
      </Button>
      <ModalPayload
        show={show}
        handleClose={handleClose}
        JSONPayload={signingPayload.payload_json || ''}
        bytesPayload={signingPayload.payload || ''}
        textExplain="Upload the payload, so that you can use it for independent verification and offline signing."
      />
    </>
  );
};

PayloadUpload.propTypes = {
  style: PropTypes.objectOf(PropTypes.any),
  operationID: PropTypes.string.isRequired,
};
PayloadUpload.defaultProps = {
  style: {},
};

export default PayloadUpload;
