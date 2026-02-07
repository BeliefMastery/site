/**
 * Full career database (180 paths) from outlier-aptitude/career-database-tables.md
 * Each career: id, name, sector, educationMin, growth, automationResistance, automationResistanceScore, aptitudes, archetypeFit
 */

// Aptitude profiles by cluster (from aptitude-mapping-structure.md)
const CLUSTER_PROFILES = {
  tech: { systems: 0.85, diagnostics: 0.75, technical: 0.9, field: 0.25, organization: 0.65, management: 0.5, creativity: 0.7, scientific: 0.8, eq: 0.55, learning: 0.85, fluid: 0.8, crystallized: 0.65, quantitative: 0.75, spatial: 0.6, processing: 0.7, grit: 0.75, achievement: 0.7, self_regulation: 0.65, adaptability: 0.8, resilience: 0.7, situational_judgment: 0.6, metacognition: 0.7, critical_thinking: 0.75, mechanical: 0.3, linguistic: 0.55, clerical: 0.35, artistic: 0.4 },
  healthcare: { systems: 0.65, diagnostics: 0.85, technical: 0.6, field: 0.75, organization: 0.7, management: 0.55, creativity: 0.5, scientific: 0.75, eq: 0.9, learning: 0.7, fluid: 0.65, crystallized: 0.8, quantitative: 0.55, spatial: 0.6, processing: 0.75, grit: 0.8, achievement: 0.7, self_regulation: 0.75, adaptability: 0.7, resilience: 0.85, situational_judgment: 0.8, metacognition: 0.65, critical_thinking: 0.75, mechanical: 0.4, linguistic: 0.7, clerical: 0.6, artistic: 0.3 },
  business: { systems: 0.9, diagnostics: 0.8, technical: 0.55, field: 0.3, organization: 0.75, management: 0.7, creativity: 0.75, scientific: 0.7, eq: 0.8, learning: 0.75, fluid: 0.85, crystallized: 0.75, quantitative: 0.7, spatial: 0.45, processing: 0.65, grit: 0.7, achievement: 0.8, self_regulation: 0.7, adaptability: 0.85, resilience: 0.75, situational_judgment: 0.85, metacognition: 0.75, critical_thinking: 0.9, mechanical: 0.25, linguistic: 0.8, clerical: 0.5, artistic: 0.55 },
  creative: { systems: 0.65, diagnostics: 0.55, technical: 0.7, field: 0.3, organization: 0.6, management: 0.5, creativity: 0.9, scientific: 0.5, eq: 0.7, learning: 0.75, fluid: 0.7, crystallized: 0.6, quantitative: 0.4, spatial: 0.8, processing: 0.65, grit: 0.65, achievement: 0.7, self_regulation: 0.65, adaptability: 0.75, resilience: 0.7, situational_judgment: 0.6, metacognition: 0.65, critical_thinking: 0.7, mechanical: 0.25, linguistic: 0.65, clerical: 0.4, artistic: 0.95 },
  trades: { systems: 0.7, diagnostics: 0.85, technical: 0.75, field: 0.9, organization: 0.65, management: 0.45, creativity: 0.55, scientific: 0.6, eq: 0.5, learning: 0.65, fluid: 0.55, crystallized: 0.7, quantitative: 0.6, spatial: 0.85, processing: 0.7, grit: 0.75, achievement: 0.65, self_regulation: 0.7, adaptability: 0.7, resilience: 0.75, situational_judgment: 0.65, metacognition: 0.55, critical_thinking: 0.6, mechanical: 0.95, linguistic: 0.45, clerical: 0.4, artistic: 0.3 },
  education: { systems: 0.6, diagnostics: 0.7, technical: 0.55, field: 0.4, organization: 0.8, management: 0.7, creativity: 0.7, scientific: 0.6, eq: 0.9, learning: 0.65, fluid: 0.6, crystallized: 0.85, quantitative: 0.45, spatial: 0.5, processing: 0.6, grit: 0.75, achievement: 0.65, self_regulation: 0.7, adaptability: 0.8, resilience: 0.8, situational_judgment: 0.75, metacognition: 0.7, critical_thinking: 0.65, mechanical: 0.25, linguistic: 0.85, clerical: 0.6, artistic: 0.55 },
  sales: { systems: 0.65, diagnostics: 0.7, technical: 0.6, field: 0.35, organization: 0.7, management: 0.6, creativity: 0.65, scientific: 0.45, eq: 0.95, learning: 0.7, fluid: 0.6, crystallized: 0.65, quantitative: 0.6, spatial: 0.35, processing: 0.55, grit: 0.85, achievement: 0.9, self_regulation: 0.75, adaptability: 0.8, resilience: 0.9, situational_judgment: 0.75, metacognition: 0.65, critical_thinking: 0.6, mechanical: 0.2, linguistic: 0.85, clerical: 0.5, artistic: 0.45 },
  research: { systems: 0.75, diagnostics: 0.7, technical: 0.8, field: 0.4, organization: 0.75, management: 0.5, creativity: 0.7, scientific: 0.95, eq: 0.5, learning: 0.8, fluid: 0.85, crystallized: 0.8, quantitative: 0.9, spatial: 0.55, processing: 0.75, grit: 0.85, achievement: 0.75, self_regulation: 0.8, adaptability: 0.65, resilience: 0.75, situational_judgment: 0.65, metacognition: 0.8, critical_thinking: 0.9, mechanical: 0.5, linguistic: 0.75, clerical: 0.6, artistic: 0.4 },
  legal: { systems: 0.75, diagnostics: 0.7, technical: 0.5, field: 0.35, organization: 0.75, management: 0.6, creativity: 0.55, scientific: 0.55, eq: 0.75, learning: 0.7, fluid: 0.75, crystallized: 0.9, linguistic: 0.9, quantitative: 0.5, spatial: 0.4, processing: 0.7, grit: 0.7, achievement: 0.75, self_regulation: 0.75, adaptability: 0.65, resilience: 0.75, situational_judgment: 0.9, metacognition: 0.7, critical_thinking: 0.9, mechanical: 0.2, clerical: 0.65, artistic: 0.35 }
};

