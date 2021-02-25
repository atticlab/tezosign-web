import { useState } from 'react';
import { handleError } from '../utils/errorsHandler';

const useRequest = (
  requestFunc,
  options,
  defaultLoadingState = false,
  defaultDataState = null,
) => {
  const [isLoading, setIsLoading] = useState(defaultLoadingState);
  const [resp, setResp] = useState(defaultDataState);
  const [err, setErr] = useState(null);

  const request = async (opts = options) => {
    try {
      setIsLoading(true);
      const data = await requestFunc(opts);
      setResp(() => data.data);
    } catch (e) {
      handleError(e);
      setErr(e);
    } finally {
      setIsLoading(false);
    }
  };

  return { request, isLoading, resp, setResp, err, setIsLoading };
};

export default useRequest;
