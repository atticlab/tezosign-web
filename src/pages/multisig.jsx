/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
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
  const { contractAddress, isContractInfoLoading } = useContractStateContext();
  const {
    setContractAddress,
    setIsContractInfoLoading,
    getContract,
  } = useContractDispatchContext();

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
  }, [contractAddress, history]);

  useEffect(() => {
    // eslint-disable-next-line no-return-await
    return () => {
      setContractAddress('');
      setIsContractInfoLoading(true);
    };
  }, []);

  return isContractInfoLoading ? (
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
    <OperationsProvider>
      <AssetsProvider>
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
            </NavTabs>

            <Tab.Content style={{ paddingTop: '20px' }}>
              <Tab.Pane eventKey="ops">
                <Operations />
              </Tab.Pane>
              <Tab.Pane eventKey="assets">
                <Assets />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </section>
      </AssetsProvider>
    </OperationsProvider>
  );
};

export default Multisig;
