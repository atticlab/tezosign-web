import styled from 'styled-components';
import { Button } from 'react-bootstrap';

const BtnLink = styled(Button).attrs({
  variant: 'link',
})`
  color: ${({ theme }) => theme.lightGray2};
  &:hover {
    color: ${({ theme }) => theme.lightGreen};
  }
`;

export default BtnLink;
