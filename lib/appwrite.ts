import { Account, Client, Databases } from "appwrite";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!) // Replace with your Appwrite endpoint
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);

export const database = new Databases(client);
