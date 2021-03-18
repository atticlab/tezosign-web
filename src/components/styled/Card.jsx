import styled from 'styled-components';

const Card = styled.div`
  background-color: ${({ theme }) => theme.lightGray4};
  border-radius: 10px;
`;

Card.Header = styled.div`
  padding: ${({ padding }) => padding || '15px'};
  border-radius: 10px;
`;

Card.Body = styled.div`
  padding: ${({ padding }) => padding || '15px'};
`;

export default Card;
