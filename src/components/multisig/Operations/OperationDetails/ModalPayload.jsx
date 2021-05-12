import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import Modal from '../../../styled/Modal';
import { Bold, Title } from '../../../styled/Text';
import Card from '../../../styled/Card';
import { FlexCenter } from '../../../styled/Flex';
import PayloadType from './PayloadDownload/PayloadType';
import Spinner from '../../../Spinner';

const PreCode = styled.pre`
  color: #ff338d;
  max-height: 400px;
  overflow: auto;
`;

const copy = () => toast.success('Payload copied!');

const ModalPayload = ({
  show,
  handleClose,
  JSONPayload,
  bytesPayload,
  textExplain,
  selectType,
  isTypeLoading,
  onSelect,
}) => {
  const JSONPayloadFormatted = useMemo(() => {
    if (!JSONPayload) return '';
    return JSON.stringify(JSON.parse(JSONPayload), null, 2);
  }, [JSONPayload]);

  return (
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
            Payload
          </Title>
        </div>
      </Modal.Header>

      <Modal.Body style={{ padding: '15px 30px' }}>
        <p>{textExplain}</p>

        {selectType && <PayloadType onSelect={onSelect} />}

        {isTypeLoading ? (
          <FlexCenter style={{ height: '400px' }}>
            <Spinner />
          </FlexCenter>
        ) : (
          JSONPayloadFormatted && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <div>
                  <Bold>JSON payload:</Bold>
                </div>
                <Card>
                  <Card.Body style={{ padding: '2px 5px', overflow: 'auto' }}>
                    <PreCode>{JSONPayloadFormatted}</PreCode>
                  </Card.Body>
                </Card>
              </div>

              <CopyToClipboard text={bytesPayload}>
                <Button style={{ marginRight: '10px' }} onClick={() => copy()}>
                  Copy bytes payload
                </Button>
              </CopyToClipboard>
              <CopyToClipboard text={JSONPayload}>
                <Button varinat="info" onClick={() => copy()}>
                  Copy JSON payload
                </Button>
              </CopyToClipboard>
            </div>
          )
        )}
      </Modal.Body>
    </Modal>
  );
};

ModalPayload.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  JSONPayload: PropTypes.string.isRequired,
  bytesPayload: PropTypes.string.isRequired,
  textExplain: PropTypes.string,
  selectType: PropTypes.bool,
  isTypeLoading: PropTypes.bool,
  onSelect: PropTypes.func,
};

ModalPayload.defaultProps = {
  textExplain:
    'You are going to sign a payload. Now you probably can see a string payload in the wallet of your choice. It is necessary to sign the payload in order to proceed.',
  selectType: false,
  isTypeLoading: false,
  onSelect: () => null,
};

export default ModalPayload;
