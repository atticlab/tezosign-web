import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BtnTransparent } from '../../../styled/Btns';
import Modal from '../../../styled/Modal';
import { Title } from '../../../styled/Text';
import CreateVestingForm from './CreateVestingForm';
import CreateVestingFormSimple from './CreateVestingFormSimple';
import CreateVestingResult from './CreateVestingResult';

const CreateVesting = () => {
  const [show, setShow] = useState(false);
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [vestingName, setVestingName] = useState('');

  const handleClose = () => {
    setTransactionHash('');
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

            <Title as="h3">Create vesting</Title>

            <BtnTransparent onClick={() => setIsAdvanced((prev) => !prev)}>
              {isAdvanced ? 'Standard mode' : 'Advanced mode'}
            </BtnTransparent>
          </div>
        </Modal.Header>

        <Modal.Body style={{ padding: '15px 30px' }}>
          {/* eslint-disable-next-line no-nested-ternary */}
          {transactionHash ? (
            <CreateVestingResult
              transactionHash={transactionHash}
              vestingName={vestingName}
              onDone={handleClose}
            />
          ) : isAdvanced ? (
            <CreateVestingForm
              onSubmit={(hash, name) => {
                setTransactionHash(() => hash);
                setVestingName(() => name);
              }}
              onCancel={handleClose}
            />
          ) : (
            <CreateVestingFormSimple
              onSubmit={(hash, name) => {
                setTransactionHash(() => hash);
                setVestingName(() => name);
              }}
              onCancel={handleClose}
            />
          )}
        </Modal.Body>
      </Modal>

      <Button variant="info" onClick={handleShow}>
        Create vesting
      </Button>
    </>
  );
};

export default CreateVesting;
