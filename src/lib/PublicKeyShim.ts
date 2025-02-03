// src/lib/PublicKeyShim.ts
export class PublicKey {
  private value: string;

  constructor(value: string) {
    this.value = value;
  }

  toString(): string {
    return this.value;
  }
}
