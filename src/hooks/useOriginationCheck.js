import { useEffect, useState } from 'react';
import useAPI from './useApi';

const useOriginationCheck = (transactionHash) => {
  const [originatedContract, setOriginatedContract] = useState('');
  const { getOriginatedContract } = useAPI();

  useEffect(() => {
    if (!transactionHash) return null;

    const interval = setInterval(async () => {
      try {
        const resp = await getOriginatedContract(transactionHash);
        if (resp.data.contract) {
          setOriginatedContract(resp.data.contract);
          clearInterval(interval);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }, 7000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionHash]);

  return {
    originatedContract,
    setOriginatedContract,
  };
};

export default useOriginationCheck;
