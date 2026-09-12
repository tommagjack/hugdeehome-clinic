import {
  INITIAL_SITE_SETTINGS,
  INITIAL_SERVICES,
  INITIAL_TEAM,
  INITIAL_ASSESSMENTS,
  INITIAL_HOME_GUIDES
} from './seedData';

const KEYS = {
  SETTINGS: 'hugdee_site_settings_v2',
  SERVICES: 'hugdee_services_v2',
  TEAM: 'hugdee_team_v2',
  ASSESSMENTS: 'hugdee_assessments_v2',
  HOME_GUIDES: 'hugdee_home_guides_v2',
  INQUIRIES: 'hugdee_inquiries_v2',
  ASSESSMENT_SUBMISSIONS: 'hugdee_assessment_submissions_v2'
};

// Helper: load from localStorage with fallback
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      save(key, fallback);
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

// Helper: save to localStorage
function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export const storage = {
  // --- Site Settings ---
  async getSettings() {
    const loaded = load(KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
    return {
      ...INITIAL_SITE_SETTINGS,
      ...loaded,
      logoUrl: loaded?.logoUrl || INITIAL_SITE_SETTINGS.logoUrl,
      faviconUrl: loaded?.faviconUrl || INITIAL_SITE_SETTINGS.faviconUrl,
      openingHours: {
        ...INITIAL_SITE_SETTINGS.openingHours,
        ...(loaded?.openingHours || {})
      }
    };
  },

  async updateSettings(updated) {
    const current = await this.getSettings();
    const merged = { 
      ...current, 
      ...updated,
      openingHours: {
        ...(current.openingHours || {}),
        ...(updated.openingHours || {})
      }
    };
    save(KEYS.SETTINGS, merged);
    window.dispatchEvent(new CustomEvent('hugdee_settings_changed', { detail: merged }));
    return merged;
  },

  // --- Services ---
  async getServices() {
    const services = load(KEYS.SERVICES, INITIAL_SERVICES);
    return [...services].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  },

  async getServiceBySlug(slug) {
    const services = await this.getServices();
    return services.find(s => s.slug === slug) || null;
  },

  async saveService(service) {
    const services = await this.getServices();
    let updated;
    if (service.id) {
      updated = services.map(s => (s.id === service.id ? { ...s, ...service } : s));
    } else {
      const newService = {
        ...service,
        id: `srv_${Date.now()}`,
        displayOrder: services.length + 1
      };
      updated = [...services, newService];
    }
    save(KEYS.SERVICES, updated);
    return updated;
  },

  async deleteService(id) {
    const services = await this.getServices();
    const updated = services.filter(s => s.id !== id);
    save(KEYS.SERVICES, updated);
    return updated;
  },

  // --- Team ---
  async getTeam() {
    const team = load(KEYS.TEAM, INITIAL_TEAM);
    return [...team].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  },

  async saveTeamMember(member) {
    const team = await this.getTeam();
    let updated;
    if (member.id) {
      updated = team.map(t => (t.id === member.id ? { ...t, ...member } : t));
    } else {
      const newMember = {
        ...member,
        id: `team_${Date.now()}`,
        displayOrder: team.length + 1
      };
      updated = [...team, newMember];
    }
    save(KEYS.TEAM, updated);
    return updated;
  },

  async deleteTeamMember(id) {
    const team = await this.getTeam();
    const updated = team.filter(t => t.id !== id);
    save(KEYS.TEAM, updated);
    return updated;
  },

  // --- Dynamic Assessments ---
  async getAssessments() {
    const assessments = load(KEYS.ASSESSMENTS, INITIAL_ASSESSMENTS);
    return assessments;
  },

  async getAssessmentById(id) {
    const assessments = await this.getAssessments();
    return assessments.find(a => a.id === id || a.slug === id) || null;
  },

  async saveAssessment(assessment) {
    const assessments = await this.getAssessments();
    let updated;
    if (assessment.id) {
      updated = assessments.map(a => (a.id === assessment.id ? { ...a, ...assessment } : a));
    } else {
      const newAsm = {
        ...assessment,
        id: `asm_${Date.now()}`,
        slug: assessment.slug || `assessment-${Date.now()}`
      };
      updated = [...assessments, newAsm];
    }
    save(KEYS.ASSESSMENTS, updated);
    return updated;
  },

  async deleteAssessment(id) {
    const assessments = await this.getAssessments();
    const updated = assessments.filter(a => a.id !== id);
    save(KEYS.ASSESSMENTS, updated);
    return updated;
  },

  // Save assessment result (strictly anonymized, no sensitive medical or personal info)
  async saveAssessmentResult(resultData) {
    const current = load(KEYS.ASSESSMENT_SUBMISSIONS, []);
    const record = {
      id: `sub_${Date.now()}`,
      assessmentId: resultData.assessmentId,
      assessmentTitle: resultData.assessmentTitle,
      score: resultData.score,
      level: resultData.level,
      badgeText: resultData.badgeText,
      completedAt: new Date().toISOString()
    };
    current.push(record);
    save(KEYS.ASSESSMENT_SUBMISSIONS, current);
    return record;
  },

  // --- Home Guides (Articles) ---
  async getHomeGuides() {
    const guides = load(KEYS.HOME_GUIDES, INITIAL_HOME_GUIDES);
    return [...guides].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  },

  async getHomeGuideBySlug(slug) {
    const guides = await this.getHomeGuides();
    return guides.find(g => g.slug === slug) || null;
  },

  async saveHomeGuide(guide) {
    const guides = await this.getHomeGuides();
    let updated;
    if (guide.id) {
      updated = guides.map(g => (g.id === guide.id ? { ...g, ...guide } : g));
    } else {
      const newGuide = {
        ...guide,
        id: `guide_${Date.now()}`,
        publishedDate: guide.publishedDate || new Date().toISOString().split('T')[0],
        displayOrder: guides.length + 1
      };
      updated = [...guides, newGuide];
    }
    save(KEYS.HOME_GUIDES, updated);
    return updated;
  },

  async deleteHomeGuide(id) {
    const guides = await this.getHomeGuides();
    const updated = guides.filter(g => g.id !== id);
    save(KEYS.HOME_GUIDES, updated);
    return updated;
  },

  // --- Inquiries (Contact messages) ---
  async getInquiries() {
    return load(KEYS.INQUIRIES, []);
  },

  async saveInquiry(inquiry) {
    const current = await this.getInquiries();
    const newInquiry = {
      id: `inq_${Date.now()}`,
      ...inquiry,
      createdAt: new Date().toISOString(),
      status: 'unread'
    };
    const updated = [newInquiry, ...current];
    save(KEYS.INQUIRIES, updated);
    return newInquiry;
  },

  // Reset to default seed data
  async resetAllToDefault() {
    save(KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
    save(KEYS.SERVICES, INITIAL_SERVICES);
    save(KEYS.TEAM, INITIAL_TEAM);
    save(KEYS.ASSESSMENTS, INITIAL_ASSESSMENTS);
    save(KEYS.HOME_GUIDES, INITIAL_HOME_GUIDES);
    window.location.reload();
  }
};
