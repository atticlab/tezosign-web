import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
// import { Normalize } from 'styled-normalize';
import { Container } from 'react-bootstrap';
import GlobalStyles from '../styled/GlobalStyles';
import theme from '../../utils/theme';
import AppWrapper from './AppWrapper';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import Router from '../../router';
import Routes from '../../router/Routes';
import '../../assets/scss/index.scss';
import '../../plugins/faLibrary';
import { UserProvider, UserStateConsumer } from '../../store/userContext';
import { ContractProvider } from '../../store/contractContext';
import Toastr from '../styled/Toastr';
import Spinner from '../Spinner';

const SpinnerWrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const App = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {/* <Normalize /> */}

        <UserProvider>
          <UserStateConsumer>
            {(value) =>
              value.isRestoreLoading ? (
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
              ) : (
                <AppWrapper>
                  <AppHeader />
                  <AppWrapper.Content>
                    <Container>
                      <ContractProvider>
                        <Routes />
                      </ContractProvider>
                    </Container>
                  </AppWrapper.Content>
                  <AppFooter />
                </AppWrapper>
              )
            }
          </UserStateConsumer>
        </UserProvider>
        <Toastr
          position="top-right"
          autoClose={3000}
          hideProgressBar
          closeOnClick
          pauseOnHover={false}
          draggable={false}
        />
      </ThemeProvider>
    </Router>
  );
};

export default App;
