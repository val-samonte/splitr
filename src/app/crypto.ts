import bs58 from 'bs58'

// original source:
// https://gist.github.com/ayosec/d4dc24fb8f0965703c023f92b8e9cdf3

async function keysFromPassword(salt: Uint8Array, password: string) {
  let enc = new TextEncoder().encode(password)
  let basekey = await crypto.subtle.importKey('raw', enc, 'PBKDF2', false, [
    'deriveBits',
  ])

  let keys = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-512',
      salt: salt,
      iterations: 1e5,
    },
    basekey,
    256 /* key */ + 128 /* iv */,
  )

  let iv = new Uint8Array(keys.slice(32))

  let key = await crypto.subtle.importKey(
    'raw',
    new Uint8Array(keys.slice(0, 32)),
    { name: 'AES-GCM' },
    false,
    ['decrypt', 'encrypt'],
  )

  return { key: key, iv: iv }
}

export async function encrypt(password: string, plaintext: string) {
  let salt = new Uint8Array(32)
  crypto.getRandomValues(salt)

  let aesParams = await keysFromPassword(salt, password)

  let ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: aesParams.iv },
    aesParams.key,
    new TextEncoder().encode(plaintext),
  )

  return {
    salt: bs58.encode(salt),
    ciphertext: bs58.encode(new Uint8Array(ciphertext)),
  }
}

export async function decrypt(
  salt: string,
  password: string,
  ciphertext: string,
) {
  let aesParams = await keysFromPassword(bs58.decode(salt), password)

  let plaintext = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: aesParams.iv },
    aesParams.key,
    new Uint8Array(bs58.decode(ciphertext)),
  )

  return new TextDecoder().decode(plaintext)
}

export async function runTest() {
  let encrypted = await encrypt('p455w0rd', 'Original Text')
  console.log('encrypted', encrypted)

  let decrypted = await decrypt(
    encrypted.salt,
    'p455w0rd',
    encrypted.ciphertext,
  )
  console.log('decrypted', decrypted)
}
