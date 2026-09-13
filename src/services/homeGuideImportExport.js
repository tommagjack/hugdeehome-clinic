/**
 * Home Guide Import & Export Helper Utilities
 * Supports CSV, JSON, and Markdown/Text article export & import with Auto-Formatting and UTF-8 BOM
 */

// File download helper
export function downloadFile(content, fileName, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Auto-Format and Beautify Article Content (Markdown)
 * Cleans messy linebreaks, normalizes bullet points, detects headings, and structures paragraphs
 */
export function autoFormatArticleContent(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';

  // 1. Normalize line breaks and remove zero-width or phantom spaces
  let text = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();

  const lines = text.split('\n');
  const formattedLines = [];
  let inList = false;

  const commonHeadingKeywords = [
    'บทนำ', 'สรุป', 'ข้อแนะนำ', 'คำแนะนำ', 'คำแนะนำสำหรับผู้ปกครอง',
    'ข้อสังเกต', 'ข้อควรระวัง', 'สัญญาณเตือน', 'สิ่งที่ไม่ควรทำ', 'สิ่งที่ควรทำ',
    'กิจกรรมที่แนะนำ', 'วิธีสังเกต', 'แนวทางช่วยเหลือ', 'ขั้นตอนการฝึก',
    'ประโยชน์ที่เด็กจะได้รับ', 'เทคนิคสำหรับคุณพ่อคุณแม่', 'ข้อควรจำ'
  ];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Blank line handling
    if (!line) {
      inList = false;
      formattedLines.push('');
      continue;
    }

    // 2. Normalize bullet points: •, ⁃, ▫, ▪, –, —, ·, ‣, or dash/asterisk
    const isBulletChar = /^[•⁃▫▪–—·‣]\s*/.test(line);
    const isDashOrStar = /^[-*]\s+/.test(line);

    if (isBulletChar || isDashOrStar) {
      const cleanContent = line.replace(/^([•⁃▫▪–—·‣]|[-*]\s*)\s*/, '').trim();
      formattedLines.push(`* ${cleanContent}`);
      inList = true;
      continue;
    }

    // 3. If line is already a markdown heading
    if (/^#{1,4}\s+/.test(line)) {
      const cleanH = line.replace(/^#{1,4}\s+/, '').trim();
      formattedLines.push(`## ${cleanH}`);
      inList = false;
      continue;
    }

    // 4. Detect heading patterns (e.g., "1. การสังเกต...", "บทนำ:", "ข้อแนะนำ:")
    const isCommonHeading = commonHeadingKeywords.some(kw => 
      line === kw || line === `${kw}:` || line.startsWith(`${kw} :`) || line.startsWith(`${kw}: `)
    );
    const isNumberedHeading = /^(\d+[\.\)]\s+[\u0E00-\u0E7Fa-zA-Z\s]{3,40})$/.test(line);
    const isShortColonHeading = line.endsWith(':') && line.length <= 40 && !inList;

    if (isCommonHeading || isNumberedHeading || isShortColonHeading) {
      const cleanH = line.replace(/^#+\s*/, '').replace(/:$/, '').trim();
      formattedLines.push(`## ${cleanH}`);
      inList = false;
      continue;
    }

    // Normal paragraph
    formattedLines.push(line);
    inList = false;
  }

  // 5. Clean up multiple consecutive empty lines to max 1 empty line (double newline)
  const result = [];
  let prevEmpty = false;

  for (let i = 0; i < formattedLines.length; i++) {
    const line = formattedLines[i];
    if (line === '') {
      if (!prevEmpty && result.length > 0) {
        result.push('');
        prevEmpty = true;
      }
    } else {
      // If heading, ensure an empty line precedes it
      if (line.startsWith('## ') && result.length > 0 && result[result.length - 1] !== '') {
        result.push('');
      }
      result.push(line);
      prevEmpty = false;
    }
  }

  return result.join('\n').trim();
}

/**
 * Generate Blank CSV Template with UTF-8 BOM
 */
export function generateGuideCsvTemplate() {
  const headers = [
    'ชื่อบทความ',
    'หมวดหมู่',
    'ผู้เขียน',
    'คำอธิบายสั้น',
    'เนื้อหาบทความ',
    'ปักหมุดแนะนำ',
    'สถานะ'
  ];

  const sampleRows = [
    [
      'เทคนิคส่งเสริมกล้ามเนื้อมัดเล็กและการใช้มือผ่านกิจวัตรประจำวัน',
      'Fine Motor',
      'ทีมวิชาการ คลินิกพัฒนาการเด็กบ้านฮักดี',
      'ฝึกทักษะกล้ามเนื้อมัดเล็กและสายตาประสานกับมือได้ง่ายๆ จากของใช้ในบ้าน โดยไม่ต้องใช้อุปกรณ์ราคาแพง',
      '## ความสำคัญของกล้ามเนื้อมัดเล็ก\n\nกล้ามเนื้อมัดเล็กคือพื้นฐานสำคัญสำหรับการหยิบจับ การจับดินสอเขียนหนังสือ และการช่วยเหลือตนเอง\n\n## 3 กิจกรรมฝึกง่ายๆ ที่บ้าน\n\n* การปั้นแป้งโดว์หรือดินน้ำมัน\n* การฉีกและแปะกระดาษหลากสี\n* การช่วยติดกระดุมเสื้อและรูดซิป',
      'ใช่',
      'เผยแพร่'
    ],
    [
      'การจัดสภาพแวดล้อมเพื่อช่วยเด็กที่มีความไวต่อเสียง (Auditory Sensitivity)',
      'Sensory',
      'นักกิจกรรมบำบัด คลินิกบ้านฮักดี',
      'วิธีปรับสภาพแวดล้อมในบ้านและห้องเรียนเพื่อลดความวิตกกังวลและเพิ่มความมั่นคงทางอารมณ์',
      '## ทำไมเสียงบางเสียงจึงทำให้เด็กตื่นกลัว?\n\nระบบประสาทการได้ยินของเด็กบางคนอาจประมวลผลไวกว่าปกติ ทำให้เสียงไดร์เป่าผม หรือเสียงฟ้าร้องฟังดูดังและน่ากลัวมาก\n\n## แนวทางช่วยเหลือ\n\n* แจ้งเตือนล่วงหน้าก่อนจะเปิดเครื่องใช้ไฟฟ้าเสียงดัง\n* จัดมุมสงบ (Quiet Corner) ในบ้าน\n* เตรียมหูฟังตัดเสียงรบกวนเมื่อต้องออกไปข้างนอก',
      'ไม่ใช่',
      'เผยแพร่'
    ]
  ];

  // UTF-8 BOM (\uFEFF) ensures Excel displays Thai characters cleanly
  return '\uFEFF' + [
    headers.map(h => `"${h}"`).join(','),
    ...sampleRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\r\n');
}

/**
 * Export Guides array to CSV
 */
export function exportGuidesToCsv(guides = []) {
  const headers = [
    'ชื่อบทความ',
    'หมวดหมู่',
    'ผู้เขียน',
    'คำอธิบายสั้น',
    'เนื้อหาบทความ',
    'ปักหมุดแนะนำ',
    'สถานะ',
    'วันที่เผยแพร่'
  ];

  const rows = guides.map(g => [
    g.title || '',
    g.category || 'ทั่วไป',
    g.author || '',
    g.excerpt || '',
    g.content || '',
    g.isFeatured ? 'ใช่' : 'ไม่ใช่',
    g.status === 'published' ? 'เผยแพร่' : 'ฉบับร่าง',
    g.publishedDate || ''
  ]);

  const csvContent = '\uFEFF' + [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\r\n');

  const filename = `hugdee_home_guides_${new Date().toISOString().split('T')[0]}.csv`;
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
}

/**
 * Generate Blank Markdown Article Template
 */
export function generateGuideMarkdownTemplate() {
  return `# เข้าใจ Executive Functions (EF) ผ่านการเล่น

หมวดหมู่: EF และสมาธิ
ผู้เขียน: ทีมวิชาการ คลินิกพัฒนาการเด็กบ้านฮักดี
คำอธิบายสั้น: ทักษะการคิด วางแผน และควบคุมอารมณ์ตนเองที่ฝึกฝนได้ผ่านการเล่นในชีวิตประจำวัน
ปักหมุดแนะนำ: ใช่
สถานะ: เผยแพร่

---

## EF คืออะไร?
Executive Functions คือความสามารถของสมองส่วนหน้าที่ช่วยให้เด็กคิด วางแผน และยับยั้งชั่งใจเพื่อทำเป้าหมายให้สำเร็จ

## 3 กิจกรรมส่งเสริม EF ที่บ้าน
* เล่นเกมที่มีกฎกติกา เช่น ซ่อนหา หรือบอร์ดเกมง่ายๆ
* ชวนเด็กวางแผนก่อนลงมือทำ เช่น จัดของใส่กระเป๋าด้วยตนเอง
* ให้โอกาสเด็กแก้ปัญหาเมื่อเกิดอุปสรรคเล็กๆ น้อยๆ

## สรุปสำหรับผู้ปกครอง
การส่งเสริม EF ที่ดีที่สุดคือการสร้างความสัมพันธ์ที่อบอุ่นและเปิดโอกาสให้เด็กลงมือทำด้วยตนเองอย่างสม่ำเสมอ
`;
}

/**
 * Export Single Guide as Markdown (.md)
 */
export function exportGuideToMarkdown(guide) {
  const mdContent = `# ${guide.title || 'บทความ'}

หมวดหมู่: ${guide.category || 'ทั่วไป'}
ผู้เขียน: ${guide.author || 'ทีมวิชาการ คลินิกพัฒนาการเด็กบ้านฮักดี'}
คำอธิบายสั้น: ${guide.excerpt || ''}
ปักหมุดแนะนำ: ${guide.isFeatured ? 'ใช่' : 'ไม่ใช่'}
สถานะ: ${guide.status === 'published' ? 'เผยแพร่' : 'ฉบับร่าง'}
วันที่เผยแพร่: ${guide.publishedDate || new Date().toISOString().split('T')[0]}

---

${guide.content || ''}
`;

  const safeTitle = (guide.title || 'article').replace(/[^a-zA-Z0-9\u0E00-\u0E7F_-]/g, '_').slice(0, 40);
  const filename = `${safeTitle}.md`;
  downloadFile(mdContent, filename, 'text/markdown;charset=utf-8;');
}

/**
 * Export Guides to JSON
 */
export function exportGuidesToJson(guides) {
  const filename = `hugdee_home_guides_${new Date().toISOString().split('T')[0]}.json`;
  const jsonString = JSON.stringify(guides, null, 2);
  downloadFile(jsonString, filename, 'application/json;charset=utf-8;');
}

/**
 * Parse CSV text into array of guide objects
 */
export function parseCsvToGuides(csvText, autoFormat = true) {
  let cleanText = csvText.replace(/^\uFEFF/, '').trim();
  if (!cleanText) return [];

  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const c = cleanText[i];
    const next = cleanText[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      currentRow.push(currentField);
      currentField = '';
      if (currentRow.some(f => f.trim() !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentField += c;
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(f => f.trim() !== '')) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.trim().replace(/^"|"$/g, ''));
  const guides = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (row.length === 0 || !row[0]?.trim()) continue;

    const rowObj = {};
    headers.forEach((h, idx) => {
      rowObj[h] = row[idx] ? row[idx].trim() : '';
    });

    const title = rowObj['ชื่อบทความ'] || rowObj['Title'] || row[0] || '';
    if (!title) continue;

    const category = rowObj['หมวดหมู่'] || rowObj['Category'] || row[1] || 'ทั่วไป';
    const author = rowObj['ผู้เขียน'] || rowObj['Author'] || row[2] || 'ทีมวิชาการ คลินิกพัฒนาการเด็กบ้านฮักดี';
    const excerpt = rowObj['คำอธิบายสั้น'] || rowObj['Excerpt'] || row[3] || '';
    let content = rowObj['เนื้อหาบทความ'] || rowObj['Content'] || row[4] || '';

    if (autoFormat && content) {
      content = autoFormatArticleContent(content);
    }

    const isFeaturedRaw = (rowObj['ปักหมุดแนะนำ'] || row[5] || '').toLowerCase();
    const isFeatured = isFeaturedRaw === 'ใช่' || isFeaturedRaw === 'true' || isFeaturedRaw === '1';

    const statusRaw = (rowObj['สถานะ'] || row[6] || '').toLowerCase();
    const status = statusRaw.includes('ร่าง') || statusRaw === 'draft' ? 'draft' : 'published';

    guides.push({
      id: `guide_${Date.now()}_${r}`,
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0E00-\u0E7F-]/g, '') || `guide-${Date.now()}-${r}`,
      category,
      contentType: 'Article',
      author,
      excerpt,
      content,
      isFeatured,
      status,
      publishedDate: new Date().toISOString().split('T')[0],
      displayOrder: r
    });
  }

  return guides;
}

/**
 * Parse Markdown or plain text into a Guide object
 */
export function parseMarkdownToGuide(text, autoFormat = true) {
  if (!text || typeof text !== 'string') return null;

  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  let title = '';
  let category = 'EF และสมาธิ';
  let author = 'ทีมวิชาการ คลินิกพัฒนาการเด็กบ้านฮักดี';
  let excerpt = '';
  let isFeatured = false;
  let status = 'published';
  const contentLines = [];

  let inBody = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      inBody = true;
      continue;
    }

    if (!inBody) {
      if (trimmed.startsWith('# ')) {
        title = trimmed.replace('# ', '').trim();
        continue;
      }
      if (/^(หมวดหมู่|Category)\s*:\s*/i.test(trimmed)) {
        category = trimmed.replace(/^(หมวดหมู่|Category)\s*:\s*/i, '').trim();
        continue;
      }
      if (/^(ผู้เขียน|Author)\s*:\s*/i.test(trimmed)) {
        author = trimmed.replace(/^(ผู้เขียน|Author)\s*:\s*/i, '').trim();
        continue;
      }
      if (/^(คำอธิบายสั้น|คำอธิบาย|Excerpt)\s*:\s*/i.test(trimmed)) {
        excerpt = trimmed.replace(/^(คำอธิบายสั้น|คำอธิบาย|Excerpt)\s*:\s*/i, '').trim();
        continue;
      }
      if (/^(ปักหมุด|แนะนำ|Featured)\s*:\s*/i.test(trimmed)) {
        const val = trimmed.replace(/^(ปักหมุด|แนะนำ|Featured)\s*:\s*/i, '').trim().toLowerCase();
        isFeatured = val === 'ใช่' || val === 'true';
        continue;
      }
      if (/^(สถานะ|Status)\s*:\s*/i.test(trimmed)) {
        const val = trimmed.replace(/^(สถานะ|Status)\s*:\s*/i, '').trim().toLowerCase();
        status = val.includes('ร่าง') || val === 'draft' ? 'draft' : 'published';
        continue;
      }

      if (!title && trimmed) {
        title = trimmed;
        continue;
      }
    }

    contentLines.push(line);
  }

  let bodyText = contentLines.join('\n').trim();

  if (!bodyText && !inBody && lines.length > 1) {
    bodyText = lines.slice(1).join('\n').trim();
  }

  if (autoFormat && bodyText) {
    bodyText = autoFormatArticleContent(bodyText);
  }

  if (!title) {
    title = 'บทความใหม่ที่นำเข้า';
  }

  if (!excerpt && bodyText) {
    const firstP = bodyText.split('\n\n').find(p => !p.startsWith('#') && p.trim().length > 10);
    excerpt = firstP ? firstP.slice(0, 140) + '...' : '';
  }

  return {
    id: `guide_${Date.now()}`,
    title,
    slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0E00-\u0E7F-]/g, '') || `guide-${Date.now()}`,
    category,
    contentType: 'Article',
    author,
    excerpt,
    content: bodyText,
    isFeatured,
    status,
    publishedDate: new Date().toISOString().split('T')[0]
  };
}

