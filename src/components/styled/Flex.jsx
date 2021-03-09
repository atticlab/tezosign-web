import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
`;

const FlexAlignItemsCenter = styled(Flex)`
  align-items: center;
`;

const FlexCenter = styled(FlexAlignItemsCenter)`
  justify-content: center;
`;

export { Flex, FlexAlignItemsCenter, FlexCenter };
