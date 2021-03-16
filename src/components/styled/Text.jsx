import styled from 'styled-components';

const Text = styled.p`
  color: ${({ theme }) => theme.black};
  font-weight: ${({ fw }) => fw || 300};
  font-size: ${({ modifier }) =>
    // eslint-disable-next-line no-nested-ternary
    modifier === 'md' ? '18px' : modifier === 'sm' ? '16px' : ''};
`;

const Green = styled.span`
  color: ${({ theme }) => theme.lightGreen};
`;

const Red = styled.span`
  color: ${({ theme }) => theme.red};
`;

export { Text, Green, Red };
