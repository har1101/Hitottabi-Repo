import { defineFunction } from '@aws-amplify/backend';

export const recommendationHotels = defineFunction({
    name: 'recommendationHotels',
    entry: './handler.ts',
    runtime: 20,
    timeoutSeconds: 60
});
