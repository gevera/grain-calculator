import { persisted } from 'svelte-persisted-store'
import type { Client, Record } from './types';

export type ClientWithRecords = Client & {
    records?: Record[],
}

export const clientsStore = persisted<ClientWithRecords[]>('clients', []);