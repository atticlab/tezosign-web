import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CreateTx from './CreateTx';
import CreateDelegation from './CreateDelegation';
import Title from '../../styled/Title';

const ModalHeader = styled(Modal.Header)`
  border-bottom: none;
`;

const ModalBody = styled(Modal.Body)`
  padding: 1rem 1rem 36px;
`;

const ModalContent = styled.div`
  max-width: 383px;
  margin: 0 auto;
`;

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

const ModalClose = styled(Button).attrs({ variant: 'link' })`
  color: ${({ theme }) => theme.lightGray};
  font-size: 24px;
  padding-top: 0;
  padding-bottom: 0;
  display: block;
  margin-left: auto;

  &:hover {
    color: ${({ theme }) => theme.red};
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
        <ModalHeader>
          <div style={{ width: '100%' }}>
            <ModalClose onClick={handleClose}>
              <FontAwesomeIcon icon="times" />
            </ModalClose>

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
        </ModalHeader>

        <ModalBody>
          <ModalContent>
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
          </ModalContent>
        </ModalBody>
      </Modal>

      <Button size="lg" onClick={handleShow}>
        New Operation
      </Button>
    </>
  );
};

export default NewOperation;
