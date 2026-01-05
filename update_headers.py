#!/usr/bin/env python3
"""Script to update all HTML file headers to match index.html structure"""

import re
import os

# Standard header template (without active class - will be added per page)
STANDARD_HEADER = '''  <header class="site-header" role="banner">
    <nav class="nav" aria-label="Primary navigation">
      <button class="hamburger" aria-expanded="false" aria-controls="top-nav" aria-label="Toggle navigation">☰</button>
      <ul class="nav-list" id="top-nav" role="menubar">
        <li role="none"><a role="menuitem" href="index.html">Home</a></li>
        <li role="none" class="nav-dropdown">
          <a role="menuitem" href="books.html" class="dropdown-toggle">Works <span style="font-size:0.8em;">▼</span></a>
          <ul class="dropdown-menu" role="menu">
            <li role="none"><a role="menuitem" href="books.html#belief-mastery">Belief Mastery</a></li>
            <li role="none"><a role="menuitem" href="books.html#sovereign-of-mind">Sovereign of Mind</a></li>
            <li role="none"><a role="menuitem" href="books.html#distortion-codex">Distortion Codex</a></li>
            <li role="none"><a role="menuitem" href="books.html#unspeakables-grimoire">The Unspeakables Grimoire</a></li>
            <li role="none"><a role="menuitem" href="books.html#sovereign-integral-devotionalism">Sovereign Integral Devotionalism</a></li>
            <li role="none"><a role="menuitem" href="books.html#peer-counseling-manual">Peer-Counseling Manual</a></li>
          </ul>
        </li>
        <li role="none" class="nav-dropdown">
          <a role="menuitem" href="tools.html" class="dropdown-toggle">Tools <span style="font-size:0.8em;">▼</span></a>
          <ul class="dropdown-menu" role="menu">
            <li role="none"><a role="menuitem" href="tools.html">All Tools</a></li>
            <li role="none"><a role="menuitem" href="tools.html#sovereignty-simulacrum">Sovereignty Simulacrum</a></li>
            <li role="none"><a role="menuitem" href="diagnosis.html">Diagnosis System</a></li>
            <li role="none"><a role="menuitem" href="coaching.html">Coaching Agent</a></li>
            <li role="none"><a role="menuitem" href="manipulation.html">Manipulation Analysis</a></li>
            <li role="none"><a role="menuitem" href="channels.html">Channel Analysis</a></li>
            <li role="none"><a role="menuitem" href="paradigm.html">Paradigm Clarification</a></li>
            <li role="none"><a role="menuitem" href="relationship.html">Relationship Optimization</a></li>
            <li role="none"><a role="menuitem" href="temperament.html">Temperament Analyzer</a></li>
          </ul>
        </li>
        <li role="none"><a role="menuitem" href="about-the-author.html">About the Author</a></li>
      </ul>
    </nav>
  </header>'''

# Files to update and their active link configuration
FILES_TO_UPDATE = {
    'index.html': {'active': 'Home', 'link': 'index.html'},
    'books.html': {'active': 'Works', 'link': 'books.html'},
    'tools.html': {'active': 'Tools', 'link': 'tools.html'},
    'diagnosis.html': {'active': 'Diagnosis System', 'link': 'diagnosis.html'},
    'coaching.html': {'active': 'Coaching Agent', 'link': 'coaching.html'},
    'manipulation.html': {'active': 'Manipulation Analysis', 'link': 'manipulation.html'},
    'channels.html': {'active': 'Channel Analysis', 'link': 'channels.html'},
    'paradigm.html': {'active': 'Paradigm Clarification', 'link': 'paradigm.html'},
    'relationship.html': {'active': 'Relationship Optimization', 'link': 'relationship.html'},
    'temperament.html': {'active': 'Temperament Analyzer', 'link': 'temperament.html'},
    'about-the-author.html': {'active': 'About the Author', 'link': 'about-the-author.html'},
}

def add_active_class(header, active_config):
    """Add active class to the appropriate link"""
    active_text = active_config['active']
    active_link = active_config['link']
    
    # Handle special cases
    if active_text == 'Home':
        header = re.sub(
            r'(<li role="none"><a role="menuitem" href="index.html">Home</a></li>)',
            r'<li role="none"><a role="menuitem" href="index.html" class="active">Home</a></li>',
            header
        )
    elif active_text == 'Works':
        header = re.sub(
            r'(<a role="menuitem" href="books.html" class="dropdown-toggle">Works)',
            r'<a role="menuitem" href="books.html" class="dropdown-toggle active">Works',
            header
        )
    elif active_text == 'Tools':
        header = re.sub(
            r'(<a role="menuitem" href="tools.html" class="dropdown-toggle">Tools)',
            r'<a role="menuitem" href="tools.html" class="dropdown-toggle active">Tools',
            header
        )
    elif active_text == 'About the Author':
        header = re.sub(
            r'(<li role="none"><a role="menuitem" href="about-the-author.html">About the Author</a></li>)',
            r'<li role="none"><a role="menuitem" href="about-the-author.html" class="active">About the Author</a></li>',
            header
        )
    else:
        # For tool pages, add active class to the tool link in the Tools dropdown
        header = re.sub(
            rf'(<li role="none"><a role="menuitem" href="{re.escape(active_link)}">[^<]+</a></li>)',
            rf'<li role="none"><a role="menuitem" href="{active_link}" class="active">{active_text}</a></li>',
            header
        )
    
    return header

def update_header_in_file(filepath, active_config):
    """Update the header in a single file"""
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return False
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the header section - look for <header> tag
    header_pattern = r'<header[^>]*>.*?</header>'
    header_match = re.search(header_pattern, content, re.DOTALL)
    
    if not header_match:
        print(f"No header found in {filepath}")
        return False
    
    # Create the new header with active class
    new_header = add_active_class(STANDARD_HEADER, active_config)
    
    # Replace the old header with the new one
    new_content = content[:header_match.start()] + new_header + content[header_match.end():]
    
    # Remove any inline style from header tag if present
    new_content = re.sub(r'<header class="site-header" role="banner"[^>]*>', 
                        r'<header class="site-header" role="banner">', 
                        new_content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Updated header in {filepath}")
    return True

def main():
    """Update all headers"""
    for filename, active_config in FILES_TO_UPDATE.items():
        update_header_in_file(filename, active_config)
    
    print("\nAll headers updated!")

if __name__ == "__main__":
    main()

