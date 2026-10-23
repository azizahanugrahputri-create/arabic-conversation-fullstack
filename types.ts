export type Topic = {
  id: string;
  slug: string;
  title: string;
  title_ar: string;
  description: string;
  level: string;
  icon: string;
  sort_order?: number;
};

export type Vocabulary = {
  id: string;
  topic_id?: string;
  topicSlug: string;
  arabic: string;
  transliteration: string;
  meaning_id: string;
  word_type: string;
  gender?: string | null;
  form_accusative?: string | null;
  grammar_tags: string[];
  level: string;
  audio_url?: string | null;
};

export type DialogueTurn = {
  speaker: "A" | "B";
  role: string;
  arabic: string;
  translation: string;
  note?: string;
};

export type GeneratedDialogue = {
  title: string;
  topicTitle: string;
  topicTitleAr: string;
  level: string;
  turns: DialogueTurn[];
  vocabularyUsed: Vocabulary[];
};
