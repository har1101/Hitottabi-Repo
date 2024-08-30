import { a, defineData, type ClientSchema } from '@aws-amplify/backend';
import { sayHello } from "../functions/say-hello/resource"

const schema = a.schema({
    sayHello: a
        .query()
        .arguments({
            inputText: a.string(),
        })
        .returns(a.string())
        // .returns(a.model({message: a.string()}))
        .handler(a.handler.function(sayHello))
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
