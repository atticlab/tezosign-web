const XTZInMutez = 1000000;
const XTZFormat = '0,0.[000000]';
const dateFormat = 'YYYY/MM/DD HH:mm UTC';
const dateFormatNoTime = dateFormat.split(' ')[0];
const secondsInHour = 3600;
const secondsInDay = 86400;
const secondsInWeek = 604800;
const secondsInMonth = 2592000;

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

const contractTypes = [
  { value: 'FA1.2', label: 'FA1.2' },
  { value: 'FA2', label: 'FA2' },
];

const unvestingIntervals = [
  { value: secondsInHour, label: 'Hourly' },
  { value: secondsInDay, label: 'Daily' },
  { value: secondsInWeek, label: 'Weekly' },
  { value: secondsInMonth, label: 'Monthly (30 days)' },
];

export {
  XTZInMutez,
  XTZFormat,
  dateFormat,
  dateFormatNoTime,
  base58Prefixes,
  operationsTypesMap,
  contractTypes,
  unvestingIntervals,
};
