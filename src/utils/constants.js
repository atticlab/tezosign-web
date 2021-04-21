const XTZInMutez = 1000000;
const XTZFormat = '0,0.[000000]';
const dateFormat = 'YYYY/MM/DD HH:mm UTC';

const base58Prefixes = {
  edpk: {
    length: 32,
    prefix: Buffer.from(new Uint8Array([13, 15, 37, 217])),
  },
  sppk: {},
  p2pk: {},
};

const operationsTypesMap = {
  transfer: 'Transfer',
  income_transfer: 'Income transfer',
  fa_transfer: 'FA transfer',
  fa2_transfer: 'FA2 transfer',
  income_fa_transfer: 'Income FA transfer',
  delegation: 'Delegation',
  storage_update: 'Storage update',
  vesting_vest: 'Vesting withdrawal',
  vesting_set_delegate: 'Vesting delegation',
};

export {
  XTZInMutez,
  XTZFormat,
  dateFormat,
  base58Prefixes,
  operationsTypesMap,
};
