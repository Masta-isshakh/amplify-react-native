import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Todo: a
    .model({
      imagePath: a.string(),
      productName: a.string(),
      productPrice: a.float(),
      productOldprice: a.float(),
      rate: a.float(),
      isDone: a.boolean()
    })
    .authorization(allow => [allow.publicApiKey()])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode:{expiresInDays:30}
  }
});