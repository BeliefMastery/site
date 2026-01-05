#!/usr/bin/env python3
"""Script to split index.html into books.html, tools.html, and update index.html"""

import re

# Read the full index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()
    lines = content.split('\n')

# Extract header (lines 1-136)
header_lines = lines[0:136]

# Extract book sections (lines 206-604) - Belief Mastery through Peer-Counseling Manual
book_sections_start = 205  # 0-indexed, so line 206 is index 205
book_sections_end = 604    # 0-indexed, so line 604 is index 603
book_sections = lines[book_sections_start:book_sections_end]

# Extract purchase section (lines 780-883)
purchase_start = 779  # 0-indexed
purchase_end = 883    # 0-indexed
purchase_section = lines[purchase_start:purchase_end]

# Extract footer and scripts (lines 885-1028)
footer_start = 884  # 0-indexed
footer_end = 1028   # 0-indexed
footer_section = lines[footer_start:footer_end]

# Extract simulacrum section (lines 607-650)
simulacrum_start = 606  # 0-indexed
simulacrum_end = 650    # 0-indexed
simulacrum_section = lines[simulacrum_start:simulacrum_end]

# Extract tools section (lines 653-777)
tools_start = 652  # 0-indexed
tools_end = 777    # 0-indexed
tools_section = lines[tools_start:tools_end]

# Create books.html
books_html = '\n'.join(header_lines)
# Update header navigation for books.html - Works dropdown should link to books.html sections
books_header_updated = []
for line in header_lines:
    if 'href="#belief-mastery"' in line or 'href="#sovereign-of-mind"' in line or 'href="#distortion-codex"' in line or 'href="#unspeakables-grimoire"' in line or 'href="#sovereign-integral-devotionalism"' in line or 'href="#peer-counseling-manual"' in line:
        # Keep anchor links as they'll be on the same page
        books_header_updated.append(line)
    elif 'href="books.html"' in line:
        # Already correct
        books_header_updated.append(line)
    elif 'Works <span' in line:
        # Update Works dropdown to point to books.html
        books_header_updated.append(line.replace('href="#"', 'href="books.html"'))
    elif 'Tools <span' in line:
        # Update Tools dropdown to point to tools.html
        books_header_updated.append(line.replace('href="#"', 'href="tools.html"'))
    else:
        books_header_updated.append(line)

books_html = '\n'.join(books_header_updated)
books_html += '\n  <main class="container" id="main">\n'
books_html += '\n'.join(book_sections)
books_html += '\n'
books_html += '\n'.join(purchase_section)
books_html += '\n  </main>\n'
books_html += '\n'.join(footer_section)

# Write books.html
with open('books.html', 'w', encoding='utf-8') as f:
    f.write(books_html)

print("Created books.html")

# Create tools.html
tools_html = '\n'.join(header_lines)
# Update header navigation for tools.html
tools_header_updated = []
for line in header_lines:
    if 'Works <span' in line:
        # Update Works dropdown to point to books.html
        tools_header_updated.append(line.replace('href="#"', 'href="books.html"'))
    elif 'Tools <span' in line:
        # Update Tools dropdown to point to tools.html
        tools_header_updated.append(line.replace('href="#"', 'href="tools.html"'))
    else:
        tools_header_updated.append(line)

tools_html = '\n'.join(tools_header_updated)
tools_html += '\n  <main class="container" id="main">\n'
tools_html += '\n'.join(simulacrum_section)
tools_html += '\n'
tools_html += '\n'.join(tools_section)
tools_html += '\n  </main>\n'
tools_html += '\n'.join(footer_section)

# Write tools.html
with open('tools.html', 'w', encoding='utf-8') as f:
    f.write(tools_html)

print("Created tools.html")

print("Done! Now update index.html manually to have only intro + two grids.")

