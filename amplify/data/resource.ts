import { a, defineData, type ClientSchema } from '@aws-amplify/backend';
import { recommendationHotels } from "../functions/recommendationHotels/resource"
import { recommendationActivities } from "../functions/recommendationActivities/resource.ts";
import { recommendationFlight } from "../functions/recommendationFlight/resource.ts";
import { confirmUserInfo } from "../functions/confirmUserInfo/resource.ts";
<<<<<<< HEAD
import { sendMessage } from "../functions/sendMessage/resource.ts"
=======
>>>>>>> 500f47038c753fea1c2b34530d0fba38859e10ae

const schema = a.schema({
    recommendationActivities: a
        .query()
        .arguments({
            sessionId: a.string().required(),
            inputText: a.string().required(),
        })
        .returns(a.string())
<<<<<<< HEAD
=======
        // .returns(a.model({message: a.string()}))
>>>>>>> 500f47038c753fea1c2b34530d0fba38859e10ae
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
    sendMessage: a
        .query()
        .arguments({
            sessionId: a.string().required(),
            inputText: a.string().required(),
        })
        .returns(a.string())
        // .returns(a.model({message: a.string()}))
<<<<<<< HEAD
        .handler(a.handler.function(sendMessage))
=======
        .handler(a.handler.function(confirmUserInfo))
>>>>>>> 500f47038c753fea1c2b34530d0fba38859e10ae
        .authorization(allow => [allow.publicApiKey()]),
    Plan: a.model({
        PK: a.id().required(),
        SK: a.string().required(),
<<<<<<< HEAD
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
=======
>>>>>>> 500f47038c753fea1c2b34530d0fba38859e10ae
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
<<<<<<< HEAD

        })
=======
        }),
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
>>>>>>> 500f47038c753fea1c2b34530d0fba38859e10ae
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
