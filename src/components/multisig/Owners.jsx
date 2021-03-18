import React from 'react';
import Card from '../styled/Card';
import { FlexCenter } from '../styled/Flex';
import { Ellipsis } from '../styled/Text';
import { TblGenInfo } from '../styled/Tbl';
import Table from '../Table';
import Spinner from '../Spinner';
import BtnCopy from '../BtnCopy';
import IndentIcon from '../IdentIcon';
import { useContractStateContext } from '../../store/contractContext';

const Owners = () => {
  const { contractInfo, isContractInfoLoading } = useContractStateContext();
  const cols = [
    {
      key: 'address',
      label: 'Account',
      process(operation) {
        const { address } = operation;

        return (
          <FlexCenter>
            <div style={{ marginRight: '5px' }}>
              <IndentIcon address={address} scale={4} />
            </div>

            <Ellipsis maxWidth="200px">{address}</Ellipsis>

            <BtnCopy
              textToCopy={address}
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
            <Ellipsis maxWidth="200px">{pubKey}</Ellipsis>

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
        <TblGenInfo.Item>
          Total Owners: {contractInfo?.threshold || 0}
        </TblGenInfo.Item>
      </TblGenInfo>

      <Card style={{ overflow: 'hidden' }}>
        <Table
          cols={cols}
          rows={contractInfo?.owners || []}
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

export default Owners;
