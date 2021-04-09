import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import { BtnIcon } from '../../styled/Btns';
import Modal from '../../styled/Modal';
import { Title } from '../../styled/Text';
import useAPI from '../../../hooks/useApi';
import { useContractStateContext } from '../../../store/contractContext';
import { handleError } from '../../../utils/errorsHandler';
import { useAssetsDispatchContext } from '../../../store/assetsContext';
import useThemeContext from '../../../hooks/useThemeContext';

const DeleteAsset = ({ asset }) => {
  const theme = useThemeContext();
  const { contractAddress } = useContractStateContext();
  const { deleteAsset } = useAPI();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const { setAssets } = useAssetsDispatchContext();
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  const removeAsset = async (contractID, address) => {
    try {
      setIsDeleteLoading(true);
      await deleteAsset(contractID, { address });
      setAssets((prev) => {
        const res = [...prev];
        res.splice(
          res.indexOf(
            res.find((assetIterable) => assetIterable.address === address),
          ),
          1,
        );
        return res;
      });
      handleClose();
    } catch (e) {
      handleError(e);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      setIsDeleteLoading(false);
    };
  });

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
              Delete asset
            </Title>
          </div>
        </Modal.Header>

        <Modal.Body style={{ padding: '15px 30px' }}>
          Are you sure you would like to delete the asset?
          <div style={{ marginTop: '40px', textAlign: 'right' }}>
            <Button
              variant="danger"
              disabled={isDeleteLoading}
              onClick={() => removeAsset(contractAddress, asset.address)}
            >
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <BtnIcon $hoverColor={theme.red} onClick={handleShow}>
        <FontAwesomeIcon icon="times" />
      </BtnIcon>
    </>
  );
};

DeleteAsset.propTypes = {
  asset: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default DeleteAsset;
