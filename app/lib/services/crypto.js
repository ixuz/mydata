import { Rsa, Sha } from '@trackforce/react-native-crypto'
import pem2jwk from 'simple-pem2jwk'

export function toBase64Url(base64) {
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export async function generateKeys(modulusLength = 2048) {
  const keyPair = await Rsa.generateKeys(modulusLength)
  return {
    publicKey: pem2jwk(keyPair.public, { use: 'sig' }),
    privateKey: pem2jwk(keyPair.private),
  }
}

export async function thumbprint({ e, kty, n }) {
  const hash = await Sha.sha256(JSON.stringify({ e, kty, n }))
  return toBase64Url(hash)
}

export async function generateKey(options = {}, modulusLength = 2048) {
  const keyPair = await Rsa.generateKeys(modulusLength)
  const key = pem2jwk(keyPair.private, options)
  key.kid = `egendata://jwks/${await thumbprint(key)}`

  return key
}

export function toPublicKey({ e, kid, kty, n, use }) {
  return { e, kid, kty, n, use }
}
