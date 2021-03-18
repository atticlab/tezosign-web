import styled, { css } from 'styled-components';

const TitleStyles = css`
  color: ${({ theme, color }) => color || theme.black};
  font-size: ${({ theme, fs }) => fs || theme.fs20};
  font-weight: ${({ fw }) => fw || 500};
`;

const Title = styled.h1`
  ${TitleStyles};
`;

const Text = styled.p`
  color: ${({ theme }) => theme.black};
  font-weight: ${({ fw }) => fw || 400};
  font-size: ${({ fs, theme }) => fs || theme.fs16};
`;

const Ellipsis = styled.span`
  display: inline-block;
  max-width: ${({ maxWidth }) => maxWidth || '100px'};
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Bold = styled.span`
  font-weight: 700;
`;

const Green = styled.span`
  color: ${({ theme }) => theme.lightGreen};
`;

const Red = styled.span`
  color: ${({ theme }) => theme.red};
`;

export { Title, TitleStyles, Text, Ellipsis, Bold, Green, Red };
