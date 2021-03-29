import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Tab, Nav } from 'react-bootstrap';
import BtnBack from '../components/BtnBack';
import MultisigInfo from '../components/multisig/MultisigInfo';
import Operations from '../components/multisig/Operations';
import Assets from '../components/multisig/Assets';
import Owners from '../components/multisig/Owners';
import Vesting from '../components/multisig/Vesting';
import Spinner from '../components/Spinner';
import { bs58Validation } from '../utils/helpers';
import {
  useContractStateContext,
  useContractDispatchContext,
} from '../store/contractContext';
import { OperationsProvider } from '../store/operationsContext';
import { AssetsProvider } from '../store/assetsContext';
import { VestingsProvider } from '../store/vestingsContext';

const NavTabs = styled(Nav).attrs({ variant: 'pills' })`
  .nav-item {
    &:not(:last-child) {
      margin-right: 20px;

      @media (${({ theme }) => theme.lgDown}) {
        margin-right: 10px;
      }
    }
  }

  .nav-link {
    background-color: white;
    border-radius: ${({ theme }) => theme.borderRadiusDefault};
    transition: background-color 0.15s;
    color: ${({ theme }) => theme.green};
    font-size: 16px;

    &:hover {
      background-color: ${({ theme }) => theme.lightGray};
    }

    &.active {
      background-color: ${({ theme }) => theme.gray};

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
    contractError,
  } = useContractStateContext();
  const {
    setContractAddress,
    setIsContractInfoLoading,
    getContract,
    setContractError,
  } = useContractDispatchContext();

  useEffect(() => {
    if (contractError) {
      const { error, value } = contractError.response.data;

      if (`${error}:${value}` === 'ERR_NOT_FOUND:contract') {
        history.push('/not-found');
      }
    }
  }, [contractError, history]);

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
      setContractError(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AssetsProvider>
      <OperationsProvider>
        <VestingsProvider>
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
                      <NavTabs.Link eventKey="ops">Operations</NavTabs.Link>
                    </NavTabs.Item>

                    <NavTabs.Item>
                      <NavTabs.Link eventKey="assets">Assets</NavTabs.Link>
                    </NavTabs.Item>

                    <NavTabs.Item>
                      <NavTabs.Link eventKey="owners">Owners</NavTabs.Link>
                    </NavTabs.Item>

                    <NavTabs.Item>
                      <NavTabs.Link eventKey="vesting">Vesting</NavTabs.Link>
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
                    <Tab.Pane eventKey="vesting">
                      <Vesting />
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </section>
            </>
          )}
        </VestingsProvider>
      </OperationsProvider>
    </AssetsProvider>
  );
};

export default Multisig;
