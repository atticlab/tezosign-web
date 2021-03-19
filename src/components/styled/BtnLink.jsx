import styled from 'styled-components';
import { Button } from 'react-bootstrap';

const BtnLink = styled(Button).attrs({
  variant: 'link',
})`
  color: ${({ theme }) => theme.gray};
  &:hover {
    color: ${({ theme }) => theme.green};
  }
`;

export default BtnLink;