function career(id, name, sector, educationMin, growth, autoLabel, autoScore, cluster, archetypeFit = []) {
  return { id, name, sector, educationMin, growth, automationResistance: autoLabel, automationResistanceScore: autoScore, aptitudes: { ...CLUSTER_PROFILES[cluster] }, archetypeFit };
}

// Tech & Engineering (25)
const TECH = [
  career('tech_001', 'AI/ML Engineer', 'technology', 'masters', 'High', 'Medium', 0.55, 'tech', ['Gamma Male']),
  career('tech_002', 'Cloud Solutions Architect', 'technology', 'bachelors', 'High', 'Medium', 0.6, 'tech', ['Gamma Male', 'Sigma Male']),
  career('tech_003', 'Cybersecurity Analyst', 'technology', 'bachelors', 'High', 'High', 0.75, 'tech', ['Gamma Male']),
  career('tech_004', 'DevOps Engineer', 'technology', 'bachelors', 'High', 'Medium', 0.58, 'tech', ['Gamma Male', 'Sigma Male']),
  career('tech_005', 'Full Stack Developer', 'technology', 'bachelors', 'Moderate', 'Medium-Low', 0.45, 'tech', ['Gamma Male', 'Sigma Male']),
  career('tech_006', 'Data Scientist', 'technology', 'masters', 'Moderate', 'Medium', 0.52, 'research', ['Gamma Male']),
  career('tech_007', 'UX/UI Designer', 'technology', 'bachelors', 'Moderate', 'Medium', 0.6, 'creative', ['Gamma-Nu Male', 'Sigma-Lambda Male']),
  career('tech_008', 'Mobile App Developer', 'technology', 'bachelors', 'Moderate', 'Low', 0.4, 'tech', ['Gamma Male', 'Sigma Male']),
  career('tech_009', 'Robotics Engineer', 'technology', 'masters', 'High', 'High', 0.7, 'tech', ['Gamma Male']),
  career('tech_010', 'IoT Specialist', 'technology', 'bachelors', 'High', 'Medium-High', 0.65, 'tech', ['Gamma Male']),
  career('tech_011', 'Quantum Computing Researcher', 'technology', 'doctorate', 'High', 'Very High', 0.85, 'research', ['Gamma Male']),
  career('tech_012', 'Blockchain Developer', 'technology', 'bachelors', 'Moderate', 'Medium', 0.55, 'tech', ['Gamma Male', 'Gamma-Pi Male']),
  career('tech_013', 'Systems Integration Engineer', 'technology', 'bachelors', 'Moderate', 'Medium-High', 0.68, 'tech', ['Gamma Male']),
  career('tech_014', 'Network Engineer', 'technology', 'bachelors', 'Stable', 'Medium', 0.58, 'tech', ['Beta Male']),
  career('tech_015', 'Hardware Engineer', 'technology', 'bachelors', 'Stable', 'Medium-High', 0.65, 'tech', ['Gamma Male', 'Delta Male']),
  career('tech_016', 'Embedded Systems Developer', 'technology', 'bachelors', 'Moderate', 'High', 0.72, 'tech', ['Gamma Male']),
  career('tech_017', 'AR/VR Developer', 'technology', 'bachelors', 'High', 'Medium-High', 0.67, 'tech', ['Gamma Male', 'Gamma-Nu Male']),
  career('tech_018', 'Site Reliability Engineer', 'technology', 'bachelors', 'Moderate', 'Medium-High', 0.66, 'tech', ['Gamma Male', 'Sigma Male']),
  career('tech_019', 'Database Administrator', 'technology', 'bachelors', 'Stable', 'Low', 0.42, 'tech', ['Beta Male']),
  career('tech_020', 'IT Support Specialist', 'technology', 'associates', 'Declining', 'Very Low', 0.25, 'tech', ['Beta Male']),
  career('tech_021', 'Renewable Energy Engineer', 'technology', 'bachelors', 'High', 'High', 0.78, 'tech', ['Gamma Male', 'Delta Male']),
  career('tech_022', 'EV Systems Engineer', 'technology', 'bachelors', 'High', 'High', 0.75, 'tech', ['Gamma Male']),
  career('tech_023', 'Biomedical Engineer', 'technology', 'bachelors', 'Moderate', 'High', 0.7, 'tech', ['Gamma Male']),
  career('tech_024', 'Mechatronics Engineer', 'technology', 'bachelors', 'Moderate', 'Medium-High', 0.68, 'tech', ['Gamma Male', 'Delta Male']),
  career('tech_025', 'CAD/3D Modeling Specialist', 'technology', 'associates', 'Stable', 'Low', 0.38, 'tech', ['Delta Male'])
];

