"""
Enhanced Styling System for Unified Mediation Platform
Comprehensive CSS with improved contrast, accessibility, and modern aesthetics
"""

def get_enhanced_css():
    """Return comprehensive enhanced CSS for the mediation platform"""
    return """
    <style>
    /* =============================================================================
       ENHANCED MEDIATION PLATFORM STYLING
       High contrast, accessible, modern design system
       ============================================================================= */
    
    /* Root Variables for Consistent Theming */
    :root {
        --primary-color: #1a365d;
        --primary-light: #2c5282;
        --primary-dark: #0f2027;
        --secondary-color: #2d3748;
        --accent-color: #3182ce;
        --success-color: #38a169;
        --warning-color: #d69e2e;
        --error-color: #e53e3e;
        --info-color: #3182ce;
        
        --text-primary: #1a202c;
        --text-secondary: #4a5568;
        --text-muted: #718096;
        --text-light: #a0aec0;
        
        --bg-primary: #ffffff;
        --bg-secondary: #f7fafc;
        --bg-tertiary: #edf2f7;
        --bg-card: #ffffff;
        --bg-hover: #f1f5f9;
        
        --border-color: #e2e8f0;
        --border-light: #f1f5f9;
        --border-dark: #cbd5e0;
        
        --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        
        --radius-sm: 0.375rem;
        --radius-md: 0.5rem;
        --radius-lg: 0.75rem;
        --radius-xl: 1rem;
        
        --font-size-xs: 0.75rem;
        --font-size-sm: 0.875rem;
        --font-size-base: 1rem;
        --font-size-lg: 1.125rem;
        --font-size-xl: 1.25rem;
        --font-size-2xl: 1.5rem;
        --font-size-3xl: 1.875rem;
        --font-size-4xl: 2.25rem;
    }
    
    /* Global Base Styles */
    .main .block-container {
        padding-top: 2rem;
        padding-bottom: 2rem;
        max-width: 1200px;
    }
    
    /* Hide Streamlit default elements */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    .stDeployButton {display: none;}
    
    /* =============================================================================
       HEADER AND BRANDING
       ============================================================================= */
    
    .main-header {
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 50%, var(--accent-color) 100%);
        padding: 3rem 2rem;
        border-radius: var(--radius-xl);
        color: white;
        text-align: center;
        margin-bottom: 2rem;
        box-shadow: var(--shadow-lg);
        position: relative;
        overflow: hidden;
    }
    
    .main-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        opacity: 0.3;
    }
    
    .main-header h1 {
        color: white;
        margin: 0;
        font-size: var(--font-size-4xl);
        font-weight: 700;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        position: relative;
        z-index: 1;
    }
    
    .main-header p {
        color: white;
        margin: 0.5rem 0 0 0;
        font-size: var(--font-size-lg);
        opacity: 0.95;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        position: relative;
        z-index: 1;
    }
    
    .main-header .subtitle {
        color: rgba(255, 255, 255, 0.9);
        font-size: var(--font-size-sm);
        margin-top: 0.5rem;
        position: relative;
        z-index: 1;
    }
    
    /* =============================================================================
       CARDS AND CONTAINERS
       ============================================================================= */
    
    .case-card {
        background: var(--bg-card);
        padding: 2rem;
        border-radius: var(--radius-lg);
        border: 1px solid var(--border-color);
        margin: 1rem 0;
        box-shadow: var(--shadow-sm);
        transition: all 0.3s ease;
        position: relative;
    }
    
    .case-card:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
        border-color: var(--accent-color);
    }
    
    .case-card h4 {
        color: var(--text-primary);
        margin: 0 0 1rem 0;
        font-size: var(--font-size-xl);
        font-weight: 600;
    }
    
    .case-card p {
        color: var(--text-secondary);
        margin: 0.5rem 0;
        line-height: 1.6;
    }
    
    .info-card {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        border-left: 4px solid var(--info-color);
        margin: 1rem 0;
        box-shadow: var(--shadow-sm);
    }
    
    .success-card {
        background: linear-gradient(135deg, #f0fff4 0%, #dcfce7 100%);
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        border-left: 4px solid var(--success-color);
        margin: 1rem 0;
        box-shadow: var(--shadow-sm);
    }
    
    .warning-card {
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        border-left: 4px solid var(--warning-color);
        margin: 1rem 0;
        box-shadow: var(--shadow-sm);
    }
    
    .error-card {
        background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        border-left: 4px solid var(--error-color);
        margin: 1rem 0;
        box-shadow: var(--shadow-sm);
    }
    
    /* =============================================================================
       STATUS BADGES AND INDICATORS
       ============================================================================= */
    
    .status-badge {
        padding: 0.375rem 0.875rem;
        border-radius: 9999px;
        font-size: var(--font-size-xs);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: inline-block;
        box-shadow: var(--shadow-sm);
    }
    
    .status-draft { 
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        color: #92400e;
        border: 1px solid #f59e0b;
    }
    
    .status-active { 
        background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
        color: #166534;
        border: 1px solid #22c55e;
    }
    
    .status-under_session { 
        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        color: #1e40af;
        border: 1px solid #3b82f6;
    }
    
    .status-in_mediation { 
        background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
        color: #3730a3;
        border: 1px solid #6366f1;
    }
    
    .status-awaiting_response { 
        background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
        color: #c2410c;
        border: 1px solid #f97316;
    }
    
    .status-scheduled { 
        background: linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 100%);
        color: #6b21a8;
        border: 1px solid #8b5cf6;
    }
    
    .status-completed { 
        background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
        color: #374151;
        border: 1px solid #6b7280;
    }
    
    .status-cancelled { 
        background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
        color: #dc2626;
        border: 1px solid #ef4444;
    }
    
    .status-retired { 
        background: linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%);
        color: #1f2937;
        border: 1px solid #9ca3af;
    }
    
    /* =============================================================================
       ROLE BADGES
       ============================================================================= */
    
    .role-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: var(--font-size-xs);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: inline-block;
        box-shadow: var(--shadow-sm);
    }
    
    .role-mediator { 
        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        color: #1e40af;
        border: 1px solid #3b82f6;
    }
    
    .role-client { 
        background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
        color: #166534;
        border: 1px solid #22c55e;
    }
    
    .role-admin { 
        background: linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 100%);
        color: #6b21a8;
        border: 1px solid #8b5cf6;
    }
    
    /* =============================================================================
       WORKFLOW STEPS
       ============================================================================= */
    
    .workflow-step {
        background: var(--bg-secondary);
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        margin: 0.75rem 0;
        border-left: 4px solid var(--primary-color);
        box-shadow: var(--shadow-sm);
        transition: all 0.3s ease;
    }
    
    .workflow-step:hover {
        box-shadow: var(--shadow-md);
        transform: translateX(4px);
    }
    
    .workflow-step.active {
        background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
        border-left-color: var(--success-color);
        box-shadow: var(--shadow-md);
    }
    
    .workflow-step.completed {
        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        border-left-color: var(--accent-color);
        box-shadow: var(--shadow-md);
    }
    
    .workflow-step h4 {
        color: var(--text-primary);
        margin: 0 0 0.5rem 0;
        font-size: var(--font-size-lg);
        font-weight: 600;
    }
    
    .workflow-step p {
        color: var(--text-secondary);
        margin: 0;
        line-height: 1.5;
    }
    
    /* =============================================================================
       BUTTONS AND INTERACTIVE ELEMENTS
       ============================================================================= */
    
    .stButton > button {
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        padding: 0.75rem 1.5rem;
        font-weight: 600;
        font-size: var(--font-size-sm);
        transition: all 0.3s ease;
        box-shadow: var(--shadow-sm);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
        background: linear-gradient(135deg, var(--primary-light) 0%, var(--accent-color) 100%);
    }
    
    .stButton > button:active {
        transform: translateY(0);
        box-shadow: var(--shadow-sm);
    }
    
    /* Primary button variant */
    .stButton > button[kind="primary"] {
        background: linear-gradient(135deg, var(--accent-color) 0%, #2b6cb0 100%);
        box-shadow: var(--shadow-md);
    }
    
    .stButton > button[kind="primary"]:hover {
        background: linear-gradient(135deg, #2b6cb0 0%, #2c5282 100%);
        box-shadow: var(--shadow-lg);
    }
    
    /* Secondary button variant */
    .stButton > button[kind="secondary"] {
        background: linear-gradient(135deg, var(--secondary-color) 0%, #4a5568 100%);
        color: white;
    }
    
    /* =============================================================================
       FORMS AND INPUTS
       ============================================================================= */
    
    .stTextInput > div > div > input,
    .stTextArea > div > div > textarea,
    .stSelectbox > div > div > select {
        border: 2px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 0.75rem;
        font-size: var(--font-size-sm);
        transition: all 0.3s ease;
        background: var(--bg-primary);
        color: var(--text-primary);
    }
    
    .stTextInput > div > div > input:focus,
    .stTextArea > div > div > textarea:focus,
    .stSelectbox > div > div > select:focus {
        border-color: var(--accent-color);
        box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
        outline: none;
    }
    
    /* =============================================================================
       SIDEBAR STYLING
       ============================================================================= */
    
    .css-1d391kg {
        background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
        border-right: 1px solid var(--border-color);
    }
    
    .css-1d391kg .stSelectbox > div > div > select,
    .css-1d391kg .stTextInput > div > div > input {
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
    }
    
    /* =============================================================================
       METRICS AND KPI CARDS
       ============================================================================= */
    
    .metric-container {
        background: var(--bg-card);
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow-sm);
        text-align: center;
        transition: all 0.3s ease;
    }
    
    .metric-container:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
    }
    
    .metric-value {
        font-size: var(--font-size-3xl);
        font-weight: 700;
        color: var(--primary-color);
        margin: 0;
    }
    
    .metric-label {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        margin: 0.5rem 0 0 0;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    /* =============================================================================
       EXPANDERS AND COLLAPSIBLE SECTIONS
       ============================================================================= */
    
    .streamlit-expanderHeader {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 1rem;
        font-weight: 600;
        color: var(--text-primary);
        transition: all 0.3s ease;
    }
    
    .streamlit-expanderHeader:hover {
        background: var(--bg-hover);
        border-color: var(--accent-color);
    }
    
    .streamlit-expanderContent {
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-top: none;
        border-radius: 0 0 var(--radius-md) var(--radius-md);
        padding: 1.5rem;
    }
    
    /* =============================================================================
       TABS
       ============================================================================= */
    
    .stTabs [data-baseweb="tab-list"] {
        gap: 0.5rem;
    }
    
    .stTabs [data-baseweb="tab"] {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md) var(--radius-md) 0 0;
        padding: 0.75rem 1.5rem;
        font-weight: 600;
        color: var(--text-secondary);
        transition: all 0.3s ease;
    }
    
    .stTabs [aria-selected="true"] {
        background: var(--bg-primary);
        color: var(--primary-color);
        border-bottom-color: var(--bg-primary);
        box-shadow: var(--shadow-sm);
    }
    
    /* =============================================================================
       ALERTS AND NOTIFICATIONS
       ============================================================================= */
    
    .stAlert {
        border-radius: var(--radius-lg);
        border: none;
        box-shadow: var(--shadow-sm);
        padding: 1.5rem;
    }
    
    .stAlert[data-testid="alert-success"] {
        background: linear-gradient(135deg, #f0fff4 0%, #dcfce7 100%);
        border-left: 4px solid var(--success-color);
        color: #166534;
    }
    
    .stAlert[data-testid="alert-warning"] {
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        border-left: 4px solid var(--warning-color);
        color: #c2410c;
    }
    
    .stAlert[data-testid="alert-error"] {
        background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
        border-left: 4px solid var(--error-color);
        color: #dc2626;
    }
    
    .stAlert[data-testid="alert-info"] {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        border-left: 4px solid var(--info-color);
        color: #1e40af;
    }
    
    /* =============================================================================
       RESPONSIVE DESIGN
       ============================================================================= */
    
    @media (max-width: 768px) {
        .main-header {
            padding: 2rem 1rem;
        }
        
        .main-header h1 {
            font-size: var(--font-size-3xl);
        }
        
        .case-card {
            padding: 1.5rem;
        }
        
        .workflow-step {
            padding: 1rem;
        }
    }
    
    /* =============================================================================
       ACCESSIBILITY IMPROVEMENTS
       ============================================================================= */
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
        :root {
            --text-primary: #000000;
            --text-secondary: #333333;
            --border-color: #000000;
            --primary-color: #000080;
        }
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
    
    /* Focus indicators for keyboard navigation */
    .stButton > button:focus,
    .stTextInput > div > div > input:focus,
    .stTextArea > div > div > textarea:focus,
    .stSelectbox > div > div > select:focus {
        outline: 2px solid var(--accent-color);
        outline-offset: 2px;
    }
    
    /* =============================================================================
       CUSTOM UTILITY CLASSES
       ============================================================================= */
    
    .text-center { text-align: center; }
    .text-left { text-align: left; }
    .text-right { text-align: right; }
    
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    
    .text-primary { color: var(--text-primary); }
    .text-secondary { color: var(--text-secondary); }
    .text-muted { color: var(--text-muted); }
    
    .bg-primary { background-color: var(--bg-primary); }
    .bg-secondary { background-color: var(--bg-secondary); }
    .bg-tertiary { background-color: var(--bg-tertiary); }
    
    .shadow-sm { box-shadow: var(--shadow-sm); }
    .shadow-md { box-shadow: var(--shadow-md); }
    .shadow-lg { box-shadow: var(--shadow-lg); }
    
    .rounded-sm { border-radius: var(--radius-sm); }
    .rounded-md { border-radius: var(--radius-md); }
    .rounded-lg { border-radius: var(--radius-lg); }
    .rounded-xl { border-radius: var(--radius-xl); }
    
    .p-2 { padding: 0.5rem; }
    .p-4 { padding: 1rem; }
    .p-6 { padding: 1.5rem; }
    .p-8 { padding: 2rem; }
    
    .m-2 { margin: 0.5rem; }
    .m-4 { margin: 1rem; }
    .m-6 { margin: 1.5rem; }
    .m-8 { margin: 2rem; }
    
    /* =============================================================================
       ANIMATIONS AND TRANSITIONS
       ============================================================================= */
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideIn {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
    }
    
    .fade-in {
        animation: fadeIn 0.5s ease-out;
    }
    
    .slide-in {
        animation: slideIn 0.3s ease-out;
    }
    
    /* =============================================================================
       PRINT STYLES
       ============================================================================= */
    
    @media print {
        .main-header {
            background: none !important;
            color: black !important;
            box-shadow: none !important;
        }
        
        .case-card,
        .workflow-step,
        .info-card,
        .success-card,
        .warning-card,
        .error-card {
            box-shadow: none !important;
            border: 1px solid #ccc !important;
        }
        
        .stButton > button {
            background: none !important;
            color: black !important;
            border: 1px solid #ccc !important;
        }
    }
    </style>
    """

def get_enhanced_header_html(title: str, subtitle: str = "", description: str = ""):
    """Generate enhanced header HTML with improved styling"""
    return f"""
    <div class="main-header fade-in">
        <h1>{title}</h1>
        {f'<p>{subtitle}</p>' if subtitle else ''}
        {f'<div class="subtitle">{description}</div>' if description else ''}
    </div>
    """

def get_metric_card_html(value: str, label: str, delta: str = None):
    """Generate metric card HTML with enhanced styling"""
    delta_html = f'<div style="font-size: var(--font-size-sm); color: var(--text-muted); margin-top: 0.25rem;">{delta}</div>' if delta else ''
    return f"""
    <div class="metric-container">
        <div class="metric-value">{value}</div>
        <div class="metric-label">{label}</div>
        {delta_html}
    </div>
    """

def get_status_badge_html(status: str, text: str = None):
    """Generate status badge HTML with enhanced styling"""
    display_text = text or status.replace('_', ' ').title()
    return f'<span class="status-badge status-{status}">{display_text}</span>'

def get_role_badge_html(role: str):
    """Generate role badge HTML with enhanced styling"""
    return f'<span class="role-badge role-{role}">{role.title()}</span>'


