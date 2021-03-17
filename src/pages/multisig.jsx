import React, { useEffect } from 'react';
import Helmet from 'react-helmet';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Tab, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BtnBack from '../components/BtnBack';
import MultisigInfo from '../components/multisig/MultisigInfo';
import Operations from '../components/multisig/Operations';
import Assets from '../components/multisig/Assets';
import Spinner from '../components/Spinner';
import { bs58Validation } from '../utils/helpers';
import {
  useContractStateContext,
  useContractDispatchContext,
} from '../store/contractContext';
import { OperationsProvider } from '../store/operationsContext';
import { AssetsProvider } from '../store/assetsContext';
import Owners from '../components/multisig/Owners';
import { availableCodes } from '../utils/errorsHandler';

const NavTabs = styled(Nav).attrs({ variant: 'pills' })`
  border-bottom: ${({ theme }) => theme.borderGrey};
  padding-bottom: 8px;

  .nav-item {
    &:not(:last-child) {
      margin-right: 64px;

      @media (${({ theme }) => theme.lgDown}) {
        margin-right: 10px;
      }
    }
  }

  .nav-link {
    border-radius: 16px;
    transition: color 0.15s;
    color: ${({ theme }) => theme.lightGray2};
    font-size: 16px;
    font-weight: 500;

    &:hover {
      color: ${({ theme }) => theme.lightGreen};
    }

    &.active {
      &:hover {
        color: white;
      }
    }
  }
`;

const Multisig = () => {
  const history = useHistory();
  const { address } = useParams();
  const {
    contractAddress,
    isContractInfoLoading,
    errorContract,
  } = useContractStateContext();
  const {
    setContractAddress,
    setIsContractInfoLoading,
    getContract,
    setErrorContract,
  } = useContractDispatchContext();

  useEffect(() => {
    if (!errorContract) return errorContract;

    if (
      availableCodes.includes(
        `${errorContract.response.data.error}:${errorContract.response.data.value}`,
      )
    ) {
      history.push('/not-found');
      setErrorContract(null);
    }

    return errorContract;
  }, [errorContract, history, setErrorContract]);

  useEffect(() => {
    setContractAddress(address);
  }, [address, setContractAddress]);

  useEffect(() => {
    if (
      contractAddress &&
      (!bs58Validation(contractAddress) ||
        contractAddress.length !== 36 ||
        contractAddress.substr(0, 3) !== 'KT1')
    ) {
      history.replace('/not-found');
    } else if (contractAddress) {
      getContract();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractAddress, history]);

  useEffect(() => {
    return () => {
      setContractAddress('');
      setIsContractInfoLoading(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AssetsProvider>
      <OperationsProvider>
        <Helmet>
          <title>
            TzSign - create & manage your XTZ transactions, delegations.
          </title>
          <meta
            name="description"
            content="TzSign - manage collectively a multisig XTZ wallet with your collaborators using an easy-to-use UI. Create, manage transactions & delegations just with a click!"
          />
          <meta
            itemProp="name"
            content="TzSign - create & manage your XTZ transactions, delegations."
          />
          <meta
            itemProp="description"
            content="TzSign - manage collectively a multisig XTZ wallet with your collaborators using an easy-to-use UI. Create, manage transactions & delegations just with a click!"
          />
          <meta
            property="og:title"
            content="TzSign - create & manage your XTZ transactions, delegations."
          />
          <meta
            property="og:description"
            content="TzSign - manage collectively a multisig XTZ wallet with your collaborators using an easy-to-use UI. Create, manage transactions & delegations just with a click!"
          />
          <meta
            name="twitter:title"
            content="TzSign - create & manage your XTZ transactions, delegations."
          />
          <meta
            name="twitter:description"
            content="TzSign - manage collectively a multisig XTZ wallet with your collaborators using an easy-to-use UI. Create, manage transactions & delegations just with a click!"
          />
          <meta
            name="keywords"
            content="manage Tezos wallet, manage XTZ wallet, Tezos multisig transaction, XTZ multisig transaction, Tezos multisig delegation, XTZ multisig delegation"
          />
        </Helmet>

        {isContractInfoLoading ? (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spinner />
          </div>
        ) : (
          <>
            <BtnBack pageName="Manage Multisig" />

            <MultisigInfo />

            <section>
              <Tab.Container defaultActiveKey="ops">
                <NavTabs>
                  <NavTabs.Item>
                    <NavTabs.Link eventKey="ops">
                      <FontAwesomeIcon
                        icon="layer-group"
                        style={{ marginRight: '5px' }}
                      />
                      OPERATIONS
                    </NavTabs.Link>
                  </NavTabs.Item>

                  <NavTabs.Item>
                    <NavTabs.Link eventKey="assets">
                      <FontAwesomeIcon
                        icon="dollar-sign"
                        style={{ marginRight: '5px' }}
                      />
                      ASSETS
                    </NavTabs.Link>
                  </NavTabs.Item>

                  <NavTabs.Item>
                    <NavTabs.Link eventKey="owners">
                      <FontAwesomeIcon
                        icon="key"
                        style={{ marginRight: '5px' }}
                      />
                      OWNERS
                    </NavTabs.Link>
                  </NavTabs.Item>
                </NavTabs>

                <Tab.Content style={{ paddingTop: '20px' }}>
                  <Tab.Pane eventKey="assets">
                    <Assets />
                  </Tab.Pane>
                  <Tab.Pane eventKey="ops">
                    <Operations />
                  </Tab.Pane>
                  <Tab.Pane eventKey="owners">
                    <Owners />
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </section>
          </>
        )}
      </OperationsProvider>
    </AssetsProvider>
  );
};

export default Multisig;
