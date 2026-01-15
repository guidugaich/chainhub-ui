// 1. Define the shape of our data
export interface Link {
  title: string;
  url: string;
}

export interface User {
  name: string;
  avatar: string; // URL to the image
  description: string;
  links: Link[];
}

// 2. Create the mock data store
// We use a Record (dictionary) where the key is the "username"
export const users: Record<string, User> = {
  gui: {
    name: "Gui",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=gui", // Generates a random avatar
    description: "Building ChainHub 🚀",
    links: [
      { title: "My Portfolio", url: "https://example.com" },
      { title: "Twitter", url: "https://twitter.com" },
      { title: "GitHub", url: "https://github.com" },
    ],
  },
  alex: {
    name: "Alex",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    description: "Crypto Enthusiast",
    links: [
      { title: "Read my blog", url: "https://medium.com" },
      { title: "Investment Thesis", url: "https://mirror.xyz" },
    ],
  },
};
