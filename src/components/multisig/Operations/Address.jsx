import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import IdentIcon from '../../IdentIcon';
import BtnCopy from '../../BtnCopy';

const AddressStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Ellipsis = styled.span`
  display: inline-block;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Address = ({ address }) => (
  <AddressStyled>
    <div>
      <IdentIcon address={address} />
    </div>
    <Flex>
      <Ellipsis>{address}</Ellipsis>
      <BtnCopy textToCopy={address} style={{ padding: 0 }} />
    </Flex>
  </AddressStyled>
);

Address.propTypes = {
  address: PropTypes.string.isRequired,
};

export default Address;
