import React, { useEffect, useState } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { Text } from '../components/styled/Text';
import Card from '../components/styled/Card';
import Spinner from '../components/Spinner';
import BtnBack from '../components/BtnBack';
import useAPI from '../hooks/useApi';

const Deployed = () => {
  const location = useLocation();
  const history = useHistory();
  const [transactionHash, setTransactionHash] = useState('');
  const [originatedContract, setOriginatedContract] = useState('');
  const { getOriginatedContract } = useAPI();

  useEffect(() => {
    if (!location.state) {
      history.replace('/not-found');
      return;
    }
    setTransactionHash(location.state.transactionHash);
  }, [history, location]);

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
        console.error(e);
      }
    }, 7000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionHash]);

  return (
    <>
      <BtnBack pageName="Create a New Multisig" />

      <Card>
        <Card.Body>
          <div>
            {originatedContract ? (
              <Text>
                Transaction has been added to the network. Now you can use your
                new wallet address.
              </Text>
            ) : (
              <>
                <Text>
                  Your transaction has been sent. Please wait until it is added
                  to the network, it may take a few minutes.
                </Text>
                <div style={{ textAlign: 'center' }}>
                  <Spinner />
                </div>
              </>
            )}
          </div>
          <Text style={{ marginBottom: 0 }}>
            Transaction hash:{' '}
            <a
              href={`https://edo2net.tzkt.io/${transactionHash}`}
              target="_blank"
              rel="noreferrer"
            >
              {transactionHash}
            </a>
          </Text>
          {originatedContract && (
            <div>
              Wallet address:{' '}
              <Link to={`/multisig/${originatedContract}`}>
                {originatedContract}
              </Link>
            </div>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default Deployed;
