import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Card from './styled/Card';
import Title from './styled/Title';
import IconGreen from './styled/IconGreen';
import Text from './styled/Text';

const CardMultisig = styled(Card)`
  padding: 22px 18px 36px;
  text-align: center;
  display: flex;
  flex-direction: column;
  flex: 0 0 44.5%;

  @media (${({ theme }) => theme.xlDown}) {
    flex: 0 0 49%;
  }

  @media (${({ theme }) => theme.lgDown}) {
    flex: 0 0 100%;
    &:not(:last-child) {
      margin-bottom: 15px;
    }
  }

  @media (${({ theme }) => theme.mdDown}) {
    max-width: 100%;
  }
`;

const Content = styled.div`
  flex: 1 0 auto;
`;

CardMultisig.Content = Content;

const CardMultisigType = ({ title, icon, text, children }) => (
  <CardMultisig>
    <CardMultisig.Content>
      <Title>{title}</Title>
      <div style={{ marginBottom: '20px' }}>
        <IconGreen icon={icon} size="4x" />
      </div>
      <Text>{text}</Text>
    </CardMultisig.Content>

    <div>{children}</div>
  </CardMultisig>
);

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
