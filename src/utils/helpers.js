import numeral from 'numeral';
import crypto from 'crypto';
import bs58 from 'bs58';
import bs58check from 'bs58check';
import * as sodium from 'libsodium-wrappers';
import { XTZInMutez, XTZFormat, base58Prefixes } from './constants';

const avoidScientificNotation = (x) => {
  return x
    .toLocaleString('fullwide', {
      useGrouping: false,
      maximumSignificantDigits: 10,
    })
    .split(',')
    .join('.');
};

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

const pow10 = (exponent) => {
  return 10 ** exponent;
};

const convertAssetAmountToAssetSubunit = (amount, scale) => {
  return `${Number(amount) * pow10(scale)}`;
};

const convertAssetSubunitToAssetAmount = (amount, scale) => {
  return `${avoidScientificNotation(Number(amount) / pow10(scale))}`;
};

const capitalize = (string) => {
  if (!string) return '';
  return `${string[0].toUpperCase()}${string.slice(1)}`;
};

const ellipsis = (string, start = 7, end = -4) => {
  if (!string) return '';
  return `${string.substr(0, start)}...${string.substr(end)}`;
};

const calcMaxAllowedBalance = (balance, tokensPerTick) => {
  return Math.floor(balance / tokensPerTick) * tokensPerTick;
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

const toHHMMSS = (secs) => {
  const secNum = parseInt(secs.toString(), 10);
  const hours = Math.floor(secNum / 3600);
  const minutes = Math.floor(secNum / 60) % 60;
  const seconds = secNum % 60;

  return [hours, minutes, seconds]
    .map((val) => (val < 10 ? `0${val}` : val))
    .filter((val, index) => val !== '00' || index > 0)
    .join(':')
    .replace(/^0/, '');
};

const getSecondsFromHHMMSS = (value) => {
  const [str1, str2, str3] = value.split(':');

  const val1 = Number(str1);
  const val2 = Number(str2);
  const val3 = Number(str3);

  const isVal1NaN = Number.isNaN(val1);
  const isVal2NaN = Number.isNaN(val2);
  const isVal3NaN = Number.isNaN(val3);

  if (!isVal1NaN && isVal2NaN && isVal3NaN) {
    // seconds
    return val1;
  }

  if (!isVal1NaN && !isVal2NaN && isVal3NaN) {
    // minutes * 60 + seconds
    return val1 * 60 + val2;
  }

  if (!isVal1NaN && !isVal2NaN && !isVal3NaN) {
    // hours * 60 * 60 + minutes * 60 + seconds
    return val1 * 60 * 60 + val2 * 60 + val3;
  }

  return 0;
};

const getAddressFromPubKey = (publicKey) => {
  const prefixes = {
    // tz1...
    edpk: {
      length: 54,
      prefix: Buffer.from(new Uint8Array([6, 161, 159])),
    },
    // tz2...
    sppk: {
      length: 55,
      prefix: Buffer.from(new Uint8Array([6, 161, 161])),
    },
    // tz3...
    p2pk: {
      length: 55,
      prefix: Buffer.from(new Uint8Array([6, 161, 164])),
    },
  };

  let prefix;
  let plainPublicKey;

  if (!publicKey) return;
  if (publicKey.length === 64) {
    prefix = prefixes.edpk.prefix;
    plainPublicKey = publicKey;
  } else {
    const entries = Object.entries(prefixes);
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < entries.length; index++) {
      const [key, value] = entries[index];
      if (publicKey.startsWith(key) && publicKey.length === value.length) {
        prefix = value.prefix;
        const decoded = bs58check.decode(publicKey);
        plainPublicKey = decoded
          .slice(key.length, decoded.length)
          .toString('hex');
        break;
      }
    }
  }

  if (!prefix || !plainPublicKey) {
    throw new Error(`invalid publicKey: ${publicKey}`);
  }

  const payload = sodium.crypto_generichash(
    20,
    Buffer.from(plainPublicKey, 'hex'),
  );

  // eslint-disable-next-line consistent-return
  return bs58check.encode(Buffer.concat([prefix, Buffer.from(payload)]));
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
  getAddressFromPubKey,
  convertAssetSubunitToAssetAmount,
  convertAssetAmountToAssetSubunit,
  ellipsis,
  toHHMMSS,
  getSecondsFromHHMMSS,
  calcMaxAllowedBalance,
};
