#!/usr/bin/env python3
"""Script to remove the purchase section from index.html"""

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start and end of the purchase section
purchase_start = content.find('<!-- PURCHASE / CONTACT -->')
if purchase_start == -1:
    print("Purchase section not found")
    exit(1)

# Find the closing </section> tag for the purchase section
# We need to find the matching </section> that closes the purchase section
section_start = content.find('<section id="purchase"', purchase_start)
if section_start == -1:
    print("Purchase section tag not found")
    exit(1)

# Find the closing </section> tag
# Count opening and closing tags to find the right one
pos = section_start
depth = 0
purchase_end = -1
while pos < len(content):
    if content[pos:pos+8] == '<section':
        depth += 1
    elif content[pos:pos+10] == '</section>':
        depth -= 1
        if depth == 0:
            purchase_end = pos + 10
            break
    pos += 1

if purchase_end == -1:
    print("Could not find closing tag for purchase section")
    exit(1)

# Remove the purchase section (including the comment and whitespace before it)
# Find the start of the line with the comment
line_start = content.rfind('\n', 0, purchase_start) + 1
# Remove from line_start to purchase_end
new_content = content[:line_start] + content[purchase_end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Removed purchase section (lines {content[:purchase_start].count(chr(10))} to {content[:purchase_end].count(chr(10))})")

