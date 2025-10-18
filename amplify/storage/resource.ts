import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: 'imageUploads',      // nom friendly pour le bucket
  access: (allow) => ({
    'uploads/{user_id}/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'public/*': [
      allow.guest.to(['read']),
    ],
  }),
});
