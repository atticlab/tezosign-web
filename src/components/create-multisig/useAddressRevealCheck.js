import useAPI from '../../hooks/useApi';
import { bs58Validation } from '../../utils/helpers';

const useAddressRevealCheck = () => {
  const { isAddressRevealed } = useAPI();
  const testIsAddressRevealed = async (val) => {
    if (!val || val.length !== 36 || !bs58Validation(val)) return false;
    const resp = await isAddressRevealed(val);
    return resp.data.revealed;
  };

  return {
    testIsAddressRevealed,
  };
};

export default useAddressRevealCheck;
