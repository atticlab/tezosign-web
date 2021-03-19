import styled from 'styled-components';
import { Button, Modal } from 'react-bootstrap';

Modal.Header = styled(Modal.Header)`
  border-bottom: none;
`;

Modal.Body = styled(Modal.Body)`
  padding: 1rem 1rem 36px;
`;

Modal.Content = styled.div`
  max-width: 383px;
  margin: 0 auto;
`;

Modal.Close = styled(Button).attrs({ variant: 'link' })`
  color: ${({ theme }) => theme.gray};
  font-size: 24px;
  padding-top: 0;
  padding-bottom: 0;
  display: block;
  margin-left: auto;

  &:hover {
    color: ${({ theme }) => theme.red};
  }
`;

export default Modal;
