const DEFAULT_SECTION_TITLE = '未命名區段';

/**
 * Logs an overview of the form structure without mutating any question content.
 * Useful for manual QA in the Apps Script editor when a new file is created.
 * @return {Array<{title: string, questions: Array, typeCounts: Object}>}
 */
function logTaipei500FormSummary() {
  const form = getOrCreateForm();
  const sections = summarizeTaipei500FormSections(form.getItems());
  Logger.log('表單「%s」共有 %d 個區段與 %d 個問題。', form.getTitle(), sections.length, form.getItems().length);

  sections.forEach((section) => {
    const typeSummary = formatTypeCounts(section.typeCounts);
    Logger.log('區段：%s，問題數：%d（%s）', section.title, section.questions.length, typeSummary);
  });

  return sections;
}

/**
 * Returns a JSON-friendly snapshot of each question, grouped by section title.
 * @return {Array<{sectionTitle: string, title: string, type: string}>}
 */
function getTaipei500FormItemSnapshot() {
  const form = getOrCreateForm();
  const snapshot = buildTaipei500FormItemSnapshot(form.getItems());
  Logger.log(JSON.stringify(snapshot, null, 2));
  return snapshot;
}

function summarizeTaipei500FormSections(items) {
  const sections = [];
  let currentSection = null;

  items.forEach((item) => {
    if (item.getType() === FormApp.ItemType.SECTION_HEADER) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = createEmptySection(item.getTitle() || DEFAULT_SECTION_TITLE);
      return;
    }

    if (!currentSection) {
      currentSection = createEmptySection(DEFAULT_SECTION_TITLE);
    }

    const type = String(item.getType());
    currentSection.questions.push({
      title: item.getTitle(),
      type
    });
    currentSection.typeCounts[type] = (currentSection.typeCounts[type] || 0) + 1;
  });

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

function buildTaipei500FormItemSnapshot(items) {
  const snapshot = [];
  let sectionTitle = DEFAULT_SECTION_TITLE;

  items.forEach((item) => {
    if (item.getType() === FormApp.ItemType.SECTION_HEADER) {
      sectionTitle = item.getTitle() || DEFAULT_SECTION_TITLE;
      return;
    }

    snapshot.push({
      sectionTitle,
      title: item.getTitle(),
      type: String(item.getType())
    });
  });

  return snapshot;
}

function createEmptySection(title) {
  return {
    title,
    questions: [],
    typeCounts: {}
  };
}

function formatTypeCounts(typeCounts) {
  const parts = Object.keys(typeCounts).map((type) => `${type}: ${typeCounts[type]}`);
  return parts.length > 0 ? parts.join(', ') : '無題目';
}
