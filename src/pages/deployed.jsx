import React, { useEffect, useState } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { Text } from '../components/styled/Text';
import Card from '../components/styled/Card';
import Spinner from '../components/Spinner';
import BtnBack from '../components/BtnBack';
import useExplorerOperationLink from '../hooks/useExplorerOperationLink';
import useOriginationCheck from '../hooks/useOriginationCheck';

const Deployed = () => {
  const location = useLocation();
  const history = useHistory();
  const [transactionHash, setTransactionHash] = useState('');
  const { explorerOperationLink } = useExplorerOperationLink(transactionHash);
  const { originatedContract } = useOriginationCheck(transactionHash);

  useEffect(() => {
    if (!location.state) {
      history.replace('/not-found');
      return;
    }
    setTransactionHash(location.state.transactionHash);
  }, [history, location]);

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
            <a href={explorerOperationLink} target="_blank" rel="noreferrer">
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