/**
 * Universal Parser for Imported Guide Data
 * Supports JSON, CSV, and Markdown/Plaintext
 */
export function parseImportedGuideData(rawText, fileName = '', autoFormat = true) {
  const trimmed = (rawText || '').trim();
  if (!trimmed) return null;

  // 1. Try JSON
  if (trimmed.startsWith('{') || trimmed.startsWith('[') || fileName.toLowerCase().endsWith('.json')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        const guides = parsed.map((item, idx) => ({
          id: item.id || `guide_${Date.now()}_${idx}`,
          title: item.title || `บทความที่ ${idx + 1}`,
          slug: item.slug || `guide-${Date.now()}-${idx}`,
          category: item.category || 'ทั่วไป',
          contentType: item.contentType || 'Article',
          author: item.author || 'ทีมวิชาการ คลินิกพัฒนาการเด็กบ้านฮักดี',
          excerpt: item.excerpt || '',
          content: autoFormat && item.content ? autoFormatArticleContent(item.content) : (item.content || ''),
          isFeatured: Boolean(item.isFeatured),
          status: item.status || 'published',
          publishedDate: item.publishedDate || new Date().toISOString().split('T')[0],
          displayOrder: idx + 1
        }));
        return { type: 'guides_array', count: guides.length, data: guides };
      } else if (parsed && parsed.title) {
        return {
          type: 'single_guide',
          count: 1,
          data: [{
            id: parsed.id || `guide_${Date.now()}`,
            title: parsed.title,
            slug: parsed.slug || `guide-${Date.now()}`,
            category: parsed.category || 'ทั่วไป',
            contentType: parsed.contentType || 'Article',
            author: parsed.author || 'ทีมวิชาการ คลินิกพัฒนาการเด็กบ้านฮักดี',
            excerpt: parsed.excerpt || '',
            content: autoFormat && parsed.content ? autoFormatArticleContent(parsed.content) : (parsed.content || ''),
            isFeatured: Boolean(parsed.isFeatured),
            status: parsed.status || 'published',
            publishedDate: parsed.publishedDate || new Date().toISOString().split('T')[0]
          }]
        };
      }
    } catch (e) {
      // Not JSON, continue to CSV/Markdown
    }
  }

  // 2. Try CSV if comma separated or filename ends in .csv
  if (fileName.toLowerCase().endsWith('.csv') || (trimmed.includes(',') && trimmed.split('\n')[0].includes(','))) {
    const csvGuides = parseCsvToGuides(trimmed, autoFormat);
    if (csvGuides && csvGuides.length > 0) {
      return { type: 'guides_array', count: csvGuides.length, data: csvGuides };
    }
  }

  // 3. Fallback: Parse as Markdown or plain text article
  const mdGuide = parseMarkdownToGuide(trimmed, autoFormat);
  if (mdGuide && mdGuide.title) {
    return { type: 'single_guide', count: 1, data: [mdGuide] };
  }

  return null;
}
