import { defineFunction } from '@aws-amplify/backend';

export const recommendationsHotels = defineFunction({
    name: 'recommendations-hotels',
    entry: './handler.ts',
    runtime: 20,
    timeoutSeconds: 300
});
