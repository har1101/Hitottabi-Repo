import { a, defineData, type ClientSchema } from '@aws-amplify/backend';
import { recommendationsHotels } from "../functions/recommendation-hotels/resource"

const schema = a.schema({
    recommendationsHotels: a
        .query()
        .arguments({
            sessionId: a.string().required(),
            inputText: a.string().required(),
        })
        .returns(a.string())
        // .returns(a.model({message: a.string()}))
        .handler(a.handler.function(recommendationsHotels))
        .authorization(allow => [allow.publicApiKey()])
});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
    schema,
    name: 'testAmplifyAPI',
    authorizationModes: {
        defaultAuthorizationMode: 'apiKey',
        apiKeyAuthorizationMode: {expiresInDays: 30}
    }
});
