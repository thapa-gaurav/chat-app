// utils/aes.js
class BetterAES {
  // AES S-Box
  static sBox = [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b,
    0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0,
    0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26,
    0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2,
    0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0,
    0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed,
    0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f,
    0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5,
    0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec,
    0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14,
    0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c,
    0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d,
    0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f,
    0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e,
    0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11,
    0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f,
    0xb0, 0x54, 0xbb, 0x16,
  ];

  // Inverse S-Box
  static invSBox = [
    0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e,
    0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87,
    0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32,
    0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
    0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49,
    0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16,
    0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50,
    0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
    0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x18, 0x95,
    0x07, 0x12, 0x80, 0xe2, 0xeb, 0x0b, 0xcd, 0x4d, 0x8e, 0x6a, 0x7a, 0xb4,
    0x9e, 0x2a, 0x6f, 0xcf, 0xc0, 0x5a, 0xf8, 0xdc, 0x22, 0x2a, 0x90, 0x88,
    0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a,
    0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
    0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea,
    0x65, 0x7a, 0xae, 0x08, 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6,
    0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66,
    0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
    0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9,
    0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68,
    0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16, 0x63, 0x7c, 0x77, 0x7b,
    0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
    0xca, 0x82, 0xc9, 0x7d,
  ];

  // Rcon (Round Constant)
  static rCon = [
    [0x00, 0x00, 0x00, 0x00],
    [0x01, 0x00, 0x00, 0x00],
    [0x02, 0x00, 0x00, 0x00],
    [0x04, 0x00, 0x00, 0x00],
    [0x08, 0x00, 0x00, 0x00],
    [0x10, 0x00, 0x00, 0x00],
    [0x20, 0x00, 0x00, 0x00],
    [0x40, 0x00, 0x00, 0x00],
    [0x80, 0x00, 0x00, 0x00],
    [0x1b, 0x00, 0x00, 0x00],
    [0x36, 0x00, 0x00, 0x00],
  ];

  static gmul = (a, b) => {
    let p = 0;
    for (let counter = 0; counter < 8; counter++) {
      if (b & 1) p ^= a;
      const hiBitSet = a & 0x80;
      a <<= 1;
      if (hiBitSet) a ^= 0x1b;
      b >>= 1;
    }
    return p & 0xff;
  };

  // Key Expansion for AES-128
  static keyExpansion = (key) => {
    if (key.length !== 16) {
      throw new Error(`Key must be exactly 16 bytes, got ${key.length}`);
    }

    const Nk = 4;
    const Nr = 10;
    const expandedKey = new Array(4 * 4 * (Nr + 1));

    for (let i = 0; i < Nk; i++) {
      expandedKey[4 * i] = key[4 * i];
      expandedKey[4 * i + 1] = key[4 * i + 1];
      expandedKey[4 * i + 2] = key[4 * i + 2];
      expandedKey[4 * i + 3] = key[4 * i + 3];
    }

    for (let i = Nk; i < 4 * (Nr + 1); i++) {
      let temp = [
        expandedKey[4 * (i - 1)],
        expandedKey[4 * (i - 1) + 1],
        expandedKey[4 * (i - 1) + 2],
        expandedKey[4 * (i - 1) + 3],
      ];

      if (i % Nk === 0) {
        temp = [temp[1], temp[2], temp[3], temp[0]];
        temp = temp.map((b) => this.sBox[b]);
        const rcon = this.rCon[i / Nk];
        temp = temp.map((b, j) => b ^ rcon[j]);
      }

      expandedKey[4 * i] = expandedKey[4 * (i - Nk)] ^ temp[0];
      expandedKey[4 * i + 1] = expandedKey[4 * (i - Nk) + 1] ^ temp[1];
      expandedKey[4 * i + 2] = expandedKey[4 * (i - Nk) + 2] ^ temp[2];
      expandedKey[4 * i + 3] = expandedKey[4 * (i - Nk) + 3] ^ temp[3];
    }

    return expandedKey;
  };

  // SubBytes Transformation
  static subBytes = (state) => {
    for (let i = 0; i < 16; i++) {
      state[i] = this.sBox[state[i]];
    }
    return state;
  };

