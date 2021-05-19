import useAPI from './useApi';
import { bs58Validation } from '../utils/helpers';

const useAddressRevealCheck = () => {
  const { isAddressRevealed } = useAPI();
  const testIsAddressRevealed = async (val) => {
    try {
      if (!val || val.length !== 36 || !bs58Validation(val)) return null;
      const resp = await isAddressRevealed(val);
      return resp.data.revealed;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return null;
    }
  };

  return {
    testIsAddressRevealed,
  };
};

export default useAddressRevealCheck;
