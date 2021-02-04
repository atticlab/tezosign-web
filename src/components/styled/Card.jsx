import styled from 'styled-components';

const Card = styled.div`
  border: ${({ theme: { border } }) => border};
  border-radius: 10px;
`;

Card.Header = styled.div`
  padding: 15px;
  border-radius: 10px;
`;

Card.Body = styled.div`
  padding: 15px;
`;

export default Card;