  // InvSubBytes Transformation
  static invSubBytes = (state) => {
    for (let i = 0; i < 16; i++) {
      state[i] = this.invSBox[state[i]];
    }
    return state;
  };

  // ShiftRows Transformation
  static shiftRows = (state) => {
    const temp = [...state];
    state[1] = temp[5];
    state[5] = temp[9];
    state[9] = temp[13];
    state[13] = temp[1];
    state[2] = temp[10];
    state[6] = temp[14];
    state[10] = temp[2];
    state[14] = temp[6];
    state[3] = temp[15];
    state[7] = temp[3];
    state[11] = temp[7];
    state[15] = temp[11];
    return state;
  };

  // InvShiftRows Transformation
  static invShiftRows = (state) => {
    const temp = [...state];
    state[1] = temp[13];
    state[5] = temp[1];
    state[9] = temp[5];
    state[13] = temp[9];
    state[2] = temp[10];
    state[6] = temp[14];
    state[10] = temp[2];
    state[14] = temp[6];
    state[3] = temp[7];
    state[7] = temp[11];
    state[11] = temp[15];
    state[15] = temp[3];
    return state;
  };

  // MixColumns Transformation
  static mixColumns = (state) => {
    for (let i = 0; i < 4; i++) {
      const a = state[4 * i];
      const b = state[4 * i + 1];
      const c = state[4 * i + 2];
      const d = state[4 * i + 3];

      state[4 * i] = this.gmul(0x02, a) ^ this.gmul(0x03, b) ^ c ^ d;
      state[4 * i + 1] = a ^ this.gmul(0x02, b) ^ this.gmul(0x03, c) ^ d;
      state[4 * i + 2] = a ^ b ^ this.gmul(0x02, c) ^ this.gmul(0x03, d);
      state[4 * i + 3] = this.gmul(0x03, a) ^ b ^ c ^ this.gmul(0x02, d);
    }
    return state;
  };

  // InvMixColumns Transformation
  static invMixColumns = (state) => {
    for (let i = 0; i < 4; i++) {
      const a = state[4 * i];
      const b = state[4 * i + 1];
      const c = state[4 * i + 2];
      const d = state[4 * i + 3];

      state[4 * i] =
        this.gmul(0x0e, a) ^
        this.gmul(0x0b, b) ^
        this.gmul(0x0d, c) ^
        this.gmul(0x09, d);
      state[4 * i + 1] =
        this.gmul(0x09, a) ^
        this.gmul(0x0e, b) ^
        this.gmul(0x0b, c) ^
        this.gmul(0x0d, d);
      state[4 * i + 2] =
        this.gmul(0x0d, a) ^
        this.gmul(0x09, b) ^
        this.gmul(0x0e, c) ^
        this.gmul(0x0b, d);
      state[4 * i + 3] =
        this.gmul(0x0b, a) ^
        this.gmul(0x0d, b) ^
        this.gmul(0x09, c) ^
        this.gmul(0x0e, d);
    }
    return state;
  };

  // AddRoundKey Transformation
  static addRoundKey = (state, roundKey, round) => {
    for (let i = 0; i < 16; i++) {
      state[i] ^= roundKey[round * 16 + i];
    }
    return state;
  };

  // PKCS7 Padding
  static padData = (data) => {
    const padLength = 16 - (data.length % 16);
    return [...data, ...Array(padLength).fill(padLength)];
  };

  // Remove Padding
  static unpadData = (data) => {
    if (data.length === 0) throw new Error("No data to unpad");
    const padLength = data[data.length - 1];
    if (padLength < 1 || padLength > 16) {
      throw new Error(`Invalid padding length: ${padLength}`);
    }
    for (let i = data.length - padLength; i < data.length; i++) {
      if (data[i] !== padLength) {
        throw new Error("Invalid padding bytes");
      }
    }
    return data.slice(0, data.length - padLength);
  };

