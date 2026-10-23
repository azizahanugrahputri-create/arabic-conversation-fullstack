import type { Topic, Vocabulary } from "@/lib/types";

export const TOPICS: Topic[] = [
  { id: "topic-taaruf", slug: "taaruf", title: "Perkenalan", title_ar: "التَّعَارُف", description: "Menyapa, memperkenalkan diri, dan bertanya tentang identitas.", level: "A1", icon: "handshake", sort_order: 1 },
  { id: "topic-school", slug: "school", title: "Sekolah", title_ar: "الْمَدْرَسَة", description: "Bertanya tentang kelas, buku, alat tulis, dan pelajaran.", level: "A1", icon: "school", sort_order: 2 },
  { id: "topic-family", slug: "family", title: "Keluarga", title_ar: "الْأُسْرَة", description: "Mengenal anggota keluarga dan menjelaskan hubungan.", level: "A1", icon: "users", sort_order: 3 },
  { id: "topic-food", slug: "food", title: "Makanan & Minuman", title_ar: "الطَّعَامُ وَالشَّرَابُ", description: "Memesan makanan dan minuman dengan ungkapan sopan.", level: "A1", icon: "utensils", sort_order: 4 },
  { id: "topic-market", slug: "market", title: "Di Pasar", title_ar: "فِي السُّوق", description: "Bertanya harga dan menyebut barang yang ingin dibeli.", level: "A1", icon: "shopping-bag", sort_order: 5 },
];

