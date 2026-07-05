// CV downloads — one source of truth. Visitors get the PDFs matching the
// site language (Nav dropdown, Contact buttons, and the terminal `cv` cmd).
const CV_FILES = {
  en: {
    ds:  { path: '/cv/AyomideMathewOduwole_DataScientist_EN.pdf',    label: 'Data Science (EN)' },
    swe: { path: '/cv/AyomideMathewOduwole_SoftwareEngineer_EN.pdf', label: 'Software Engineering (EN)' },
  },
  fr: {
    ds:  { path: '/cv/AyomideMathewOduwole_DataScientist_FR.pdf',    label: 'Data Science (FR)' },
    swe: { path: '/cv/AyomideMathewOduwole_SoftwareEngineer_FR.pdf', label: 'Génie logiciel (FR)' },
  },
};

export const cvFor = (lang) => CV_FILES[lang === 'fr' ? 'fr' : 'en'];
