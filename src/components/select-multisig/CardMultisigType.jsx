import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Card from '../styled/Card';
import IconGreen from '../styled/IconGreen';
import { Title } from '../styled/Text';
import useThemeContext from '../../hooks/useThemeContext';

const cardHeaderHeight = '61px';

const CardMSigType = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

CardMSigType.Header = styled(Card.Header)`
  border-bottom: ${({ theme }) => `1px solid ${theme.lightGreen}`};
  border-radius: 0;
  text-align: center;
  min-height: ${cardHeaderHeight};
`;

CardMSigType.Body = styled(Card.Body)`
  display: flex;
  flex-direction: column;
  padding: 40px;
  flex: 1 0 calc(100% - ${cardHeaderHeight});

  @media (${({ theme }) => theme.smDown}) {
    padding: 15px;
  }
`;

CardMSigType.Footer = styled.div`
  margin-top: auto;
`;

CardMSigType.IconContainer = styled.div`
  margin-bottom: 60px;
  text-align: center;
`;

const CardMultisigType = ({ title, icon, text, children }) => {
  const theme = useThemeContext();

  return (
    <CardMSigType>
      <CardMSigType.Header>
        <Title color={theme.lightGreen} style={{ marginBottom: 0 }}>
          {title}
        </Title>
      </CardMSigType.Header>
      <CardMSigType.Body>
        <CardMSigType.IconContainer>
          <IconGreen icon={icon} size="4x" />
        </CardMSigType.IconContainer>
        <div>{text}</div>

        <CardMSigType.Footer>{children}</CardMSigType.Footer>
      </CardMSigType.Body>
    </CardMSigType>
  );
};

CardMultisigType.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  text: PropTypes.node.isRequired,
  children: PropTypes.node,
};
CardMultisigType.defaultProps = {
  children: '',
};

export default CardMultisigType;
