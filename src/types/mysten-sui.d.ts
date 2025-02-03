// src/types/mysten-sui.d.ts
declare module "@mysten/sui" {
  export class JsonRpcProvider {
    constructor(endpoint: string);
    getObject(objectId: PublicKey): Promise<{ data: any }>;
  }

  export class PublicKey {
    constructor(value: string);
  }

  export class TransactionBlock {
    moveCall(params: { target: string; arguments: any[] }): void;
    build(): Promise<Uint8Array>;
    object(arg: string): any;
    pure(arg: any): any;
  }
}
