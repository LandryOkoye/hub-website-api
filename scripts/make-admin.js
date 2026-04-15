// scripts/make-admin.js
// ======================
// One-time script to promote an existing user to admin role.
//
// PLACEMENT: Create this file at scripts/make-admin.js
//
// USAGE:
//   node scripts/make-admin.js admin@example.com
//
// WHAT IT DOES:
//   Finds the user with the given email in MongoDB and sets their role to "admin".
//   After running this, the user logs in normally via POST /api/v1/users/login.
//   Their JWT token will contain { role: "admin" } which grants access to
//   all admin-protected routes.
//
// REQUIREMENTS:
//   - The user must already exist (created via POST /api/v1/users)
//   - Your .env file must be present (script uses DB_URI from it)
//   - Run from the project root: node scripts/make-admin.js email@example.com
//
// SECURITY NOTE:
//   This script has direct write access to your database.
//   Only run it from a secure server or developer machine.
//   Never automate it or expose it as an HTTP endpoint.

require("dotenv").config(); // Load .env so we can connect to MongoDB

const mongoose = require("mongoose");
const User = require("../src/models/user");
const env = require("../src/config/env");

// Read the email from command-line arguments.
// process.argv: [node, scripts/make-admin.js, email@example.com]
const email = process.argv[2];

if (!email) {
    console.error("❌ Error: Please provide an email address.");
    console.error("   Usage: node scripts/make-admin.js admin@example.com");
    process.exit(1);
}

const makeAdmin = async () => {
    try {
        // Connect to MongoDB using the same connection string as the app
        await mongoose.connect(env.DB_URI);
        console.log("✅ Connected to MongoDB");

        // Find the user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            console.error(`❌ No user found with email: ${email}`);
            console.error(
                "   Create the user first via POST /api/v1/users, then run this script."
            );
            process.exit(1);
        }

        // Check if they're already an admin — no-op if so
        if (user.role === "admin") {
            console.log(`ℹ️  User "${email}" is already an admin. No changes made.`);
            process.exit(0);
        }

        // Update the role to "admin"
        // { new: true } returns the updated document for confirmation logging
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { role: "admin" },
            { new: true }
        );

        console.log(`✅ Success! "${updatedUser.email}" is now an admin.`);
        console.log(
            "   They can log in via POST /api/v1/users/login and use admin routes."
        );

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    } finally {
        // Always close the DB connection when the script finishes
        await mongoose.connection.close();
    }
};

makeAdmin();