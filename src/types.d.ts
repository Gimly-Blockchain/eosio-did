import { DIDDocument } from 'did-resolver';

export declare type ConfigOptions = {
    [x: string]: {
        chainId: string,
        service: [{
            id: string,
            type: [string],
            serviceEndpoint: string
        }]
    }
}

export declare type Authority = {
    threshold: number,
    keys?: [{
        key: string,
        weight: number
    }],
    accounts?: [{
        permission: {
            actor: string,
            permission: string
        },
        weight: number
    }],
    waits?: [{
        wait_sec: number,
        wait: number
    }]
}

export declare interface EosioDIDInterface {
    async create(creator: string, name: string, owner: Authority, active: Authority, options?: ConfigOptions): Promise<DIDDocument>;

    async resolve(did: string, options?: ConfigOptions): Promise<DIDDocument>;

    async update(account: string, permission: string, parent: string, auth: Authority, options?: ConfigOptions): Promise<DIDDocument>;

    async deactivate(did: string, options?: ConfigOptions): Promise<void>;
}