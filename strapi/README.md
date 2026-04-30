# � LaunchPad Strapi CMS

The content management system powering the LaunchPad transportation website. This guide includes everything you need to manage content effectively.

---

## 🚀 Quick Start

### Development Server

Start Strapi with hot reload enabled:

```bash
yarn develop
# or
npm run develop
```

Access the admin panel at: **http://localhost:1337/admin**

### Production Build

```bash
yarn build
yarn start
```

### For Full Stack (Strapi + Next.js)

From the root directory:

```bash
yarn setup      # Configure both apps
yarn dev        # Start both simultaneously
yarn strapi     # Start only Strapi
yarn next       # Start only Next.js
```

---

## 📖 Documentation by Role

### 👨‍💼 For Administrators

- [**ROLES_AND_PERMISSIONS.md**](./ROLES_AND_PERMISSIONS.md) - User management, permissions, access control
- [System Settings & Configuration](./CONTENT_MANAGEMENT.md#system-settings)
- [Troubleshooting Guide](#troubleshooting)

### ✍️ For Content Editors

- [**CONTENT_MANAGEMENT.md**](./CONTENT_MANAGEMENT.md) - Complete content creation guide
- [**DATA_EXAMPLES.md**](./DATA_EXAMPLES.md) - Real examples for every content type
- [Best Practices](./CONTENT_MANAGEMENT.md#best-practices)
- [Content Checklist](#content-creation-checklist)

### 🎨 For Marketing Teams

- [Marketing Content Guide](./DATA_EXAMPLES.md#marketing-page-examples)
- [Campaign Examples](./DATA_EXAMPLES.md#blog-content-examples)
- [SEO Best Practices](./CONTENT_MANAGEMENT.md#content-creation)

### 👨‍💻 For Developers

- [Content Architecture Overview](./CONTENT_MANAGEMENT.md#content-architecture)
- [Data Relationships & Schema](./CONTENT_MANAGEMENT.md#data-relationships)
- [API Documentation](https://docs.strapi.io)

---

## 📋 Content Management Overview

### Content Types & Collections

| Type             | Purpose             | Examples                           | Read More                                                         |
| ---------------- | ------------------- | ---------------------------------- | ----------------------------------------------------------------- |
| **Fleet**        | Vehicle catalog     | Sedans, SUVs, Limousines           | [Fleet Guide](./DATA_EXAMPLES.md#fleet-content-examples)          |
| **Services**     | Service offerings   | Airport Transfer, Corporate Events | [Service Guide](./DATA_EXAMPLES.md#service-content-examples)      |
| **Articles**     | Blog & news content | Guides, How-tos, Industry news     | [Article Guide](./DATA_EXAMPLES.md#article-content-examples)      |
| **Testimonials** | Customer reviews    | 5-star feedback from clients       | [Testimonial Guide](./DATA_EXAMPLES.md#testimonial-examples)      |
| **FAQ**          | Common questions    | Booking, Safety, Pricing           | [FAQ Guide](./DATA_EXAMPLES.md#faq-examples)                      |
| **Global**       | Site-wide settings  | Navigation, Footer, SEO defaults   | [Global Config](./DATA_EXAMPLES.md#global-configuration-examples) |

### Dynamic Pages

- **Homepage** - Hero, features, testimonials, CTA blocks
- **Blog Page** - Blog listing with dynamic zones
- **Marketing Pages** - Custom content blocks for campaigns

**Learn More:** [Content Examples & Templates](./DATA_EXAMPLES.md)

---

## ✨ Key Features

### Multi-Language Support (i18n)

All main content types support multiple languages:

- English, German, French (configurable)
- Locale-specific SEO metadata
- Automatic locale switching in frontend

### Draft & Publish Workflow

- Save drafts before publishing
- Preview on website before going live
- Schedule publishing for future dates
- Version history tracking

### SEO Management

- Meta titles and descriptions
- Open Graph (OG) images
- Twitter card support
- Automatic sitemap generation
- URL redirect management

### Dynamic Page Building

Build flexible pages with reusable components:

- Hero sections
- Feature cards
- Testimonial carousels
- FAQ sections
- CTA buttons
- And more...

---

## 🎯 Getting Started as a Content Creator

### Step 1: Account Setup

1. Wait for admin to create your account
2. Log in at: http://localhost:1337/admin
3. Review your role and permissions: [ROLES_AND_PERMISSIONS.md](./ROLES_AND_PERMISSIONS.md)

### Step 2: Learn the Platform

1. Read [CONTENT_MANAGEMENT.md](./CONTENT_MANAGEMENT.md) for your role
2. Review [DATA_EXAMPLES.md](./DATA_EXAMPLES.md) for examples
3. Watch Strapi tutorial videos (optional)

### Step 3: Create Your First Content

```
For Articles:
├─ Navigate to Articles → Create new
├─ Fill in title, content, SEO fields
├─ Add featured image
├─ Preview and publish

For Services:
├─ Navigate to Services → Create new
├─ Add description and amenities
├─ Link related fleet items
├─ Publish and verify on website

For Testimonials:
├─ Navigate to Testimonials → Create new
├─ Add customer feedback
├─ Include customer name/title
├─ Add star rating
└─ Publish
```

### Step 4: Review Best Practices

- [Content Quality Checklist](./DATA_EXAMPLES.md#content-checklist-for-editors)
- [SEO Optimization](./CONTENT_MANAGEMENT.md#content-creation)
- [Naming Conventions](./DATA_EXAMPLES.md#naming-conventions)

---

## 📊 Content Management Basics

### Publishing Workflow

```mermaid
graph LR
    A["Create Draft"] → B["Preview"]
    B → C{Ready?}
    C -->|No| D["Revise"]
    D → B
    C -->|Yes| E["Publish"]
    E → F["Check on Website"]
    F → G{Looks Good?}
    G -->|No| H["Unpublish & Revise"]
    H → B
    G -->|Yes| I["✓ Live"]
```

### Required Fields by Content Type

**Articles:**

- ✓ Title (60-70 characters)
- ✓ Slug (URL-friendly)
- ✓ Description (155-160 characters)
- ✓ Content (300+ words)
- ✓ Featured Image (1200x630px)
- ✓ SEO metadata
- ✓ Category/Tags
- ✓ Publication date

**Services:**

- ✓ Title
- ✓ Slug
- ✓ Description
- ✓ Hero Image
- ✓ Service Points (min 3)
- ✓ Related Fleet
- ✓ SEO metadata

**Fleet:**

- ✓ Name
- ✓ Capacity
- ✓ Main Image
- ✓ Description
- ✓ Amenities (min 2)
- ✓ SEO metadata

---

## 🌐 Localization (Multi-Language)

All main content types are localized. When creating content:

1. **Create in Default Language** (English)
   - All fields must be filled
   - Test and publish

2. **Add Translations**
   - Click "Add translation" / "Localize"
   - Translate all content
   - Repeat for each language

3. **Verify on Website**
   - Switch language in website header
   - Confirm translated content appears

**Important:** Slugs should be unique per locale. System will add language suffix automatically.

---

## 📸 Image Guidelines

### Image Dimensions by Type

| Type                   | Dimension     | Size    | Format  |
| ---------------------- | ------------- | ------- | ------- |
| Featured Article Image | 1200 x 630px  | < 200KB | JPG/PNG |
| Hero Images            | 1920 x 1080px | < 300KB | JPG/PNG |
| Fleet/Product Images   | 800 x 600px   | < 150KB | JPG/PNG |
| OG/Social Images       | 1200 x 630px  | < 200KB | JPG/PNG |
| Logo                   | 300 x 100px   | < 50KB  | SVG/PNG |

### Image Best Practices

- Always add descriptive alt text
- Optimize file size before uploading
- Use descriptive filenames: `2025-01-airport-transfer.jpg`
- Ensure images are mobile-friendly
- Use consistent image styles across site

---

## 🔒 Permissions Overview

### Quick Reference by Role

**Administrator:**

- ✓ Full access to all content
- ✓ User management
- ✓ System settings
- ✓ Backup & retrieval

**Content Editor:**

- ✓ Create, edit, publish articles
- ✓ Manage testimonials & FAQ
- ✓ Create services & fleet items
- ✗ Cannot delete services/fleet
- ✗ Cannot access system settings

**Marketing Manager:**

- ✓ Create campaigns & promotional content
- ✓ Create & publish articles
- ✓ Manage testimonials
- ✓ View analytics
- ✗ Cannot edit core services

**Contributor:**

- ✓ Submit draft articles
- ✓ Propose content
- ✗ Cannot publish
- ✗ Requires editor approval

**See [ROLES_AND_PERMISSIONS.md](./ROLES_AND_PERMISSIONS.md) for full permission matrix**

---

## 🛠️ Common Tasks

### Publishing an Article

```
1. Navigate to Articles
2. Select existing or create new
3. Fill in all required fields:
   ├─ Title, slug, description
   ├─ Content (300+ words)
   ├─ Featured image
   └─ Categories
4. Complete SEO section:
   ├─ Meta title (optimize for keywords)
   ├─ Meta description
   └─ OG image
5. Click "Save" then "Publish"
6. Go to website and verify
```

### Creating a Testimonial

```
1. Navigate to Testimonials
2. Click "Create new testimonial"
3. Add customer feedback text
4. Fill in user information:
   ├─ First name
   ├─ Last name
   ├─ Job title
   └─ Profile photo
5. Add star rating (1-5)
6. Publish
7. Verify on homepage testimonial section
```

### Adding a Service with Related Fleet

```
1. Create Service entry:
   ├─ Title & slug
   ├─ Description
   ├─ Hero image
   └─ Service points (features)
2. Link Fleet items:
   ├─ Scroll to "Fleets" relation
   ├─ Click add and select vehicles
   └─ Save
3. Complete SEO metadata
4. Publish
5. Verify fleet vehicles appear on service page
```

### Managing Redirects

```
1. Navigate to Redirects
2. Create new redirect:
   ├─ Source: /old-page-url
   ├─ Destination: /new-page-url
   └─ Status: 301 (permanent)
3. Save and publish
4. Test old URL redirects correctly
```

---

## 🐛 Troubleshooting

### Content Not Appearing on Website

**Checklist:**

- [ ] Content is **Published** (not Draft)
- [ ] Content has correct **locale** set
- [ ] **Images are uploaded** and visible
- [ ] **Relations are linked** properly
- [ ] Clear website **cache** or reload page
- [ ] Check browser console for errors

### Images Not Showing

**Solution:**

1. Check image is uploaded in Strapi
2. Verify alt text is set
3. Confirm image dimensions are correct
4. Try re-uploading if corrupted
5. Clear CDN cache if using one

### Slug Already Exists

**Solution:**

- Slugs must be unique per content type
- Change the slug to be unique
- Add a suffix like `-2`, `-2025`, etc.
- Or use date prefix: `2025-01-article-title`

### SEO Not Indexing

**Checklist:**

- [ ] Meta title is set (50-60 chars)
- [ ] Meta description set (155-160 chars)
- [ ] OG image configured
- [ ] URL is unique
- [ ] Content has links to it
- [ ] Submit to Google Search Console
- [ ] Wait 24-48 hours for indexing

### Localization Issues

**Problem:** Translation isn't showing

- [ ] Verify translation is published
- [ ] Check correct locale in URL
- [ ] Clear browser cache
- [ ] Check language switcher works

**Problem:** Slug conflicts across locales

- [ ] Slugs CAN be identical across locales
- [ ] System adds language prefix automatically
- [ ] No action needed

---

## 📞 Support & Resources

### Internal Resources

- [CONTENT_MANAGEMENT.md](./CONTENT_MANAGEMENT.md) - Complete content guide
- [DATA_EXAMPLES.md](./DATA_EXAMPLES.md) - Real data examples
- [ROLES_AND_PERMISSIONS.md](./ROLES_AND_PERMISSIONS.md) - User roles setup

### External Resources

- [Strapi Documentation](https://docs.strapi.io) - Official docs
- [Strapi Community](https://strapi.io/community) - Help & forums
- [Strapi Tutorials](https://strapi.io/tutorials) - Video guides
- [Strapi Blog](https://strapi.io/blog) - Articles & updates

### Getting Help

- **Questions about content?** Check [CONTENT_MANAGEMENT.md](./CONTENT_MANAGEMENT.md)
- **Need data examples?** See [DATA_EXAMPLES.md](./DATA_EXAMPLES.md)
- **Permission issues?** Contact your administrator
- **Technical problems?** Check the Strapi documentation

---

## 📈 Content Performance

### Monitoring Content

The website tracks:

- Page views
- Time on page
- Bounce rate
- Click-through rate (CTR)
- Conversion rate

Work with your analytics team to:

- Identify top-performing content
- Improve underperforming articles
- Optimize for better engagement
- Plan future content strategy

---

## 🎓 Learning Resources

### For Content Editors

1. Read [CONTENT_MANAGEMENT.md](./CONTENT_MANAGEMENT.md) completely
2. Review [DATA_EXAMPLES.md](./DATA_EXAMPLES.md) for your content type
3. Reference [Best Practices](./CONTENT_MANAGEMENT.md#best-practices)
4. Practice with draft articles before publishing

### For Marketing Teams

1. Review [Marketing Examples](./DATA_EXAMPLES.md#marketing-page-examples)
2. Study [Campaign Guidelines](./DATA_EXAMPLES.md#content-checklist-for-editors)
3. Learn analytics tracking setup
4. Coordinate with content team

### For Developers

1. Understand [Content Architecture](./CONTENT_MANAGEMENT.md#content-architecture)
2. Review [Data Relationships](./CONTENT_MANAGEMENT.md#data-relationships)
3. Check [Populate Middlewares](../src/api/) in source
4. Consult Strapi API docs for advanced topics

---

## 🚀 CLI Commands Reference

| Command        | Purpose                    |
| -------------- | -------------------------- |
| `yarn develop` | Start with hot reload      |
| `yarn start`   | Start production server    |
| `yarn build`   | Build admin panel          |
| `yarn strapi`  | Run from root (full stack) |
| `yarn next`    | Run Next.js only from root |
| `yarn setup`   | Initial project setup      |

---

## ⚙️ Deployment

Strapi provides multiple deployment options:

- [Strapi Cloud](https://cloud.strapi.io) - Official hosting
- [Heroku](https://docs.strapi.io/dev-docs/deployment/heroku)
- [AWS](https://docs.strapi.io/dev-docs/deployment/amazon-aws)
- [DigitalOcean](https://docs.strapi.io/dev-docs/deployment/digitalocean)
- [Custom VPS](https://docs.strapi.io/dev-docs/deployment/other)

See [Strapi Deployment Guide](https://docs.strapi.io/dev-docs/deployment) for detailed instructions.

---

## 📚 Additional Resources

- [Strapi Documentation](https://docs.strapi.io) - Official documentation
- [Strapi Community Forum](https://forum.strapi.io) - Ask questions
- [Strapi Discord](https://discord.strapi.io) - Real-time chat
- [Changelog](https://strapi.io/changelog) - Product updates

---

**Created:** January 2025  
**Last Updated:** January 2025  
**Version:** 1.0

For content management help, start with [CONTENT_MANAGEMENT.md](./CONTENT_MANAGEMENT.md)

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
