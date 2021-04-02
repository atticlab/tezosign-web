import styled from 'styled-components';
import { Button } from 'react-bootstrap';

const BtnIcon = styled(Button).attrs({ variant: 'link' })`
  color: ${({ theme }) => theme.gray};
  &:hover {
    color: ${({ hoverColor, theme }) => hoverColor || theme.green};
  }
`;

export default BtnIcon;
