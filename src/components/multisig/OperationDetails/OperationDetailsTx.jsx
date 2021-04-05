import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tbl } from '../../styled/Tbl';
import { useAssetsStateContext } from '../../../store/assetsContext';
import { Ellipsis } from '../../styled/Text';
import BtnCopy from '../../BtnCopy';
import IndentIcon from '../../IdentIcon';
import { FlexAlignItemsCenter } from '../../styled/Flex';

const OperationGeneralInfo = styled.div`
  display: flex;
  border: ${({ theme }) => theme.border};
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
  margin-top: 10px;
`;

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

// const transferList = [
//   {
//     from: 'tz1TamtKM6SwTqdP1wPCGCqndnCiKcSxaQBg',
//     txs: [
//       { to: 'KT1Xa7F5FY5eSiBAYgvgW9S1tu7kMnACAg6W', amount: 500 },
//       { to: 'KT1Xa7F5FY5eSiBAYgvgW9S1tu7kMnACAg6eR', amount: 300 },
//     ],
//   },
//   {
//     from: 'tz1TamtKM6SwTqdP1wPCGCqndnCiKcSxaEwq',
//     txs: [
//       { to: 'KT1Xa7F5FY5eSiBAYgvgW9S1tu7kMnACAgEr', amount: 30 },
//       { to: 'KT1Xa7F5FY5eSiBAYgvgW9S1tu7kMnACAgOh', amount: 50 },
//     ],
//   },
// ];

const OperationDetailsTx = ({ operation }) => {
  const { assets } = useAssetsStateContext();

  const transferList = operation.operation_info.transfer_list.reduce(
    (list, transferItem) => {
      const txs = transferItem.txs.map((txsItem) => ({
        from: transferItem.from,
        to: txsItem.to,
        amount: txsItem.amount,
      }));

      list.push(...txs);
      return list;
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
            <Ellipsis>{from}</Ellipsis>
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
            <Ellipsis>{to}</Ellipsis>
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
          currAsset?.scale ? amount / (10 ** currAsset?.scale || 1) : amount
        } ${currAsset?.ticker || '???'}`;
      },
    },
  ];

  return (
    <OperationGeneralInfo>
      <Tbl style={{ textAlign: 'left' }} responsive>
        <thead>
          <tr>
            {cols.map((col) => (
              <Th key={col.key}>{col.label ? col.label : col.key}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transferList.map((txs) => (
            <tr key={txs.to}>
              {cols.map((col) => (
                <Td key={col.key}>
                  {col.process ? col.process(txs, operation) : txs[col.key]}
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Tbl>
    </OperationGeneralInfo>
  );
};

OperationDetailsTx.propTypes = {
  operation: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default OperationDetailsTx;
