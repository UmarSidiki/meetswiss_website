# 📋 Strapi Content Management Guide

A comprehensive guide to managing content in LaunchPad's Strapi CMS. This document organizes all content types, components, and relationships with professional examples for different user roles.

---

## 📑 Table of Contents

1. [Content Architecture](#content-architecture)
2. [Core Content Types](#core-content-types)
3. [System Settings](#system-settings)
4. [Components & Building Blocks](#components--building-blocks)
5. [Content Examples by User Role](#content-examples-by-user-role)
6. [Data Relationships](#data-relationships)
7. [Best Practices](#best-practices)

---

## Content Architecture

### Content Hierarchy

```
🌍 Global Settings (Single Type)
├─ Navigation Configuration
├─ Footer Links
├─ SEO Defaults
└─ Organization Branding

📄 Core Content (Collection Types)
├─ 🚗 Fleet Management
│  ├─ Individual Vehicles
│  ├─ Amenities
│  └─ Service Relationships
├─ 🛠️ Services
│  ├─ Service Descriptions
│  ├─ Service Points
│  └─ Associated Fleet
├─ 📰 Blog & Articles
│  ├─ Articles
│  ├─ Categories/Tags
│  ├─ Blog Page Settings
│  └─ Related Content
├─ ⭐ Testimonials & Reviews
├─ ❓ FAQ & Documentation
└─ 🎯 Redirects (SEO Management)

🎨 Marketing Pages (Single Type)
└─ Dynamic Content Zones
   ├─ Hero Sections
   ├─ Feature Cards
   ├─ CTA Blocks
   ├─ Forms
   └─ etc.
```

---

## Core Content Types

### 1️⃣ Fleet Management

**Purpose:** Manage vehicle inventory, specifications, and availability.

#### Fleet Content Type Fields

| Field         | Type              | Localized | Required | Description                      |
| ------------- | ----------------- | --------- | -------- | -------------------------------- |
| `name`        | String            | ✓         | ✓        | Vehicle name/model               |
| `slug`        | UID               | ✓         | ✓        | URL-friendly identifier          |
| `description` | Rich Text         | ✓         | ✓        | Detailed vehicle description     |
| `capacity`    | Integer           | ✗         | ✓        | Maximum passenger count          |
| `image`       | Media             | ✗         | ✓        | Primary vehicle image            |
| `amenities`   | Component (steps) | ✓         | ✓        | List of features/amenities       |
| `services`    | Relation          | ✗         | ✗        | Associated services (manyToMany) |
| `seo`         | Component         | ✓         | ✗        | SEO metadata                     |

#### Example: Premium Sedan

```json
{
  "name": "Premium Sedan Class",
  "slug": "premium-sedan-class",
  "description": "Luxury sedan perfect for business travel and executive transportation. Features leather seating, climate control, and advanced safety systems.",
  "capacity": 4,
  "image": {
    "url": "/uploads/sedan_premium_2024.jpg",
    "alt": "Black Premium Sedan"
  },
  "amenities": [
    {
      "title": "Wi-Fi & Connectivity",
      "description": "High-speed onboard Wi-Fi"
    },
    {
      "title": "Premium Audio System",
      "description": "Bose premium sound system"
    },
    {
      "title": "Climate Control",
      "description": "Individual zone climate control"
    },
    {
      "title": "USB Charging Ports",
      "description": "Multiple charging options"
    }
  ],
  "services": ["airport-transfer", "corporate-events"]
}
```

---

### 2️⃣ Services

**Purpose:** Define service offerings, descriptions, and related fleets.

#### Service Content Type Fields

| Field            | Type              | Localized | Required | Description             |
| ---------------- | ----------------- | --------- | -------- | ----------------------- |
| `title`          | String            | ✓         | ✓        | Service name            |
| `slug`           | UID               | ✓         | ✓        | URL-friendly identifier |
| `description`    | Rich Text         | ✓         | ✓        | Service overview        |
| `hero_image`     | Media             | ✗         | ✓        | Service header image    |
| `service_points` | Component (steps) | ✓         | ✓        | Key service features    |
| `fleets`         | Relation          | ✗         | ✗        | Available fleet options |
| `seo`            | Component         | ✓         | ✗        | SEO metadata            |

#### Example: Airport Transfer Service

```json
{
  "id": "airport-transfer",
  "title": "Airport Transfer Service",
  "slug": "airport-transfer",
  "description": "Professional airport transportation with real-time flight tracking and flexible pickup scheduling. We ensure punctual arrivals with premium comfort.",
  "hero_image": {
    "url": "/uploads/airport_transfer_hero.jpg",
    "alt": "Airport Transfer Service"
  },
  "service_points": [
    {
      "title": "Flight Tracking",
      "description": "Real-time flight status monitoring for optimal pickup timing"
    },
    {
      "title": "Meet & Greet",
      "description": "Professional driver waiting with name placard in arrivals hall"
    },
    {
      "title": "Luggage Assistance",
      "description": "Full assistance with baggage handling and loading"
    },
    {
      "title": "Direct Routing",
      "description": "Express routes avoiding traffic congestion"
    }
  ],
  "fleets": ["premium-sedan-class", "luxury-suv"]
}
```

---

### 3️⃣ Articles & Blog

**Purpose:** Publish articles, news, and content marketing materials.

#### Article Content Type Fields

| Field          | Type         | Localized | Required | Description               |
| -------------- | ------------ | --------- | -------- | ------------------------- |
| `title`        | String       | ✓         | ✓        | Article headline          |
| `slug`         | UID          | ✓         | ✓        | URL-friendly identifier   |
| `description`  | Text         | ✓         | ✓        | SEO meta description      |
| `content`      | Rich Text    | ✓         | ✓        | Article body              |
| `image`        | Media        | ✗         | ✓        | Featured image            |
| `categories`   | Relation     | ✗         | ✗        | Article tags (manyToMany) |
| `dynamic_zone` | Dynamic Zone | ✓         | ✗        | Embedded content blocks   |
| `seo`          | Component    | ✓         | ✗        | Complete SEO data         |
| `publishedAt`  | DateTime     | ✗         | ✓        | Publication date          |

#### Example: Travel Tips Article

```json
{
  "title": "7 Essential Tips for Comfortable Airport Transportation",
  "slug": "airport-transportation-tips",
  "description": "Professional tips for making your airport transfers smooth and comfortable",
  "content": "When traveling, your airport transfer sets the tone for your entire journey. Here's how to make it seamless...",
  "image": {
    "url": "/uploads/travel_tips_cover.jpg",
    "alt": "Airport Transportation Tips"
  },
  "categories": ["travel-tips", "ground-transportation"],
  "seo": {
    "metaTitle": "7 Essential Tips for Comfortable Airport Transportation",
    "metaDescription": "Professional tips for seamless airport transfers and ground transportation",
    "metaImage": {
      "url": "/uploads/travel_tips_seo.jpg"
    }
  },
  "publishedAt": "2025-01-15T10:00:00.000Z"
}
```

#### Blog Page (Single Type)

**Purpose:** Configure the blog listing page with dynamic content zones.

```json
{
  "title": "Blog & News",
  "description": "Latest updates and insights from our transportation services",
  "dynamic_zone": [
    {
      "__component": "dynamic-zone/hero",
      "title": "Insights & Updates",
      "subtitle": "Read our latest articles on transportation trends and tips"
    },
    {
      "__component": "dynamic-zone/related-articles",
      "title": "Featured Articles"
    }
  ]
}
```

---

### 4️⃣ Testimonials & Reviews

**Purpose:** Display customer reviews and success stories.

#### Testimonial Content Type Fields

| Field         | Type      | Localized | Required | Description             |
| ------------- | --------- | --------- | -------- | ----------------------- |
| `text`        | Rich Text | ✓         | ✓        | Customer review content |
| `user`        | Component | ✗         | ✓        | Customer profile info   |
| `rating`      | Integer   | ✗         | ✗        | Star rating (1-5)       |
| `publishedAt` | DateTime  | ✗         | ✓        | Publication date        |

#### User Component Fields

| Field       | Type   | Required | Description         |
| ----------- | ------ | -------- | ------------------- |
| `firstName` | String | ✓        | Customer first name |
| `lastName`  | String | ✓        | Customer last name  |
| `jobTitle`  | String | ✗        | Professional role   |
| `image`     | Media  | ✓        | Profile photo       |

#### Example: Executive Testimonial

```json
{
  "text": "The airport transfer service exceeded all expectations. Professional drivers, immaculate vehicles, and punctual service every single time. Highly recommended for business travelers.",
  "user": {
    "firstName": "Michael",
    "lastName": "Richardson",
    "jobTitle": "Chief Executive Officer, Tech Ventures Inc.",
    "image": {
      "url": "/uploads/testimonial_michael.jpg",
      "alt": "Michael Richardson"
    }
  },
  "rating": 5,
  "publishedAt": "2025-01-10T14:30:00.000Z"
}
```

---

### 5️⃣ FAQ & Documentation

**Purpose:** Provide answers to common questions and support documentation.

#### FAQ Content Type Fields

| Field      | Type      | Localized | Required | Description     |
| ---------- | --------- | --------- | -------- | --------------- |
| `question` | String    | ✓         | ✓        | FAQ question    |
| `answer`   | Rich Text | ✓         | ✓        | Detailed answer |
| `category` | String    | ✓         | ✗        | FAQ category    |
| `order`    | Integer   | ✗         | ✗        | Display order   |

#### Example: Booking FAQs

```json
[
  {
    "question": "How much advance notice do I need to book a transfer?",
    "answer": "We recommend booking at least 24 hours in advance. However, we also handle last-minute bookings based on vehicle availability. Contact our support team for urgent requests.",
    "category": "Booking",
    "order": 1
  },
  {
    "question": "What is your cancellation policy?",
    "answer": "Free cancellation up to 24 hours before your scheduled transfer. Cancellations within 24 hours may incur a service fee. For emergencies, our team will work with you.",
    "category": "Booking",
    "order": 2
  },
  {
    "question": "Do you offer corporate accounts and special rates?",
    "answer": "Yes! We offer customized corporate packages with dedicated account management, flexible billing, and volume discounts for regular bookings.",
    "category": "Services",
    "order": 3
  }
]
```

---

### 6️⃣ URL Redirects (SEO Management)

**Purpose:** Manage URL changes and maintain SEO integrity.

#### Redirection Content Type Fields

| Field         | Type    | Required | Description           |
| ------------- | ------- | -------- | --------------------- |
| `source`      | String  | ✓        | Original URL path     |
| `destination` | String  | ✓        | Target URL path       |
| `statusCode`  | Integer | ✓        | HTTP status (301/302) |
| `permanent`   | Boolean | ✓        | Permanent redirect?   |

#### Examples

```json
[
  {
    "source": "/old-airport-service",
    "destination": "/airport-transfer",
    "statusCode": 301,
    "permanent": true
  },
  {
    "source": "/blog/old-article-slug",
    "destination": "/blog/airport-transportation-tips",
    "statusCode": 301,
    "permanent": true
  }
]
```

---

## System Settings

### Global Configuration (Single Type)

**Purpose:** Manage site-wide settings, navigation, and branding.

#### Global Type Fields

| Field                | Type      | Description            |
| -------------------- | --------- | ---------------------- |
| `siteName`           | String    | Website name           |
| `siteDescription`    | Text      | Site tagline           |
| `navbar`             | Component | Navigation menu config |
| `footer`             | Component | Footer links and info  |
| `seo`                | Component | Default SEO settings   |
| `organizationLogo`   | Media     | Logo asset             |
| `defaultSocialImage` | Media     | Default OG image       |

#### Navbar Component Example

```json
{
  "logo": {
    "url": "/uploads/launchpad_logo.svg"
  },
  "leftItems": [
    {
      "label": "Services",
      "href": "/services"
    },
    {
      "label": "Fleet",
      "href": "/fleet"
    },
    {
      "label": "Blog",
      "href": "/blog"
    }
  ],
  "rightItems": [
    {
      "label": "Pricing",
      "href": "/pricing"
    },
    {
      "label": "Contact",
      "href": "/contact",
      "target": "_blank"
    },
    {
      "label": "Book Now",
      "href": "https://booking.example.com",
      "variant": "primary"
    }
  ]
}
```

#### Footer Component Example

```json
{
  "logo": {
    "url": "/uploads/launchpad_logo_white.svg"
  },
  "description": "Professional ground transportation and fleet management services.",
  "copyright": "© 2025 LaunchPad Transportation. All rights reserved.",
  "builtWith": "Built with Strapi",
  "internalLinks": [
    {
      "label": "Privacy Policy",
      "href": "/privacy"
    },
    {
      "label": "Terms of Service",
      "href": "/terms"
    },
    {
      "label": "Cookie Policy",
      "href": "/cookies"
    }
  ],
  "policyLinks": [
    {
      "label": "Accessibility Statement",
      "href": "/accessibility"
    }
  ],
  "socialLinks": [
    {
      "platform": "LinkedIn",
      "url": "https://linkedin.com/company/launchpad"
    },
    {
      "platform": "Twitter",
      "url": "https://twitter.com/launchpad"
    }
  ]
}
```

---

## Components & Building Blocks

### Dynamic Zone Components

Dynamic zones allow you to build flexible page layouts with reusable blocks.

#### 1. Hero Section

```json
{
  "__component": "dynamic-zone/hero",
  "title": "Premium Ground Transportation",
  "subtitle": "Book reliable, professional transportation services",
  "slides": [
    {
      "image": {
        "url": "/uploads/hero_slide_1.jpg"
      }
    }
  ],
  "button": {
    "text": "Book a Ride",
    "href": "https://booking.example.com",
    "variant": "primary"
  }
}
```

#### 2. Features Section

```json
{
  "__component": "dynamic-zone/features",
  "title": "Why Choose Us",
  "cards": [
    {
      "__component": "cards/globe-card",
      "title": "Nationwide Coverage",
      "description": "Operating in 50+ cities nationwide"
    },
    {
      "__component": "cards/ray-card",
      "title": "Professional Drivers",
      "description": "Thoroughly vetted and trained professionals"
    }
  ]
}
```

#### 3. Testimonials Section

```json
{
  "__component": "dynamic-zone/testimonials",
  "title": "What Our Clients Say",
  "testimonials": ["testimonial-1", "testimonial-2"]
}
```

#### 4. FAQ Section

```json
{
  "__component": "dynamic-zone/faq",
  "title": "Frequently Asked Questions",
  "faqs": ["faq-1", "faq-2", "faq-3"]
}
```

#### 5. Call-to-Action Block

```json
{
  "__component": "dynamic-zone/cta",
  "buttons": [
    {
      "text": "Book Now",
      "href": "https://booking.example.com",
      "variant": "primary"
    },
    {
      "text": "Learn More",
      "href": "/services",
      "variant": "outline"
    }
  ]
}
```

---

## Content Examples by User Role

### 👨‍💼 Admin Role

**Responsibilities:** Full system management, settings, backups.

**Content Admin Can Do:**

- Create and manage all content types
- Configure global settings and navigation
- Manage user permissions and roles
- Access analytics and reports
- Perform bulk operations

**Typical Workflow:**

1. Review system health and analytics
2. Approve/reject content from editors
3. Manage SEO redirects
4. Update global configuration
5. Monitor content updates from other users

---

### ✍️ Content Editor Role

**Responsibilities:** Create and maintain content, but cannot manage settings.

**Sample Content Package for Editor Onboarding:**

#### Articles to Publish

```markdown
1. "Getting Started with Airport Transfers"
   - Target: New customers
   - Keywords: airport transport, ground transportation
   - Sections: Introduction, Benefits, How to Book, FAQ

2. "Fleet Maintenance & Safety Standards"
   - Target: Safety-conscious customers
   - Keywords: vehicle safety, maintenance, standards
   - Sections: Maintenance schedule, Safety features, Certifications

3. "Corporate Transportation Solutions"
   - Target: B2B clients
   - Keywords: corporate transfer, enterprise, bulk booking
   - Sections: Benefits, Pricing, Case studies
```

#### Testimonials to Collect

```markdown
Customer Profile Types:

1. Business Executive
   - Focus: Professionalism, punctuality
   - Length: 2-3 sentences
   - Rating: 5 stars typical

2. Leisure Traveler
   - Focus: Comfort, convenience
   - Length: 1-2 sentences
   - Rating: 4-5 stars

3. Corporate Manager
   - Focus: Reliability, employee satisfaction
   - Length: 3-4 sentences
   - Rating: 5 stars typical
```

**Required Fields for Each Article:**

- Title (60-70 characters for SEO)
- Slug (auto-generated from title)
- Description (meta description, 155-160 characters)
- Featured image (1200x630px recommended)
- Category/Tags
- Content (min 300 words)
- SEO title and description
- Publication date

---

### 🎨 Marketing Role

**Responsibilities:** Campaign content, promotions, seasonal updates.

**Sample Promotional Content:**

#### Seasonal Campaign: Summer Travel Season

```json
{
  "title": "Summer Travel Made Easy: Special Airport Transfer Rates",
  "slug": "summer-airport-transfer-promo",
  "description": "Beat the summer rush with our airport transfer service. Book now and get 20% off",
  "content": "...",
  "image": {
    "url": "/uploads/summer_campaign_2025.jpg"
  },
  "dynamic_zone": [
    {
      "__component": "dynamic-zone/hero",
      "title": "Summer Travel Season Special Offer",
      "subtitle": "20% off airport transfers through September 30th"
    },
    {
      "__component": "dynamic-zone/cta",
      "buttons": [
        {
          "text": "Claim Your Discount",
          "href": "https://booking.example.com?promo=SUMMER20"
        }
      ]
    }
  ]
}
```

#### Flash Sale Promotion

```json
{
  "title": "Weekend Flash Sale: Premium Sedan Class",
  "campaigns": {
    "discount": "25%",
    "validUntil": "2025-02-28T23:59:59Z",
    "promoCode": "WEEKEND25"
  }
}
```

---

### 📊 Data Analyst Role

**Responsibilities:** Report on content performance, user engagement, SEO metrics.

**Key Queries:**

```sql
-- Top performing articles (page views)
SELECT title, slug, pageViews, avgTimeOnPage
FROM articles
ORDER BY pageViews DESC

-- Articles by category
SELECT category, COUNT(*) as count
FROM articles
GROUP BY category

-- Content publication history
SELECT title, publishedAt, status
FROM articles
WHERE publishedAt BETWEEN '2025-01-01' AND '2025-01-31'

-- SEO optimization status
SELECT title, seo.metaTitle, seo.metaDescription
FROM articles
WHERE seo.metaTitle IS NULL OR seo.metaDescription IS NULL
```

---

## Data Relationships

### Relationship Diagram

```
┌─────────────────────────────────────┐
│         GLOBAL (Single Type)        │
│  (Navbar, Footer, Branding, SEO)    │
└────────┬────────────────────────────┘
         │
         ├── navbar.logo --> Logo
         ├── footer.logo --> Logo
         └── organizationLogo --> Logo

┌─────────────────┐      ┌──────────────┐
│     Service     │──────│    Fleet     │
│  (manyToMany    │      │  Vehicles &  │
│  Relationship)  │      │  Amenities   │
└─────────────────┘      └──────────────┘

┌──────────────┐      ┌────────────────┐
│   Article    │──────│   Categories   │
│(manyToMany)  │      │  (Tags/Topics) │
└──────────────┘      └────────────────┘

┌────────────────────────────────────┐
│       Blog Page (Single Type)       │
│  (Settings + Dynamic Zone Blocks)   │
└────────────────────────────────────┘
         │
         ├── dynamic_zone: Hero
         ├── dynamic_zone: Features
         ├── dynamic_zone: Testimonials
         ├── dynamic_zone: FAQ
         └── dynamic_zone: Related Articles

┌──────────────────┐
│  Testimonial     │
│  (Reviews)       │
└──────────────────┘
         │
         └── user (Customer Profile)
```

---

## Best Practices

### ✅ Content Creation

1. **SEO Optimization**
   - Use meta titles (50-60 characters)
   - Write meta descriptions (155-160 characters)
   - Use relevant keywords naturally
   - Add alt text to all images

2. **Localization**
   - Translate all localized content types
   - Use locale-specific examples
   - Maintain consistent terminology across languages
   - Use professional translation for B2B content

3. **Image Management**
   - Use appropriate dimensions:
     - Featured images: 1200x630px (16:9)
     - Hero images: 1920x1080px or wider
     - Product/Fleet images: 800x600px
   - Optimize file size (< 200KB recommended)
   - Always add descriptive alt text

4. **Content Quality**
   - Minimum 300 words for articles
   - Use clear headings and subheadings
   - Break content into readable paragraphs
   - Include relevant internal links
   - Proofread before publishing

5. **Consistency**
   - Follow naming conventions
   - Use consistent terminology
   - Match tone across content types
   - Keep formatting uniform

### ✅ Content Organization

1. **Naming Conventions**
   - Use descriptive, keyword-rich titles
   - Create URL-friendly slugs (lowercase, hyphens)
   - Categorize content appropriately
   - Use consistent date formats

2. **Relationship Management**
   - Link related articles
   - Associate content with appropriate categories
   - Link services to available fleet options
   - Maintain referential integrity

3. **Publishing Workflow**
   - Save as draft before publishing
   - Preview on website before scheduling
   - Use publication dates for scheduling
   - Archive outdated content properly

4. **Maintenance**
   - Review and update content quarterly
   - Check for broken links and images
   - Update testimonials and reviews
   - Monitor SEO performance

---

## Common Content Scenarios

### Scenario 1: Launching a New Service

**Steps:**

1. Create Service content type entry
2. Add service_points (features/benefits)
3. Link related Fleet vehicles
4. Create supporting Article(s)
5. Add Testimonials from pilot customers
6. Update Global navigation if needed
7. Add FAQ entries if applicable

**Required Content:**

- 1 Service entry (300+ words)
- 2-3 Articles about the service
- 3-5 Testimonials
- 5-10 FAQ entries
- Service images and Fleet associations
- SEO data for all content

---

### Scenario 2: Blog Campaign Series

**Steps:**

1. Create topic-specific Category
2. Write 5-8 related Articles
3. Add cross-linking in dynamic_zone
4. Create hero/intro Article
5. Add testimonials and social proof
6. Update Blog page with campaign info
7. Add redirects from old URLs if applicable

**Content Checklist:**

- ✓ Category created and described
- ✓ All articles published with category
- ✓ Related articles linked
- ✓ Testimonials added for credibility
- ✓ SEO optimized all entries
- ✓ Scheduled publication dates

---

## Troubleshooting

### Content Not Appearing on Frontend

**Checklist:**

- [ ] Content is Published (not Draft)
- [ ] Content has correct locale set
- [ ] Relations are properly configured
- [ ] Populate middleware includes the field
- [ ] Images/media are properly uploaded
- [ ] Caching is cleared

### SEO Not Reflecting

**Checklist:**

- [ ] Meta title and description set
- [ ] OG image configured
- [ ] Schema markup included
- [ ] Site sitemap updated
- [ ] Google Search Console reindex submitted

### Missing Relations or Data

**Checklist:**

- [ ] Related content is Published
- [ ] Relation field is not empty
- [ ] No circular or conflicting links
- [ ] Correct content type linked
- [ ] Permissions allow viewing related content

---

## Resources

- [Strapi Documentation](https://docs.strapi.io/)
- [Content Management Best Practices](https://strapi.io/blog)
- [SEO & Metadata Guide](https://docs.strapi.io/dev-docs/plugins/seo)
- [i18n Localization](https://docs.strapi.io/dev-docs/plugins/i18n)
