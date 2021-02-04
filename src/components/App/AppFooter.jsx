import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';

const TheFooter = styled.footer`
  ${({ theme: { border, borderShadowTop, smDown } }) => css`
    border-top: ${border};
    box-shadow: ${borderShadowTop};
    padding: 12px 46px;
    font-size: 16px;
    font-weight: 300;

    @media (${smDown}) {
      padding: 15px;
    }
  `}
`;

const AppFooter = () => {
  const currentYear = useMemo(() => {
    return new Date().getFullYear();
  }, []);

  return (
    <TheFooter>
      <div>
        © {currentYear}{' '}
        <a href="https://atticlab.net" target="_blank" rel="noreferrer">
          Attic Lab
        </a>{' '}
        |{' '}
        <a
          href="https://github.com/atticlab/tezosign"
          target="_blank"
          rel="noreferrer"
        >
          Back-end repo
        </a>{' '}
        |{' '}
        <a
          href="https://github.com/atticlab/tezosign-web"
          target="_blank"
          rel="noreferrer"
        >
          Front-end repo
        </a>
        {/* {' '} |  <a href="https://atticlab.net/">Terms</a> |{' '} */}
        {/* <a href="https://atticlab.net/">Licences</a> |{' '} */}
        {/* <a href="https://atticlab.net/">Github</a> |{' '} */}
        {/* <a href="https://atticlab.net/">Cookie Policy</a> | Version 0.0.1 */}
      </div>
    </TheFooter>
  );
};

export default AppFooter;
