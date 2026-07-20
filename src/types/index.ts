export type NavItem = {
  label: string;
  href: string;
  icon: string;
  isProtected?: boolean;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
};
