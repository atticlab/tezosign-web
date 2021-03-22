import React, { useMemo } from 'react';
import { Badge } from 'react-bootstrap';
import styled from 'styled-components';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ContractActions from './ContractActions';
import IdentIcon from '../IdentIcon';
// import BtnLink from '../styled/BtnLink';
import { Title, Text, TextAccent, BreakTxt } from '../styled/Text';
import BtnCopy from '../BtnCopy';
import { useContractStateContext } from '../../store/contractContext';
import useThemeContext from '../../hooks/useThemeContext';
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
  border: 0;
  background-color: ${({ theme }) => theme.green15};
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 400;
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
  const theme = useThemeContext();
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
            <Title style={{ lineHeight: '22px', marginBottom: '0' }} fw="300">
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
              <TextAccent color={theme.blue}>
                {formatXTZ(convertMutezToXTZ(contractInfo?.balance))} XTZ
              </TextAccent>
            </Text>
          </Flex>
        </ContractManagement.Address>
      </ContractManagement>

      {isUserOwner && <ContractActions />}
    </SectionMultisigInfo>
  );
};

export default MultisigInfo;
