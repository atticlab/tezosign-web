import styled from 'styled-components';
import { Form as BForm } from 'react-bootstrap';

const FormLabel = styled(BForm.Label)`
  font-size: 18px;
`;

const FormSubmit = styled.div`
  text-align: center;
  margin-top: 120px;
`;

export { FormLabel, FormSubmit };
