import styled from 'styled-components';

const InfoBox = styled.div`
  display: flex;
  border: ${({ theme }) => theme.border};
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
`;

InfoBox.Item = styled.div`
  text-align: left;

  &:not(:last-child) {
    margin-right: 30px;
  }
`;

export default InfoBox;
