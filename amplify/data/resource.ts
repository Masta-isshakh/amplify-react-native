import { a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Product: a
    .model({
      name: a.string().required(),
      price: a.float().required(),
      imagePath: a.string().required(), // chemin du fichier S3
      rating: a.float(), // optionnel
    })
    .authorization((allow) => [allow.publicApiKey()]), // tout le monde peut lire
});

export const data = defineData({
  schema,
});

export type Schema = typeof schema;
