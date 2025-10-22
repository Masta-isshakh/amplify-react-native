// amplify/data/resource.ts
import { a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a
    .model({
      title: a.string().required(),       // Titre de la publication
      imagePath: a.string().required(),   // Chemin du fichier S3
      author: a.string(),                 // Nom du créateur (optionnel)
      createdAt: a.datetime().required(), // Date de création
    })
    .authorization((allow) => [
      allow.publicApiKey(), // tout le monde peut lire
      allow.owner(),        // seul le propriétaire peut écrire
    ]),
});

export const data = defineData({
  schema,
});

export type Schema = typeof schema;
