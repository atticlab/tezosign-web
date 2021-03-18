import styled from 'styled-components';

const AppWrapper = styled.div`
  height: 100vh;
  min-height: 700px;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  flex: 1 0 auto;
  padding: 80px 0;
  background-color: ${({ theme }) => theme.whiteBlueish};
`;

AppWrapper.Content = Content;

export default AppWrapper;
