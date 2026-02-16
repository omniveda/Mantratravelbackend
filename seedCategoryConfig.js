const mongoose = require("mongoose");
const dotenv = require("dotenv");
const CategoryConfig = require("./models/CategoryConfig.Model");

dotenv.config();

const configs = {
    "News Hub": {
        subtitle: "The world, as it truly is",
        subs: ["Breaking News", "Opinion"]
    },
    "World": {
        subtitle: "Global perspectives and local impact",
        subs: ["India", "America", "Asia", "Europe", "Africa", "Middle East", "Oceania"]
    },
    "Travel": {
        subtitle: "Exploring the unknown",
        subs: ["Destinations", "Tips", "Stories"]
    },
    "Politics": {
        subtitle: "The power of choice",
        subs: []
    },
    "Entertainment": {
        subtitle: "The art of stories",
        subs: ["Movies & OTT", "Music", "TV", "Celebs", "Awards", "Video Game"]
    },
    "Finance": {
        subtitle: "Where wealth finds its voice",
        subs: []
    },
    "Sports": {
        subtitle: "Glory, grit, and greatness",
        subs: []
    },
    "LifeLine+": {
        subtitle: "The refined art of living",
        subs: ["Health", "Fitness", "Food & Drink", "Style & Beauty", "Fashion", "Mental Health", "Relationships", "Parenting", "Pet's"]
    },
    "Shopping": {
        subtitle: "Curated for you",
        subs: ["Deals", "Trends", "Guides"]
    },
    "Science & Tech": {
        subtitle: "Inventing tomorrow's world",
        subs: ["AI & Future Tech", "Space", "Health Science", "Gadgets"]
    },
    "Faith & Consciousness": {
        subtitle: "The eternal search for truth",
        subs: ["Religion", "Spirituality", "Philosophy", "Story & Scriptures"]
    },
    "Vlogs": {
        subtitle: "Visual stories from around the world",
        subs: ["Travel Vlogs", "Food Vlogs", "Tech Vlogs", "Lifestyle Vlogs"]
    }
};

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB");

        const operations = Object.entries(configs).map(([categoryName, data]) => ({
            updateOne: {
                filter: { categoryName },
                update: { subtitle: data.subtitle, subCategories: data.subs },
                upsert: true
            }
        }));

        await CategoryConfig.bulkWrite(operations);
        console.log("Categories seeded successfully");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding:", error);
        process.exit(1);
    }
};

seed();
