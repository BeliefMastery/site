#!/usr/bin/env python3
"""Script to clean index.html - remove all book and tool sections, keep only intro + two grids + purchase"""

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find where the home section ends (after the orientation text)
# Find where purchase section starts (the correct one at line 804)
home_end = None
purchase_start = None

for i, line in enumerate(lines):
    if '<!-- PURCHASE / CONTACT -->' in line and i > 200:  # The second occurrence
        purchase_start = i
        break

# Find where home section ends (after orientation)
for i, line in enumerate(lines):
    if '</section>' in line and i > 200 and i < purchase_start:
        # Check if this is the end of the home section
        if 'A short orientation' in ''.join(lines[max(0, i-50):i]):
            home_end = i + 1
            break

if home_end and purchase_start:
    # Keep: lines 0 to home_end, then skip to purchase_start
    new_lines = lines[0:home_end] + lines[purchase_start:]
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print(f"Cleaned index.html: removed lines {home_end} to {purchase_start-1}")
else:
    print("Could not find sections to remove. Manual cleanup needed.")

