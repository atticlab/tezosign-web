import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import styled from 'styled-components';
import { FlexJustifyBetween, FlexAlignItemsCenter } from '../../../styled/Flex';
import { Red, Green, Bold } from '../../../styled/Text';
import BtnCopy from '../../../BtnCopy';
import { useContractStateContext } from '../../../../store/contractContext';
import { getAddressFromPubKey } from '../../../../utils/helpers';

const Change = styled.ol`
  padding-left: 30px;
  word-break: break-all;
`;

Change.Item = styled.li`
  padding: 5px;
`;

const ContractChanges = ({ newKeys, newThreshold, oldKeys, oldThreshold }) => {
  const {
    contractInfo: { owners, threshold },
  } = useContractStateContext();

  const prevOwners = useMemo(
    () =>
      oldKeys.length
        ? oldKeys.map((key) => ({
            address: getAddressFromPubKey(key),
            pub_key: key,
          }))
        : owners,
    [oldKeys, owners],
  );
  const prevThreshold = oldThreshold ?? threshold;

  return (
    <div>
      <Bold>Contract changes</Bold>
      <FlexJustifyBetween style={{ marginLeft: '10px' }}>
        <div>
          <Bold>Current:</Bold>
          <div style={{ marginLeft: '10px' }}>
            <Bold>Owners:</Bold>
            <Change old>
              {prevOwners &&
                prevOwners.length &&
                prevOwners.map((owner) => (
                  <Change.Item key={owner.address}>
                    <OverlayTrigger
                      overlay={<Tooltip>Public key: {owner.pub_key}</Tooltip>}
                    >
                      <FlexAlignItemsCenter style={{ display: 'flex' }}>
                        <Red>{owner.address}</Red>
                        <BtnCopy textToCopy={owner.address} />
                      </FlexAlignItemsCenter>
                    </OverlayTrigger>
                  </Change.Item>
                ))}
            </Change>
          </div>
          <div style={{ marginLeft: '10px' }}>
            <Bold>Threshold:</Bold>
            <Change old>
              <Change.Item>
                <Red>{prevThreshold}</Red>
              </Change.Item>
            </Change>
          </div>
        </div>

        <div>
          <Bold>New:</Bold>
          <div style={{ marginLeft: '10px' }}>
            <Bold>Owners:</Bold>
            <Change old={false}>
              {newKeys &&
                newKeys.length &&
                newKeys.map((key) => (
                  <Change.Item key={key}>
                    <OverlayTrigger
                      overlay={<Tooltip>Public key: {key}</Tooltip>}
                    >
                      <FlexAlignItemsCenter style={{ display: 'flex' }}>
                        {(() => {
                          const address = getAddressFromPubKey(key);
                          return (
                            <>
                              <Green>{address}</Green>
                              <BtnCopy textToCopy={address} />
                            </>
                          );
                        })()}
                      </FlexAlignItemsCenter>
                    </OverlayTrigger>
                  </Change.Item>
                ))}
            </Change>
          </div>
          <div style={{ marginLeft: '10px' }}>
            <Bold>Threshold:</Bold>
            <Change old={false}>
              <Change.Item>
                <Green>{newThreshold}</Green>
              </Change.Item>
            </Change>
          </div>
        </div>
      </FlexJustifyBetween>
    </div>
  );
};

ContractChanges.propTypes = {
  newKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  newThreshold: PropTypes.number.isRequired,
  oldKeys: PropTypes.arrayOf(PropTypes.string),
  oldThreshold: PropTypes.number,
};
ContractChanges.defaultProps = {
  oldKeys: [],
  oldThreshold: null,
};

export default ContractChanges;
