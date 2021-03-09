import numeral from 'numeral';
import crypto from 'crypto';
import bs58 from 'bs58';
import bs58check from 'bs58check';
import { XTZInMutez, XTZFormat, base58Prefixes } from './constants';

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

const isHex = (string) => {
  const hexRegExp = /^[A-F0-9]+$/i;
  return hexRegExp.test(string);
};

const sha256x2 = (buffer) => {
  const tmpChecksum = crypto.createHash('sha256').update(buffer).digest();
  return crypto.createHash('sha256').update(tmpChecksum).digest();
};

const convertHexToPrefixedBase58 = (
  string,
  prefix = 'edpk',
  encoding = 'hex',
) => {
  const stringBuffer = Buffer.from(string, encoding);
  const prefixBuffer = base58Prefixes[prefix].prefix;
  const prefixStringBuffer = Buffer.concat([prefixBuffer, stringBuffer]);
  const checksum = sha256x2(prefixStringBuffer).slice(0, 4);
  const res = Buffer.concat([prefixStringBuffer, checksum]);
  return bs58.encode(res);
};

const limitInputDecimals = (event, limit) => {
  return event.target.value.split(/[.,]/)[1]?.length >= limit
    ? event.preventDefault()
    : null;
};

export {
  convertXTZToMutez,
  convertMutezToXTZ,
  formatXTZ,
  bs58Validation,
  capitalize,
  convertHexToPrefixedBase58,
  isHex,
  limitInputDecimals,
};
