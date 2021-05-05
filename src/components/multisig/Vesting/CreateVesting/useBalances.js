import { useEffect, useMemo } from 'react';
import {
  convertMutezToXTZ,
  calcMaxAllowedBalance,
} from '../../../../utils/helpers';
import {
  useUserDispatchContext,
  useUserStateContext,
} from '../../../../store/userContext';

const useBalances = (currentTokensPerTick) => {
  const { balance: balanceRaw, address } = useUserStateContext();
  const { getBalance } = useUserDispatchContext();

  useEffect(() => {
    getBalance(address);
  }, [getBalance, address]);

  const balanceInXTZ = useMemo(() => {
    if (!balanceRaw) return 0;
    return convertMutezToXTZ(balanceRaw?.balance);
  }, [balanceRaw]);

  const balanceConverted = useMemo(() => {
    const bal = balanceRaw?.balance;
    if (!currentTokensPerTick || currentTokensPerTick > bal) {
      return balanceInXTZ;
    }

    return convertMutezToXTZ(calcMaxAllowedBalance(bal, currentTokensPerTick));
  }, [balanceRaw, currentTokensPerTick, balanceInXTZ]);

  return {
    balanceInXTZ,
    balanceConverted,
  };
};

export default useBalances;
