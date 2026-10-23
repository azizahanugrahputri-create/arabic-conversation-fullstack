import { TOPICS, VOCABULARY } from "@/lib/data";
import type { DialogueTurn, GeneratedDialogue, Topic, Vocabulary } from "@/lib/types";

function turn(speaker: "A" | "B", role: string, arabic: string, translation: string): DialogueTurn {
  return { speaker, role, arabic, translation };
}

export function generateDialogue(topicSlug: string, chosen: Vocabulary[], topicList: Topic[] = TOPICS): GeneratedDialogue {
  const topic = topicList.find((item) => item.slug === topicSlug) ?? TOPICS[0];
  const defaults = VOCABULARY.filter((item) => item.topicSlug === topicSlug);
  const selected = chosen.length ? chosen : defaults.slice(0, 3);
  const first = selected[0] ?? defaults[0] ?? VOCABULARY[0];
  const second = selected.find((item) => item.id !== first?.id && !item.grammar_tags.includes("question")) ?? selected[1] ?? defaults[1] ?? first;
  let turns: DialogueTurn[];
  let title = `Percakapan: ${topic.title}`;

  if (topicSlug === "food") {
    const items = selected.filter((item) => item.grammar_tags.includes("food-item"));
    const foodOne = items[0] ?? VOCABULARY.find((item) => item.id === "v-fo-01")!;
    const foodTwo = items[1] ?? VOCABULARY.find((item) => item.id === "v-fo-02")!;
    const foodOneForm = foodOne.form_accusative || foodOne.arabic;
    const foodTwoForm = foodTwo.form_accusative || foodTwo.arabic;
    turns = [
      turn("A", "Penjual", "مَرْحَبًا، مَاذَا تُرِيدُ؟", "Halo, apa yang kamu inginkan?"),
      turn("B", "Siswa", `أُرِيدُ ${foodOneForm}، مِنْ فَضْلِكَ.`, `Saya ingin ${foodOne.meaning_id.toLowerCase()}, tolong.`),
      turn("A", "Penjual", `هَلْ تُرِيدُ ${foodTwoForm} أَيْضًا؟`, `Apakah kamu juga ingin ${foodTwo.meaning_id.toLowerCase()}?`),
      turn("B", "Siswa", "لَا، شُكْرًا.", "Tidak, terima kasih."),
      turn("A", "Penjual", "تَفَضَّلْ.", "Silakan, ini pesanannya."),
      turn("B", "Siswa", "شُكْرًا جَزِيلًا.", "Terima kasih banyak."),
    ];
  } else if (topicSlug === "school") {
    const items = selected.filter((item) => item.grammar_tags.includes("object"));
    const schoolOne = items[0] ?? VOCABULARY.find((item) => item.id === "v-sc-02")!;
    const schoolTwo = items[1] ?? VOCABULARY.find((item) => item.id === "v-sc-03")!;
    turns = [
      turn("A", "Teman", "مَاذَا فِي حَقِيبَتِكَ؟", "Apa yang ada di tasmu?"),
      turn("B", "Siswa", `فِي حَقِيبَتِي ${schoolOne.arabic} وَ${schoolTwo.arabic}.`, `Di tasku ada ${schoolOne.meaning_id.toLowerCase()} dan ${schoolTwo.meaning_id.toLowerCase()}.`),
      turn("A", "Teman", "هَلْ عِنْدَكَ كِتَابُ اللُّغَةِ الْعَرَبِيَّةِ؟", "Apakah kamu punya buku bahasa Arab?"),
      turn("B", "Siswa", "نَعَمْ، عِنْدِي كِتَابٌ.", "Ya, saya punya buku."),
      turn("A", "Teman", "جَيِّدٌ، هَيَّا نَدْرُسْ مَعًا.", "Bagus, ayo kita belajar bersama."),
      turn("B", "Siswa", "هَيَّا بِنَا!", "Ayo!"),
    ];
  } else if (topicSlug === "family") {
    const family = selected.find((item) => item.grammar_tags.includes("person")) ?? VOCABULARY.find((item) => item.id === "v-fa-02")!;
    const familyPhrase = family.arabic;
    const isFeminine = family.gender === "feminin";
    turns = [
      turn("A", "Teman", "مَنْ هَذَا؟", "Siapa ini?"),
      turn("B", "Siswa", isFeminine ? `هَذِهِ ${familyPhrase}.` : `هَذَا ${familyPhrase}.`, `Ini ${family.meaning_id.toLowerCase()}.`),
      turn("A", "Teman", "هَلْ أُسْرَتُكَ كَبِيرَةٌ؟", "Apakah keluargamu besar?"),
      turn("B", "Siswa", "نَعَمْ، أُسْرَتِي كَبِيرَةٌ.", "Ya, keluarga saya besar."),
      turn("A", "Teman", "مَا شَاءَ اللَّهُ!", "Masyaallah!"),
    ];
  } else if (topicSlug === "market") {
    const selectedItem = selected.find((item) => !item.grammar_tags.includes("question") && !item.grammar_tags.includes("response")) ?? VOCABULARY.find((item) => item.id === "v-ma-04")!;
    const isPhrase = selectedItem.word_type === "ungkapan" || selectedItem.word_type === "kalimat";
    turns = [
      turn("A", "Pembeli", "السَّلَامُ عَلَيْكُمْ، بِكَمْ هَذَا؟", "Assalamu'alaikum, berapa harga ini?"),
      turn("B", "Penjual", "بِعَشَرَةِ آلَافِ رُوبِيَّةٍ.", "Sepuluh ribu rupiah."),
      turn("A", "Pembeli", isPhrase ? selectedItem.arabic : `أُرِيدُ ${selectedItem.form_accusative || selectedItem.arabic}، مِنْ فَضْلِكَ.`, `Saya ingin ${selectedItem.meaning_id.toLowerCase()}, tolong.`),
      turn("B", "Penjual", "تَفَضَّلْ، شُكْرًا.", "Silakan, terima kasih."),
      turn("A", "Pembeli", "شُكْرًا، إِلَى اللِّقَاءِ.", "Terima kasih, sampai jumpa."),
    ];
  } else {
    const identity = selected.find((item) => item.grammar_tags.includes("identity")) ?? VOCABULARY.find((item) => item.id === "v-ta-05")!;
    turns = [
      turn("A", "Ahmad", "السَّلَامُ عَلَيْكُمْ.", "Assalamu'alaikum."),
      turn("B", "Ali", "وَعَلَيْكُمُ السَّلَامُ.", "Wa'alaikumussalam."),
      turn("A", "Ahmad", "مَا اسْمُكَ؟", "Siapa namamu? (laki-laki)"),
      turn("B", "Ali", "اسْمِي عَلِيٌّ، وَأَنْتَ؟", "Nama saya Ali. Kalau kamu?"),
      turn("A", "Ahmad", `أَنَا ${identity.arabic}.`, `Saya ${identity.meaning_id.toLowerCase()}.`),
      turn("B", "Ali", "تَشَرَّفْنَا.", "Senang berkenalan denganmu."),
    ];
  }

  const ids = new Set(selected.map((item) => item.id));
  const used = selected.filter((item) => ids.has(item.id)).slice(0, 8);
  return { title, topicTitle: topic.title, topicTitleAr: topic.title_ar, level: topic.level, turns, vocabularyUsed: used };
}
