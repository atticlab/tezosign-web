import React from 'react';
import styled from 'styled-components';
import Card from '../styled/Card';
import { FlexCenter } from '../styled/Flex';
import { TextAccent, BreakTxt } from '../styled/Text';
import { TblGenInfo } from '../styled/Tbl';
import Table from '../Table';
import Spinner from '../Spinner';
import BtnCopy from '../BtnCopy';
import IndentIcon from '../IdentIcon';
import { useContractStateContext } from '../../store/contractContext';
import useThemeContext from '../../hooks/useThemeContext';

const BreakTxtAddress = styled(BreakTxt)`
  min-width: 200px;
  margin-right: 10px;
`;

const Owners = () => {
  const theme = useThemeContext();
  const { contractInfo, isContractInfoLoading } = useContractStateContext();
  const cols = [
    {
      key: 'address',
      label: 'Account',
      isSortable: true,
      process(operation) {
        const { address } = operation;

        return (
          <FlexCenter>
            <div style={{ marginRight: '10px' }}>
              <IndentIcon address={address} scale={4} />
            </div>

            <BreakTxtAddress>{address}</BreakTxtAddress>

            <BtnCopy textToCopy={address} style={{ padding: 0 }} />
          </FlexCenter>
        );
      },
    },
    {
      key: 'pub_key',
      label: 'Public key',
      isSortable: true,
      process(operation) {
        const pubKey = operation.pub_key;

        return (
          <FlexCenter>
            <BreakTxtAddress>{pubKey}</BreakTxtAddress>

            <BtnCopy textToCopy={pubKey} style={{ padding: 0 }} />
          </FlexCenter>
        );
      },
    },
  ];

  return (
    <section>
      <TblGenInfo>
        <TblGenInfo.Item style={{ marginTop: 0, textTransform: 'initial' }}>
          Total owners:{' '}
          <TextAccent color={theme.blue}>
            {contractInfo?.owners.length || 0}
          </TextAccent>
        </TblGenInfo.Item>
      </TblGenInfo>

      <Card style={{ overflow: 'hidden' }}>
        <Table
          cols={cols}
          rows={contractInfo?.owners || []}
          rowKey="pub_key"
          maxHeight="550px"
          stickyHeader
          isDataLoading={isContractInfoLoading}
        />

        {isContractInfoLoading && (
          <div style={{ textAlign: 'center' }}>
            <Spinner />
          </div>
        )}
      </Card>
    </section>
  );
};

export default Owners;
