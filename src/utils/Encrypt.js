import crypto from 'crypto-browserify';

const algorithm = 'aes-256-ctr';
const secretKey = 'mySecretKey';
const iv = crypto.randomBytes(16);

// Function to encrypt JSON object
const encryptJson = (jsonObj) => {
  const jsonString = JSON.stringify(jsonObj);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(jsonString, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv: iv.toString('hex'),
    content: encrypted,
  };
};

// Function to decrypt JSON object
const decryptJson = (encryptedJson) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(encryptedJson.iv, 'hex'));
  let decrypted = decipher.update(encryptedJson.content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
};

export { encryptJson, decryptJson }