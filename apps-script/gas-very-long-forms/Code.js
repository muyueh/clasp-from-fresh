const FORM_SETTINGS = {
  title: 'Very Long Forms 活動滿意度長問卷',
  description: '這份 30 題的問卷蒐集您對活動各面向的感受，作為優化議程、服務與後續跟進的依據。',
  confirmation: '感謝您填寫完整的活動回饋，我們會依據建議持續改善。'
};

const DATE_QUESTIONS = [
  {
    title: '請選擇您參加本次活動的日期',
    required: true
  }
];

const TIME_QUESTIONS = [
  {
    title: '您抵達活動現場的大約時間',
    required: true
  }
];

const SHORT_TEXT_QUESTIONS = [
  {
    title: '您的姓名或暱稱（選填）',
    required: false
  },
  {
    title: '您的服務單位 / 公司',
    required: true
  },
  {
    title: '您的職稱或角色',
    required: true
  },
  {
    title: '您目前所在的城市',
    required: true
  }
];

const PARAGRAPH_QUESTIONS = [
  {
    title: '請分享讓您印象最深刻的活動亮點',
    required: true
  },
  {
    title: '請描述任何需要改善的地方',
    required: true
  },
  {
    title: '請提供未來希望安排的主題或講者',
    required: false
  },
  {
    title: '還有什麼想對主辦單位說的話',
    required: false
  }
];

const MULTIPLE_CHOICE_QUESTIONS = [
  {
    title: '您參與的是哪一個活動時段？',
    choices: ['上午主題論壇', '下午深度工作坊', '整日通行證'],
    required: true
  },
  {
    title: '這是您第一次參加我們舉辦的活動嗎？',
    choices: ['是，第一次參加', '否，曾參加過 1 次', '否，參加過多次'],
    required: true
  },
  {
    title: '您覺得活動長度如何？',
    choices: ['稍微太短', '剛剛好', '有點太長'],
    required: true
  },
  {
    title: '您最偏好的活動形式？',
    choices: ['實體聚會', '線上直播', '線上 + 實體混合'],
    required: true
  },
  {
    title: '您是否願意推薦這場活動給朋友或同事？',
    choices: ['一定會推薦', '可能會推薦', '需要再觀察', '暫時不會推薦'],
    required: true
  }
];

const CHECKBOX_QUESTIONS = [
  {
    title: '報名這場活動的主要原因（可複選）',
    choices: ['了解產業趨勢', '聽講者分享', '拓展人脈', '取得教材資源'],
    showOtherOption: true,
    required: true
  },
  {
    title: '您實際參與的單元（可複選）',
    choices: ['主題演講', '動手實作', '圓桌論壇', '展區互動', '閉幕交流'],
    required: true
  },
  {
    title: '您最感興趣的延伸服務（可複選）',
    choices: ['活動錄影回放', '講義下載', '後續線上課程', '企業顧問諮詢', '社群聚會'],
    required: true
  },
  {
    title: '未來希望加強的支援（可複選）',
    choices: ['行前提醒', '交通與住宿資訊', '專屬客服窗口', '活動 App', '即時 Q&A 管道'],
    required: true
  }
];

const SCALE_QUESTIONS = [
  {
    title: '請為整體活動滿意度評分',
    lowerLabel: '非常不滿意',
    upperLabel: '非常滿意'
  },
  {
    title: '報到與入場流程是否順暢',
    lowerLabel: '需要改善',
    upperLabel: '非常順暢'
  },
  {
    title: '活動前資訊與提醒是否清楚',
    lowerLabel: '不清楚',
    upperLabel: '非常清楚'
  },
  {
    title: '議程內容與深度符合需求程度',
    lowerLabel: '落差大',
    upperLabel: '高度符合'
  },
  {
    title: '講者的表現與互動品質',
    lowerLabel: '需再加強',
    upperLabel: '非常精彩'
  },
  {
    title: '整體活動節奏與時間安排',
    lowerLabel: '過於鬆散',
    upperLabel: '非常流暢'
  },
  {
    title: '現場互動與參與感',
    lowerLabel: '參與感低',
    upperLabel: '參與感高'
  },
  {
    title: '場地與設備舒適度',
    lowerLabel: '不舒適',
    upperLabel: '非常舒適'
  },
  {
    title: '餐飲與茶點品質',
    lowerLabel: '需要改善',
    upperLabel: '非常滿意'
  }
];

const GRID_QUESTION = {
  title: '請針對以下時間安排是否足夠給予評估',
  rows: ['報到與領取資料', '議程間休息', '交流與攤位時間', 'Q&A 與提問'],
  columns: ['不足', '剛剛好', '偏多'],
  required: true
};

