import numeral from 'numeral';
import bs58check from 'bs58check';
import { XTZInMutez, XTZFormat } from './constants';

const convertXTZToMutez = (amount) => {
  return `${Number(amount) * XTZInMutez}`;
};

const convertMutezToXTZ = (amount) => {
  return `${Number(amount) / XTZInMutez}`;
};

const formatXTZ = (amount) => {
  return numeral(amount).format(XTZFormat);
};

const bs58Validation = (value) => {
  try {
    bs58check.decode(value);
    return true;
  } catch (e) {
    return false;
  }
};

const capitalize = (string) => {
  if (!string) return '';
  return `${string[0].toUpperCase()}${string.slice(1)}`;
};

export {
  convertXTZToMutez,
  convertMutezToXTZ,
  formatXTZ,
  bs58Validation,
  capitalize,
};
