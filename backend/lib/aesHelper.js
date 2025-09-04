import crypto from "crypto";

const AES_KEY = crypto.randomBytes(16); // 128 bits
const IV = crypto.randomBytes(16); // 16 bytes IV

export function encryptAES(plaintext) {
  const cipher = crypto.createCipheriv("aes-128-cbc", AES_KEY, IV);
  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");
  return {
    encrypted,
    AES_KEY: AES_KEY.toString("base64"),
    IV: IV.toString("base64"),
  };
}

export function decryptAES(ciphertext, key, iv) {
  const decipher = crypto.createDecipheriv(
    "aes-128-cbc",
    Buffer.from(key, "base64"),
    Buffer.from(iv, "base64")
  );
  let decrypted = decipher.update(ciphertext, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

const message = "Hello, this is my AES-128 encrypted message!";
const { encrypted } = encryptAES(message, AES_KEY, IV);
const decryptedMessage = decryptAES(
  encrypted,
  AES_KEY.toString("base64"),
  IV.toString("base64")
);

console.log("Original:", message);
console.log("Encrypted:", encrypted);
console.log("Decrypted:", decryptedMessage);
