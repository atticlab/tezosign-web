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

const TextAccent = styled.span`
  color: ${({ color, theme }) => color || theme.green};
  font-weight: 700;
`;

const BreakTxt = styled.span`
  word-break: break-all;
`;
const Bold = styled.span`
  font-weight: 700;
`;

const Green = styled.span`
  color: ${({ theme }) => theme.green};
`;

const Red = styled.span`
  color: ${({ theme }) => theme.red};
`;

const TextLeft = styled.span`
  width: ${({ width }) => width || '120px'};
  text-align: left;
`;

const PreCode = styled.pre`
  color: #ff338d;
  max-height: 400px;
  overflow: auto;
`;

export {
  Title,
  TitleStyles,
  Text,
  TextAccent,
  BreakTxt,
  Bold,
  Green,
  Red,
  TextLeft,
  PreCode,
};
