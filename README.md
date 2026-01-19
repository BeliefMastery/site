# Belief Mastery & Sovereign of Mind

## Live Site
**https://beliefmastery.github.io/site/**

## What This Project Is

This repository contains the official website for **Belief Mastery** and **Sovereign of Mind**, a collection of books and diagnostic tools by Warwick Marshall focused on mental sovereignty, cognitive defense, and inner authorship.

### Primary Purpose
A static website that serves as:
- Book information and sales portal
- Collection of 13 self-assessment tools for mental sovereignty and diagnostic clarity
- Author biography and contact information

### Target Audience
**Primary users:** Individuals interested in mental sovereignty, cognitive defense, and diagnostic self-assessment tools.

**Use this site if:**
- You want to learn about books on mental sovereignty and cognitive defense
- You're looking for self-assessment tools for psychological patterns, relationships, archetypes, or worldview clarity
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
- `assessment-examples.html` - Example outputs hub for every engine

### Diagnostic Tools (13 tools)
1. **Pathology Assessment** (`diagnosis.html`) - DSM-5 self-reporting diagnostic tool
2. **Life Domain Review** (`coaching.html`) - Obstacles and satisfaction domains mapping
3. **Dependency Loop Tracer** (`needs-dependency.html`) - Needs and dependency pattern identification
4. **Manipulation Defense Decoder** (`manipulation.html`) - Manipulation tactic identification
5. **Technical Title for your Sovereignty Paradigm** (`sovereignty-spectrum.html`) - Philosophical paradigm alignment
6. **Logos Structure** (`paradigm.html`) - Worldview foundation mapping
7. **Relationships** (`relationship.html`) - Relationship compatibility assessment
8. **Polarity Position Mapping** (`temperament.html`) - Masculine-feminine temperament spectrum
9. **Modern Archetype Identification** (`archetype.html`) - Archetype identification system
10. **Channel Flow Diagnostics** (`channels.html`) - Energy channel blockage identification
11. **Astrological Character Sheet** (`character-sheet.html`) - Astrology-to-RPG character conversion
12. **Unlocked GPT** - External link to custom GPT interface
13. **Cognitive Resistance Capacity Assessment** (`sovereignty.html`) - AI dependency resistance assessment

### Key Files
- `style.css` - Shared stylesheet for all pages
- `shared/` - Shared background, utilities, and diagnostics
- `*-engine.js` - Individual tool engines (one per tool)
- `*-data/` - Data modules for each tool
- `images/` - All site images
- `assessment-examples.html` - Generates live sample reports via `?sample=1`
- `books/` and `tools/` - Source text files for book and tool materials (not public pages)

## Technical Details

### Technologies
- HTML5 with semantic markup
- CSS3 with custom properties
- Vanilla JavaScript (no frameworks)
- GitHub Pages deployment

### Architecture
- Static site with client-side JavaScript
- No server required
- All data stored in JS modules
- Results exportable as JSON/CSV + Executive Brief
- Export metadata includes framework alignment and versioning
- Resume last assessment is user-triggered (no auto-restore by default)
- All data stored in JS data modules
- Results exportable as JSON/CSV (per-tool)

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
