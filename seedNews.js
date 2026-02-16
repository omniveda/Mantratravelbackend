const mongoose = require("mongoose");
const dotenv = require("dotenv");
const News = require("./models/News.Model");

dotenv.config();

const newsItems = [
    // --- MAIN FEATURES ---
    {
        heading: "Global Summit Addresses Climate Change Emergency",
        subHeading: "World leaders gather to pledge net-zero emissions by 2050",
        author: "Sarah Jenkins",
        description: "A historic summit in Geneva has brought together leaders from 190 nations to finalize a binding agreement on carbon reduction...",
        category: "Top Story",
        tags: ["World", "Politics", "Environment"],
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070",
        content: [
            { type: "paragraph", value: "The summit opened with a stark warning from climate scientists..." },
            { type: "subheading", value: "Key Agreements" },
            { type: "paragraph", value: "Developing nations will receive increased funding for green energy..." }
        ]
    },
    {
        heading: "Tech Giant Unveils Revolutionary Quantum Processor",
        subHeading: "The chip promises to solve complex problems in seconds",
        author: "David Chen",
        description: "In a surprise announcement, Zenith Corp revealed their new 'Nexus-1' processor, marking a new era in computing.",
        category: "Headline",
        tags: ["Tech", "Business", "Science & Tech", "AI & Future Tech"],
        image: "https://images.unsplash.com/photo-1518770660439-46361a0af87d?q=80&w=2070"
    },
    {
        heading: "Markets Hit Record Highs Amid Economic Optimism",
        subHeading: "Dow Jones and S&P 500 surge as inflation cools",
        author: "Michael Bloomberg",
        description: "Wall Street saw significant gains today as investors reacted to better-than-expected jobs data and cooling inflation numbers.",
        category: "Headline",
        tags: ["Business", "Finance", "Economy", "Markets"],
        image: "https://images.unsplash.com/photo-1611974717482-bcbae4142f6d?q=80&w=2070"
    },
    {
        heading: "India's Space Mission Successfully Lands on Mars",
        subHeading: "Mangalyaan-2 sends back first high-resolution images",
        author: "Rajesh Kumar",
        description: "ISRO has achieved another milestone by successfully placing its latest orbiter around Mars, further cementing India's space status.",
        category: "Trending",
        tags: ["India", "Science & Tech", "Space"],
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2070"
    },

    // --- WORLD & REGIONS ---
    {
        heading: "Election Results in Japan: A Shift in Power?",
        author: "Kenji Sato",
        description: "Preliminary results show a surprising surge for the opposition party in the latest parliamentary elections.",
        category: "Grid Story",
        tags: ["World", "Asia", "Politics"],
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070"
    },
    {
        heading: "European Union Proposes New Digital Privacy Laws",
        author: "Elena Rossi",
        description: "The EU Commission is drafting stricter regulations for AI and data usage to protect citizen privacy in the digital age.",
        category: "Grid Story",
        tags: ["World", "Europe", "Tech", "Politics"],
        image: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?q=80&w=2071"
    },
    {
        heading: "African Union Strengthens Trade Ties with South America",
        author: "Amara Okoro",
        description: "A landmark trade deal aims to boost economic cooperation between the two continents with reduced tariffs.",
        category: "Grid Story",
        tags: ["World", "Africa", "The Americas", "Business"],
        image: "https://images.unsplash.com/photo-1523201182281-968987178044?q=80&w=2070"
    },
    {
        heading: "Oceania Faces Rising Sea Levels: New Infrastructure Planned",
        author: "James Cook",
        description: "Pacific island nations are investing in innovative sea walls and floating cities to combat the effects of climate change.",
        category: "Grid Story",
        tags: ["World", "Oceania", "Environment", "Science & Tech"],
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073"
    },
    {
        heading: "Middle East Tech Hubs Bloom in Saudi Arabia",
        author: "Fatima Al-Sayed",
        description: "NEOM and other mega-projects are attracting global tech talent, positioning the region as a future innovation leader.",
        category: "Grid Story",
        tags: ["World", "Middle East", "Tech", "Future"],
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070"
    },

    // --- POLITICS ---
    {
        heading: "The Race for 2024: Candidates Kick Off Campaigns",
        author: "John Adams",
        description: "Primary season officially begins as major contenders hold rallies in key battleground states.",
        category: "Side Headline",
        tags: ["Politics", "Elections", "America"],
        image: "https://images.unsplash.com/photo-1520110120385-c288373f7521?q=80&w=2070"
    },
    {
        heading: "New Bill Aims to Reform Healthcare System",
        author: "Lisa Wong",
        description: "The proposed legislation focuses on reducing prescription drug costs and expanding coverage for mental health.",
        category: "Grid Story",
        tags: ["Politics", "Government", "Health", "Policy"],
        image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=2070"
    },

    // --- BUSINESS & FINANCE ---
    {
        heading: "Electric Vehicle Sales Surpass Internal Combustion Engines",
        author: "Grace Hopper",
        description: "A major shift in the automotive industry as consumer preference pivots toward sustainable transportation.",
        category: "Featured",
        tags: ["Business", "Tech", "Economy", "Environment"],
        image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2072"
    },
    {
        heading: "Central Bank Maintains Interest Rates Amid Inflation Fears",
        author: "Warren Buffet",
        description: "Economists are divided on the central bank's decision to hold steady as prices continue to fluctuate.",
        category: "Grid Story",
        tags: ["Business", "Finance", "Economy", "Markets"],
        image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070"
    },

    // --- LIFELINE+ (LIFESTYLE) ---
    {
        heading: "The Future of Wellness: AI-Powered Fitness",
        author: "Emma Watson",
        description: "New wearable devices use biometric data to create real-time, personalized workout and recovery plans.",
        category: "Featured",
        tags: ["LifeLine+", "Health", "Fitness", "Tech"],
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070"
    },
    {
        heading: "Sustainable Fashion: Brands Turning Plastic into Couture",
        author: "Stella McCartney",
        description: "The luxury fashion industry is embracing recycled materials, proving that style doesn't have to cost the Earth.",
        category: "Side Headline",
        tags: ["LifeLine+", "Style & Beauty", "Fashion", "Environment"],
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070"
    },
    {
        heading: "10 Superfoods to Boost Your Immunity This Winter",
        author: "Gordon Ramsay",
        description: "From turmeric to blueberries, these nutrient-dense foods are essential for staying healthy during the cold season.",
        category: "Grid Story",
        tags: ["LifeLine+", "Food & Drink", "Health"],
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2070"
    },
    {
        heading: "Navigating Relationships in the Digital Age",
        author: "Esther Perel",
        description: "Experts discuss how social media and dating apps are reshaping human connection and intimacy.",
        category: "Grid Story",
        tags: ["LifeLine+", "Relationships", "Mental Health"],
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070"
    },

    // --- THE STYLE ---
    {
        heading: "Milan Fashion Week: Highlights from the Runway",
        author: "Anna Wintour",
        description: "The spring collection features bold colors, asymmetrical cuts, and a return to 90s minimalism.",
        category: "Featured",
        tags: ["The Style", "Fashion", "LifeLine+"],
        image: "https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?q=80&w=2070"
    },
    {
        heading: "Modern Power Dressing for the Brave",
        author: "Alexander McQueen",
        description: "How structural tailoring and bold palettes are redefining authority in the workplace.",
        category: "Grid Story",
        tags: ["The Style", "Power", "Fashion", "styletopheadline", "powertopheadline"],
        image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2095"
    },
    {
        heading: "Top 5 Trending Accessories for 2024",
        author: "Tom Ford",
        description: "From oversized totes to vintage-inspired eyewear, here's what everyone will be wearing.",
        category: "Grid Story",
        tags: ["The Style", "Trends", "Fashion", "styletrending", "trendstrending"],
        image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=2070"
    },

    // --- FAITH & CONSCIOUSNESS ---
    {
        heading: "Finding Inner Peace Through Ancient Meditation Techniques",
        author: "Dalai Lama",
        description: "A look at how thousand-year-old practices are helping modern people cope with stress and anxiety.",
        category: "Featured",
        tags: ["Faith & Consciousness", "Spirituality", "Mental Health"],
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2099"
    },
    {
        heading: "The Philosophy of Ethics in the Workplace",
        author: "Socrates",
        description: "Why integrity and moral clarity are becoming the most valued leadership traits in the 21st century.",
        category: "Grid Story",
        tags: ["Faith & Consciousness", "Philosophy", "Religion"],
        image: "https://images.unsplash.com/photo-1454165833767-1330084b1d31?q=80&w=2070"
    },

    // --- ENTERTAINMENT ---
    {
        heading: "Summer Blockbusters: What to Watch This Season",
        author: "Steven Spielberg",
        description: "From sci-fi epics to heart-warming comedies, the cinema lineup this year is stronger than ever.",
        category: "Featured",
        tags: ["Entertainment", "Movies & OTT"],
        image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059"
    },
    {
        heading: "The Evolution of Streaming Services: Beyond Content",
        author: "Ted Sarandos",
        description: "How gamification and interactive storytelling are the next frontiers for streaming giants.",
        category: "Grid Story",
        tags: ["Entertainment", "TV", "Tech"],
        image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=2070"
    },

    // --- SCIENCE & TECH ---
    {
        heading: "CRISPR Breakthrough: Curing Genetic Diseases",
        author: "Jennifer Doudna",
        description: "Scientists successfully use gene-editing technology to reverse a rare hereditary condition in clinical trials.",
        category: "Featured",
        tags: ["Science & Tech", "Health Science", "Science"],
        image: "https://images.unsplash.com/photo-1532187875605-7fe359843c68?q=80&w=2070"
    },
    {
        heading: "Next-Gen Gadgets: The Modular Phone is Back",
        author: "Elon Musk",
        description: "A startup claims to have solved the durability issues of modular electronics, promising a phone that lasts decades.",
        category: "Grid Story",
        tags: ["Science & Tech", "Gadgets", "Tech"],
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2080"
    },

    // --- SHOPPING ---
    {
        heading: "Ultimate Guide to Home Office Gear 2024",
        author: "IKEA",
        description: "The best ergonomic chairs, standing desks, and lighting to maximize your productivity at home.",
        category: "More Story",
        tags: ["Shopping", "Guides", "Tech"],
        image: "https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?q=80&w=2070"
    },
    {
        heading: "Unbeatable Deals on Tech This Black Friday",
        author: "Best Buy",
        description: "A sneak peek at the massive discounts coming to laptops, smartphones, and smart home devices.",
        category: "More Story",
        tags: ["Shopping", "Deals", "Tech"],
        image: "https://images.unsplash.com/photo-1556742044-3c52d6e881ee?q=80&w=2070"
    },

    // --- ASTROLOGY ---
    {
        heading: "Your Monthly Horoscope: What the Stars Have in Store",
        author: "Zodiac Master",
        description: "A detailed look at the planetary alignments for November and how they affect each sun sign.",
        category: "Grid Story",
        tags: ["Astrology"],
        image: "https://images.unsplash.com/photo-1515940175183-6798529cb860?q=80&w=2070"
    },

    // --- MORE INDIA ---
    {
        heading: "Indian Startup Ecosystem Sees Record Funding in Q3",
        author: "Vijay Shekhar Sharma",
        description: "Fintech and EdTech sectors lead the way as global investors double down on India's growth story.",
        category: "Grid Story",
        tags: ["India", "Business", "Tech"],
        image: "https://images.unsplash.com/photo-1519163219200-7996e3006886?q=80&w=2070"
    },
    {
        heading: "New National Education Policy Showcases Positive Results",
        author: "Dharmendra Pradhan",
        description: "Literacy rates and vocational training enrollment see significant improvement across rural India.",
        category: "Grid Story",
        tags: ["India", "Politics", "Government"],
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070"
    },

    // --- CATEGORY SPECIFIC VLOGS ---
    {
        heading: "The Future of Finance: Crypto vs Traditional Banking | Finance Vlog",
        author: "Ray Dalio",
        description: "Exploring how blockchain is disrupting the global financial landscape.",
        category: "Featured",
        tags: ["Finance", "Finance Vlog", "Vlog"],
        image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2070",
        content: [{ type: "video", value: "https://www.youtube.com/watch?v=M576u_T4W_Q" }]
    },
    {
        heading: "Inside the World's Most High-Tech Labs | Science & Tech Vlog",
        author: "Veritasium",
        description: "A journey through the future of quantum computing and biotechnology.",
        category: "Featured",
        tags: ["Science & Tech", "Science & Tech Vlog", "Vlog"],
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070",
        content: [{ type: "video", value: "https://www.youtube.com/watch?v=vV_T_7_wIn0" }]
    },
    {
        heading: "Top 10 Ancient Wonders You Must Visit | Travel Vlog",
        author: "Drew Binsky",
        description: "From the Pyramids to Petra, exploring the history of our civilization.",
        category: "Featured",
        tags: ["Travel", "Travel Vlog", "Vlog"],
        image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2070",
        content: [{ type: "video", value: "https://www.youtube.com/watch?v=I_68_J8M_xM" }]
    },
    {
        heading: "Politics Unplugged: The Global Power Shift | Politics Vlog",
        author: "Fareed Zakaria",
        description: "Analyzing the changing geopolitical landscape in 2024.",
        category: "Featured",
        tags: ["Politics", "Politics Vlog", "Vlog"],
        image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=2070",
        content: [{ type: "video", value: "https://www.youtube.com/watch?v=hG7XstEXS-M" }]
    },
    {
        heading: "Entertainment Now: The Rise of Indie Films | Entertainment Vlog",
        author: "Film Riot",
        description: "How small-scale productions are winning big at global festivals.",
        category: "Featured",
        tags: ["Entertainment", "Entertainment Vlog", "Vlog"],
        image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059",
        content: [{ type: "video", value: "https://www.youtube.com/watch?v=8K0m-z-Wpks" }]
    },
    {
        heading: "Sports Revolution: AI in Modern Athletics | Sports Vlog",
        author: "Nike Performance",
        description: "How data and artificial intelligence are pushing the limits of human performance.",
        category: "Featured",
        tags: ["Sports", "Sports Vlog", "Vlog"],
        image: "https://images.unsplash.com/photo-1461896756913-c3b401b23999?q=80&w=2070",
        content: [{ type: "video", value: "https://www.youtube.com/watch?v=S2fF-d0v8vQ" }]
    },
    {
        heading: "LifeLine+: Mastering Your Personal Energy | LifeLine+ Vlog",
        author: "Tony Robbins",
        description: "Practical strategies for achieving peak physical and mental performance.",
        category: "Featured",
        tags: ["LifeLine+", "LifeLine+ Vlog", "Vlog"],
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2099",
        content: [{ type: "video", value: "https://www.youtube.com/watch?v=f7_P9v_fB9k" }]
    },
    {
        heading: "Shopping Trends: The Rise of Ethical Consumerism | Shopping Vlog",
        author: "Eco Stylist",
        description: "Why buying with a conscience is the biggest trend of the year.",
        category: "Featured",
        tags: ["Shopping", "Shopping Vlog", "Vlog"],
        image: "https://images.unsplash.com/photo-1556742044-3c52d6e881ee?q=80&w=2070",
        content: [{ type: "video", value: "https://www.youtube.com/watch?v=M_f8U_Fk9D0" }]
    },
    {
        heading: "Faith & Consciousness: Ancient Wisdom for Modern Times | Faith Vlog",
        author: "Sadhguru",
        description: "Exploring the depths of consciousness through meditative practices.",
        category: "Featured",
        tags: ["Faith & Consciousness", "Faith & Consciousness Vlog", "Vlog"],
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2099",
        content: [{ type: "video", value: "https://www.youtube.com/watch?v=Xn7K_L3Am3U" }]
    },
    {
        heading: "World Report: The Melting Arctic | World Vlog",
        author: "National Geographic",
        description: "A firsthand look at the frontlines of the climate crisis.",
        category: "Featured",
        tags: ["World", "World Vlog", "Vlog"],
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070",
        content: [{ type: "video", value: "https://www.youtube.com/watch?v=2_Wp6P-v18w" }]
    },

    // --- VLOGS ---
    {
        heading: "Exploring the Hidden Temples of Kyoto | Travel Vlog",
        author: "Casey Neistat",
        description: "Join me on a journey through the ancient streets of Kyoto as we discover temples that most tourists miss.",
        category: "Featured",
        tags: ["Vlogs", "Travel Vlogs", "Travel"],
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070",
        content: [
            { type: "paragraph", value: "Kyoto is a city of a thousand temples, but some are more special than others..." },
            { type: "video", value: "https://www.youtube.com/watch?v=R9KCHnK-YIs" },
            { type: "paragraph", value: "The experience of walking through these quiet gardens is unlike anything else." }
        ]
    },
    {
        heading: "Street Food Tour in Old Delhi | Food Vlog",
        author: "Mark Wiens",
        description: "Sampling the legendary Parathas and Jalebis in the heart of Delhi's narrow lanes.",
        category: "Grid Story",
        tags: ["Vlogs", "Food Vlogs", "India", "LifeLine+"],
        image: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6?q=80&w=2070",
        content: [
            { type: "video", value: "https://www.youtube.com/watch?v=v_86tO8lG9w" }
        ]
    },
    {
        heading: "Setup Tour 2024: My Ultimate Productivity Desk",
        author: "MKBHD",
        description: "A deep dive into the tech and tools I use daily to get things done.",
        category: "Grid Story",
        tags: ["Vlogs", "Tech Vlogs", "Tech", "Science & Tech"],
        image: "https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?q=80&w=2070",
        content: [
            { type: "video", value: "https://www.youtube.com/watch?v=0hK9SreN5Yw" }
        ]
    },
    {
        heading: "A Day in the Life of a Digital Nomad in Bali",
        author: "Lost LeBlanc",
        description: "Living and working from paradise: how I manage my schedule and stay creative.",
        category: "Grid Story",
        tags: ["Vlogs", "Lifestyle Vlogs", "Travel"],
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2138",
        content: [
            { type: "video", value: "https://www.youtube.com/watch?v=F0S_FpG9u6c" }
        ]
    }
];