// Healthcare & Life Sciences (30)
const HEALTHCARE = [
  career('health_001', 'Nurse Practitioner', 'healthcare', 'masters', 'Moderate', 'Very High', 0.88, 'healthcare', ['Delta-Mu Male', 'Beta-Iota Male']),
  career('health_002', 'Physician Assistant', 'healthcare', 'masters', 'Moderate', 'Very High', 0.86, 'healthcare', ['Delta-Mu Male']),
  career('health_003', 'Physical Therapist', 'healthcare', 'doctorate', 'Moderate', 'Very High', 0.9, 'healthcare', ['Delta-Mu Male', 'Beta-Iota Male']),
  career('health_004', 'Occupational Therapist', 'healthcare', 'masters', 'Moderate', 'Very High', 0.88, 'healthcare', ['Delta-Mu Male', 'Beta-Iota Male']),
  career('health_005', 'Genetic Counselor', 'healthcare', 'masters', 'High', 'High', 0.82, 'healthcare', ['Beta-Iota Male']),
  career('health_006', 'Radiologic Technologist', 'healthcare', 'associates', 'Stable', 'Medium', 0.58, 'healthcare', ['Beta Male']),
  career('health_007', 'Surgical Technologist', 'healthcare', 'certificate', 'Stable', 'Medium-High', 0.68, 'healthcare', ['Beta Male', 'Delta Male']),
  career('health_008', 'Respiratory Therapist', 'healthcare', 'associates', 'Moderate', 'High', 0.75, 'healthcare', ['Beta Male', 'Delta-Mu Male']),
  career('health_009', 'Mental Health Counselor', 'healthcare', 'masters', 'Moderate', 'Very High', 0.92, 'healthcare', ['Beta-Iota Male', 'Gamma-Theta Male']),
  career('health_010', 'Clinical Psychologist', 'healthcare', 'doctorate', 'Moderate', 'Very High', 0.9, 'healthcare', ['Beta-Iota Male']),
  career('health_011', 'Psychiatrist', 'healthcare', 'md', 'Moderate', 'Very High', 0.88, 'healthcare', ['Alpha Male']),
  career('health_012', 'Pharmacist', 'healthcare', 'doctorate', 'Stable', 'Medium', 0.52, 'healthcare', ['Beta Male']),
  career('health_013', 'Pharmacy Technician', 'healthcare', 'certificate', 'Declining', 'Low', 0.35, 'healthcare', ['Beta Male']),
  career('health_014', 'Medical Lab Technician', 'healthcare', 'associates', 'Stable', 'Medium', 0.55, 'healthcare', ['Beta Male']),
  career('health_015', 'Biomedical Technician', 'healthcare', 'associates', 'Moderate', 'High', 0.72, 'healthcare', ['Beta Male', 'Delta Male']),
  career('health_016', 'Ultrasound Technician', 'healthcare', 'associates', 'Stable', 'Medium-High', 0.65, 'healthcare', ['Beta Male']),
  career('health_017', 'Dental Hygienist', 'healthcare', 'associates', 'Stable', 'Medium-High', 0.68, 'healthcare', ['Beta Male']),
  career('health_018', 'Paramedic/EMT', 'healthcare', 'certificate', 'Stable', 'High', 0.78, 'healthcare', ['Alpha-Xi Male']),
  career('health_019', 'Medical Records Specialist', 'healthcare', 'certificate', 'Declining', 'Very Low', 0.22, 'healthcare', ['Beta Male']),
  career('health_020', 'Healthcare Administrator', 'healthcare', 'masters', 'Moderate', 'Medium-High', 0.66, 'business', ['Alpha Male', 'Beta Male']),
  career('health_021', 'Clinical Research Coordinator', 'healthcare', 'bachelors', 'Moderate', 'High', 0.7, 'research', ['Gamma Male']),
  career('health_022', 'Epidemiologist', 'healthcare', 'masters', 'Moderate', 'High', 0.72, 'research', ['Gamma Male']),
  career('health_023', 'Biostatistician', 'healthcare', 'masters', 'Moderate', 'Medium-High', 0.65, 'research', ['Gamma Male']),
  career('health_024', 'Public Health Specialist', 'healthcare', 'masters', 'Moderate', 'High', 0.7, 'healthcare', ['Beta-Iota Male']),
  career('health_025', 'Nutritionist/Dietitian', 'healthcare', 'bachelors', 'Stable', 'High', 0.72, 'healthcare', ['Beta-Iota Male']),
  career('health_026', 'Speech-Language Pathologist', 'healthcare', 'masters', 'Moderate', 'Very High', 0.85, 'healthcare', ['Delta-Mu Male', 'Beta-Iota Male']),
  career('health_027', 'Audiologist', 'healthcare', 'doctorate', 'Stable', 'High', 0.75, 'healthcare', ['Delta-Mu Male']),
  career('health_028', 'Genetic Lab Technician', 'healthcare', 'bachelors', 'Moderate', 'Medium-High', 0.68, 'research', ['Gamma Male']),
  career('health_029', 'Medical Illustrator', 'healthcare', 'masters', 'Stable', 'Medium-High', 0.65, 'creative', ['Gamma-Nu Male']),
  career('health_030', 'Telemedicine Coordinator', 'healthcare', 'bachelors', 'High', 'Medium', 0.6, 'healthcare', ['Beta Male'])
];