const CHECKBOX_GRID_QUESTION = {
  title: '請勾選希望後續收到的內容與頻率',
  rows: ['活動照片', '講者簡報', '活動錄影', '未來活動優惠'],
  columns: ['希望立即收到', '一週內收到即可', '不需要這項內容'],
  required: true
};

function buildEventSatisfactionForm() {
  const form = FormApp.create(FORM_SETTINGS.title)
    .setDescription(FORM_SETTINGS.description)
    .setCollectEmail(true)
    .setLimitOneResponsePerUser(true)
    .setProgressBar(true)
    .setAllowResponseEdits(true)
    .setConfirmationMessage(FORM_SETTINGS.confirmation)
    .setShowLinkToRespondAgain(false);

  let totalQuestions = 0;
  totalQuestions += addDateItems(form, DATE_QUESTIONS);
  totalQuestions += addTimeItems(form, TIME_QUESTIONS);
  totalQuestions += addShortTextItems(form, SHORT_TEXT_QUESTIONS);
  totalQuestions += addParagraphItems(form, PARAGRAPH_QUESTIONS);
  totalQuestions += addMultipleChoiceItems(form, MULTIPLE_CHOICE_QUESTIONS);
  totalQuestions += addCheckboxItems(form, CHECKBOX_QUESTIONS);
  totalQuestions += addScaleItems(form, SCALE_QUESTIONS);
  totalQuestions += addGridItem(form, GRID_QUESTION);
  totalQuestions += addCheckboxGridItem(form, CHECKBOX_GRID_QUESTION);

  if (totalQuestions !== 30) {
    throw new Error(`需要 30 題，但目前只有 ${totalQuestions} 題。`);
  }

  Logger.log(`已建立 ${totalQuestions} 道題目。表單編輯連結：${form.getEditUrl()}`);
  return form;
}

function addDateItems(form, definitions) {
  definitions.forEach(({ title, required = true }) => {
    form
      .addDateItem()
      .setTitle(title)
      .setRequired(required);
  });
  return definitions.length;
}

function addTimeItems(form, definitions) {
  definitions.forEach(({ title, required = true }) => {
    form
      .addTimeItem()
      .setTitle(title)
      .setRequired(required);
  });
  return definitions.length;
}

function addShortTextItems(form, definitions) {
  definitions.forEach(({ title, required = true }) => {
    form
      .addTextItem()
      .setTitle(title)
      .setRequired(required);
  });
  return definitions.length;
}

function addParagraphItems(form, definitions) {
  definitions.forEach(({ title, required = true }) => {
    form
      .addParagraphTextItem()
      .setTitle(title)
      .setRequired(required);
  });
  return definitions.length;
}

function addMultipleChoiceItems(form, definitions) {
  definitions.forEach(({ title, choices, required = true, helpText, showOtherOption }) => {
    const item = form
      .addMultipleChoiceItem()
      .setTitle(title)
      .setRequired(required);

    if (helpText) {
      item.setHelpText(helpText);
    }

    const formChoices = choices.map((choice) => item.createChoice(choice));
    item.setChoices(formChoices);

    if (showOtherOption) {
      item.showOtherOption(true);
    }
  });
  return definitions.length;
}

function addCheckboxItems(form, definitions) {
  definitions.forEach(({ title, choices, required = true, helpText, showOtherOption }) => {
    const item = form
      .addCheckboxItem()
      .setTitle(title)
      .setRequired(required);

    if (helpText) {
      item.setHelpText(helpText);
    }

    const formChoices = choices.map((choice) => item.createChoice(choice));
    item.setChoices(formChoices);

    if (showOtherOption) {
      item.showOtherOption(true);
    }
  });
  return definitions.length;
}

function addScaleItems(form, definitions) {
  definitions.forEach(({ title, lowerLabel, upperLabel, lowerBound = 1, upperBound = 5, required = true }) => {
    form
      .addScaleItem()
      .setTitle(title)
      .setBounds(lowerBound, upperBound)
      .setLabels(lowerLabel, upperLabel)
      .setRequired(required);
  });
  return definitions.length;
}

function addGridItem(form, definition) {
  if (!definition) {
    return 0;
  }

  const item = form
    .addGridItem()
    .setTitle(definition.title)
    .setRows(definition.rows)
    .setColumns(definition.columns)
    .setRequired(definition.required !== false);

  if (definition.helpText) {
    item.setHelpText(definition.helpText);
  }

  return 1;
}

function addCheckboxGridItem(form, definition) {
  if (!definition) {
    return 0;
  }

  const item = form
    .addCheckboxGridItem()
    .setTitle(definition.title)
    .setRows(definition.rows)
    .setColumns(definition.columns)
    .setRequired(definition.required !== false);

  if (definition.helpText) {
    item.setHelpText(definition.helpText);
  }

  return 1;
}
