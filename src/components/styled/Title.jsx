import styled, { css } from 'styled-components';

const TitleStyles = css`
  font-size: 35px;
  font-weight: 300;
  color: ${({ theme }) => theme.black};
`;

const Title = styled.h1`
  ${TitleStyles}
  font-size: ${({ modifier }) =>
    // eslint-disable-next-line no-nested-ternary
    modifier === 'md'
      ? '25px'
      : // eslint-disable-next-line no-nested-ternary
      modifier === 'sm'
      ? '22px'
      : modifier === 'xs'
      ? '18px'
      : ''};
  font-weight: ${({ fw }) => fw || ''};
`;

export { TitleStyles };
export default Title;
