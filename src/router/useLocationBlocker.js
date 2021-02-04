import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function useLocationBlocker() {
  const history = useHistory();
  useEffect(() => {
    history.block(
      (location, action) =>
        action !== 'PUSH' ||
        // eslint-disable-next-line no-use-before-define
        getLocationId(location) !== getLocationId(history.location),
    );
  }, [history]);
}

function getLocationId({ pathname, search, hash }) {
  return pathname + (search ? `?${search}` : '') + (hash ? `#${hash}` : '');
}
