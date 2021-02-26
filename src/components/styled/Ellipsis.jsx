import styled from 'styled-components';

const Ellipsis = styled.span`
  display: inline-block;
  max-width: ${({ maxWidth }) => maxWidth || '100px'};
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default Ellipsis;
