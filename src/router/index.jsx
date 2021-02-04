import { React, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// eslint-disable-next-line react/prop-types
const Router = ({ children }) => (
  <BrowserRouter>
    <ScrollToTop />

    {children}
  </BrowserRouter>
);

export default Router;