// Business & Finance (25)
const BUSINESS = [
  career('biz_001', 'Management Consultant', 'business', 'masters', 'Stable', 'Medium-High', 0.68, 'business', ['Alpha Male']),
  career('biz_002', 'Financial Analyst', 'business', 'bachelors', 'Stable', 'Medium', 0.48, 'business', ['Gamma Male', 'Gamma-Pi Male']),
  career('biz_003', 'Investment Banker', 'business', 'bachelors', 'Stable', 'Medium', 0.52, 'business', ['Alpha Male']),
  career('biz_004', 'Accountant (CPA)', 'business', 'bachelors', 'Declining', 'Low', 0.38, 'business', ['Beta Male']),
  career('biz_005', 'Financial Planner', 'business', 'bachelors', 'Stable', 'Medium-High', 0.7, 'business', ['Gamma-Pi Male']),
  career('biz_006', 'Actuary', 'business', 'bachelors', 'Moderate', 'Medium', 0.55, 'research', ['Gamma Male']),
  career('biz_007', 'Data Analyst (Business)', 'business', 'bachelors', 'Moderate', 'Medium', 0.5, 'research', ['Gamma Male']),
  career('biz_008', 'Business Intelligence Analyst', 'business', 'bachelors', 'Moderate', 'Medium', 0.52, 'business', ['Gamma Male']),
  career('biz_009', 'Product Manager', 'business', 'bachelors', 'Moderate', 'Medium-High', 0.68, 'business', ['Alpha Male', 'Gamma Male']),
  career('biz_010', 'Project Manager', 'business', 'bachelors', 'Stable', 'Medium', 0.55, 'business', ['Beta Male']),
  career('biz_011', 'Operations Manager', 'business', 'bachelors', 'Stable', 'Medium', 0.58, 'business', ['Beta Male', 'Alpha Male']),
  career('biz_012', 'Supply Chain Manager', 'business', 'bachelors', 'Stable', 'Medium', 0.6, 'business', ['Beta Male']),
  career('biz_013', 'HR Specialist', 'business', 'bachelors', 'Stable', 'Medium', 0.5, 'business', ['Beta Male']),
  career('biz_014', 'Recruiter/Talent Acquisition', 'business', 'bachelors', 'Stable', 'Medium', 0.55, 'sales', ['Gamma-Pi Male']),
  career('biz_015', 'Organizational Development', 'business', 'masters', 'Moderate', 'High', 0.72, 'business', ['Alpha Male']),
  career('biz_016', 'Strategy Consultant', 'business', 'masters', 'Moderate', 'High', 0.74, 'business', ['Sigma-Kappa Male']),
  career('biz_017', 'Risk Manager', 'business', 'bachelors', 'Moderate', 'Medium-High', 0.66, 'business', ['Alpha-Rho Male']),
  career('biz_018', 'Compliance Officer', 'business', 'bachelors', 'Stable', 'Medium', 0.58, 'legal', ['Alpha-Rho Male']),
  career('biz_019', 'Real Estate Analyst', 'business', 'bachelors', 'Stable', 'Medium', 0.52, 'business', ['Gamma-Pi Male']),
  career('biz_020', 'Entrepreneur (Tech Startup)', 'business', 'bachelors', 'Moderate', 'High', 0.75, 'business', ['Alpha Male', 'Sigma Male']),
  career('biz_021', 'Franchise Owner', 'business', 'bachelors', 'Stable', 'Medium-High', 0.65, 'business', ['Gamma-Pi Male']),
  career('biz_022', 'ESG Analyst', 'business', 'masters', 'High', 'Medium-High', 0.68, 'business', ['Gamma Male']),
  career('biz_023', 'Sustainability Consultant', 'business', 'masters', 'High', 'High', 0.72, 'business', ['Gamma Male']),
  career('biz_024', 'M&A Analyst', 'business', 'masters', 'Stable', 'Medium-High', 0.64, 'business', ['Alpha Male']),
  career('biz_025', 'Corporate Trainer', 'business', 'bachelors', 'Stable', 'Medium-High', 0.66, 'education', ['Beta Male'])
];

