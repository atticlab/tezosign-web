import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import BtnIcon from '../../styled/BtnIcon';
import Modal from '../../styled/Modal';
import { Title } from '../../styled/Text';
import { handleError } from '../../../utils/errorsHandler';
import { useVestingsDispatchContext } from '../../../store/vestingsContext';
import useAPI from '../../../hooks/useApi';
import { useContractStateContext } from '../../../store/contractContext';
import useThemeContext from '../../../hooks/useThemeContext';

const DeleteVesting = ({ vesting }) => {
  const [show, setShow] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const { deleteVesting } = useAPI();
  const { contractAddress } = useContractStateContext();
  const { setVestings } = useVestingsDispatchContext();
  const theme = useThemeContext();

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };
  const removeVesting = async (contractID, address) => {
    try {
      setIsDeleteLoading(true);
      await deleteVesting(contractAddress, { address });
      setVestings((prev) => {
        const res = [...prev];
        res.splice(
          res.indexOf(
            res.find((vestingIterable) => vestingIterable.address === address),
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
    return () => setIsDeleteLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              Delete vesting
            </Title>
          </div>
        </Modal.Header>

        <Modal.Body style={{ padding: '15px 30px' }}>
          Are you sure you would like to delete the vesting contract?
          <div style={{ marginTop: '40px', textAlign: 'right' }}>
            <Button
              variant="danger"
              disabled={isDeleteLoading}
              onClick={() => removeVesting(contractAddress, vesting.address)}
            >
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <BtnIcon hoverColor={theme.red} onClick={handleShow}>
        <FontAwesomeIcon icon="times" />
      </BtnIcon>
    </>
  );
};

DeleteVesting.propTypes = {
  vesting: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default DeleteVesting;
