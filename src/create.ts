import { DIDDocument } from "did-resolver";
import { Authority, ConfigOptions } from "./types";

export default async function create(
    creator: string,
    name: string,
    owner: Authority,
    active: Authority,
    options?: ConfigOptions): Promise<DIDDocument> {

    return { id: 'did:eosio:stub' };
}