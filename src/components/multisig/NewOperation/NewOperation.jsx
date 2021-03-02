import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CreateTx from './CreateTx';
import CreateDelegation from './CreateDelegation';
import Title from '../../styled/Title';
import Modal from '../../styled/Modal';

const LinkBtn = styled(Button).attrs({ variant: 'link' })`
  color: ${({ theme }) => theme.black};

  &:hover {
    color: ${({ theme }) => theme.lightGreen};
    text-decoration: none;
  }
  &:focus {
    text-decoration: none;
  }
`;

const NewOperation = () => {
  const [show, setShow] = useState(false);
  const [opType, setOpType] = useState('');
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setOpType('');
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
                New Operation
              </Title>
              {opType && (
                <LinkBtn onClick={() => setOpType('')}>
                  <FontAwesomeIcon
                    icon="arrow-left"
                    style={{ marginRight: '10px' }}
                  />
                  Back
                </LinkBtn>
              )}
            </div>
          </div>
        </Modal.Header>

        <Modal.Body>
          <Modal.Content>
            {(() => {
              if (opType === 'transaction') {
                return <CreateTx onCreate={handleClose} />;
              }

              if (opType === 'delegation') {
                return <CreateDelegation onCreate={handleClose} />;
              }

              return (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <Button
                      style={{ width: '100%' }}
                      onClick={() => setOpType('transaction')}
                    >
                      Create Transaction
                    </Button>
                  </div>
                  <div>
                    <Button
                      style={{ width: '100%' }}
                      onClick={() => setOpType('delegation')}
                    >
                      Create Delegation
                    </Button>
                  </div>
                </div>
              );
            })()}
          </Modal.Content>
        </Modal.Body>
      </Modal>

      <Button onClick={handleShow}>New Operation</Button>
    </>
  );
};

export default NewOperation;