// Education & Research (20)
const EDUCATION = [
  career('edu_001', 'K-12 Teacher', 'education', 'bachelors', 'Stable', 'High', 0.75, 'education', ['Delta-Mu Male', 'Beta-Iota Male']),
  career('edu_002', 'Special Education Teacher', 'education', 'bachelors', 'Stable', 'Very High', 0.85, 'education', ['Delta-Mu Male', 'Beta-Iota Male']),
  career('edu_003', 'ESL/TESOL Instructor', 'education', 'bachelors', 'Stable', 'High', 0.72, 'education', ['Beta-Iota Male']),
  career('edu_004', 'University Professor', 'education', 'doctorate', 'Stable', 'Medium-High', 0.68, 'research', ['Gamma Male']),
  career('edu_005', 'Instructional Designer', 'education', 'masters', 'Moderate', 'Medium', 0.58, 'education', ['Gamma Male']),
  career('edu_006', 'Education Technology Specialist', 'education', 'bachelors', 'Moderate', 'Medium-High', 0.65, 'tech', ['Gamma Male']),
  career('edu_007', 'Corporate Trainer', 'education', 'bachelors', 'Stable', 'Medium-High', 0.66, 'education', ['Beta Male']),
  career('edu_008', 'Academic Advisor', 'education', 'masters', 'Stable', 'High', 0.7, 'education', ['Beta-Iota Male']),
  career('edu_009', 'Curriculum Developer', 'education', 'masters', 'Stable', 'Medium-High', 0.68, 'education', ['Gamma Male']),
  career('edu_010', 'Research Scientist (Academia)', 'education', 'doctorate', 'Stable', 'Medium-High', 0.7, 'research', ['Gamma Male']),
  career('edu_011', 'Lab Manager (Academic)', 'education', 'masters', 'Stable', 'Medium-High', 0.65, 'research', ['Beta Male']),
  career('edu_012', 'School Psychologist', 'education', 'masters', 'Stable', 'Very High', 0.82, 'healthcare', ['Beta-Iota Male']),
  career('edu_013', 'School Counselor', 'education', 'masters', 'Stable', 'Very High', 0.8, 'education', ['Delta-Mu Male', 'Beta-Iota Male']),
  career('edu_014', 'Librarian (Academic)', 'education', 'masters', 'Declining', 'Medium', 0.55, 'education', ['Beta-Iota Male']),
  career('edu_015', 'Museum Educator', 'education', 'masters', 'Stable', 'High', 0.72, 'education', ['Beta-Iota Male']),
  career('edu_016', 'Education Policy Analyst', 'education', 'masters', 'Stable', 'High', 0.7, 'legal', ['Alpha-Rho Male']),
  career('edu_017', 'Online Course Creator', 'education', 'bachelors', 'High', 'Medium', 0.58, 'education', ['Sigma Male', 'Gamma-Nu Male']),
  career('edu_018', 'Tutoring Service Owner', 'education', 'bachelors', 'Moderate', 'Medium-High', 0.68, 'education', ['Sigma Male']),
  career('edu_019', 'Educational Consultant', 'education', 'masters', 'Moderate', 'High', 0.72, 'business', ['Sigma-Kappa Male']),
  career('edu_020', 'Learning & Development Manager', 'education', 'masters', 'Moderate', 'Medium-High', 0.68, 'education', ['Alpha Male'])
];

