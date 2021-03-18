import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import Modal from '../../styled/Modal';
import { Title } from '../../styled/Text';
import useAPI from '../../../hooks/useApi';
import { useContractStateContext } from '../../../store/contractContext';
import { handleError } from '../../../utils/errorsHandler';
import { useAssetsDispatchContext } from '../../../store/assetsContext';

const Close = styled(Button).attrs({ variant: 'link' })`
  color: ${({ theme }) => theme.lightGray};
  &:hover {
    color: ${({ theme }) => theme.red};
  }
`;

const DeleteAsset = ({ asset }) => {
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
          <Modal.Content style={{ textAlign: 'center' }}>
            Are you sure you would like to delete the asset?
            <div style={{ marginTop: '30px' }}>
              <Button
                variant="danger"
                size="lg"
                disabled={isDeleteLoading}
                onClick={() => removeAsset(contractAddress, asset.address)}
              >
                Delete
              </Button>
            </div>
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
