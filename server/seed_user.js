
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv/config';
import mongoConnect from './config/database.js';

const seedUser = async () => {
    await mongoConnect();

    try {
        // REPLACE THIS ID WITH YOUR ACTUAL CLERK USER ID
        // You can find this in the Clerk Dashboard -> Users -> Profile
        const CLERK_USER_ID = "user_2zbiU0i9j5Zl3djoc4QUC7xheyK";

        const user = await User.findOne({ _id: CLERK_USER_ID });
        if (user) {
            console.log("User already exists:", user);
        } else {
            // You can update these details if you like
            const newUser = await User.create({
                _id: CLERK_USER_ID,
                name: "Ishmeet Singh",
                email: "ishmeet2004singh@gmail.com",
                image: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yemJpVHRka0kwVUVMdEZPSWpBUE5KV0lkUmwifQ?width=128"
            });
            console.log("User created successfully:", newUser);
        }
        process.exit(0);
    } catch (error) {
        console.error("Error seeding user:", error);
        process.exit(1);
    }
};

seedUser();
