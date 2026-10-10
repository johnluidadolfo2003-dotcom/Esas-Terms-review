import JSZip from 'jszip';

export interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  parents?: string[];
  webViewLink?: string;
  matchedSubject?: string;
}

export interface DriveFolder {
  id: string;
  name: string;
  parents?: string[];
}

// Target subjects requested by user
export const TARGET_SUBJECT_KEYWORDS = [
  { subject: 'Economics', keywords: ['economics', 'engineering economics', 'econ', 'interest', 'annuity', 'depreciation', 'capital'] },
  { subject: 'Mechanics 1', keywords: ['mechanics 1', 'statics', 'equilibrium', 'coplanar', 'truss', 'friction', 'moment of inertia', 'force system'] },
  { subject: 'Mechanics 2', keywords: ['mechanics 2', 'dynamics', 'kinematics', 'kinetics', 'rectilinear', 'curvilinear', 'momentum', 'work-energy'] },
  { subject: 'EE Laws', keywords: ['ee law', 'ee laws', 'electrical engineering law', 'ra 7920', 'r.a. 7920', 'republic act 7920', 'pec', 'philippine electrical code', 'code of ethics', 'bprce'] },
  { subject: 'Project Management', keywords: ['project management', 'engineering management', 'pert', 'cpm', 'gantt', 'wbs', 'critical path', 'risk management', 'procurement'] },
  { subject: 'Communication', keywords: ['communication', 'communications', 'telecommunication', 'modulation', 'am fm', 'data communication', 'technical communication', 'antenna'] },
];

/**
 * Searches user's Google Drive for files and folders.
 */
export async function listAllDriveFiles(
  accessToken: string,
  options?: {
    customQuery?: string;
    pageToken?: string;
    pageSize?: number;
  }
): Promise<{ files: DriveItem[]; nextPageToken?: string }> {
  const pageSize = options?.pageSize || 100;
  
  // Construct query to avoid trashed files
  let q = "trashed = false";
  if (options?.customQuery && options.customQuery.trim().length > 0) {
    q += ` and (${options.customQuery})`;
  }

  const params = new URLSearchParams({
    q,
    pageSize: pageSize.toString(),
    fields: 'nextPageToken, files(id, name, mimeType, modifiedTime, size, parents, webViewLink)',
    orderBy: 'modifiedTime desc',
  });

  if (options?.pageToken) {
    params.set('pageToken', options.pageToken);
  }

  const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Drive API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawFiles: DriveItem[] = data.files || [];

  // Annotate files with matched subjects
  const annotatedFiles = rawFiles.map((file) => {
    const lowerName = file.name.toLowerCase();
    let matchedSubject: string | undefined;

    for (const group of TARGET_SUBJECT_KEYWORDS) {
      if (group.keywords.some((kw) => lowerName.includes(kw))) {
        matchedSubject = group.subject;
        break;
      }
    }

    return {
      ...file,
      matchedSubject,
    };
  });

  return {
    files: annotatedFiles,
    nextPageToken: data.nextPageToken,
  };
}

/**
 * Perform a targeted full-scan search across Google Drive for subject-related reviewers
 */
export async function scanDriveForSubjects(accessToken: string): Promise<DriveItem[]> {
  const matchingFiles: DriveItem[] = [];
  const visitedIds = new Set<string>();

  // 1. Broad queries for file names matching subject names and review terms
  const searchTerms = [
    "name contains 'Economics' or name contains 'Econ'",
    "name contains 'Mechanics' or name contains 'Statics' or name contains 'Dynamics'",
    "name contains 'EE' or name contains 'Law' or name contains 'PEC' or name contains '7920'",
    "name contains 'Management' or name contains 'Project'",
    "name contains 'Communication' or name contains 'Comm'",
    "name contains 'Reviewer' or name contains 'Quiz' or name contains 'Exam' or name contains 'Question' or name contains 'Terms'",
  ];

  for (const term of searchTerms) {
    try {
      const q = `trashed = false and (${term})`;
      const params = new URLSearchParams({
        q,
        pageSize: '50',
        fields: 'files(id, name, mimeType, modifiedTime, size, parents, webViewLink)',
      });

      const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.ok) {
        const data = await res.json();
        for (const file of data.files || []) {
          if (!visitedIds.has(file.id)) {
            visitedIds.add(file.id);
            matchingFiles.push(file);
          }
        }
      }
    } catch (e) {
      console.warn('Error running search term', term, e);
    }
  }

  // 2. Also fetch recently modified Docs, Spreadsheets, and Text files
  try {
    const qDocs = `trashed = false and (mimeType = 'application/vnd.google-apps.document' or mimeType = 'application/vnd.google-apps.spreadsheet' or mimeType = 'text/plain' or mimeType = 'text/csv' or mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')`;
    const params = new URLSearchParams({
      q: qDocs,
      pageSize: '100',
      fields: 'files(id, name, mimeType, modifiedTime, size, parents, webViewLink)',
      orderBy: 'modifiedTime desc',
    });

    const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.ok) {
      const data = await res.json();
      for (const file of data.files || []) {
        if (!visitedIds.has(file.id)) {
          visitedIds.add(file.id);
          matchingFiles.push(file);
        }
      }
    }
  } catch (e) {
    console.warn('Error fetching recent documents', e);
  }

  // Annotate matched subjects
  return matchingFiles.map((file) => {
    const lowerName = file.name.toLowerCase();
    let matchedSubject: string | undefined;

    for (const group of TARGET_SUBJECT_KEYWORDS) {
      if (group.keywords.some((kw) => lowerName.includes(kw))) {
        matchedSubject = group.subject;
        break;
      }
    }

    return {
      ...file,
      matchedSubject,
    };
  });
}

/**
 * Downloads and extracts the plain text content of a Drive file
 */
export async function fetchDriveFileContent(accessToken: string, file: DriveItem): Promise<string> {
  // 1. Google Docs
  if (file.mimeType === 'application/vnd.google-apps.document') {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`Failed to export Google Doc: ${res.statusText}`);
    return await res.text();
  }

  // 2. Google Sheets
  if (file.mimeType === 'application/vnd.google-apps.spreadsheet') {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/csv`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`Failed to export Google Sheet: ${res.statusText}`);
    return await res.text();
  }

  // 3. Word DOCX
  if (
    file.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.name.endsWith('.docx')
  ) {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`Failed to download DOCX file: ${res.statusText}`);
    const arrayBuffer = await res.arrayBuffer();
    return await extractTextFromDocx(arrayBuffer);
  }

  // 4. Plain text / CSV / JSON / Markdown
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to download file content: ${res.statusText}`);
  }

  // If text-like:
  const text = await res.text();
  return text;
}

/**
 * Extracts plain text from a Word (.docx) document using JSZip
 */
async function extractTextFromDocx(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const zip = await JSZip.loadAsync(arrayBuffer);
    const documentXmlFile = zip.file('word/document.xml');
    if (!documentXmlFile) {
      throw new Error('document.xml not found in docx archive');
    }

    const xmlText = await documentXmlFile.async('text');
    // Extract paragraphs and text nodes
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
    const paragraphs = xmlDoc.getElementsByTagName('w:p');

    const lines: string[] = [];
    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i];
      const textNodes = p.getElementsByTagName('w:t');
      let pText = '';
      for (let j = 0; j < textNodes.length; j++) {
        pText += textNodes[j].textContent || '';
      }
      if (pText.trim().length > 0) {
        lines.push(pText.trim());
      }
    }

    return lines.join('\n');
  } catch (err) {
    console.error('Error extracting text from docx:', err);
    throw new Error('Failed to parse docx document');
  }
}
