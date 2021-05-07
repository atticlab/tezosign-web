import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tbl } from '../../../styled/Tbl';
import { FlexAlignItemsCenter } from '../../../styled/Flex';
import InfoBox from '../../../styled/InfoBox';
import BtnCopy from '../../../BtnCopy';
import IndentIcon from '../../../IdentIcon';
import { useAssetsStateContext } from '../../../../store/assetsContext';
import {
  convertAssetSubunitToAssetAmount,
  ellipsis,
} from '../../../../utils/helpers';

const Th = styled.th`
  border: none !important;
  padding: 0.5rem !important;
`;
const Td = styled.td`
  border: none !important;
  padding: 0.5rem !important;
  vertical-align: middle !important;

  &:first-child {
    width: 40%;
  }
  &:last-child {
    width: 15%;
  }
`;

const IconWrapper = styled.div`
  margin-right: 5px;
`;

const OperationTransfersList = ({ operation }) => {
  const { assets } = useAssetsStateContext();

  const transferList = operation.operation_info.transfer_list.reduce(
    (agg, transferItem) => {
      const txs = transferItem.txs.map((txsItem) => ({
        from: transferItem.from,
        to: txsItem.to,
        amount: txsItem.amount,
      }));

      agg.push(...txs);
      return agg;
    },
    [],
  );

  const cols = [
    {
      key: 'from',
      label: 'From',
      process(txs) {
        const from = txs[this.key];

        if (!from) return '';

        return (
          <FlexAlignItemsCenter>
            <IconWrapper>
              <IndentIcon address={from} scale={3} />
            </IconWrapper>
            <span>{ellipsis(from)}</span>
            <BtnCopy
              textToCopy={from}
              style={{ paddingTop: 0, paddingBottom: 0 }}
            />
          </FlexAlignItemsCenter>
        );
      },
    },
    {
      key: 'to',
      label: 'To',
      process(txs) {
        const to = txs[this.key];

        return (
          <FlexAlignItemsCenter>
            <IconWrapper>
              <IndentIcon address={to} scale={3} />
            </IconWrapper>
            <span>{ellipsis(to)}</span>
            <BtnCopy
              textToCopy={to}
              style={{ paddingTop: 0, paddingBottom: 0 }}
            />
          </FlexAlignItemsCenter>
        );
      },
    },
    {
      key: 'amount',
      label: 'Amount',
      process(txs, opr) {
        const {
          operation_info: { asset_id: assetId },
        } = opr;
        const { amount } = txs;
        const currAsset = assets?.find((asset) => {
          return asset.address === assetId;
        });

        return `${
          currAsset?.scale
            ? convertAssetSubunitToAssetAmount(amount, currAsset.scale)
            : amount
        } ${currAsset?.ticker || '???'}`;
      },
    },
  ];

  return (
    <InfoBox style={{ padding: 0 }}>
      <Tbl style={{ textAlign: 'left' }} responsive>
        <thead>
          <tr>
            {cols.map((col) => (
              <Th key={col.key}>{col.label ? col.label : col.key}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transferList.map((txs, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={index}>
              {cols.map((col) => (
                <Td key={col.key}>
                  {col.process ? col.process(txs, operation) : txs[col.key]}
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Tbl>
    </InfoBox>
  );
};

OperationTransfersList.propTypes = {
  operation: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default OperationTransfersList;
