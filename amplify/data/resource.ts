import { a, defineData, type ClientSchema } from '@aws-amplify/backend';
import { recommendationHotels } from "../functions/recommendationHotels/resource"
import { recommendationActivities } from "../functions/recommendationActivities/resource.ts";
import { recommendationFlight } from "../functions/recommendationFlight/resource.ts";
import { confirmUserInfo } from "../functions/confirmUserInfo/resource.ts";

const schema = a.schema({
    recommendationActivities: a
        .query()
        .arguments({
            sessionId: a.string().required(),
            inputText: a.string().required(),
        })
        .returns(a.string())
        .handler(a.handler.function(recommendationActivities))
        .authorization(allow => [allow.publicApiKey()]),
    recommendationHotels: a
        .query()
        .arguments({
            sessionId: a.string().required(),
            inputText: a.string().required(),
        })
        .returns(a.string())
        .handler(a.handler.function(recommendationHotels))
        .authorization(allow => [allow.publicApiKey()]),
    recommendationsFlight: a
        .query()
        .arguments({
            sessionId: a.string().required(),
            inputText: a.string().required(),
        })
        .returns(a.string())
        .handler(a.handler.function(recommendationFlight))
        .authorization(allow => [allow.publicApiKey()]),
    confirmUserInfo: a
        .query()
        .arguments({
            sessionId: a.string().required(),
            inputText: a.string().required(),
        })
        .returns(a.string())
        .handler(a.handler.function(confirmUserInfo))
        .authorization(allow => [allow.publicApiKey()]),
    Plan: a.model({
        PK: a.id().required(),
        SK: a.string().required(),
        TravelBasic: a.customType({
            outbound: a.customType({
                location: a.string(),
                date: a.string()
            }),
            inbound: a.customType({
                location: a.string(),
                date: a.string()
            }),
            people: a.customType({
                adults: a.integer(),
                children: a.integer(),
                infants: a.integer(),
            })
        }),
        Hotel: a.customType({
            name: a.string(),
            description: a.string()
        }),
        Activity: a.customType({
            name: a.string(),
            description: a.string()
        }),
        Flight: a.customType({
            outbound: a.customType({
                airport: a.string(),
                number: a.string(),
                startTime: a.string(),
                endTime: a.string(),
                seats: a.string().array()
            }),
            inbound: a.customType({
                airport: a.string(),
                number: a.string(),
                startTime: a.string(),
                endTime: a.string(),
                seats: a.string().array()
            })

        }),
        User: a.customType({
            Delegate: a.customType({
                firstname: a.string(),
                lastname: a.string(),
                age: a.integer(),
                gender: a.string(),
                telno: a.string(),
                email: a.string(),
                address: a.string(),
            }),
            Traveler1: a.customType({
                firstname: a.string(),
                lastname: a.string(),
                age: a.integer(),
                gender: a.string(),
            }),
            Traveler2: a.customType({
                firstname: a.string(),
                lastname: a.string(),
                age: a.integer(),
                gender: a.string(),
            }),
            Traveler3: a.customType({
                firstname: a.string(),
                lastname: a.string(),
                age: a.integer(),
                gender: a.string(),
            })
        })
    })
        .identifier(['PK', 'SK'])
        .authorization(allow => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    name: 'hitottabi-api',
    authorizationModes: {
        defaultAuthorizationMode: 'apiKey',
        apiKeyAuthorizationMode: {expiresInDays: 30}
    }
});
