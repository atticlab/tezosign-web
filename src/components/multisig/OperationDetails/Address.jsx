import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Ellipsis } from '../../styled/Text';
import { FlexCenter } from '../../styled/Flex';
import IdentIcon from '../../IdentIcon';
import BtnCopy from '../../BtnCopy';

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
      <Ellipsis style={{ fontSize: '14px' }}>{address}</Ellipsis>
      <BtnCopy textToCopy={address} style={{ padding: 0 }} />
    </FlexCenter>
  </AddressStyled>
);

Address.propTypes = {
  address: PropTypes.string.isRequired,
};

export default Address;
