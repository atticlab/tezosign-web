import React, { useMemo } from 'react';
import { Badge } from 'react-bootstrap';
import styled from 'styled-components';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ContractActions from './ContractActions';
import IdentIcon from '../IdentIcon';
import BreakTxt from '../styled/BreakTxt';
// import BtnLink from '../styled/BtnLink';
import { Title, Text } from '../styled/Text';
import AccentText from '../styled/AccentText';
import BtnCopy from '../BtnCopy';
import { useContractStateContext } from '../../store/contractContext';
import { formatXTZ, convertMutezToXTZ } from '../../utils/helpers';

const SectionMultisigInfo = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 45px;

  @media (${({ theme }) => theme.lgDown}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const BadgeCustom = styled(Badge)`
  padding: 4px 20px;
  font-size: 20px;
  font-weight: 500;
`;

const ContractManagement = styled.div`
  display: flex;
  align-items: center;

  @media (${({ theme }) => theme.lgDown}) {
    margin-bottom: 25px;
  }

  @media (${({ theme }) => theme.mdDown}) {
    flex-direction: column;
    align-items: flex-start;

    div {
      margin-bottom: 20px;
    }
  }
`;

ContractManagement.Icon = styled.div`
  margin-right: 14px;
`;

ContractManagement.Address = styled.div`
  @media (${({ theme }) => theme.mdDown}) {
    margin: 10px 0 0;
  }
`;

const MultisigInfo = () => {
  const {
    contractAddress,
    isUserOwner,
    contractInfo,
  } = useContractStateContext();
  const userType = useMemo(() => {
    return isUserOwner ? 'Owner' : 'Viewer';
  }, [isUserOwner]);

  return (
    <SectionMultisigInfo>
      <ContractManagement>
        <ContractManagement.Icon>
          <IdentIcon address={contractAddress} scale={7.5} />
        </ContractManagement.Icon>

        <ContractManagement.Address>
          <Flex>
            <Title
              modifier="sm"
              style={{ lineHeight: '22px', marginBottom: '0' }}
            >
              <BreakTxt>{contractAddress}</BreakTxt>
            </Title>
            {/* <BtnLink */}
            {/*  variant="link" */}
            {/*  style={{ paddingLeft: '5px', paddingRight: '5px' }} */}
            {/* > */}
            {/*  <FontAwesomeIcon icon="pen" /> */}
            {/* </BtnLink> */}
            <BtnCopy
              textToCopy={contractAddress}
              style={{ paddingLeft: '5px', paddingRight: '5px' }}
            />
            {/* <BtnLink style={{ paddingLeft: '5px', paddingRight: '5px' }}> */}
            {/*  <FontAwesomeIcon icon="sign-out-alt" rotation={270} /> */}
            {/* </BtnLink> */}
          </Flex>

          <Flex style={{ flexWrap: 'wrap' }}>
            <BadgeCustom
              variant="outline-primary"
              style={{ marginRight: '20px' }}
            >
              {userType}
            </BadgeCustom>
            <Text style={{ marginBottom: 0 }}>
              Balance:{' '}
              <AccentText>
                {formatXTZ(convertMutezToXTZ(contractInfo?.balance))} XTZ
              </AccentText>
            </Text>
          </Flex>
        </ContractManagement.Address>
      </ContractManagement>

      {isUserOwner && <ContractActions />}
    </SectionMultisigInfo>
  );
};

export default MultisigInfo;
