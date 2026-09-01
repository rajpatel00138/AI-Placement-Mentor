export type CompanyCategory =
  | "Big Tech"
  | "Indian IT"
  | "Startups"
  | "Fintech & Consulting"
  | "Global Product"
  | "Hardware";

export interface Company {
  name: string;
  category: CompanyCategory;
  tag?: string;
}

export const COMPANY_CATEGORIES: Array<{ id: "All" | CompanyCategory; label: string }> = [
  { id: "All", label: "All Companies" },
  { id: "Big Tech", label: "Big Tech" },
  { id: "Indian IT", label: "Indian IT & Services" },
  { id: "Startups", label: "Startups & Unicorns" },
  { id: "Fintech & Consulting", label: "Fintech & Consulting" },
  { id: "Global Product", label: "Global Product" },
  { id: "Hardware", label: "Hardware & Chips" },
];

export const TARGET_COMPANIES: Company[] = [
  // 1. Global Big Tech
  { name: "Google", category: "Big Tech", tag: "FAANG / Tier 1" },
  { name: "Microsoft", category: "Big Tech", tag: "Cloud & Systems" },
  { name: "Amazon", category: "Big Tech", tag: "E-Commerce & AWS" },
  { name: "Meta", category: "Big Tech", tag: "Social & AI" },
  { name: "Apple", category: "Big Tech", tag: "Consumer Tech" },
  { name: "Netflix", category: "Big Tech", tag: "Streaming & Distributed" },
  { name: "Adobe", category: "Big Tech", tag: "Creative Cloud" },
  { name: "Oracle", category: "Big Tech", tag: "Database & Cloud" },
  { name: "Salesforce", category: "Big Tech", tag: "Enterprise CRM" },
  { name: "IBM", category: "Big Tech", tag: "Enterprise AI" },
  { name: "Intel", category: "Big Tech", tag: "Semiconductor" },
  { name: "Nvidia", category: "Big Tech", tag: "GPU & AI Compute" },
  { name: "SAP", category: "Big Tech", tag: "Enterprise Software" },
  { name: "Cisco", category: "Big Tech", tag: "Networking & Security" },
  { name: "Dell", category: "Big Tech", tag: "Infrastructure" },
  { name: "HP", category: "Big Tech", tag: "Hardware & Computing" },

  // 2. Indian IT Services / Product Companies
  { name: "TCS", category: "Indian IT", tag: "IT Services Leader" },
  { name: "Infosys", category: "Indian IT", tag: "Global IT Solutions" },
  { name: "Wipro", category: "Indian IT", tag: "Consulting & Services" },
  { name: "HCLTech", category: "Indian IT", tag: "Digital & Engineering" },
  { name: "Tech Mahindra", category: "Indian IT", tag: "Telecom & Digital" },
  { name: "Cognizant", category: "Indian IT", tag: "Global Consulting" },
  { name: "Capgemini", category: "Indian IT", tag: "Engineering & IT" },
  { name: "LTIMindtree", category: "Indian IT", tag: "Digital Transformation" },
  { name: "Zoho", category: "Indian IT", tag: "SaaS & Productivity" },
  { name: "Freshworks", category: "Indian IT", tag: "Customer CRM SaaS" },
  { name: "Persistent Systems", category: "Indian IT", tag: "Software Engineering" },

  // 3. Indian Startups / Unicorns
  { name: "Flipkart", category: "Startups", tag: "E-Commerce Unicorn" },
  { name: "Zomato", category: "Startups", tag: "FoodTech & Logistics" },
  { name: "Swiggy", category: "Startups", tag: "Hyperlocal Delivery" },
  { name: "Paytm", category: "Startups", tag: "Fintech & Payments" },
  { name: "PhonePe", category: "Startups", tag: "UPI & Digital Wallet" },
  { name: "Razorpay", category: "Startups", tag: "Payment Gateway" },
  { name: "CRED", category: "Startups", tag: "Fintech Rewards" },
  { name: "Meesho", category: "Startups", tag: "Social Commerce" },
  { name: "Ola", category: "Startups", tag: "Mobility & EV" },
  { name: "Byju's", category: "Startups", tag: "EdTech" },
  { name: "Nykaa", category: "Startups", tag: "Beauty E-Commerce" },

  // 4. Global Fintech / Banking / Consulting
  { name: "Goldman Sachs", category: "Fintech & Consulting", tag: "Investment Banking" },
  { name: "JPMorgan Chase", category: "Fintech & Consulting", tag: "Global Banking" },
  { name: "Morgan Stanley", category: "Fintech & Consulting", tag: "Wealth & Finance" },
  { name: "Barclays", category: "Fintech & Consulting", tag: "Universal Banking" },
  { name: "HSBC", category: "Fintech & Consulting", tag: "International Banking" },
  { name: "Deloitte", category: "Fintech & Consulting", tag: "Strategy & Tech Consulting" },
  { name: "Accenture", category: "Fintech & Consulting", tag: "Global Consulting" },
  { name: "McKinsey & Company", category: "Fintech & Consulting", tag: "Management Consulting" },
  { name: "EY", category: "Fintech & Consulting", tag: "Advisory & Assurance" },
  { name: "PwC", category: "Fintech & Consulting", tag: "Strategy & Tech Consulting" },

  // 5. Other Global Tech / Product Companies
  { name: "Atlassian", category: "Global Product", tag: "Dev Tools (Jira/Confluence)" },
  { name: "Walmart", category: "Global Product", tag: "Retail Tech & Supply Chain" },
  { name: "Uber", category: "Global Product", tag: "Ride-Sharing & Routing" },
  { name: "Stripe", category: "Global Product", tag: "Global Financial Infrastructure" },
  { name: "Airbnb", category: "Global Product", tag: "Travel & Hospitality" },
  { name: "Spotify", category: "Global Product", tag: "Audio & Recommendation" },
  { name: "Shopify", category: "Global Product", tag: "Commerce Platform" },
  { name: "Twilio", category: "Global Product", tag: "Cloud Communications" },
  { name: "ServiceNow", category: "Global Product", tag: "Enterprise Workflow" },
  { name: "Palantir", category: "Global Product", tag: "Big Data & Defense" },
  { name: "Snowflake", category: "Global Product", tag: "Data Cloud & Warehousing" },

  // 6. Semiconductor / Hardware
  { name: "Qualcomm", category: "Hardware", tag: "Mobile Processors & 5G" },
  { name: "AMD", category: "Hardware", tag: "CPUs & GPUs" },
  { name: "Texas Instruments", category: "Hardware", tag: "Embedded & Analog Chips" },
];
