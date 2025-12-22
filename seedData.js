const mongoose = require("mongoose");
const Blog = require("./models/Blog.Model");
require("dotenv").config();

// Connect to DB
mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("DB Connected"))
    .catch((err) => {
        console.error("DB Connection Failed", err);
        process.exit(1);
    });

const countryData = {
    "EXPLORER": [
        "Wildlife", "Heritage", "Spiritual", "Adventure", "Arts", "Nature", "Beaches", "Major Cities"
    ],
    "STATES": [
        "Heavenly Himachal", "Dazzling Delhi", "Regal Rajasthan"
    ],
    "THINGS TO DO": [
        "Road Trips", "Scenic Highways", "Biking in India", "Hiking in India", "Train Rides",
        "Walking Trails", "Rock Climbing", "Trekking in India", "Paragliding", "Safari (Wildlife)",
        "Jungle Safari", "Snow Adventures", "Scuba Diving", "Kayaking"
    ],
    "FLAVOURS OF": [
        "North Indian Food", "North East Food", "East India Food", "West Indian Food",
        "South Indian Food", "Central Indian Food"
    ],
    "ART & CULTURE": [
        "Art Museums", "Local Crafts", "Indian Architecture", "Performing Arts", "Living Culture",
        "Daily Heritage", "Theatre", "Art Festivals"
    ],
    "PACKING GUIDES": [
        "Summer Essentials", "Winter Gear", "Monsoon Ready"
    ],
    "PLAN YOUR TRIP": [
        "Discover India", "Timing your Trip", "Transport Guide", "VISA info", "Stay & Dine", "Culture Guide"
    ]
};

const seedBlogs = async () => {
    try {
        const country = "india";
        let blogsToInsert = [];

        for (const [category, items] of Object.entries(countryData)) {
            const cleanCategory = category.toLowerCase().replace(/\s+/g, '').replace('&', '');

            for (const item of items) {
                const cleanItem = item.toLowerCase().replace(/\s+/g, '');
                const tag = `${country}${cleanCategory}${cleanItem}`;

                // Create 2 dummy blogs per tag
                blogsToInsert.push({
                    heading: `Experiencing ${item} in ${countryName(country)}`,
                    description: `A wonderful journey exploring ${item} specifically in the ${category} category. This is a placeholder blog post to demonstrate the tagging system.`,
                    author: "Admin",
                    tags: [tag, "india", cleanCategory],
                    image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=600&q=80" // Generic India image
                });

                blogsToInsert.push({
                    heading: `Top Tips for ${item}`,
                    description: `Everything you need to know about ${item}. Expert advice and hidden gems awaiting you.`,
                    author: "Travel Guide",
                    tags: [tag, "tips", "travel"],
                    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80" // Another generic image
                });
            }
        }

        // Optional: Clear existing dummy blogs?
        // await Blog.deleteMany({ author: { $in: ["Admin", "Travel Guide"] } }); 
        // console.log("Cleared old dummy blogs.");

        console.log(`Inserting ${blogsToInsert.length} blogs...`);
        await Blog.insertMany(blogsToInsert);
        console.log("Seeding Completed Successfully!");

        process.exit(0);
    } catch (error) {
        console.error("Seeding Failed:", error);
        process.exit(1);
    }
};

function countryName(code) {
    return code.charAt(0).toUpperCase() + code.slice(1);
}

seedBlogs();
