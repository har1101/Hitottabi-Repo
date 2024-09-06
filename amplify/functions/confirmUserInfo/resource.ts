import { defineFunction } from '@aws-amplify/backend';

export const confirmUserInfo = defineFunction({
    name: 'confirmUserInfo',
    entry: './handler.ts',
    runtime: 20,
    timeoutSeconds: 60
});
