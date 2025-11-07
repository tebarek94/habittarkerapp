import { Account, Client } from "appwrite";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://[YOUR_APPWRITE_ENDPOINT]/v1") // Your Appwrite endpoint
  .setProject("[YOUR_PROJECT_ID]"); // Your project ID

export const account = new Account(client);