// Creative & Media (25)
const CREATIVE = [
  career('creative_001', 'Graphic Designer', 'creative', 'bachelors', 'Stable', 'Medium', 0.5, 'creative', ['Sigma-Lambda Male', 'Gamma-Nu Male']),
  career('creative_002', 'UI/UX Designer', 'creative', 'bachelors', 'Moderate', 'Medium-High', 0.65, 'creative', ['Gamma-Nu Male']),
  career('creative_003', 'Art Director', 'creative', 'bachelors', 'Stable', 'Medium-High', 0.68, 'creative', ['Gamma-Nu Male']),
  career('creative_004', 'Copywriter', 'creative', 'bachelors', 'Declining', 'Low', 0.4, 'creative', ['Gamma-Nu Male']),
  career('creative_005', 'Content Strategist', 'creative', 'bachelors', 'Moderate', 'Medium', 0.58, 'creative', ['Gamma Male']),
  career('creative_006', 'Social Media Manager', 'creative', 'bachelors', 'Stable', 'Medium', 0.52, 'creative', ['Gamma-Pi Male']),
  career('creative_007', 'Video Editor', 'creative', 'bachelors', 'Stable', 'Medium', 0.48, 'creative', ['Sigma-Lambda Male']),
  career('creative_008', 'Motion Graphics Designer', 'creative', 'bachelors', 'Moderate', 'Medium-High', 0.62, 'creative', ['Gamma-Nu Male']),
  career('creative_009', 'Photographer', 'creative', 'bachelors', 'Declining', 'Medium', 0.55, 'creative', ['Gamma-Nu Male', 'Sigma-Lambda Male']),
  career('creative_010', 'Videographer', 'creative', 'bachelors', 'Stable', 'Medium', 0.58, 'creative', ['Sigma-Lambda Male']),
  career('creative_011', 'Animator (3D/2D)', 'creative', 'bachelors', 'Stable', 'Medium', 0.55, 'creative', ['Gamma-Nu Male']),
  career('creative_012', 'Game Designer', 'creative', 'bachelors', 'Stable', 'Medium-High', 0.65, 'creative', ['Gamma Male']),
  career('creative_013', 'Industrial Designer', 'creative', 'bachelors', 'Stable', 'Medium', 0.58, 'creative', ['Gamma Male']),
  career('creative_014', 'Fashion Designer', 'creative', 'bachelors', 'Stable', 'Medium', 0.52, 'creative', ['Gamma-Nu Male']),
  career('creative_015', 'Interior Designer', 'creative', 'bachelors', 'Stable', 'Medium-High', 0.62, 'creative', ['Gamma-Nu Male']),
  career('creative_016', 'Technical Writer', 'creative', 'bachelors', 'Stable', 'Medium', 0.5, 'creative', ['Gamma Male']),
  career('creative_017', 'Grant Writer', 'creative', 'bachelors', 'Stable', 'Medium-High', 0.65, 'creative', ['Beta Male']),
  career('creative_018', 'Podcast Producer', 'creative', 'bachelors', 'Moderate', 'Medium-High', 0.66, 'creative', ['Sigma Male']),
  career('creative_019', 'Brand Strategist', 'creative', 'bachelors', 'Moderate', 'High', 0.7, 'business', ['Gamma-Nu Male']),
  career('creative_020', 'Creative Director', 'creative', 'bachelors', 'Stable', 'High', 0.72, 'creative', ['Gamma-Nu Male']),
  career('creative_021', 'Museum Curator', 'creative', 'masters', 'Stable', 'High', 0.75, 'creative', ['Beta-Iota Male']),
  career('creative_022', 'Music Producer', 'creative', 'bachelors', 'Stable', 'Medium-High', 0.65, 'creative', ['Gamma-Nu Male', 'Sigma-Lambda Male']),
  career('creative_023', 'Set Designer', 'creative', 'bachelors', 'Stable', 'High', 0.7, 'creative', ['Sigma-Lambda Male']),
  career('creative_024', 'Digital Marketer', 'creative', 'bachelors', 'Moderate', 'Medium', 0.54, 'sales', ['Gamma-Pi Male']),
  career('creative_025', 'Influencer/Content Creator', 'creative', 'bachelors', 'Moderate', 'Medium', 0.58, 'creative', ['Sigma Male'])
];

// Legal & Public Service (18) — includes Social Work, Foster Care
const LEGAL = [
  career('legal_001', 'Corporate Lawyer', 'legal', 'jd', 'Stable', 'Medium-High', 0.68, 'legal', ['Alpha Male']),
  career('legal_002', 'Public Defender', 'legal', 'jd', 'Stable', 'High', 0.75, 'legal', ['Alpha Male']),
  career('legal_003', 'Paralegal', 'legal', 'associates', 'Declining', 'Low', 0.35, 'legal', ['Beta Male']),
  career('legal_004', 'Legal Technology Specialist', 'legal', 'bachelors', 'Moderate', 'Medium', 0.6, 'tech', ['Gamma Male']),
  career('legal_005', 'Compliance Attorney', 'legal', 'jd', 'Stable', 'Medium-High', 0.68, 'legal', ['Alpha-Rho Male']),
  career('legal_006', 'Patent Attorney', 'legal', 'jd', 'Stable', 'Medium-High', 0.7, 'legal', ['Gamma Male']),
  career('legal_007', 'Immigration Lawyer', 'legal', 'jd', 'Stable', 'High', 0.72, 'legal', ['Alpha-Rho Male']),
  career('legal_008', 'Mediator/Arbitrator', 'legal', 'masters', 'Stable', 'Very High', 0.82, 'legal', ['Alpha-Rho Male']),
  career('legal_009', 'Judge', 'legal', 'jd', 'Stable', 'Very High', 0.88, 'legal', ['Alpha-Rho Male']),
  career('legal_010', 'Policy Analyst', 'legal', 'masters', 'Stable', 'High', 0.7, 'legal', ['Alpha-Rho Male']),
  career('legal_011', 'Legislative Aide', 'legal', 'bachelors', 'Stable', 'Medium-High', 0.65, 'legal', ['Beta Male']),
  career('legal_012', 'Urban Planner', 'legal', 'masters', 'Stable', 'Medium-High', 0.68, 'legal', ['Gamma Male']),
  career('legal_013', 'Police Officer', 'legal', 'none', 'Declining', 'High', 0.72, 'legal', ['Alpha-Xi Male']),
  career('legal_014', 'Detective/Investigator', 'legal', 'associates', 'Stable', 'High', 0.75, 'legal', ['Alpha-Xi Male']),
  career('legal_015', 'Social Worker', 'legal', 'masters', 'Stable', 'Very High', 0.85, 'healthcare', ['Delta-Mu Male', 'Beta-Iota Male']),
  career('legal_016', 'Victim Advocate', 'legal', 'bachelors', 'Stable', 'Very High', 0.82, 'healthcare', ['Delta-Mu Male', 'Beta-Iota Male']),
  career('legal_017', 'Probation Officer', 'legal', 'bachelors', 'Stable', 'High', 0.72, 'legal', ['Alpha-Rho Male']),
  career('legal_018', 'Emergency Management Director', 'legal', 'bachelors', 'Stable', 'High', 0.75, 'legal', ['Alpha-Xi Male'])
];

