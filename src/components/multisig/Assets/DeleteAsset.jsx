import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import Modal from '../../styled/Modal';
import Title from '../../styled/Title';

const Close = styled(Button).attrs({ variant: 'link' })`
  color: ${({ theme }) => theme.lightGray};
  &:hover {
    color: ${({ theme }) => theme.red};
  }
`;

const DeleteAsset = ({ asset }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };
  console.log(asset);

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
                Delete Asset
              </Title>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body>
          <Modal.Content>
            Are you sure you would like to delete the asset?
          </Modal.Content>
        </Modal.Body>
      </Modal>

      <Close onClick={handleShow}>
        <FontAwesomeIcon icon="times" />
      </Close>
    </>
  );
};

DeleteAsset.propTypes = {
  asset: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default DeleteAsset;
