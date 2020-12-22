import { naclBoxPrivateKeyFromMnemonic } from './utils/mnemonic';
import { derivePublicKey, generateSigningKeys } from './utils/nacl';

import type { KeyPair, SigningKeyPair } from '@emberclear/crypto/types';

export async function login(mnemonic: string): Promise<KeyPair & SigningKeyPair> {
  let privateKey = await naclBoxPrivateKeyFromMnemonic(mnemonic);
  let publicKey = await derivePublicKey(privateKey);

  let { publicSigningKey, privateSigningKey } = await generateSigningKeys();

  return { publicKey, privateKey, publicSigningKey, privateSigningKey };
}
