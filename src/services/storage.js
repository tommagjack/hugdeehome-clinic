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

const CLOUD_BASE_URL = 'https://bmplfuzkyyuqtlfgifvm.supabase.co/storage/v1/object/public/website_data';
const API_URL = '/api/data';

// Helper: load from localStorage with fallback
function loadLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      saveLocal(key, fallback);
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from local storage:`, err);
    return fallback;
  }
}

// Helper: save to localStorage
function saveLocal(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to local storage:`, err);
  }
}

// Fetch single JSON data from cloud CDN
async function fetchCloudData(cloudKey) {
  try {
    const res = await fetch(`${CLOUD_BASE_URL}/${cloudKey}.json?t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`[Storage] Cloud fetch for ${cloudKey} failed:`, err);
  }
  return null;
}

// Save data to cloud via API
async function saveCloudData(cloudKey, data) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: cloudKey, data })
    });
    if (!res.ok) {
      console.warn(`[Storage] Cloud save for ${cloudKey} returned status ${res.status}`);
    }
    return res.ok;
  } catch (err) {
    console.error(`[Storage] Cloud save for ${cloudKey} failed:`, err);
    return false;
  }
}

// Cloud synchronization and real-time polling state
let lastKnownUpdate = 0;
let isSyncing = false;

export async function syncFromCloud() {
  if (isSyncing) return;
  isSyncing = true;
  try {
    const metaRes = await fetch(`${CLOUD_BASE_URL}/metadata.json?t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (!metaRes.ok) {
      isSyncing = false;
      return;
    }
    const meta = await metaRes.json();
    if (!meta || !meta.lastUpdated) {
      isSyncing = false;
      return;
    }

    if (meta.lastUpdated > lastKnownUpdate) {
      lastKnownUpdate = meta.lastUpdated;

      // Sync updated data from cloud storage
      const [cloudSettings, cloudServices, cloudTeam, cloudAssessments, cloudGuides] = await Promise.all([
        fetchCloudData('settings'),
        fetchCloudData('services'),
        fetchCloudData('team'),
        fetchCloudData('assessments'),
        fetchCloudData('home_guides')
      ]);

      if (cloudSettings) {
        const mergedSettings = {
          ...INITIAL_SITE_SETTINGS,
          ...cloudSettings,
          logoUrl: cloudSettings.logoUrl || INITIAL_SITE_SETTINGS.logoUrl,
          faviconUrl: cloudSettings.faviconUrl || INITIAL_SITE_SETTINGS.faviconUrl,
          openingHours: {
            ...INITIAL_SITE_SETTINGS.openingHours,
            ...(cloudSettings.openingHours || {})
          }
        };
        saveLocal(KEYS.SETTINGS, mergedSettings);
        window.dispatchEvent(new CustomEvent('hugdee_settings_changed', { detail: mergedSettings }));
      }

      if (cloudServices) {
        saveLocal(KEYS.SERVICES, cloudServices);
      }

      if (cloudTeam) {
        saveLocal(KEYS.TEAM, cloudTeam);
      }

      if (cloudAssessments) {
        saveLocal(KEYS.ASSESSMENTS, cloudAssessments);
      }

      if (cloudGuides) {
        saveLocal(KEYS.HOME_GUIDES, cloudGuides);
      }

      // Notify all pages and components that cloud data has been updated
      window.dispatchEvent(new CustomEvent('hugdee_data_updated', { 
        detail: { 
          updatedKey: meta.updatedKey, 
          timestamp: meta.lastUpdated 
        } 
      }));
    }
  } catch (e) {
    // Ignore network hiccups silently
  } finally {
    isSyncing = false;
  }
}

// Initial sync on startup & background polling every 5 seconds
if (typeof window !== 'undefined') {
  setTimeout(syncFromCloud, 300);
  setInterval(syncFromCloud, 5000);

  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      syncFromCloud();
    }
  });
  window.addEventListener('focus', syncFromCloud);
}

