/**
 * NEX ASSOCIATE — Standalone System Data & Agent Registry
 * Nexus Learning Ecosystem
 */

const NEX_DATA = {
  systemInfo: {
    name: "NEX ASSOCIATE OS",
    version: "v3.0",
    clientRole: "NEX_ASSOCIATE",
    gatewayMode: "PRIMARY_NEX_CURRICULUM_FETCH",
    targetMarket: "African & International K-12 Education",
    actualLoadedCounts: {
      totalConcepts: 5420,
      totalQuestions: 102400,
      totalAgents: 28,
      microAgents: 21
    }
  },

  // Available Curriculum Standards
  curricula: [
    { id: 'NERDC', name: 'NERDC National Standard (Nigeria / WAEC / NECO / JAMB)', defaultSystem: true },
    { id: 'CAMBRIDGE', name: 'Cambridge International (British / IGCSE / Checkpoint)', defaultSystem: false },
    { id: 'AMERICAN', name: 'US Common Core State Standards (American / SAT)', defaultSystem: false },
    { id: 'HARMONIZED', name: 'Nexus Harmonized Multi-Curriculum (Hybrid International)', defaultSystem: false }
  ],

  // Subject Catalog
  subjectCatalog: [
    { code: 'MATH', name: 'Mathematics / General Math', category: 'STEM', icon: '📐' },
    { code: 'ENG', name: 'English Language / Studies', category: 'Humanities', icon: '✍️' },
    { code: 'PHY', name: 'Physics', category: 'STEM', icon: '⚡' },
    { code: 'CHEM', name: 'Chemistry', category: 'STEM', icon: '🧪' },
    { code: 'BIO', name: 'Biology', category: 'STEM', icon: '🧬' },
    { code: 'FUR_MATH', name: 'Further Mathematics', category: 'STEM', icon: '🔢' },
    { code: 'COMP', name: 'Computer Studies / ICT', category: 'STEM', icon: '💻' },
    { code: 'CIVIC', name: 'Civic Education', category: 'Humanities', icon: '🏛️' },
    { code: 'ECON', name: 'Economics', category: 'Commercial', icon: '📊' },
    { code: 'GOVT', name: 'Government', category: 'Humanities', icon: '📜' },
    { code: 'AGRIC', name: 'Agricultural Science', category: 'STEM', icon: '🌾' },
    { code: 'ACCT', name: 'Financial Accounting', category: 'Commercial', icon: '💰' },
    { code: 'COMM', name: 'Commerce', category: 'Commercial', icon: '🏬' },
    { code: 'LIT', name: 'Literature in English', category: 'Humanities', icon: '📚' }
  ],

  // 9 Lead Tier-2 Agents Roster under NEX Associate
  leadAgents: [
    {
      id: "nex_schedule_dispatcher",
      name: "NEX Schedule Dispatcher",
      role: "Lead Timetable & Substitute Logistics",
      badge: "NEW LOGISTICS LEAD",
      microAgents: ["timetable_calendar_micro", "automated_dispatch_micro", "substitute_handover_micro"]
    },
    {
      id: "nex_inspector_compliance",
      name: "NEX Inspector Compliance",
      role: "Lead Ministry Quality Inspection & Logbooks",
      badge: "NEW COMPLIANCE LEAD",
      microAgents: ["ministry_stamp_auditor_micro", "syllabus_velocity_tracker_micro", "accreditation_report_micro"]
    },
    {
      id: "nex_vernacular_inclusion",
      name: "NEX Vernacular & Inclusion",
      role: "Lead Hausa/Yoruba/Igbo/French/Swahili & SEN",
      badge: "NEW INCLUSION LEAD",
      microAgents: ["indigenous_vernacular_micro", "sen_udl_adapter_micro", "multilingual_scriptor_micro"]
    },
    {
      id: "nex_teacher_coach",
      name: "NEX Teacher Coach",
      role: "Lead 60+ Class Management & Micro-CPD",
      badge: "NEW COACHING LEAD",
      microAgents: ["classroom_management_micro", "micro_cpd_coach_micro", "low_cost_realia_micro"]
    },
    {
      id: "nex_lead_lesson_planner",
      name: "NEX Lead Lesson Planner",
      role: "Lead 13-Section Lesson Plan Manufacturing",
      badge: "CORE PEDAGOGY LEAD",
      microAgents: ["lp_objectives_micro", "lp_differentiation_micro", "lp_african_context_micro"]
    },
    {
      id: "nex_note_specialist",
      name: "NEX Lead Note Specialist",
      role: "Lead 5-Step Blackboard Notes & Notebooks",
      badge: "CORE PEDAGOGY LEAD",
      microAgents: ["note_board_summary_micro", "note_worked_examples_micro", "note_guided_practice_micro"]
    },
    {
      id: "nex_lead_assessment_engine",
      name: "NEX Lead Assessment Engine",
      role: "Lead Exam Question Banks & WAEC Rubrics",
      badge: "ASSESSMENT LEAD",
      microAgents: ["mcq_item_builder_micro", "theory_rubric_micro", "dok_blueprint_micro"]
    },
    {
      id: "nex_lead_curriculum_harmonizer",
      name: "NEX Lead Curriculum Harmonizer",
      role: "Lead NERDC / Cambridge / US Cross-Mapping",
      badge: "HARMONIZATION LEAD",
      microAgents: ["nerdc_waec_mapper_micro", "cambridge_igcse_mapper_micro", "commoncore_sat_mapper_micro"]
    },
    {
      id: "nex_lead_math_validator",
      name: "NEX Lead Math Validator",
      role: "Lead Mathematical Rigor & LaTeX Syntax Auditor",
      badge: "RIGOR & SYNTAX LEAD",
      microAgents: ["latex_syntax_micro", "algebra_verifier_micro", "word_problem_checker_micro"]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = NEX_DATA;
}
