import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: 'myProject',      // nom friendly pour le bucket
  access: (allow) => ({

    'products/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
  }),
});