export const storage = {
  // --- Site Settings ---
  async getSettings() {
    const loaded = loadLocal(KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
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
    saveLocal(KEYS.SETTINGS, merged);
    window.dispatchEvent(new CustomEvent('hugdee_settings_changed', { detail: merged }));
    window.dispatchEvent(new CustomEvent('hugdee_data_updated', { detail: { key: 'settings' } }));
    
    // Save to Cloud in background
    saveCloudData('settings', merged);
    return merged;
  },

  // --- Services ---
  async getServices() {
    const services = loadLocal(KEYS.SERVICES, INITIAL_SERVICES);
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
    saveLocal(KEYS.SERVICES, updated);
    window.dispatchEvent(new CustomEvent('hugdee_data_updated', { detail: { key: 'services' } }));
    saveCloudData('services', updated);
    return updated;
  },

  async deleteService(id) {
    const services = await this.getServices();
    const updated = services.filter(s => s.id !== id);
    saveLocal(KEYS.SERVICES, updated);
    window.dispatchEvent(new CustomEvent('hugdee_data_updated', { detail: { key: 'services' } }));
    saveCloudData('services', updated);
    return updated;
  },

  // --- Team ---
  async getTeam() {
    const team = loadLocal(KEYS.TEAM, INITIAL_TEAM);
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
    saveLocal(KEYS.TEAM, updated);
    window.dispatchEvent(new CustomEvent('hugdee_data_updated', { detail: { key: 'team' } }));
    saveCloudData('team', updated);
    return updated;
  },

  async deleteTeamMember(id) {
    const team = await this.getTeam();
    const updated = team.filter(t => t.id !== id);
    saveLocal(KEYS.TEAM, updated);
    window.dispatchEvent(new CustomEvent('hugdee_data_updated', { detail: { key: 'team' } }));
    saveCloudData('team', updated);
    return updated;
  },

  // --- Dynamic Assessments ---
  async getAssessments() {
    const assessments = loadLocal(KEYS.ASSESSMENTS, INITIAL_ASSESSMENTS);
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
    saveLocal(KEYS.ASSESSMENTS, updated);
    window.dispatchEvent(new CustomEvent('hugdee_data_updated', { detail: { key: 'assessments' } }));
    saveCloudData('assessments', updated);
    return updated;
  },

  async deleteAssessment(id) {
    const assessments = await this.getAssessments();
    const updated = assessments.filter(a => a.id !== id);
    saveLocal(KEYS.ASSESSMENTS, updated);
    window.dispatchEvent(new CustomEvent('hugdee_data_updated', { detail: { key: 'assessments' } }));
    saveCloudData('assessments', updated);
    return updated;
  },

  // Save assessment result (strictly anonymized)
  async saveAssessmentResult(resultData) {
    const current = loadLocal(KEYS.ASSESSMENT_SUBMISSIONS, []);
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
    saveLocal(KEYS.ASSESSMENT_SUBMISSIONS, current);
    saveCloudData('assessment_submissions', current);
    return record;
  },

  // --- Home Guides (Articles) ---
  async getHomeGuides() {
    const guides = loadLocal(KEYS.HOME_GUIDES, INITIAL_HOME_GUIDES);
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
    saveLocal(KEYS.HOME_GUIDES, updated);
    window.dispatchEvent(new CustomEvent('hugdee_data_updated', { detail: { key: 'home_guides' } }));
    saveCloudData('home_guides', updated);
    return updated;
  },

  async deleteHomeGuide(id) {
    const guides = await this.getHomeGuides();
    const updated = guides.filter(g => g.id !== id);
    saveLocal(KEYS.HOME_GUIDES, updated);
    window.dispatchEvent(new CustomEvent('hugdee_data_updated', { detail: { key: 'home_guides' } }));
    saveCloudData('home_guides', updated);
    return updated;
  },

  // --- Inquiries (Contact messages) ---
  async getInquiries() {
    return loadLocal(KEYS.INQUIRIES, []);
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
    saveLocal(KEYS.INQUIRIES, updated);
    saveCloudData('inquiries', updated);
    return newInquiry;
  },

  // Reset to default seed data and sync to cloud
  async resetAllToDefault() {
    saveLocal(KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
    saveLocal(KEYS.SERVICES, INITIAL_SERVICES);
    saveLocal(KEYS.TEAM, INITIAL_TEAM);
    saveLocal(KEYS.ASSESSMENTS, INITIAL_ASSESSMENTS);
    saveLocal(KEYS.HOME_GUIDES, INITIAL_HOME_GUIDES);
    await Promise.all([
      saveCloudData('settings', INITIAL_SITE_SETTINGS),
      saveCloudData('services', INITIAL_SERVICES),
      saveCloudData('team', INITIAL_TEAM),
      saveCloudData('assessments', INITIAL_ASSESSMENTS),
      saveCloudData('home_guides', INITIAL_HOME_GUIDES)
    ]);
    window.location.reload();
  }
};
