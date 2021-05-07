import React, { useEffect } from 'react';
import { FlexCenter } from '../../styled/Flex';
import Card from '../../styled/Card';
import { TblGenInfo } from '../../styled/Tbl';
import AddAsset from './AddAsset';
import IdentIcon from '../../IdentIcon';
import Table from '../../Table';
import Spinner from '../../Spinner';
import BtnCopy from '../../BtnCopy';
import ChangeAsset from './ChangeAsset';
import DeleteAsset from './DeleteAsset';
import {
  useAssetsDispatchContext,
  useAssetsStateContext,
} from '../../../store/assetsContext';
import { useContractStateContext } from '../../../store/contractContext';
import {
  convertAssetSubunitToAssetAmount,
  ellipsis,
} from '../../../utils/helpers';
import { TextLeft } from '../../styled/Text';

const Assets = () => {
  const { assets, isAssetsLoading } = useAssetsStateContext();
  const { getAssetsReq } = useAssetsDispatchContext();
  const { isUserOwner } = useContractStateContext();

  useEffect(() => {
    (async () => {
      await getAssetsReq();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cols = [
    { key: 'name', label: 'asset', isSortable: true },
    {
      key: 'address',
      label: 'contract',
      isSortable: true,
      process(asset) {
        const assetContractAddress = asset[this.key];

        return (
          <FlexCenter>
            <div style={{ marginRight: '10px' }}>
              <IdentIcon address={assetContractAddress} scale={4} />
            </div>
            <TextLeft>{ellipsis(assetContractAddress)}</TextLeft>
            <BtnCopy textToCopy={assetContractAddress} style={{ padding: 0 }} />
          </FlexCenter>
        );
      },
    },
    { key: 'contract_type', label: 'contract type', isSortable: true },
    { key: 'token_id', label: 'token ID' },
    {
      key: 'balances',
      label: 'Balance',
      isSortable: false,
      process({ balances, scale, ticker }) {
        return balances && balances.length
          ? `${convertAssetSubunitToAssetAmount(
              balances[0].balance,
              scale,
            )} ${ticker}`
          : '';
      },
    },
    {
      key: 'Actions',
      isSortable: false,
      process(asset) {
        return (
          !asset.is_global && (
            <div>
              <ChangeAsset asset={asset} />
              <DeleteAsset asset={asset} />
            </div>
          )
        );
      },
    },
  ];
  return (
    <section>
      <TblGenInfo style={{ marginBottom: '20px', justifyContent: 'flex-end' }}>
        <TblGenInfo.Item style={{ margin: 0 }}>
          {isUserOwner && <AddAsset />}
        </TblGenInfo.Item>
      </TblGenInfo>

      <Card style={{ overflow: 'hidden' }}>
        <Table
          cols={cols}
          rows={assets || []}
          rowKey="address"
          maxHeight="600px"
          stickyHeader
          isDataLoading={isAssetsLoading}
        />

        {isAssetsLoading && (
          <div style={{ textAlign: 'center' }}>
            <Spinner />
          </div>
        )}
      </Card>
    </section>
  );
};

export default Assets;
