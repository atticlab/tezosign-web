import React, { useState, useEffect, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import PropTypes from 'prop-types';
import { createIcon } from '@download/blockies';

const ImgIcon = styled.img`
  display: inline-block;
  border-radius: 5px;
`;

const IdentIcon = ({ address, scale }) => {
  const theme = useContext(ThemeContext);
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    if (!address) {
      setIcon(
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      );
    } else {
      setIcon(
        createIcon({
          seed: address,
          color: theme.lightGreen,
          size: 8,
          scale,
        }).toDataURL(),
      );
    }
  }, [address, theme, scale]);

  return <ImgIcon src={icon} alt={address} />;
};

IdentIcon.propTypes = {
  address: PropTypes.string,
  scale: PropTypes.number,
};

IdentIcon.defaultProps = {
  address: '',
  scale: 4,
};

export default IdentIcon;
