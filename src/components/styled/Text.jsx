import styled from 'styled-components';

const Text = styled.p`
  color: ${({ theme }) => theme.black};
  font-weight: 300;
  font-size: ${({ modifier }) => (modifier === 'md' ? '18px' : '')};
`;

export default Text;
