import React, { useEffect } from 'react';
import { TblGenInfo } from '../../styled/Tbl';
import Card from '../../styled/Card';
import { FlexCenter } from '../../styled/Flex';
import { Ellipsis } from '../../styled/Text';
import NewVesting from './NewVesting';
import AddVesting from './AddVesting';
import Table from '../../Table';
import Spinner from '../../Spinner';
import BtnCopy from '../../BtnCopy';
import IdentIcon from '../../IdentIcon';
import ChangeVesting from './ChangeVesting';
import DeleteVesting from './DeleteVesting';
import { useContractStateContext } from '../../../store/contractContext';
import {
  useVestingsDispatchContext,
  useVestingsStateContext,
} from '../../../store/vestingsContext';

const Vesting = () => {
  const { isUserOwner } = useContractStateContext();
  const { vestings, isVestingsLoading } = useVestingsStateContext();
  const { getVestingsReq } = useVestingsDispatchContext();

  useEffect(() => {
    (async () => {
      await getVestingsReq();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          isCollapsible
          collapseContent={(vesting) => {
            return <div style={{ height: '200px' }}>{vesting.name}</div>;
          }}
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
