/**
 * Assessment Import & Export Helper Utilities
 * Supports JSON and CSV template export & import with UTF-8 BOM for Thai Excel compatibility
 */

// Download file utility
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

// Generate blank questions CSV template
export function generateQuestionsCsvTemplate() {
  const headers = [
    'ข้อที่',
    'คำถาม',
    'หมวดหมู่',
    'ตัวเลือกที่ 1',
    'คะแนนที่ 1',
    'ตัวเลือกที่ 2',
    'คะแนนที่ 2',
    'ตัวเลือกที่ 3',
    'คะแนนที่ 3',
    'ตัวเลือกที่ 4',
    'คะแนนที่ 4'
  ];

  const sampleRows = [
    [
      '1',
      'เด็กสามารถสบตาเวลาพูดคุยหรือเล่นด้วยได้ต่อเนื่อง',
      'การสื่อสารและปฏิสัมพันธ์',
      'ทำได้สม่ำเสมอ',
      '0',
      'ทำได้บางครั้ง',
      '1',
      'ยังไม่สามารถทำได้',
      '2',
      '',
      ''
    ],
    [
      '2',
      'หันตามเสียงเรียกชื่อของตนเองได้ทันที',
      'การสื่อสารและปฏิสัมพันธ์',
      'ใช่ / ทำได้',
      '0',
      'ไม่ใช่ / ไม่หัน',
      '1',
      '',
      '',
      '',
      ''
    ],
    [
      '3',
      'สามารถหยิบสิ่งของชิ้นเล็กด้วยนิ้วโป้งและนิ้วชี้ได้ (Pincer Grasp)',
      'กล้ามเนื้อมัดเล็ก',
      'ทำได้คล่องแคล่ว',
      '0',
      'ทำได้บ้างแต่เก้ๆกังๆ',
      '1',
      'ยังทำไม่ได้',
      '2',
      '',
      ''
    ],
    [
      '4',
      'ร้องไห้ อุดหู หรือวิ่งหนีเวลาได้ยินเสียงดัง ๆ',
      'การประมวลความรู้สึก (Sensory)',
      'ไม่เป็น / ปกติ',
      '0',
      'เป็นบางครั้ง',
      '1',
      'เป็นประจำ',
      '2',
      '',
      ''
    ]
  ];

  // UTF-8 BOM (\uFEFF) ensures Excel opens Thai characters cleanly
  return '\uFEFF' + [
    headers.map(h => `"${h}"`).join(','),
    ...sampleRows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\r\n');
}

// Export current questions to CSV
export function exportCurrentQuestionsToCsv(questions, title = 'assessment') {
  const headers = [
    'ข้อที่',
    'คำถาม',
    'หมวดหมู่',
    'ตัวเลือกที่ 1',
    'คะแนนที่ 1',
    'ตัวเลือกที่ 2',
    'คะแนนที่ 2',
    'ตัวเลือกที่ 3',
    'คะแนนที่ 3',
    'ตัวเลือกที่ 4',
    'คะแนนที่ 4'
  ];

  const rows = (questions || []).map((q, idx) => {
    const row = [
      String(idx + 1),
      q.questionText || '',
      q.section || 'ทั่วไป'
    ];
    (q.options || []).forEach(opt => {
      row.push(opt.text || '');
      row.push(String(opt.score ?? 0));
    });
    return row;
  });

  const csvContent = '\uFEFF' + [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\r\n');

  const filename = `${title.replace(/[^a-zA-Z0-9\u0E00-\u0E7F_-]/g, '_')}_questions.csv`;
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
}

// Generate clean blank full JSON template
export function generateJsonTemplate() {
  return {
    title: 'แบบประเมินพัฒนาการเด็ก (Template ตัวอย่าง)',
    slug: 'template-assessment',
    category: 'พัฒนาการเด็ก',
    targetAge: '1 – 5 ปี (12 – 60 เดือน)',
    estimatedMinutes: 5,
    description: 'แบบประเมินกลุ่มพัฒนาการและพฤติกรรมเด็กเบื้องต้น',
    disclaimer: 'ผลการประเมินนี้เป็นเพียงการคัดกรองเบื้องต้น ไม่ใช่การวินิจฉัยโรคหรือการประเมินโดยผู้เชี่ยวชาญ หากมีข้อกังวลเกี่ยวกับพัฒนาการของเด็ก ควรปรึกษาผู้เชี่ยวชาญเพื่อรับการประเมินอย่างเหมาะสม',
    scoringRules: {
      thresholds: [
        {
          minScore: 0,
          maxScore: 3,
          level: 1,
          badgeText: 'อยู่ในเกณฑ์เบื้องต้น',
          color: 'blue',
          interpretation: 'เด็กมีทักษะและพฤติกรรมส่วนใหญ่สอดคล้องตามเกณฑ์วัยเบื้องต้น สามารถสนับสนุนพัฒนาการต่อเนื่องได้ด้วยกิจกรรมในบ้าน',
          recommendation: 'ส่งเสริมการเล่นอิสระ การพูดคุยโต้ตอบ และเปิดโอกาสให้เด็กลงมือทำสิ่งต่างๆ ด้วยตนเองอย่างสม่ำเสมอ'
        },
        {
          minScore: 4,
          maxScore: 7,
          level: 2,
          badgeText: 'พบข้อสังเกตบางประการ ควรติดตาม',
          color: 'yellow',
          interpretation: 'พบข้อสังเกตในบางทักษะที่อาจต้องการการกระตุ้นหรือสภาพแวดล้อมที่เอื้อต่อการเรียนรู้เพิ่มเติม',
          recommendation: 'ลองเพิ่มกิจกรรมเล่นที่เน้นทักษะที่พบข้อสังเกต และติดตามดูพัฒนาการใน 1-2 เดือน'
        },
        {
          minScore: 8,
          maxScore: 99,
          level: 3,
          badgeText: 'แนะนำให้ปรึกษาผู้เชี่ยวชาญ',
          color: 'pink',
          interpretation: 'พบข้อสังเกตในหลายด้านที่อาจส่งผลต่อกิจวัตรประจำวันหรือการปรับตัวของเด็ก',
          recommendation: 'แนะนำให้นำเด็กมาพบนักกิจกรรมบำบัดหรือกุมารแพทย์พัฒนาการเด็ก เพื่อรับการตรวจประเมินอย่างละเอียด'
        }
      ]
    },
    questions: [
      {
        id: 'q_template_1',
        questionText: 'เด็กสามารถสบตาเวลาพูดคุยหรือเล่นด้วยได้ต่อเนื่อง',
        questionType: 'yes_no',
        section: 'หมวดพัฒนาการและการสื่อสาร',
        required: true,
        displayOrder: 1,
        options: [
          { text: 'ใช่ / ทำบ่อยๆ', score: 0 },
          { text: 'ทำได้บ้างเล็กน้อย / ไม่ใช่', score: 1 }
        ]
      },
      {
        id: 'q_template_2',
        questionText: 'หันตามเสียงเรียกชื่อตนเองทันที',
        questionType: 'yes_no',
        section: 'หมวดพัฒนาการและการสื่อสาร',
        required: true,
        displayOrder: 2,
        options: [
          { text: 'ใช่ / ทำบ่อยๆ', score: 0 },
          { text: 'ทำได้บ้างเล็กน้อย / ไม่ใช่', score: 1 }
        ]
      }
    ]
  };
}

// Export full assessment as JSON
export function exportAssessmentToJson(assessment) {
  const filename = `${(assessment.slug || assessment.title || 'assessment').replace(/[^a-zA-Z0-9\u0E00-\u0E7F_-]/g, '_')}_full.json`;
  const jsonString = JSON.stringify(assessment, null, 2);
  downloadFile(jsonString, filename, 'application/json;charset=utf-8;');
}

// Parse CSV text into array of question objects
export function parseCsvToQuestions(csvText) {
  let cleanText = csvText.replace(/^\uFEFF/, '').trim();
  const lines = cleanText.split(/\r\n|\n|\r/);
  if (lines.length < 2) return [];

  const parseLine = (text) => {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') {
        if (inQuotes && text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const questions = [];
  // Line 0 is header, parse from line 1
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = parseLine(line);
    if (cols.length < 2) continue;

    const questionText = cols[1] || cols[0];
    if (!questionText || questionText.trim() === '') continue;

    const section = cols[2] || 'หมวดพัฒนาการ';

    // Parse options: pairs starting at column index 3: (optText, score)
    const options = [];
    for (let c = 3; c < cols.length; c += 2) {
      const optText = cols[c];
      const optScore = cols[c + 1];
      if (optText && optText.trim() !== '') {
        options.push({
          text: optText.trim(),
          score: !isNaN(Number(optScore)) ? Number(optScore) : 0
        });
      }
    }

    // Default yes/no if no options found
    if (options.length === 0) {
      options.push({ text: 'ใช่ / ทำบ่อยๆ', score: 0 });
      options.push({ text: 'ทำได้บ้างเล็กน้อย', score: 1 });
    }

    questions.push({
      id: `q_import_${Date.now()}_${i}`,
      questionText: questionText.trim(),
      questionType: options.length === 2 ? 'yes_no' : 'single_choice',
      section: section.trim() || 'หมวดพัฒนาการ',
      required: true,
      displayOrder: questions.length + 1,
      options
    });
  }

  return questions;
}

// Parse imported JSON text (handles full assessment or array of questions)
export function parseImportedJson(jsonText) {
  try {
    const parsed = JSON.parse(jsonText);
    if (!parsed) return null;

    // Case 1: Array of questions
    if (Array.isArray(parsed)) {
      return {
        type: 'questions_only',
        questions: parsed.map((q, idx) => ({
          id: q.id || `q_import_${Date.now()}_${idx}`,
          questionText: q.questionText || q.text || `คำถามข้อที่ ${idx + 1}`,
          questionType: q.questionType || (q.options?.length === 2 ? 'yes_no' : 'single_choice'),
          section: q.section || 'หมวดพัฒนาการ',
          required: q.required !== false,
          displayOrder: idx + 1,
          options: q.options || [
            { text: 'ใช่ / ทำบ่อยๆ', score: 0 },
            { text: 'ทำได้บ้างเล็กน้อย', score: 1 }
          ]
        }))
      };
    }

    // Case 2: Full assessment object
    if (parsed.questions && Array.isArray(parsed.questions)) {
      return {
        type: 'full_assessment',
        data: {
          title: parsed.title || 'แบบประเมินที่นำเข้า',
          slug: parsed.slug || `assessment-${Date.now()}`,
          category: parsed.category || 'พัฒนาการเด็ก',
          targetAge: parsed.targetAge || '1 – 6 ปี',
          estimatedMinutes: parsed.estimatedMinutes || 5,
          description: parsed.description || '',
          disclaimer: parsed.disclaimer || 'ผลการประเมินนี้เป็นเพียงการคัดกรองเบื้องต้น ไม่ใช่การวินิจฉัยโรคหรือการประเมินโดยผู้เชี่ยวชาญ',
          status: parsed.status || 'draft',
          scoringRules: parsed.scoringRules || {
            thresholds: [
              { minScore: 0, maxScore: 3, level: 1, badgeText: 'อยู่ในเกณฑ์เบื้องต้น', color: 'blue', interpretation: 'เด็กมีทักษะและพฤติกรรมส่วนใหญ่สอดคล้องตามเกณฑ์วัยเบื้องต้น' },
              { minScore: 4, maxScore: 7, level: 2, badgeText: 'พบข้อสังเกตบางประการ', color: 'yellow', interpretation: 'พบข้อสังเกตในบางทักษะที่อาจต้องการการกระตุ้นเพิ่มเติม' },
              { minScore: 8, maxScore: 99, level: 3, badgeText: 'แนะนำให้ปรึกษาผู้เชี่ยวชาญ', color: 'pink', interpretation: 'พบข้อสังเกตในหลายด้าน แนะนำปรึกษาผู้เชี่ยวชาญ' }
            ]
          },
          questions: parsed.questions.map((q, idx) => ({
            id: q.id || `q_import_${Date.now()}_${idx}`,
            questionText: q.questionText || q.text || `คำถามข้อที่ ${idx + 1}`,
            questionType: q.questionType || (q.options?.length === 2 ? 'yes_no' : 'single_choice'),
            section: q.section || 'หมวดพัฒนาการ',
            required: q.required !== false,
            displayOrder: idx + 1,
            options: q.options || [
              { text: 'ใช่ / ทำบ่อยๆ', score: 0 },
              { text: 'ทำได้บ้างเล็กน้อย', score: 1 }
            ]
          }))
        }
      };
    }

    return null;
  } catch (err) {
    console.error('Error parsing JSON:', err);
    return null;
  }
}
