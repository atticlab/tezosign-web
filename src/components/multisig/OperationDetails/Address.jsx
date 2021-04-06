import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import { Ellipsis } from '../../styled/Text';
import { FlexBetweenAndCenter } from '../../styled/Flex';
import IdentIcon from '../../IdentIcon';
import BtnCopy from '../../BtnCopy';
import { ellipsis } from '../../../utils/helpers';

const AddressStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Address = ({ address }) => (
  <AddressStyled>
    <div>
      <IdentIcon address={address} />
    </div>
    <FlexBetweenAndCenter>
      <span style={{ fontSize: '14px' }}>{ellipsis(address)}</span>
      <BtnCopy
        textToCopy={address}
        style={{ padding: 0, paddingLeft: '10px' }}
      />
    </FlexBetweenAndCenter>
  </AddressStyled>
);

Address.propTypes = {
  address: PropTypes.string.isRequired,
};

export default Address;
