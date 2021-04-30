import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from './styled/Modal';
import { Bold, Title } from './styled/Text';
import Card from './styled/Card';
import BtnCopy from './BtnCopy';
import { useUserStateContext } from '../store/userContext';

const ModalAuth = ({ show, handleClose }) => {
  const { authRequestToken } = useUserStateContext();

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
            Login
          </Title>
        </div>
      </Modal.Header>

      <Modal.Body style={{ padding: '15px 30px' }}>
        <p>
          You are going to login to the application. Now you probably can see a
          string payload in the wallet of your choice. It is necessary to sign
          the payload in order to proceed.
        </p>
        <p>
          <div>
            <Bold>Original payload:</Bold>
          </div>
          <Card>
            <Card.Body style={{ padding: '2px 5px' }}>
              <code style={{ color: '#ff338d' }}>{authRequestToken}</code>
              <BtnCopy textToCopy={authRequestToken} />
            </Card.Body>
          </Card>
        </p>
      </Modal.Body>
    </Modal>
  );
};

ModalAuth.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ModalAuth;
