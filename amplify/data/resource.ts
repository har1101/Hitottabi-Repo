import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  User: a.model({
      PK: a.id().required(),
      SK: a.string().required(),
      Type: a.string(),
      UserFirstName: a.string(),
      UserLastName: a.string(),
      UserEmail: a.string(),
      UserPhone: a.integer(),
      UserAddress: a.string(),
      UserBirthday: a.string(),
      UserAge: a.integer(),
      UserGender: a.string(),
      StartDate: a.date(),
      EndDate: a.date(),
      TotalSum: a.integer(),
      NumberOfPeople: a.integer(),
      AirplaneId: a.id(),
    })
    .identifier(['PK', 'SK'])
    .secondaryIndexes((index) => [
      index("PK")
        .sortKeys(["AirplaneId"])
        .name("AirplaneIndex")
    ])
    .authorization((allow) => [allow.owner()])
});

// フロントエンドからリクエストを行う際のコード補完/ハイライトに使用
export type Schema = ClientSchema<typeof schema>;

// デプロイするデータリソースを定義
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});