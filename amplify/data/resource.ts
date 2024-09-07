import { a, defineData, type ClientSchema } from '@aws-amplify/backend';
import { recommendationHotels } from "../functions/recommendationHotels/resource"
import { recommendationFlight } from "../functions/recommendationFlight/resource"

const schema = a.schema({
    recommendationActivities: a
        .query()
        .arguments({
            sessionId: a.string().required(),
            inputText: a.string().required(),
        })
        .returns(a.string())
        // .returns(a.model({message: a.string()}))
        .handler(a.handler.function(recommendationHotels))
        .authorization(allow => [allow.publicApiKey()]),
    recommendationHotels: a
        .query()
        .arguments({
            sessionId: a.string().required(),
            inputText: a.string().required(),
        })
        .returns(a.string())
        // .returns(a.model({message: a.string()}))
        .handler(a.handler.function(recommendationHotels))
        .authorization(allow => [allow.publicApiKey()]),
    recommendationsFlight: a
        .query()
        .arguments({
            sessionId: a.string().required(),
            inputText: a.string().required(),
        })
        .returns(a.string())
        // .returns(a.model({message: a.string()}))
        .handler(a.handler.function(recommendationFlight))
        .authorization(allow => [allow.publicApiKey()]),
    confirmUserInfo: a
        .query()
        .arguments({
            sessionId: a.string().required(),
            inputText: a.string().required(),
        })
        .returns(a.string())
        // .returns(a.model({message: a.string()}))
        .handler(a.handler.function(recommendationHotels))
        .authorization(allow => [allow.publicApiKey()]),
    Plan: a.model({
        PK: a.id().required(),
        SK: a.string().required(),
        Hotel: a.customType({
            name: a.string().required(),
            description: a.string().required(),
        }),
        Flight: a.customType({
            departure: a.customType({
                flight_number: a.string().required(),
                departure_airport: a.string().required(),
                departure_time: a.string().required(),
                arrival_time: a.string().required(),
                price: a.string().required(),
                seats: a.string().array().required()
            }),
            return: a.customType({
                flight_number: a.string().required(),
                departure_airport: a.string().required(),
                departure_time: a.string().required(),
                arrival_time: a.string().required(),
                price: a.string().required(),
                seats: a.string().array().required()
            })
        })
    })
        .identifier(['PK', 'SK'])
        .authorization(allow => [allow.publicApiKey()]),
});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
    schema,
    name: 'hitottabi-api',
    authorizationModes: {
        defaultAuthorizationMode: 'apiKey',
        apiKeyAuthorizationMode: {expiresInDays: 30}
    }
});
