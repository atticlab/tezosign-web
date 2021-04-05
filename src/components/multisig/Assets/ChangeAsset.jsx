import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BtnIcon } from '../../styled/Btns';
import Modal from '../../styled/Modal';
import { Title } from '../../styled/Text';
import AssetEditor from './AssetEditor';

const ChangeAsset = ({ asset }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
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

            <Title as="h3" style={{ marginBottom: 0 }}>
              Edit asset
            </Title>
          </div>
        </Modal.Header>

        <Modal.Body style={{ padding: '15px 30px' }}>
          <AssetEditor
            isEdit
            name={asset.name}
            address={asset.address}
            contractType={asset.contract_type}
            scale={asset.scale}
            ticker={asset.ticker}
            onSubmit={handleClose}
            onCancel={handleClose}
          />
        </Modal.Body>
      </Modal>

      <BtnIcon onClick={handleShow}>
        <FontAwesomeIcon icon="pen" />
      </BtnIcon>
    </>
  );
};

ChangeAsset.propTypes = {
  asset: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ChangeAsset;
