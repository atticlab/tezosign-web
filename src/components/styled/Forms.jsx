import styled from 'styled-components';
import { Form as BForm } from 'react-bootstrap';

const FormLabel = styled(BForm.Label)`
  margin-bottom: 0.2rem;
`;

const FormSubmit = styled.div`
  text-align: right;
  margin-top: 40px;
`;

export { FormLabel, FormSubmit };
