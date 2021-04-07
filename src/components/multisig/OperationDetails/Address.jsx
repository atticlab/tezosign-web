import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FlexCenter } from '../../styled/Flex';
import IdentIcon from '../../IdentIcon';
import BtnCopy from '../../BtnCopy';
import { ellipsis } from '../../../utils/helpers';
import { TextLeft } from '../../styled/Text';

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
    <FlexCenter>
      <TextLeft style={{ fontSize: '14px' }}>{ellipsis(address)}</TextLeft>
      <BtnCopy
        textToCopy={address}
        style={{ padding: 0, paddingLeft: '10px' }}
      />
    </FlexCenter>
  </AddressStyled>
);

Address.propTypes = {
  address: PropTypes.string.isRequired,
};

export default Address;
