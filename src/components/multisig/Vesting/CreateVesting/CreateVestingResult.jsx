import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { FormSubmit } from '../../../styled/Forms';
import { Text, BreakTxt } from '../../../styled/Text';
import Spinner from '../../../Spinner';
import BtnCopy from '../../../BtnCopy';
import useAPI from '../../../../hooks/useApi';
import { useVestingsDispatchContext } from '../../../../store/vestingsContext';
import { handleError } from '../../../../utils/errorsHandler';
import { useContractStateContext } from '../../../../store/contractContext';

const explorerNetworks = {
  florence: 'florencenet',
};

const CreateVestingResult = ({ transactionHash, vestingName, onDone }) => {
  const [originatedContract, setOriginatedContract] = useState('');
  const { contractAddress } = useContractStateContext();
  const { getOriginatedContract, addVesting } = useAPI();
  const { setVestings } = useVestingsDispatchContext();

  const addVestingReq = async (values) => {
    try {
      const resp = await addVesting(contractAddress, values);
      setVestings((prev) => [resp.data, ...prev]);
    } catch (e) {
      handleError(e);
    }
  };

  const explorerOperationLink = useMemo(() => {
    return `https://${
      explorerNetworks[process.env.REACT_APP_TEZOS_NETWORK]
    }.tzkt.io/${transactionHash}`;
  }, [transactionHash]);

  useEffect(() => {
    if (!transactionHash) return null;

    const interval = setInterval(async () => {
      try {
        const resp = await getOriginatedContract(transactionHash);
        if (resp.data.contract) {
          setOriginatedContract(resp.data.contract);
          clearInterval(interval);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }, 7000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionHash]);

  useEffect(() => {
    if (!originatedContract || !vestingName) return null;

    return addVestingReq({ address: originatedContract, name: vestingName });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originatedContract, vestingName]);

  return (
    <div>
      {originatedContract ? (
        <div>
          <Text>
            Transaction has been added to the network. Now you can use your new
            vesting contract address.
          </Text>
        </div>
      ) : (
        <div>
          <Text>
            Your transaction has been sent. Please wait until it is added to the
            network, it may take a few minutes.
          </Text>
          <div style={{ textAlign: 'center' }}>
            <Spinner />
          </div>
        </div>
      )}

      <div>
        Transaction hash:{' '}
        <a href={explorerOperationLink} target="_blank" rel="noreferrer">
          <BreakTxt>{transactionHash}</BreakTxt>
        </a>
      </div>
      {originatedContract && (
        <div>
          Vesting contract address: <BreakTxt>{originatedContract}</BreakTxt>{' '}
          <BtnCopy textToCopy={originatedContract} />
        </div>
      )}

      <FormSubmit>
        <Button
          onClick={() => {
            setOriginatedContract('');
            onDone();
          }}
        >
          Done
        </Button>
      </FormSubmit>
    </div>
  );
};

CreateVestingResult.propTypes = {
  transactionHash: PropTypes.string.isRequired,
  vestingName: PropTypes.string.isRequired,
  onDone: PropTypes.func.isRequired,
};

export default CreateVestingResult;
