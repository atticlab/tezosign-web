import styled from 'styled-components';
import { Button } from 'react-bootstrap';

const BtnMax = styled(Button).attrs({ variant: 'link' })`
  padding: 0;
  margin-right: 5px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.blue};

  &:hover,
  &:focus {
    text-decoration: none;
    color: #249ac2;
  }
`;

export default BtnMax;
