import React, { useState, useEffect, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BtnTransparent } from '../../../styled/Btns';
import Modal from '../../../styled/Modal';
import { Title } from '../../../styled/Text';
import CreateVestingForm from './CreateVestingForm';
import CreateVestingFormSimple from './CreateVestingFormSimple';
import CreateVestingConfirm from './CreateVestingConfirm';
import CreateVestingResult from './CreateVestingResult';
import useAPI from '../../../../hooks/useApi';

const CreateVesting = () => {
  const { getVestingContractCode } = useAPI();
  const [show, setShow] = useState(false);
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [vestingCode, setVestingCode] = useState('');
  const [vestingOriginationPayload, setVestingOriginationPayload] = useState(
    '',
  );
  const [formData, setFormData] = useState({});

  const handleClose = () => {
    setIsAdvanced(false);
    setVestingOriginationPayload('');
    setTransactionHash('');
    setFormData({});
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };
  const handleModeToggle = () => {
    setIsAdvanced((prev) => !prev);
    setFormData({});
  };

  useEffect(() => {
    (async () => {
      const respCode = await getVestingContractCode();
      setVestingCode(() => respCode.data);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const script = useMemo(() => {
    return {
      code: vestingCode,
      storage: vestingOriginationPayload.storage,
    };
  }, [vestingCode, vestingOriginationPayload]);

  const renderForms = () => {
    return (
      <>
        <BtnTransparent
          style={{ marginBottom: '10px' }}
          onClick={handleModeToggle}
        >
          {isAdvanced ? 'Standard mode' : 'Advanced mode'}
        </BtnTransparent>

        {isAdvanced ? (
          <CreateVestingForm
            formData={formData}
            onSubmit={(raw, payload) => {
              setFormData(() => raw);
              setVestingOriginationPayload(() => payload);
            }}
            onCancel={handleClose}
          />
        ) : (
          <CreateVestingFormSimple
            formData={formData}
            onSubmit={(raw, payload) => {
              setFormData(() => raw);
              setVestingOriginationPayload(() => payload);
            }}
            onCancel={handleClose}
          />
        )}
      </>
    );
  };

  const renderFinalSteps = () => {
    return transactionHash ? (
      <CreateVestingResult
        transactionHash={transactionHash}
        vestingName={vestingOriginationPayload.name}
        onDone={handleClose}
      />
    ) : (
      <CreateVestingConfirm
        script={script}
        formData={formData}
        isFormAdvanced={isAdvanced}
        onSubmit={(txHash) => setTransactionHash(() => txHash)}
        onBack={() => setVestingOriginationPayload('')}
      />
    );
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
          </div>
        </Modal.Header>

        <Modal.Body style={{ padding: '15px 30px' }}>
          {vestingOriginationPayload ? renderFinalSteps() : renderForms()}
        </Modal.Body>
      </Modal>

      <Button variant="info" onClick={handleShow}>
        Create vesting
      </Button>
    </>
  );
};

export default CreateVesting;
