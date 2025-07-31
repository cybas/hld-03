
import { Heart, TrendingUp, Activity, TestTube, Users, Pill, Brain, Microscope, Shield } from 'lucide-react';

export interface BlogArticle {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  views: string;
  url: string;
  icon: React.ReactNode;
  priority?: number;
  content?: any[];
  tags?: string[];
  relatedArticles?: any[];
  author?: string;
  subtitle?: string;
}

export const BLOG_ARTICLES: BlogArticle[] = [
  // Priority 1 Articles
  {
    id: 1,
    title: "Why Women Have Fewer Hair-Loss Treatment Options",
    excerpt: "Explains risks with minoxidil drift, finasteride, shaving for transplant; frames early-action urgency for women's hair loss.",
    category: "Women's Health",
    date: "Dec 15, 2024",
    readTime: "8 min",
    views: "2.3k",
    url: "/blog/women-limited-hair-loss-options",
    icon: <Heart className="w-8 h-8 text-white" />,
    priority: 1,
    author: "Dr. Sarah Chen, MD",
    subtitle: "Explores the unique challenges women face with common hair loss treatments and underscores the urgency of early action.",
    tags: ["women's hair loss", "finasteride", "minoxidil", "early intervention", "treatment options"],
    content: [
      {
        type: "paragraph",
        text: "When it comes to hair loss treatment, women face a frustrating reality: significantly fewer safe and effective options compared to men. This disparity isn't just about biology—it's about how treatments were developed, tested, and approved."
      },
      {
        type: "heading",
        text: "The Finasteride Problem"
      },
      {
        type: "paragraph", 
        text: "Finasteride, one of the most effective treatments for male pattern baldness, is largely off-limits to women of childbearing age. The drug can cause severe birth defects, making it unsuitable for most women who could benefit from its hair-preserving effects."
      },
      {
        type: "callout",
        text: "Key Point: Women have a narrower window of safe treatment options, making early intervention even more critical."
      },
      {
        type: "heading",
        text: "Minoxidil Challenges"
      },
      {
        type: "paragraph",
        text: "While minoxidil is FDA-approved for women, it comes with unique challenges. Minoxidil 'drift' can cause unwanted facial hair growth, particularly concerning for women. The 2% concentration approved for women is also less potent than the 5% version available to men."
      },
      {
        type: "list",
        items: [
          "Risk of facial hair growth from product migration",
          "Lower concentration limits effectiveness", 
          "Daily application challenges with longer hairstyles",
          "Potential scalp irritation in sensitive individuals"
        ]
      },
      {
        type: "heading",
        text: "The Early Action Imperative"
      },
      {
        type: "paragraph",
        text: "Given these limited options, early intervention becomes absolutely critical for women experiencing hair loss. The sooner treatment begins, the more hair follicles can be preserved before they miniaturize beyond recovery."
      },
      {
        type: "callout",
        text: "Don't wait for hair loss to become severe. Early action with safe, natural approaches can prevent the need for more aggressive interventions later."
      }
    ],
    relatedArticles: [],
  },
  {
    id: 2,
    title: "The Sooner You Start, the More Hair You Keep",
    excerpt: "Core behaviour-change piece: why miniaturised follicles are harder to rescue later; sets 'start somewhere' mindset.",
    category: "Prevention",
    date: "Dec 12, 2024", 
    readTime: "6 min",
    views: "3.1k",
    url: "/blog/start-early-keep-more-hair",
    icon: <TrendingUp className="w-8 h-8 text-white" />,
    priority: 1
  },
  {
    id: 3,
    title: "Why Our Programs Run for 100 Days",
    excerpt: "Explains hair-cycle timing, consistency, and the upgrade path (Starter → Intensive). Links to package logic.",
    category: "Science",
    date: "Dec 10, 2024",
    readTime: "7 min", 
    views: "1.8k",
    url: "/blog/100-day-program-hair-cycle-science",
    icon: <Activity className="w-8 h-8 text-white" />,
    priority: 1
  },
  {
    id: 4,
    title: "Why Blood Work Completes Your Hair-Recovery Puzzle",
    excerpt: "Patient-friendly rationale for ferritin, TSH, D 25-OH, etc. Includes iron-calcium inhibition tip for better results.",
    category: "Lab Testing",
    date: "Dec 8, 2024",
    readTime: "10 min",
    views: "2.7k", 
    url: "/blog/blood-work-hair-recovery-labs",
    icon: <TestTube className="w-8 h-8 text-white" />,
    priority: 2
  },
  {
    id: 5,
    title: "Five Free Habits That Slow Hair Loss Right Now",
    excerpt: "Summarises the 'QuickWins' the chatbot shows at Step 3 (mild shampoo, stress walk, shower filter, etc.).",
    category: "Quick Tips",
    date: "Dec 5, 2024",
    readTime: "5 min",
    views: "4.2k",
    url: "/blog/five-free-habits-slow-hair-loss",
    icon: <Users className="w-8 h-8 text-white" />,
    priority: 2
  },
  {
    id: 6,
    title: "Natural Topicals vs. Prescription Drugs",
    excerpt: "Balanced view of minoxidil/finasteride vs peptides, rosemary, LED. Guides shared decision-making between natural and medical approaches.",
    category: "Treatments",
    date: "Dec 3, 2024",
    readTime: "12 min",
    views: "1.9k",
    url: "/blog/natural-vs-prescription-hair-treatments",
    icon: <Pill className="w-8 h-8 text-white" />,
    priority: 2
  },
  // Lab & Medical Articles
  {
    id: 7,
    title: "Low Ferritin & Hair Loss: The Iron Connection",
    excerpt: "Understanding how iron deficiency affects hair growth cycles and practical steps to optimize ferritin levels for better hair health.",
    category: "Lab Testing",
    date: "Nov 28, 2024",
    readTime: "9 min",
    views: "3.5k",
    url: "/blog/low-ferritin-hair-loss-iron-deficiency",
    icon: <TestTube className="w-8 h-8 text-white" />
  },
  {
    id: 8,
    title: "High Testosterone & DHT in Hair Loss",
    excerpt: "How elevated androgens contribute to pattern baldness and what your hormone levels really mean for treatment planning.",
    category: "Hormones",
    date: "Nov 25, 2024",
    readTime: "11 min",
    views: "2.8k",
    url: "/blog/high-testosterone-dht-androgenetic-alopecia",
    icon: <Brain className="w-8 h-8 text-white" />
  },
  {
    id: 9,
    title: "Thyroid Function & Hair Cycling",
    excerpt: "TSH levels and their impact on hair growth phases. When thyroid dysfunction might be behind your hair loss.",
    category: "Hormones",
    date: "Nov 22, 2024",
    readTime: "8 min",
    views: "2.1k",
    url: "/blog/tsh-thyroid-hair-cycling-connection",
    icon: <Activity className="w-8 h-8 text-white" />
  },
  {
    id: 10,
    title: "Low SHBG = Hidden High Androgens",
    excerpt: "SHBG binds testosterone & DHT. Low SHBG means more free hormones hitting scalp follicles even if 'total T' appears normal.",
    category: "Lab Testing",
    date: "Nov 20, 2024",
    readTime: "7 min",
    views: "1.6k",
    url: "/blog/low-shbg-hidden-high-androgens-hair-loss",
    icon: <Microscope className="w-8 h-8 text-white" />
  },
  {
    id: 11,
    title: "Why Scarring Alopecia Needs a Specialist Fast",
    excerpt: "Prepares users for the referral pathway if Step 3 flags scarring conditions. Explains urgency and what to expect.",
    category: "Medical",
    date: "Nov 18, 2024",
    readTime: "6 min",
    views: "1.4k",
    url: "/blog/scarring-alopecia-specialist-urgent-care",
    icon: <Shield className="w-8 h-8 text-white" />
  },
  {
    id: 12,
    title: "When Do You Need In-Clinic Treatments?",
    excerpt: "Describes PRP, exosomes, TrichoScan monitoring; helps users decide if travel to a partner clinic is worth it.",
    category: "Procedures",
    date: "Nov 15, 2024",
    readTime: "10 min",
    views: "2.2k",
    url: "/blog/in-clinic-treatments-prp-exosomes-trichoscan",
    icon: <Activity className="w-8 h-8 text-white" />
  }
];

// Add related articles to each article
BLOG_ARTICLES.forEach(article => {
    if (article.id === 1) {
        article.relatedArticles = [
            BLOG_ARTICLES.find(a => a.id === 2),
            BLOG_ARTICLES.find(a => a.id === 4),
            BLOG_ARTICLES.find(a => a.id === 5)
        ].filter(Boolean);
    }
    // You can add more specific related articles for other posts here
});

    