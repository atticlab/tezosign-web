import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

const useThemeContext = () => {
  return useContext(ThemeContext);
};

export default useThemeContext;
