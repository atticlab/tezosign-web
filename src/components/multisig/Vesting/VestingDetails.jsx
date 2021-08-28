import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import styled from 'styled-components';
import { Bold } from '../../styled/Text';
import Spinner from '../../Spinner';
import VestingActions from './VestingActions';
import useAPI from '../../../hooks/useApi';
import useRequest from '../../../hooks/useRequest';
import { convertMutezToXTZ, toHHMMSS } from '../../../utils/helpers';
import { dateFormatNoTime } from '../../../utils/constants';
import IconTooltip from '../../IconTooltip';

dayjs.extend(utc);

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  text-align: left;
  border: ${({ theme }) => theme.border};
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
`;

const VestingDetails = ({ vesting, isRowCollapsed }) => {
  const { getVestingInfo } = useAPI();
  const {
    request: loadVestingInfo,
    resp: vestingInfo,
    isLoading: isVestingInfoLoading,
  } = useRequest(getVestingInfo);

  useEffect(() => {
    if (isRowCollapsed && !vestingInfo) {
      loadVestingInfo(vesting.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesting, isRowCollapsed]);

  return (
    <div>
      {isVestingInfoLoading ? (
        <Spinner />
      ) : (
        vestingInfo && (
          <>
            <Grid style={{ flexWrap: 'wrap' }}>
              <div>
                <Bold>Balance:</Bold>{' '}
                {`${convertMutezToXTZ(vestingInfo.balance)} XTZ`}
              </div>
              <div>
                <Bold>Delegate address:</Bold>
                <IconTooltip tooltipTxt="The baker that a vesting contract delegates its funds to." />{' '}
                {vestingInfo.delegate}
              </div>
              <div>
                <Bold>Withdrawal limit:</Bold>
                <IconTooltip tooltipTxt="The limit of XTZ available for a withdrawal." />{' '}
                {`${convertMutezToXTZ(vestingInfo.opened_balance)} XTZ`}
              </div>
              <div>
                <Bold>Delegate admin address:</Bold>
                <IconTooltip
                  tooltipTxt="The address that sets and changes the delegate/baker for a
                      vesting contract."
                />{' '}
                {vestingInfo.storage.delegate_admin}
              </div>
              <div>
                <Bold>Time per tick:</Bold>
                <IconTooltip
                  tooltipTxt="Time interval at which a portion of XTZ becomes unvested
                      and available for withdrawal."
                />{' '}
                {toHHMMSS(vestingInfo.storage.seconds_per_tick)}
              </div>
              <div>
                <Bold>Activation date:</Bold>
                <IconTooltip tooltipTxt="Vesting start date." />{' '}
                {dayjs
                  .unix(vestingInfo.storage.timestamp)
                  .utc()
                  .format(dateFormatNoTime)}
              </div>
              <div>
                <Bold>XTZ per tick:</Bold>
                <IconTooltip
                  tooltipTxt=" Amount to become unvested and the smallest unit that can
                      be withdrawn."
                />{' '}
                {`${convertMutezToXTZ(
                  vestingInfo.storage.tokens_per_tick,
                )} XTZ`}
              </div>
              <div>
                <Bold>Vested amount</Bold>{' '}
                {`${convertMutezToXTZ(vestingInfo.storage.vested_amount)} XTZ`}
              </div>
              <div>
                <Bold>Withdrawal address:</Bold>
                <IconTooltip tooltipTxt="The address to which the unvested XTZ is sent." />{' '}
                {vestingInfo.storage.vesting_address}
              </div>
            </Grid>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <VestingActions
                vestingAddress={vesting.address}
                vestingDelegateAdmin={vestingInfo.storage.delegate_admin}
                tokensPerTIck={vestingInfo.storage.tokens_per_tick}
              />
            </div>
          </>
        )
      )}
    </div>
  );
};

VestingDetails.propTypes = {
  vesting: PropTypes.objectOf(PropTypes.any).isRequired,
  isRowCollapsed: PropTypes.bool.isRequired,
};

export default VestingDetails;