  // Convert string to byte array
  static stringToBytes = (str) => {
    const bytes = new Array(str.length);
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code > 255) {
        throw new Error(`Character code ${code} exceeds 8-bit range`);
      }
      bytes[i] = code;
    }
    return bytes;
  };

  // Convert byte array to string
  static bytesToString = (bytes) => {
    let str = "";
    for (let i = 0; i < bytes.length; i++) {
      if (bytes[i] < 0 || bytes[i] > 255) {
        throw new Error(`Invalid byte value: ${bytes[i]}`);
      }
      str += String.fromCharCode(bytes[i]);
    }
    return str;
  };

  // Convert bytes to base64
  static bytesToBase64 = (bytes) => {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Convert base64 to bytes
  static base64ToBytes = (base64) => {
    try {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return Array.from(bytes);
    } catch (error) {
      throw new Error(`Invalid Base64 string: ${error.message}`);
    }
  };

  // Main Encryption Method
  static encrypt = (text, key) => {
    if (typeof text !== "string") throw new Error("Text must be a string");
    if (typeof key !== "string") throw new Error("Key must be a string");

    const textBytes = this.stringToBytes(text);
    const keyBytes = this.stringToBytes(key);

    if (keyBytes.length !== 16) {
      throw new Error(`Key must be exactly 16 bytes, got ${keyBytes.length}`);
    }

    const paddedText = this.padData(textBytes);
    const expandedKey = this.keyExpansion(keyBytes);
    let encryptedBytes = [];

    for (let i = 0; i < paddedText.length; i += 16) {
      let state = paddedText.slice(i, i + 16);
      state = this.addRoundKey(state, expandedKey, 0);

      for (let round = 1; round < 10; round++) {
        state = this.subBytes(state);
        state = this.shiftRows(state);
        state = this.mixColumns(state);
        state = this.addRoundKey(state, expandedKey, round);
      }

      state = this.subBytes(state);
      state = this.shiftRows(state);
      state = this.addRoundKey(state, expandedKey, 10);
      encryptedBytes.push(...state);
    }

    return this.bytesToBase64(encryptedBytes);
  };

  // Main Decryption Method
  static decrypt = (encryptedBase64, key) => {
    if (typeof encryptedBase64 !== "string")
      throw new Error("Encrypted data must be a Base64 string");
    if (typeof key !== "string") throw new Error("Key must be a string");

    const encryptedBytes = this.base64ToBytes(encryptedBase64);
    const keyBytes = this.stringToBytes(key);

    if (keyBytes.length !== 16) {
      throw new Error(`Key must be exactly 16 bytes, got ${keyBytes.length}`);
    }

    if (encryptedBytes.length % 16 !== 0) {
      throw new Error(
        `Encrypted data length must be multiple of 16, got ${encryptedBytes.length}`
      );
    }

    const expandedKey = this.keyExpansion(keyBytes);
    let decryptedBytes = [];

    for (let i = 0; i < encryptedBytes.length; i += 16) {
      let state = encryptedBytes.slice(i, i + 16);
      state = this.addRoundKey(state, expandedKey, 10);
      state = this.invShiftRows(state);
      state = this.invSubBytes(state);

      for (let round = 9; round > 0; round--) {
        state = this.addRoundKey(state, expandedKey, round);
        state = this.invMixColumns(state);
        state = this.invShiftRows(state);
        state = this.invSubBytes(state);
      }

      state = this.addRoundKey(state, expandedKey, 0);
      decryptedBytes.push(...state);
    }

    const unpadded = this.unpadData(decryptedBytes);
    return this.bytesToString(unpadded);
  };

  // Generate a proper 16-byte key
  static generateKey = () => {
    const bytes = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
    return this.bytesToString(Array.from(bytes));
  };

  // Helper to ensure key is exactly 16 bytes
  static normalizeKey = (key) => {
    const keyBytes = this.stringToBytes(key);

    if (keyBytes.length < 16) {
      const padded = new Array(16).fill(0);
      for (let i = 0; i < keyBytes.length; i++) {
        padded[i] = keyBytes[i];
      }
      return this.bytesToString(padded);
    } else if (keyBytes.length > 16) {
      return this.bytesToString(keyBytes.slice(0, 16));
    }

    return key;
  };

  // Convert base64 to string
  static base64ToString = (base64) => {
    try {
      const bytes = this.base64ToBytes(base64);
      return this.bytesToString(bytes);
    } catch (error) {
      throw new Error(`Invalid Base64 conversion: ${error.message}`);
    }
  };

  // String to base64
  static stringToBase64 = (str) => {
    const bytes = this.stringToBytes(str);
    return this.bytesToBase64(bytes);
  };
}

export default BetterAES;
