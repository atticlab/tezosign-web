import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import ModalPayload from '../ModalPayload';
import useModal from '../../../../../hooks/useModal';
import { handleError } from '../../../../../utils/errorsHandler';
import useAPI from '../../../../../hooks/useApi';

const PayloadDownload = ({ style, operationID, disabled }) => {
  const { show, handleShow, handleClose } = useModal();
  const { getOperationPayload } = useAPI();
  const [signingPayload, setSigningPayload] = useState({});
  const [isSigningPayloadLoading, setIsSigningPayloadLoading] = useState(false);

  const handleGetOperationPayload = async (opID, type) => {
    try {
      setIsSigningPayloadLoading(true);
      const payload = await getOperationPayload(opID, {
        type,
      });

      setSigningPayload(() => payload.data);
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
        disabled={disabled || isSigningPayloadLoading}
        onClick={handleShow}
      >
        Download payload
      </Button>

      <ModalPayload
        show={show}
        handleClose={() => {
          handleClose();
          setSigningPayload(() => ({}));
        }}
        JSONPayload={signingPayload.payload_json || ''}
        bytesPayload={signingPayload.payload || ''}
        isTypeLoading={isSigningPayloadLoading}
        onSelect={(type) => handleGetOperationPayload(operationID, type)}
      />
    </>
  );
};

PayloadDownload.propTypes = {
  style: PropTypes.objectOf(PropTypes.any),
  operationID: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};
PayloadDownload.defaultProps = {
  style: {},
};

export default PayloadDownload;
