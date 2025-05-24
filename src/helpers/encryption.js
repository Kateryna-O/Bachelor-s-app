// Функція безпечного декодування Base64
export function base64ToArrayBuffer(base64) {
  if (!base64 || typeof base64 !== 'string') {
    throw new Error('Invalid Base64 input');
  }

  try {
    const binary = atob(base64);
    const len = binary.length;
    const buffer = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      buffer[i] = binary.charCodeAt(i);
    }
    return buffer;
  } catch (e) {
    console.error('base64ToArrayBuffer failed. Input:', base64);
    throw e;
  }
}

export async function importRSAPublicKey(base64Key) {
  const binaryDer = base64ToArrayBuffer(base64Key);
  return crypto.subtle.importKey(
    'spki',
    binaryDer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['encrypt']
  );
}

export async function encryptMessageForUser(message, recipientPublicKeyBase64) {
  const encoder = new TextEncoder();

  const aesKey = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    encoder.encode(message)
  );

  const rawAesKey = await crypto.subtle.exportKey('raw', aesKey);
  const recipientPublicKey = await importRSAPublicKey(recipientPublicKeyBase64);

  const encryptedAESKey = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    recipientPublicKey,
    rawAesKey
  );

  return {
    encryptedMessage: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    encryptedAESKey: btoa(
      String.fromCharCode(...new Uint8Array(encryptedAESKey))
    ),
    iv: btoa(String.fromCharCode(...iv)),
  };
}

export async function getStoredPrivateKey() {
  const base64Key = localStorage.getItem('privateKey');
  if (!base64Key) throw new Error('No private key in localStorage');

  const binaryDer = base64ToArrayBuffer(base64Key);

  return crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['decrypt']
  );
}

export async function decryptMessageForUser(
  encryptedMessage,
  encryptedAESKey,
  iv,
  privateKey
) {
  console.log('Trying to decrypt:', { encryptedMessage, encryptedAESKey, iv });

  const aesKeyBuffer = await crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    base64ToArrayBuffer(encryptedAESKey)
  );

  const aesKey = await crypto.subtle.importKey(
    'raw',
    aesKeyBuffer,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: base64ToArrayBuffer(iv),
    },
    aesKey,
    base64ToArrayBuffer(encryptedMessage)
  );

  return new TextDecoder().decode(decrypted);
}
