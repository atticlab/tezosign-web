import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`

  body {
    padding: 0;
    margin: 0;
    font-family: Roboto, sans-serif;
    font-size: ${({ theme }) => theme.fs20};
    box-sizing: border-box;
    letter-spacing: 0.75px;
  }
  
  ::-moz-selection {
    background-color: #87f7c1;
  }
  ::selection {
    background-color: #87f7c1;
  }
  
  :focus {
    outline: rgba(38, 210, 129, 0.5) auto 1px;
  }
  
  button {
    letter-spacing: 0.75px;
  }
  
  .beacon-modal {
    &__wrapper {
      font-weight: 300;
    }
    
    &__content {
      button {
        outline: none;
        border: ${({ theme }) => `2px solid ${theme.lightGreen}`};
        transition: all 0.2s ease;

        &:hover {
          border-color: #0ed776;
        }

        &:focus {
          box-shadow: 0 0 0 0.2rem rgba(38, 210, 129, 0.5);
        }
      }

      .beacon-modal__button {
        background: ${({ theme }) => theme.lightGreen};

        &:hover {
          background: #0fe37d;
        }
      }

      .beacon-modal__button--outline {
        color: ${({ theme }) => theme.lightGreen};

        &:hover {
          color: #0ed776;
        }
      }
    }
  }
  
  .beacon-toast__base {
    display: flex;
    border: ${({ theme }) => theme.borderGrey};
    box-shadow: ${({ theme }) => theme.borderShadow};
    color: ${({ theme }) => theme.lightGreen};
    
    .beacon-toast__content p {
        margin-bottom: 0;
    }
    
    .spinner .loader {
      border-left-color: ${({ theme }) => theme.lightGreen};
    }
  }
`;