// Trades & Technical Services (20)
const TRADES = [
  career('trades_001', 'Electrician', 'trades', 'certificate', 'Stable', 'High', 0.78, 'trades', ['Delta Male']),
  career('trades_002', 'Plumber', 'trades', 'certificate', 'Stable', 'Very High', 0.82, 'trades', ['Delta Male']),
  career('trades_003', 'HVAC Technician', 'trades', 'certificate', 'Moderate', 'High', 0.75, 'trades', ['Delta Male']),
  career('trades_004', 'Carpenter', 'trades', 'certificate', 'Stable', 'High', 0.72, 'trades', ['Delta Male']),
  career('trades_005', 'Welder', 'trades', 'certificate', 'Stable', 'Medium-High', 0.68, 'trades', ['Delta Male']),
  career('trades_006', 'Auto Mechanic', 'trades', 'certificate', 'Declining', 'Medium', 0.58, 'trades', ['Delta Male']),
  career('trades_007', 'Diesel Mechanic', 'trades', 'certificate', 'Stable', 'Medium-High', 0.65, 'trades', ['Delta Male']),
  career('trades_008', 'Aircraft Mechanic', 'trades', 'certificate', 'Stable', 'High', 0.75, 'trades', ['Delta Male']),
  career('trades_009', 'Wind Turbine Technician', 'trades', 'certificate', 'High', 'Very High', 0.88, 'trades', ['Delta Male']),
  career('trades_010', 'Solar Panel Installer', 'trades', 'certificate', 'High', 'High', 0.78, 'trades', ['Delta Male']),
  career('trades_011', 'EV Charging Technician', 'trades', 'certificate', 'High', 'High', 0.75, 'trades', ['Delta Male']),
  career('trades_012', 'CNC Machinist', 'trades', 'certificate', 'Stable', 'Medium', 0.58, 'trades', ['Delta Male']),
  career('trades_013', 'Industrial Maintenance Tech', 'trades', 'certificate', 'Stable', 'High', 0.72, 'trades', ['Delta Male']),
  career('trades_014', 'Elevator Installer/Repairer', 'trades', 'certificate', 'Stable', 'High', 0.75, 'trades', ['Delta Male']),
  career('trades_015', 'Locksmith', 'trades', 'certificate', 'Stable', 'Medium-High', 0.68, 'trades', ['Delta Male']),
  career('trades_016', 'Glazier', 'trades', 'certificate', 'Stable', 'High', 0.72, 'trades', ['Delta Male']),
  career('trades_017', 'Heavy Equipment Operator', 'trades', 'certificate', 'Stable', 'Medium', 0.6, 'trades', ['Delta Male']),
  career('trades_018', 'Roofer', 'trades', 'certificate', 'Stable', 'High', 0.75, 'trades', ['Delta Male']),
  career('trades_019', 'Pipefitter', 'trades', 'certificate', 'Stable', 'High', 0.72, 'trades', ['Delta Male']),
  career('trades_020', 'Millwright', 'trades', 'certificate', 'Stable', 'High', 0.7, 'trades', ['Delta Male'])
];

// Hospitality & Personal Services (15)
const HOSPITALITY = [
  career('hosp_001', 'Chef/Head Cook', 'hospitality', 'certificate', 'Stable', 'High', 0.75, 'trades', ['Delta Male']),
  career('hosp_002', 'Sous Chef', 'hospitality', 'certificate', 'Stable', 'High', 0.72, 'trades', ['Delta Male']),
  career('hosp_003', 'Restaurant Manager', 'hospitality', 'bachelors', 'Stable', 'Medium-High', 0.65, 'business', ['Beta Male']),
  career('hosp_004', 'Hotel Manager', 'hospitality', 'bachelors', 'Stable', 'Medium-High', 0.68, 'business', ['Beta Male']),
  career('hosp_005', 'Event Planner', 'hospitality', 'bachelors', 'Stable', 'High', 0.72, 'sales', ['Gamma-Nu Male']),
  career('hosp_006', 'Wedding Planner', 'hospitality', 'bachelors', 'Stable', 'High', 0.75, 'sales', ['Gamma-Nu Male']),
  career('hosp_007', 'Cosmetologist', 'hospitality', 'certificate', 'Stable', 'Very High', 0.85, 'creative', ['Gamma-Nu Male']),
  career('hosp_008', 'Barber', 'hospitality', 'certificate', 'Stable', 'Very High', 0.82, 'trades', ['Delta Male']),
  career('hosp_009', 'Massage Therapist', 'hospitality', 'certificate', 'Stable', 'Very High', 0.88, 'healthcare', ['Delta-Mu Male']),
  career('hosp_010', 'Personal Trainer', 'hospitality', 'certificate', 'Stable', 'High', 0.75, 'education', ['Alpha Male']),
  career('hosp_011', 'Life Coach', 'hospitality', 'bachelors', 'Moderate', 'High', 0.75, 'healthcare', ['Gamma-Theta Male']),
  career('hosp_012', 'Travel Agent', 'hospitality', 'certificate', 'Declining', 'Medium', 0.5, 'sales', ['Beta Male']),
  career('hosp_013', 'Concierge', 'hospitality', 'none', 'Stable', 'High', 0.72, 'sales', ['Beta Male']),
  career('hosp_014', 'Sommelier', 'hospitality', 'certificate', 'Stable', 'High', 0.78, 'creative', ['Gamma-Nu Male']),
  career('hosp_015', 'Private Chef', 'hospitality', 'certificate', 'Stable', 'Very High', 0.85, 'trades', ['Sigma Male'])
];

