import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Product: a.model({
    name: a.string().required(),
    description: a.string(),
    price: a.float().required(),
    oldPrice: a.float(),
    rate: a.float(),
    imagePath: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});
export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});
