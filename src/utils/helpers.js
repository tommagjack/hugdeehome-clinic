/**
 * SEO helper: Dynamically updates the page title and meta description.
 */
export const updateMeta = (title, description, path = '') => {
  document.title = title || 'บ้านฮักดี คลินิกกิจกรรมบำบัด พะเยา';
  
  // Update Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description || 'บ้านฮักดี คลินิกกิจกรรมบำบัด พะเยา ให้บริการประเมิน บำบัด และส่งเสริมพัฒนาการเด็กอายุ 6 เดือน – 12 ปี');

  // Update Open Graph Title
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', title);

  // Update Open Graph Description
  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    document.head.appendChild(ogDesc);
  }
  ogDesc.setAttribute('content', description);

  // Update Canonical URL
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  const base = window.location.origin;
  canonical.setAttribute('href', `${base}/#${path}`);
};

/**
 * Injects Structured Data (JSON-LD) into the head.
 * Automatically clears previous JSON-LD scripts to avoid pollution.
 */
export const injectStructuredData = (id, dataObj) => {
  // Remove existing element if any
  const existing = document.getElementById(`jsonld-${id}`);
  if (existing) {
    existing.remove();
  }

  if (!dataObj) return;

  const script = document.createElement('script');
  script.id = `jsonld-${id}`;
  script.type = 'application/ld+json';
  script.text = JSON.stringify(dataObj);
  document.head.appendChild(script);
};

/**
 * Generates LocalBusiness Structured Data
 */
export const getLocalBusinessSchema = (settings) => {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": settings?.name_th || "บ้านฮักดี คลินิกกิจกรรมบำบัด",
    "alternateName": settings?.name_en || "Hug Dee Home Clinic",
    "image": settings?.logo_url || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400",
    "@id": window.location.origin,
    "url": window.location.origin,
    "telephone": settings?.phone || "094-675-3557",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "104/7 หมู่ 17",
      "addressLocality": "ตำบลบ้านต๋อม อำเภอเมือง",
      "addressRegion": "จังหวัดพะเยา",
      "postalCode": "56000",
      "addressCountry": "TH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 19.197090,
      "longitude": 99.887948
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "17:00",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday", "Sunday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "sameAs": [
      settings?.facebook_url || "https://www.facebook.com/hugdeehome"
    ]
  };
};

/**
 * Generates FAQPage Structured Data
 */
export const getFAQPageSchema = (faqs) => {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question_th,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer_th
      }
    }))
  };
};

/**
 * Generates Article Structured Data
 */
export const getArticleSchema = (article) => {
  if (!article) return null;
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title_th,
    "image": [
      article.cover_image_url || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800"
    ],
    "datePublished": article.published_date || new Date().toISOString(),
    "dateModified": article.published_date || new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": article.author || "นักกิจกรรมบำบัดวิชาชีพ"
    }
  };
};

/**
 * Language selection utility
 */
export const t = (lang, thVal, enVal) => {
  return lang === 'en' ? (enVal || thVal) : thVal;
};
