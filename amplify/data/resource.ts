import { a } from "@aws-amplify/data-schema";

const schema = a.schema({
  Product: a
    .model({
      name: a.string(),
      description: a.string(),
      price: a.float(),
      oldPrice: a.float(),
      rate: a.float(),
      imagePath: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = typeof schema;
export const dataSchema = schema;
