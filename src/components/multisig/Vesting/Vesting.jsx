import React from 'react';
import { TblGenInfo } from '../../styled/Tbl';
import Card from '../../styled/Card';
import NewVesting from './NewVesting';
import AddVesting from './AddVesting';
import Table from '../../Table';
import Spinner from '../../Spinner';
import { useContractStateContext } from '../../../store/contractContext';
import { FlexCenter } from '../../styled/Flex';
import IdentIcon from '../../IdentIcon';
import { Ellipsis } from '../../styled/Text';
import BtnCopy from '../../BtnCopy';
import ChangeVesting from './ChangeVesting';
import DeleteVesting from './DeleteVesting';

const Vesting = () => {
  const { isUserOwner } = useContractStateContext();
  const isVestingsLoading = false;
  const vestings = [
    {
      address: 'KT1JJbWfW8CHUY95hG9iq2CEMma1RiKhMHDR',
      name: 'Vesting 1',
      balance: 123300,
    },
    {
      address: 'KT1JiQhr9EXHL88U3hjJH6FkPv8wWdVYvwtg',
      name: 'Vesting 2',
      balance: 0,
    },
    {
      address: 'KT1UF15SCkdvqkS6QDA5kJZqov6VGUU6vwFJ',
      name: 'Vesting 3',
      balance: 0,
    },
  ];
  const cols = [
    {
      key: 'address',
      process(vesting) {
        const vestingAddress = vesting.address;

        return (
          <FlexCenter>
            <div style={{ marginRight: '10px' }}>
              <IdentIcon address={vestingAddress} scale={4} />
            </div>
            <Ellipsis maxWidth="100px">{vestingAddress}</Ellipsis>
            <BtnCopy
              textToCopy={vestingAddress}
              style={{ paddingTop: 0, paddingBottom: 0 }}
            />
          </FlexCenter>
        );
      },
    },
    { key: 'name' },
    { key: 'balance' },
    {
      key: 'Actions',
      process(vesting) {
        return (
          <div>
            <ChangeVesting vesting={vesting} />
            <DeleteVesting vesting={vesting} />
          </div>
        );
      },
    },
  ];

  return (
    <section>
      <TblGenInfo style={{ marginBottom: '20px', justifyContent: 'flex-end' }}>
        {isUserOwner && (
          <>
            <TblGenInfo.Item style={{ margin: '0 10px 0 0' }}>
              <AddVesting />
            </TblGenInfo.Item>
            <TblGenInfo.Item style={{ margin: 0 }}>
              <NewVesting />
            </TblGenInfo.Item>
          </>
        )}
      </TblGenInfo>

      <Card style={{ overflow: 'hidden' }}>
        <Table
          cols={cols}
          rows={vestings || []}
          rowKey="address"
          maxHeight="600px"
          stickyHeader
          isDataLoading={isVestingsLoading}
        />

        {isVestingsLoading && (
          <div style={{ textAlign: 'center' }}>
            <Spinner />
          </div>
        )}
      </Card>
    </section>
  );
};

export default Vesting;