// Sales & Customer Relations (12)
const SALES = [
  career('sales_001', 'Account Executive (B2B)', 'sales', 'bachelors', 'Stable', 'Medium-High', 0.68, 'sales', ['Alpha Male', 'Gamma-Pi Male']),
  career('sales_002', 'Sales Engineer', 'sales', 'bachelors', 'Moderate', 'High', 0.72, 'sales', ['Gamma Male']),
  career('sales_003', 'Retail Manager', 'sales', 'none', 'Declining', 'Medium', 0.52, 'business', ['Beta Male']),
  career('sales_004', 'Pharmaceutical Sales Rep', 'sales', 'bachelors', 'Stable', 'Medium', 0.58, 'sales', ['Gamma-Pi Male']),
  career('sales_005', 'Real Estate Agent', 'sales', 'certificate', 'Stable', 'Medium-High', 0.68, 'sales', ['Gamma-Pi Male']),
  career('sales_006', 'Insurance Agent', 'sales', 'certificate', 'Stable', 'Medium', 0.52, 'sales', ['Gamma-Pi Male']),
  career('sales_007', 'Customer Success Manager', 'sales', 'bachelors', 'Moderate', 'Medium-High', 0.68, 'sales', ['Beta Male']),
  career('sales_008', 'Business Development Rep', 'sales', 'bachelors', 'Moderate', 'Medium-High', 0.65, 'sales', ['Gamma-Pi Male']),
  career('sales_009', 'Sales Trainer', 'sales', 'bachelors', 'Stable', 'Medium-High', 0.68, 'education', ['Alpha Male']),
  career('sales_010', 'Inside Sales Rep', 'sales', 'none', 'Declining', 'Low', 0.38, 'sales', ['Omega Male']),
  career('sales_011', 'Territory Manager', 'sales', 'bachelors', 'Stable', 'Medium-High', 0.65, 'sales', ['Gamma-Pi Male']),
  career('sales_012', 'E-commerce Manager', 'sales', 'bachelors', 'Moderate', 'Medium', 0.58, 'business', ['Gamma Male'])
];

// Agriculture & Environmental (10)
const AGRICULTURE = [
  career('ag_001', 'Environmental Scientist', 'agriculture', 'bachelors', 'Moderate', 'High', 0.72, 'research', ['Gamma Male']),
  career('ag_002', 'Conservation Scientist', 'agriculture', 'bachelors', 'Stable', 'High', 0.75, 'research', ['Gamma Male']),
  career('ag_003', 'Agricultural Engineer', 'agriculture', 'bachelors', 'Stable', 'Medium-High', 0.68, 'tech', ['Gamma Male', 'Delta Male']),
  career('ag_004', 'Precision Agriculture Specialist', 'agriculture', 'bachelors', 'High', 'Medium-High', 0.65, 'tech', ['Gamma Male']),
  career('ag_005', 'Wildlife Biologist', 'agriculture', 'masters', 'Stable', 'High', 0.75, 'research', ['Gamma Male']),
  career('ag_006', 'Park Ranger', 'agriculture', 'bachelors', 'Stable', 'Very High', 0.82, 'legal', ['Delta Male']),
  career('ag_007', 'Sustainability Coordinator', 'agriculture', 'bachelors', 'Moderate', 'High', 0.7, 'business', ['Gamma Male']),
  career('ag_008', 'Carbon Accounting Specialist', 'agriculture', 'bachelors', 'High', 'Medium-High', 0.68, 'business', ['Gamma Male']),
  career('ag_009', 'Water Resource Specialist', 'agriculture', 'masters', 'Moderate', 'High', 0.72, 'research', ['Gamma Male']),
  career('ag_010', 'Farm Manager (Modern)', 'agriculture', 'bachelors', 'Stable', 'Medium-High', 0.65, 'business', ['Delta Male'])
];

export const MARKET_PROJECTION_MATRIX = [
  ...TECH, ...HEALTHCARE, ...BUSINESS, ...EDUCATION,
  ...CREATIVE, ...LEGAL, ...TRADES, ...HOSPITALITY, ...SALES, ...AGRICULTURE
];
