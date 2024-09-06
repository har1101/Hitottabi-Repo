import { defineFunction } from '@aws-amplify/backend';

export const recommendationActivities = defineFunction({
    name: 'recommendationActivities',
    entry: './handler.ts',
    runtime: 20,
    timeoutSeconds: 60
});
