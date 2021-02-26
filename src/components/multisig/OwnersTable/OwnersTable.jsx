import React from 'react';
import styled from 'styled-components';
import Table from '../../Table';
import Spinner from '../../Spinner';
import Card from '../../styled/Card';
import { useContractStateContext } from '../../../store/contractContext';
import BtnCopy from '../../BtnCopy';
import IndentIcon from '../../IdentIcon';

const TblGenInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

TblGenInfo.Item = styled.span`
  margin: 0 30px 20px;
  text-transform: capitalize;
  font-size: 16px;
`;

const FlexCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Ellipsis = styled.span`
  display: inline-block;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OwnersTable = () => {
  const { contractInfo, isContractInfoLoading } = useContractStateContext();
  const cols = [
    {
      key: 'address',
      label: 'Account',
      process(operation) {
        const adr = operation.address;

        return (
          <FlexCenter>
            <div style={{ marginRight: '5px' }}>
              <IndentIcon address={adr} scale={3} />
            </div>

            <Ellipsis style={{ maxWidth: '70px' }}>{adr}</Ellipsis>

            <BtnCopy
              textToCopy={adr}
              style={{ paddingTop: 0, paddingBottom: 0 }}
            />
          </FlexCenter>
        );
      },
    },
    {
      key: 'pub_key',
      label: 'Public key',
      process(operation) {
        const pubKey = operation.pub_key;

        return (
          <FlexCenter>
            <Ellipsis style={{ maxWidth: '70px' }}>{pubKey}</Ellipsis>

            <BtnCopy
              textToCopy={pubKey}
              style={{ paddingTop: 0, paddingBottom: 0 }}
            />
          </FlexCenter>
        );
      },
    },
  ];

  return (
    <section>
      <TblGenInfo>
        <TblGenInfo.Item>Total Owners:{contractInfo.threshold}</TblGenInfo.Item>
      </TblGenInfo>

      <Card style={{ overflow: 'hidden' }}>
        <Table
          cols={cols}
          rows={contractInfo.owners || []}
          rowKey="pub_key"
          maxHeight="600px"
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

export default OwnersTable;