export const VOCABULARY: Vocabulary[] = [
  { id: "v-ta-01", topicSlug: "taaruf", arabic: "السَّلَامُ عَلَيْكُمْ", transliteration: "as-salāmu ‘alaikum", meaning_id: "Semoga keselamatan tercurah kepada kalian", word_type: "ungkapan", grammar_tags: ["greeting", "phrase"], level: "A1" },
  { id: "v-ta-02", topicSlug: "taaruf", arabic: "وَعَلَيْكُمُ السَّلَامُ", transliteration: "wa ‘alaikumus-salām", meaning_id: "Dan semoga keselamatan juga tercurah kepada kalian", word_type: "ungkapan", grammar_tags: ["greeting", "phrase"], level: "A1" },
  { id: "v-ta-03", topicSlug: "taaruf", arabic: "مَا اسْمُكَ؟", transliteration: "mā ismuka?", meaning_id: "Siapa namamu? (laki-laki)", word_type: "kalimat", grammar_tags: ["question", "identity"], level: "A1" },
  { id: "v-ta-04", topicSlug: "taaruf", arabic: "اسْمِي ...", transliteration: "ismī ...", meaning_id: "Nama saya ...", word_type: "ungkapan", grammar_tags: ["identity", "phrase"], level: "A1" },
  { id: "v-ta-05", topicSlug: "taaruf", arabic: "طَالِبٌ", transliteration: "ṭālibun", meaning_id: "Siswa / pelajar laki-laki", word_type: "isim", gender: "maskulin", form_accusative: "طَالِبًا", grammar_tags: ["identity", "person"], level: "A1" },
  { id: "v-ta-06", topicSlug: "taaruf", arabic: "مِنْ إِنْدُونِيسِيَا", transliteration: "min Indūnīsiyā", meaning_id: "Dari Indonesia", word_type: "frasa", grammar_tags: ["identity", "place"], level: "A1" },

  { id: "v-sc-01", topicSlug: "school", arabic: "مَدْرَسَةٌ", transliteration: "madrasatun", meaning_id: "Sekolah", word_type: "isim", gender: "feminin", form_accusative: "مَدْرَسَةً", grammar_tags: ["school", "place"], level: "A1" },
  { id: "v-sc-02", topicSlug: "school", arabic: "كِتَابٌ", transliteration: "kitābun", meaning_id: "Buku", word_type: "isim", gender: "maskulin", form_accusative: "كِتَابًا", grammar_tags: ["school", "object"], level: "A1" },
  { id: "v-sc-03", topicSlug: "school", arabic: "قَلَمٌ", transliteration: "qalamun", meaning_id: "Pulpen", word_type: "isim", gender: "maskulin", form_accusative: "قَلَمًا", grammar_tags: ["school", "object"], level: "A1" },
  { id: "v-sc-04", topicSlug: "school", arabic: "مُعَلِّمٌ", transliteration: "mu‘allimun", meaning_id: "Guru laki-laki", word_type: "isim", gender: "maskulin", form_accusative: "مُعَلِّمًا", grammar_tags: ["school", "person"], level: "A1" },
  { id: "v-sc-05", topicSlug: "school", arabic: "اللُّغَةُ الْعَرَبِيَّةُ", transliteration: "al-lughah al-‘arabiyyah", meaning_id: "Bahasa Arab", word_type: "frasa", gender: "feminin", grammar_tags: ["school", "subject"], level: "A1" },
  { id: "v-sc-06", topicSlug: "school", arabic: "فَصْلٌ", transliteration: "faṣlun", meaning_id: "Kelas", word_type: "isim", gender: "maskulin", form_accusative: "فَصْلًا", grammar_tags: ["school", "place"], level: "A1" },

  { id: "v-fa-01", topicSlug: "family", arabic: "أَبِي", transliteration: "abī", meaning_id: "Ayah saya", word_type: "isim", gender: "maskulin", grammar_tags: ["family", "person"], level: "A1" },
  { id: "v-fa-02", topicSlug: "family", arabic: "أُمِّي", transliteration: "ummī", meaning_id: "Ibu saya", word_type: "isim", gender: "feminin", grammar_tags: ["family", "person"], level: "A1" },
  { id: "v-fa-03", topicSlug: "family", arabic: "أَخِي", transliteration: "akhī", meaning_id: "Saudara laki-laki saya", word_type: "isim", gender: "maskulin", grammar_tags: ["family", "person"], level: "A1" },
  { id: "v-fa-04", topicSlug: "family", arabic: "أُخْتِي", transliteration: "ukhtī", meaning_id: "Saudara perempuan saya", word_type: "isim", gender: "feminin", grammar_tags: ["family", "person"], level: "A1" },
  { id: "v-fa-05", topicSlug: "family", arabic: "أُسْرَةٌ", transliteration: "usratun", meaning_id: "Keluarga", word_type: "isim", gender: "feminin", form_accusative: "أُسْرَةً", grammar_tags: ["family"], level: "A1" },

  { id: "v-fo-01", topicSlug: "food", arabic: "مَاءٌ", transliteration: "mā’un", meaning_id: "Air", word_type: "isim", gender: "maskulin", form_accusative: "مَاءً", grammar_tags: ["food-item", "drink"], level: "A1" },
  { id: "v-fo-02", topicSlug: "food", arabic: "عَصِيرٌ", transliteration: "‘aṣīrun", meaning_id: "Jus", word_type: "isim", gender: "maskulin", form_accusative: "عَصِيرًا", grammar_tags: ["food-item", "drink"], level: "A1" },
  { id: "v-fo-03", topicSlug: "food", arabic: "خُبْزٌ", transliteration: "khubzun", meaning_id: "Roti", word_type: "isim", gender: "maskulin", form_accusative: "خُبْزًا", grammar_tags: ["food-item", "food"], level: "A1" },
  { id: "v-fo-04", topicSlug: "food", arabic: "أُرِيدُ", transliteration: "urīdu", meaning_id: "Saya ingin", word_type: "fi'il", grammar_tags: ["request", "phrase"], level: "A1" },
  { id: "v-fo-05", topicSlug: "food", arabic: "مِنْ فَضْلِكَ", transliteration: "min faḍlika", meaning_id: "Tolong / silakan (kepada laki-laki)", word_type: "ungkapan", grammar_tags: ["polite", "phrase"], level: "A1" },
  { id: "v-fo-06", topicSlug: "food", arabic: "شُكْرًا", transliteration: "shukran", meaning_id: "Terima kasih", word_type: "ungkapan", grammar_tags: ["polite", "phrase"], level: "A1" },

  { id: "v-ma-01", topicSlug: "market", arabic: "بِكَمْ هَذَا؟", transliteration: "bikam hādhā?", meaning_id: "Berapa harga ini?", word_type: "kalimat", grammar_tags: ["shopping", "question"], level: "A1" },
  { id: "v-ma-02", topicSlug: "market", arabic: "رَخِيصٌ", transliteration: "rakhīṣun", meaning_id: "Murah", word_type: "sifat", gender: "maskulin", grammar_tags: ["shopping", "adjective"], level: "A1" },
  { id: "v-ma-03", topicSlug: "market", arabic: "غَالٍ", transliteration: "ghālin", meaning_id: "Mahal", word_type: "sifat", gender: "maskulin", grammar_tags: ["shopping", "adjective"], level: "A1" },
  { id: "v-ma-04", topicSlug: "market", arabic: "أُرِيدُ هَذَا", transliteration: "urīdu hādhā", meaning_id: "Saya ingin ini", word_type: "ungkapan", grammar_tags: ["shopping", "request"], level: "A1" },
  { id: "v-ma-05", topicSlug: "market", arabic: "كَمْ؟", transliteration: "kam?", meaning_id: "Berapa?", word_type: "kata tanya", grammar_tags: ["question"], level: "A1" },
  { id: "v-ma-06", topicSlug: "market", arabic: "نَعَمْ", transliteration: "na‘am", meaning_id: "Ya", word_type: "jawaban", grammar_tags: ["response"], level: "A1" },
];
