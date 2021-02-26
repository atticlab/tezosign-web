import React, { useEffect } from 'react';
import { FlexCenter } from '../../styled/Flex';
import Card from '../../styled/Card';
import { TblGenInfo } from '../../styled/Tbl';
import Ellipsis from '../../styled/Ellipsis';
import NewAsset from './NewAsset';
import IdentIcon from '../../IdentIcon';
import Table from '../../Table';
import Spinner from '../../Spinner';
import BtnCopy from '../../BtnCopy';
import useAPI from '../../../hooks/useApi';
import useRequest from '../../../hooks/useRequest';
import { useContractStateContext } from '../../../store/contractContext';

const Assets = () => {
  // getAssetsRates
  const { getAssets } = useAPI();
  const { contractAddress } = useContractStateContext();
  const {
    request: getAssetsLocal,
    resp: assets,
    isLoading: isAssetsLoading,
  } = useRequest(getAssets, contractAddress);
  // const {
  //   request: getAssetsRatesLocal,
  //   resp: assetsRates,
  //   isLoading: isAssetsRatesLoading,
  // } = useRequest(getAssetsRates, contractAddress);

  useEffect(() => {
    (async () => {
      await getAssetsLocal();
      // await getAssetsRatesLocal();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cols = [
    { key: 'name', label: 'asset' },
    {
      key: 'address',
      label: 'contract',
      process(asset) {
        const assetContractAddress = asset[this.key];

        return (
          <FlexCenter>
            <div style={{ marginRight: '10px' }}>
              <IdentIcon address={assetContractAddress} />
            </div>
            <Ellipsis maxWidth="100px">{assetContractAddress}</Ellipsis>
            <BtnCopy
              textToCopy={assetContractAddress}
              style={{ paddingTop: 0, paddingBottom: 0 }}
            />
          </FlexCenter>
        );
      },
    },
    { key: 'contract_type', label: 'contract type' },
  ];
  return (
    <section>
      <TblGenInfo style={{ marginBottom: '20px', justifyContent: 'flex-end' }}>
        <TblGenInfo.Item style={{ margin: 0 }}>
          <NewAsset />
        </TblGenInfo.Item>
      </TblGenInfo>

      <Card style={{ overflow: 'hidden' }}>
        <Table
          cols={cols}
          rows={assets || []}
          rowKey="ticker"
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
