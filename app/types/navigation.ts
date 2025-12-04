export type Navigation = {
  name: string;
  href: string;
  permission: string;
  children?: NavigationChild[];
};

export type NavigationChild = Omit<Navigation, "Children">;
