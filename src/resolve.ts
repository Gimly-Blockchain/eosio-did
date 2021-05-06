import { DIDDocument } from "did-resolver";
import { ConfigOptions } from "./types";

export default async function resolve(
    did: string,
    options?: ConfigOptions): Promise<DIDDocument> {

    return { id: 'did:eosio:stub' };
}
