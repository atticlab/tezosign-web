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

export { XTZInMutez, XTZFormat, dateFormat, base58Prefixes };
