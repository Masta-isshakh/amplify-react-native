import { a, defineData } from "@aws-amplify/backend";

export const data = defineData({
  schema: a.schema({
    Product: a
      .model({
        name: a.string().required(),
        description: a.string(),
        price: a.float(),
        oldPrice: a.float(),
        rate: a.float(),
        imagePath: a.string(), // clé S3
      })
      .authorization((allow) => [
        allow.publicApiKey().to(["read"]), // les utilisateurs publics peuvent lire
        allow.authenticated().to(["read", "create", "update", "delete"]), // utilisateurs connectés
      ]),
  }),
});
