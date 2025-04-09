export const contact:
  | {
      general: {
        email: string;
        phone?: string;
        address?: string;
      };
      socials: {
        twitter: string;
        linkedin: string;
        instagram: string;
      };
    }
  | undefined = {
  general: {
    email: '',
    phone: '',
    address: '',
  },
  socials: {
    twitter: '',
    linkedin: '',
    instagram: '',
  },
};
