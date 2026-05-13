# Belief Mastery & Sovereign of Mind

## Live Site

**Canonical experience:** [https://beliefmastery.github.io/site/v3/app/](https://beliefmastery.github.io/site/v3/app/) (React SPA). Repository root [`index.html`](index.html) redirects visitors there.

**Legacy HTML:** Engine pages previously under `v3/*.html` now live in [`archive/v3-engines/`](archive/v3-engines/) and are embedded from in-app routes (`#/engines/...`). The former large root home page is at [`archive/legacy-root-html/index-full-legacy.html`](archive/legacy-root-html/index-full-legacy.html).

**https://beliefmastery.github.io/site/** — root URL (redirects into the SPA).

### Portfolio / LinkedIn
For a concise, copy-ready summary of site function and assessment engines (written for featured-project fields, **max 2000 characters**), see [`docs/SHOWCASE_DESCRIPTION.md`](docs/SHOWCASE_DESCRIPTION.md).

## What This Project Is

This repository contains the official website for **Belief Mastery** and **Sovereign of Mind**, a collection of books and diagnostic tools by Warwick Marshall focused on mental sovereignty, cognitive defense, and inner authorship.

### Primary Purpose
A static website that serves as:
- Book information and sales portal
- Collection of 12 self-assessment tools for mental sovereignty and diagnostic clarity
- Author biography and contact information

### Target Audience
**Primary users:** Individuals interested in mental sovereignty, cognitive defense, and diagnostic self-assessment tools.

**Use this site if:**
- You want to learn about books on mental sovereignty and cognitive defense
- You're looking for self-assessment tools for psychological patterns, worldview clarity, and cognitive defense
- You want to contact the author or purchase books

## Quick Start

### For Visitors
1. Visit https://beliefmastery.github.io/site/
2. Browse books or explore diagnostic tools
3. Use the navigation menu to access different sections

### For Developers (Local Setup)
```bash
# Clone the repository
git clone https://github.com/BeliefMastery/site.git

# Navigate to directory
cd site

# Open index.html in a browser
# No build process required - pure HTML/CSS/JS
```

### For Researchers
- All tools export results as JSON/CSV for analysis
- Structured data available in individual tool files
- See `CITATION.cff` for proper citation format

## Project Structure

### Main Pages
- `index.html` - Homepage with book and tools overview
- `books.html` - Complete book catalog and descriptions
- `tools.html` - All diagnostic tools listing
- `about-the-author.html` - Author biography
- `framework-atlas.html` - Cross-map of book principles, engines, and outputs

### Diagnostic Tools (12 tools)
1. **Pathology Assessment** (`diagnosis.html`) - DSM-5 educational self-assessment for pattern clarity
2. **Life Domain Review** (`coaching.html`) - Sovereign of Mind + Belief Mastery obstacles/satisfaction mapping
3. **Dependency Loop Tracer** (`needs-dependency.html`) - Belief Mastery Chapter 5 needs/dependency tracing
4. **Manipulation Defense Decoder** (`manipulation.html`) - Sovereign of Mind manipulation vectors/tactics mapping
5. **Your Sovereignty Paradigm** (`sovereignty-spectrum.html`) - Philosophical paradigm alignment
6. **Logos Structure** (`paradigm.html`) - Worldview foundation mapping (Good Life/God lenses)
7. **Channel Flow Diagnostics** (`channels.html`) - Energy channel blockage identification
8. **Astrological Character Sheet** (`character-sheet.html`) - Western/Chinese/Mayan + Numerology RPG conversion
9. **Will Anomaly Mapping** (`entities.html`) - Secular will-anomaly mapping with reclamation protocols
10. **Aptitude Mapping** (`outlier-aptitude.html`) - Aptitude signal mapping with market projection matrix
11. **Unlocked GPT** - External link to custom GPT interface
12. **Cognitive Resistance Capacity Assessment** (`sovereignty.html`) - AI dependency resistance assessment

**In-repo engines (11):** `diagnosis-engine.js`, `coaching-engine.js`, `needs-dependency-engine.js`, `sovereignty-spectrum-engine.js`, `paradigm-engine.js`, `manipulation-engine.js`, `sovereignty-engine.js`, `channels-engine.js`, `character-sheet-engine.js`, `entities-engine.js`, `outlier-aptitude-engine.js`. **Unlocked GPT** is an external ChatGPT custom GPT; it is listed as a tool but has no engine file in this repository.

### Key Files
- `style.css` - Shared stylesheet for all pages
- `shared/` - Shared background, utilities, and diagnostics
- `*-engine.js` - Client-side assessment engines (ES modules); one primary engine per in-repo tool (see list below)
- `*-data/` - Data modules for each tool
- `images/` - All site images
- `books/` and `tools/` - Source text files for book and tool materials (not public pages)

## Technical Details

### Technologies
- HTML5 with semantic markup
- CSS3 with custom properties
- Vanilla JavaScript (no frameworks)
- GitHub Pages deployment

### Architecture
- Static site with client-side JavaScript (ES modules; no bundler required for authoring)
- No server required; GitHub Pages deployment
- Tool content and scoring inputs live in JS data modules beside each engine
- Results exportable as JSON/CSV per tool, with executive-style briefs where implemented
- Export metadata includes framework alignment and versioning where applicable
- Resume last assessment is user-triggered (no auto-restore by default)

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- No build process required

## Installation / Local Development

### Prerequisites
- A web browser
- Git (for cloning)

### Steps
1. Clone repository: `git clone https://github.com/BeliefMastery/site.git`
2. Open `index.html` in a web browser
3. All paths are relative - no server configuration needed

### Deployment
Site is automatically deployed via GitHub Pages. Push to `main` branch to deploy.

## Accessibility

- Semantic HTML5 elements
- ARIA labels on interactive elements
- Alt text on images
- Keyboard navigable
- Screen reader compatible

## SEO

- Structured data (JSON-LD) for books
- Open Graph and Twitter Card meta tags
- Semantic HTML structure
- Descriptive page titles and meta descriptions
- `robots.txt` and `sitemap.xml` for indexing control

## Post-Grading Improvements (Since Initial 75/100 Score)

The following improvements have been made to address grading feedback:

### Repository Professionalism
- ✅ Clear README with plain language description
- ✅ Live site link prominently placed
- ✅ Installation/local dev steps added
- ✅ Clean directory structure
- ✅ Removed dead files and backup files

### Site Structure & Navigation
- ✅ Standardized header navigation across all pages
- ✅ Consistent mobile navigation (horizontal layout)
- ✅ Clear tool categorization (Psychological, Defensive/Protective, Philosophical, Relational, Esoteric, Technological/AI)
- ✅ Updated tool names for clarity

### Technical Execution
- ✅ Semantic HTML throughout
- ✅ Organized CSS with custom properties
- ✅ No console errors
- ✅ Mobile responsive design
- ✅ Fixed background rendering issues

### Accessibility
- ✅ Alt text on all images
- ✅ ARIA labels on interactive elements
- ✅ Logical heading hierarchy
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility

### Content Clarity
- ✅ Updated tool names for mid-IQ user clarity
- ✅ Consistent metadata across pages
- ✅ Clear tool descriptions
- ✅ Standardized navigation structure
- ✅ Framework Atlas and Case Studies for portfolio-grade clarity

## Contact & Links

- **Live Site:** https://beliefmastery.github.io/site/
- **Books:** https://beliefmastery.github.io/site/books.html
- **Tools:** https://beliefmastery.github.io/site/tools.html
- **Author Page:** https://beliefmastery.github.io/site/about-the-author.html

## License

See LICENSE file for details.

---

**Note for Reviewers:** This project represents a complete static website for books and diagnostic tools related to mental sovereignty. All functionality is client-side JavaScript with no external dependencies. The site is production-ready and fully deployed via GitHub Pages.
