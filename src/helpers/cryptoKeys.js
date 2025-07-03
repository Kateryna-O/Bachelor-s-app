export const generateRSAKeyPair = async () => {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );

  const publicKey = await window.crypto.subtle.exportKey(
    'spki',
    keyPair.publicKey
  );
  const privateKey = await window.crypto.subtle.exportKey(
    'pkcs8',
    keyPair.privateKey
  );

  return {
    publicKey: btoa(String.fromCharCode(...new Uint8Array(publicKey))),
    privateKey: btoa(String.fromCharCode(...new Uint8Array(privateKey))),
  };
};

// Ця функція:

// Генерує пару ключів RSA.

// Експортує їх у форматі spki і pkcs8.

// Кодує їх у base64.

// Повертає об’єкт { publicKey, privateKey }.