// Add more to fill up the grids (need at least 4-6 for each section)
const fillers = [
    { tag: "India", count: 4 },
    { tag: "World", count: 4 },
    { tag: "Politics", count: 4 },
    { tag: "Business", count: 4 },
    { tag: "LifeLine+", count: 4 },
    { tag: "Faith & Consciousness", count: 4 },
    { tag: "Entertainment", count: 4 },
    { tag: "Science & Tech", count: 4 },
    { tag: "Shopping", count: 4 },
    { tag: "Astrology", count: 4 }
];

fillers.forEach(f => {
    for (let i = 1; i <= f.count; i++) {
        newsItems.push({
            heading: `${f.tag} News Extra ${i}: Shaping the Future`,
            author: "Global Correspondent",
            description: `This is an additional news item for the ${f.tag} category to demonstrate grid layout and filtering...`,
            category: "Grid Story",
            tags: [f.tag, "General"],
            image: `https://picsum.photos/seed/${f.tag}${i}/800/600`
        });
    }
});

const seedNews = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB");

        // Use deleteMany instead of drop to keep indexes if any, though drop is fine too
        await News.deleteMany({});
        console.log("Cleared existing news");

        await News.insertMany(newsItems);
        console.log(`Successfully seeded ${newsItems.length} news items`);

        process.exit(0);
    } catch (err) {
        console.error("Error seeding news:", err);
        process.exit(1);
    }
};

seedNews();
