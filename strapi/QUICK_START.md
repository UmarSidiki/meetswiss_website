# 🚀 Quick Start Guide - Content Creators

A quick reference guide to get you producing content in LaunchPad's Strapi CMS in minutes.

---

## ⚡ 5-Minute Setup

### 1. Log In

- **URL:** http://localhost:1337/admin
- **Username:** Your email (provided by admin)
- **Password:** Your password (provided by admin)

### 2. Understand Your Role

Check your permissions at [ROLES_AND_PERMISSIONS.md](./ROLES_AND_PERMISSIONS.md)

```
👨‍💼 Admin        → Full access
✍️  Editor       → Create articles, testimonials, FAQ
🎨 Marketing    → Create campaigns and promotional content
👨‍💻 Developer    → Technical documentation
```

### 3. Choose Your First Task

**Creating an Article?**
→ [Jump to Article Creation](#create-your-first-article)

**Creating a Testimonial?**
→ [Jump to Testimonial Creation](#create-a-testimonial)

**Creating a Service?**
→ [Jump to Service Creation](#create-a-service)

---

## 📝 Create Your First Article

### Step-by-Step

1. **Open Strapi Admin**
   - Go to http://localhost:1337/admin
   - Click "Content Manager" in sidebar
   - Click "Articles"

2. **Create New Article**
   - Click "+ Create new entry"
   - Fill in the title
   - Auto-generated slug appears (edit if needed)

3. **Enter Required Content**

   ```
   Title:           "My First Article" (60-70 characters)
   Slug:            "my-first-article" (auto-generated)
   Description:     Your SEO meta description (155-160 chars)
   Content:         Your article body (300+ words)
   Featured Image:  Upload a 1200x630px image
   ```

4. **Optimize for SEO**
   - Scroll to "SEO"
   - Set Meta Title (50-60 chars)
   - Set Meta Description (155-160 chars)
   - Add OG Image
   - SEO Score should be green

5. **Add Categories**
   - Scroll to "Categories"
   - Click "+" and select relevant tags
   - E.g., "Travel Tips", "How-To Guides"

6. **Preview Before Publishing**
   - Click "Save" first
   - Go to website (http://localhost:3000)
   - Check if it looks good

7. **Publish**
   - Return to article in Strapi
   - Click "Publish" button
   - Set publication date if needed
   - Article is now live!

---

## ⭐ Create a Testimonial

1. **Navigate to Testimonials**
   - Content Manager → Testimonials
   - Click "+ Create new entry"

2. **Fill in Customer Review**

   ```
   Text:     Customer's feedback (1-3 sentences)
   Rating:   Select star rating (1-5)
   ```

3. **Add Customer Info**
   - First Name: "John"
   - Last Name: "Smith"
   - Job Title: "CEO, Company XYZ"
   - Upload profile photo (square 200x200px)

4. **Publish**
   - Click "Publish"
   - Check website homepage for new testimonial

---

## 🛠️ Create a Service

1. **Navigate to Services**
   - Content Manager → Services
   - Click "+ Create new entry"

2. **Basic Info**

   ```
   Title:            "Airport Transfer Service"
   Slug:             "airport-transfer-service"
   Description:      Overview of the service
   Hero Image:       Service header image (1920x1080px)
   ```

3. **Add Service Points** (Features/Benefits)
   - Click "+ Add Service Point"
   - Title: "Real-Time Flight Tracking"
   - Description: "We monitor your flight..."
   - Add at least 3 service points

4. **Link Related Fleet**
   - Scroll to "Fleets"
   - Click "+" and select vehicles
   - E.g., Economy Sedan, Premium SUV

5. **SEO Settings**
   - Complete SEO metadata
   - Add OG image

6. **Publish**
   - Click "Publish"
   - Verify on website

---

## 📋 Create an FAQ Entry

1. **Navigate to FAQ**
   - Content Manager → FAQs
   - Click "+ Create new entry"

2. **Fill in Q&A**

   ```
   Question:   "How far in advance should I book?"
   Answer:     "We recommend 24-48 hours..."
   Category:   "Booking" (or other relevant)
   Order:      1, 2, 3... (display order)
   ```

3. **Publish**
   - Click "Publish"

---

## ✅ Key Reminders Checklist

**Before Publishing ANY Content:**

```markdown
Content Quality
□ Minimum 300 words (articles)
□ Grammar and spelling checked
□ Links tested and working
□ Images optimized (< 200KB)
□ No duplicate content

SEO Optimization
□ Meta title set (50-60 chars)
□ Meta description set (155-160 chars)
□ Keywords naturally included
□ Alt text on all images
□ OG image configured

Structure
□ Clear headings and hierarchy
□ Relevant categories assigned
□ Internal links added
□ Related content linked

Images
□ Correct dimensions
□ Descriptive filenames
□ Optimized file size
□ Alt text added
□ Relevant to content

Final Check
□ Preview on website
□ Check all links work
□ Verify mobile appearance
□ Confirm metadata looks good
□ Ready to publish!
```

---

## 🖼️ Image Size Cheat Sheet

```
Featured Article Image:  1200 x 630px
Hero Images:            1920 x 1080px
Product/Fleet Images:    800 x 600px
Social/OG Images:       1200 x 630px
Profile Photos:          200 x 200px
Logos:                   300 x 100px

📌 Max File Size: 200KB (for fast loading)
📌 Format: JPG or PNG
```

---

## 🌍 Working with Multiple Languages

**If your content is localized:**

1. **Create in Default Language First**
   - Fill in all fields in English
   - Publish

2. **Add Translation**
   - Click "Localize" (top right)
   - Select language (e.g., German, French)
   - Translate all fields
   - Publish

3. **Test**
   - Go to website
   - Switch language in header
   - Verify translated content appears

---

## 🚨 Common Mistakes to Avoid

❌ **DON'T:**

- Publish without previewing first
- Skip SEO metadata
- Forget to optimize images
- Use random filenames for images
- Create duplicate content
- Link to broken pages
- Ignore alt text on images

✅ **DO:**

- Always preview before publishing
- Complete all SEO fields
- Optimize images to < 200KB
- Use descriptive filenames
- Add helpful alt text
- Test all links
- Follow naming conventions

---

## 📚 Full Documentation

For more details, see:

- **Content Management Guide:** [CONTENT_MANAGEMENT.md](./CONTENT_MANAGEMENT.md)
- **Data Examples:** [DATA_EXAMPLES.md](./DATA_EXAMPLES.md)
- **Roles & Permissions:** [ROLES_AND_PERMISSIONS.md](./ROLES_AND_PERMISSIONS.md)

---

## 🆘 Need Help?

**Common Questions?**
→ Check [CONTENT_MANAGEMENT.md - Troubleshooting](./CONTENT_MANAGEMENT.md#troubleshooting)

**Need data examples?**
→ See [DATA_EXAMPLES.md](./DATA_EXAMPLES.md)

**Permission issues?**
→ Contact your administrator

**Technical problem?**
→ Check [Strapi Documentation](https://docs.strapi.io)

---

## ⌨️ Keyboard Shortcuts

| Shortcut               | Action       |
| ---------------------- | ------------ |
| `Ctrl/Cmd + S`         | Save draft   |
| `Ctrl/Cmd + Shift + P` | Publish      |
| `Ctrl/Cmd + K`         | Quick search |
| `ESC`                  | Close modal  |

---

## 📊 Understanding the Strapi Interface

```
┌─────────────────────────────────────┐
│         Strapi Admin Panel          │
├─────────────────────────────────────┤
│ Content Manager (Left Sidebar)       │
├─ Articles                           │
├─ Services                           │
├─ Fleet                              │
├─ Testimonials                       │
├─ FAQ                                │
├─ Categories                         │
└─ Global Settings                    │
└─────────────────────────────────────┘
```

---

## 🎯 Your First Week Roadmap

**Day 1:**

- [ ] Login and explore the admin panel
- [ ] Read this quick start guide
- [ ] Review your role permissions

**Day 2:**

- [ ] Create and publish 1 test article
- [ ] Preview on website
- [ ] Make edits and republish

**Day 3:**

- [ ] Create a testimonial
- [ ] Add SEO metadata
- [ ] Publish and verify

**Day 4:**

- [ ] Create an FAQ entry
- [ ] Create a service description
- [ ] Link related content

**Day 5:**

- [ ] Review content quality
- [ ] Check website appearance
- [ ] Plan your first real content piece

---

## 💡 Pro Tips

1. **Always Save First**
   - Draft saves don't publish
   - Safe to save frequently
   - Publish only when ready

2. **Preview is Your Friend**
   - Always preview before publishing
   - Check mobile view too
   - Test all links

3. **Use Drafts**
   - Create draft content
   - Have teammate review
   - Then publish together

4. **Image Optimization**
   - Smaller = faster loading
   - Use best image tool
   - Save at 200KB or less

5. **Naming Conventions**
   - Use hyphens: `my-article`
   - No spaces or special chars
   - Keep slugs short and descriptive

---

## 📞 Getting Help

**Is something broken?**

1. Take a screenshot of the error
2. Note what you were doing
3. Contact your Strapi administrator

**Don't understand a field?**

1. Check [CONTENT_MANAGEMENT.md](./CONTENT_MANAGEMENT.md)
2. Look for your content type
3. Review field descriptions

**Need content ideas?**

1. Check [DATA_EXAMPLES.md](./DATA_EXAMPLES.md)
2. Copy structure from examples
3. Adapt to your needs

---

**Last Updated:** January 2025  
**Version:** 1.0

Ready to create? Start with [Create Your First Article](#create-your-first-article)!
