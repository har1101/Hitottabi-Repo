import { defineFunction } from '@aws-amplify/backend';

export const recommendationFlight = defineFunction({
    name: 'recommendationFlight',
    entry: './handler.ts',
    runtime: 20,
    timeoutSeconds: 60
});
