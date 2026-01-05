#!/usr/bin/env python3
"""Script to remove all book and tool sections from index.html"""

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the end of the home section (after orientation)
home_end = None
for i, line in enumerate(lines):
    if '</section>' in line and i > 200:
        # Check if this closes the home section
        if 'A short orientation' in ''.join(lines[max(0, i-30):i+1]):
            home_end = i + 1
            break

# Find the correct purchase section (the second one)
purchase_start = None
purchase_count = 0
for i, line in enumerate(lines):
    if '<!-- PURCHASE / CONTACT -->' in line:
        purchase_count += 1
        if purchase_count == 2:  # The second occurrence
            purchase_start = i
            break

if home_end and purchase_start:
    # Keep: lines 0 to home_end, then skip to purchase_start
    new_lines = lines[0:home_end] + ['\n'] + lines[purchase_start:]
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print(f"Removed {purchase_start - home_end} lines (book and tool sections)")
    print(f"Kept lines 0-{home_end} and {purchase_start}-end")
else:
    print(f"home_end: {home_end}, purchase_start: {purchase_start}")
    print("Manual cleanup needed")

