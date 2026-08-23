/**
 * Song catalogue and station definitions for Soulstation.
 * Edit this file to add/remove songs — no UI components need to change.
 */

export type Song = {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  film?: string;
  year?: number;
  mood?: string[];
  category?: string[];
  youtubeId?: string | null;
  audioUrl?: string | null;
  youtubeUrl?: string | null;
  spotifyUrl?: string | null;
  youtubeMusicUrl?: string | null;
  artwork?: string | null;
};

export type Station = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  moods: string[];
  categories: string[];
};

export const RADIO_FREQUENCIES = [90.1, 92.5, 94.5, 96.6, 98.3, 100.1, 102.5, 104.9] as const;

export const RADIO_CHANNELS: Record<number, { name: string; categories: string[]; moods: string[] }> = {
  90.1: { name: "Love", categories: ["love"], moods: ["romantic", "love", "tender"] },
  92.5: { name: "Happy", categories: ["party", "dance"], moods: ["energetic", "playful", "happy"] },
  94.5: { name: "Indie", categories: ["indie"], moods: ["dreamy", "soft", "reflective"] },
  96.6: { name: "Bollywood", categories: ["bollywood"], moods: ["emotional", "romantic"] },
  98.3: { name: "Punjabi", categories: ["punjabi"], moods: ["energetic", "romantic"] },
  100.1: { name: "Nostalgia", categories: ["2000s", "2010s"], moods: ["nostalgic", "melancholic"] },
  102.5: { name: "Sukoon", categories: ["love", "indie"], moods: ["soft", "dreamy", "intimate"] },
  104.9: { name: "Heartbreak", categories: [], moods: ["melancholic", "emotional", "intense", "longing"] },
};

const NINETIES_SONG_IDS = [
  "aa-chal-ke-tujhe",
  "aaja-piya-tohe-pyar-doon",
  "abhi-na-jao-chhod-kar",
  "ajib-dastan-hai-yeh",
  "bade-achhe-lagte-hain",
  "itna-na-mujhse-tu-pyar-badha-chhaya",
  "lata-ji-hum-tere-pyar-mein-sara-aalam",
  "sar-jo-tera-chakraye-pyaasa",
  "tera-mera-pyar-amar",
  "yeh-raaten-yeh-mausam-dilli-ka-thug",
] as const;

export function getFrequencyQueues(): Record<string, Song[]> {
  const queues: Record<string, Song[]> = {};

  const availableSongs = SONGS.filter((song) => Boolean(R2_AUDIO_FILES[song.id]));
  const ninetiesSongs = availableSongs.filter((song) => NINETIES_SONG_IDS.includes(song.id as (typeof NINETIES_SONG_IDS)[number]));
  const earlyTwoThousandsSongs = availableSongs.filter(
    (song) => !NINETIES_SONG_IDS.includes(song.id as (typeof NINETIES_SONG_IDS)[number]) && song.year !== undefined && song.year <= 2013
  );
  const newerSongs = availableSongs.filter(
    (song) => !NINETIES_SONG_IDS.includes(song.id as (typeof NINETIES_SONG_IDS)[number]) && !earlyTwoThousandsSongs.includes(song)
  );
  const frequencyPools = [
    ninetiesSongs,
    ninetiesSongs,
    earlyTwoThousandsSongs,
    earlyTwoThousandsSongs,
    earlyTwoThousandsSongs,
    newerSongs,
    newerSongs,
    newerSongs,
  ];

  RADIO_FREQUENCIES.forEach((frequency, frequencyIndex) => {
    queues[String(frequency)] = frequencyPools[frequencyIndex].filter(
      (_, songIndex) => songIndex % (frequencyIndex < 2 ? 2 : frequencyIndex < 5 ? 3 : 3) ===
        (frequencyIndex < 2 ? frequencyIndex : frequencyIndex < 5 ? frequencyIndex - 2 : frequencyIndex - 5)
    );
  });

  return queues;
}

export const STATIONS: Station[] = [
  {
    id: "rain",
    name: "Rain",
    emoji: "🌧",
    description: "Songs that belong to rainy windows and grey afternoons.",
    moods: ["melancholy", "introspective", "ambient", "rain"],
    categories: ["rain"],
  },
  {
    id: "love",
    name: "Love",
    emoji: "💛",
    description: "Tender and honest songs about love found and remembered.",
    moods: ["love", "tender", "romantic", "soft"],
    categories: ["love"],
  },
  {
    id: "heartbreak",
    name: "Heartbreak",
    emoji: "💔",
    description: "The songs you play when you need someone to understand.",
    moods: ["heartbreak", "raw", "emotional", "sad"],
    categories: ["heartbreak"],
  },
  {
    id: "night",
    name: "Night",
    emoji: "🌙",
    description: "Late hours, city lights, and quiet thoughts.",
    moods: ["night", "cinematic", "dark", "quiet"],
    categories: ["night"],
  },
  {
    id: "long-drive",
    name: "Long Drive",
    emoji: "🚗",
    description: "Open road, open window, no particular destination.",
    moods: ["drive", "open", "reflective", "wandering"],
    categories: ["long-drive"],
  },
  {
    id: "indie",
    name: "Indie",
    emoji: "🎸",
    description: "Uplifting and alternative — music that feels alive.",
    moods: ["indie", "uplifting", "alternative", "bright"],
    categories: ["indie"],
  },
];

export const SONGS: Song[] = [
  { id: "aa-chal-ke-tujhe", title: "Aa Chal Ke Tujhe", artist: "Kishore Kumar", year: 1967, mood: ["nostalgic", "tender", "reflective"], category: ["1990s", "classic", "love"], youtubeId: null },
  { id: "aaja-piya-tohe-pyar-doon", title: "Aaja Piya Tohe Pyar Doon", artist: "Lata Mangeshkar", year: 1967, mood: ["romantic", "tender", "nostalgic"], category: ["1990s", "classic", "love"], youtubeId: null },
  { id: "abhi-na-jao-chhod-kar", title: "Abhi Na Jao Chhod Kar", artist: "Asha Bhosle, Mohammed Rafi", year: 1961, mood: ["romantic", "tender", "nostalgic"], category: ["1990s", "classic", "love"], youtubeId: null },
  { id: "ajib-dastan-hai-yeh", title: "Ajib Dastan Hai Yeh", artist: "Lata Mangeshkar", year: 1960, mood: ["melancholic", "romantic", "nostalgic"], category: ["1990s", "classic", "love"], youtubeId: null },
  { id: "bade-achhe-lagte-hain", title: "Bade Achhe Lagte Hain", artist: "Amit Kumar, Kalyani Mitra", year: 1976, mood: ["romantic", "tender", "nostalgic"], category: ["1990s", "classic", "love"], youtubeId: null },
  { id: "itna-na-mujhse-tu-pyar-badha-chhaya", title: "Itna Na Mujhse Tu Pyar Badha Chhaya", artist: "Talat Mahmood, Lata Mangeshkar", year: 1959, mood: ["romantic", "tender", "nostalgic"], category: ["1990s", "classic", "love"], youtubeId: null },
  { id: "lata-ji-hum-tere-pyar-mein-sara-aalam", title: "Hum Tere Pyar Mein Sara Aalam", artist: "Lata Mangeshkar", year: 1967, mood: ["romantic", "tender", "nostalgic"], category: ["1990s", "classic", "love"], youtubeId: null },
  { id: "sar-jo-tera-chakraye-pyaasa", title: "Sar Jo Tera Chakraye", artist: "Mohammed Rafi", year: 1957, mood: ["playful", "nostalgic", "happy"], category: ["1990s", "classic", "party"], youtubeId: null },
  { id: "tera-mera-pyar-amar", title: "Tera Mera Pyar Amar", artist: "Lata Mangeshkar", year: 1962, mood: ["romantic", "melancholic", "nostalgic"], category: ["1990s", "classic", "love"], youtubeId: null },
  { id: "yeh-raaten-yeh-mausam-dilli-ka-thug", title: "Yeh Raaten Yeh Mausam", artist: "Kishore Kumar, Asha Bhosle", year: 1958, mood: ["romantic", "nostalgic", "dreamy"], category: ["1990s", "classic", "love"], youtubeId: null },
  {
    id: "sitaare",
    title: "Sitaare",
    artist: "Arijit Singh",
    film: "Ikkis",
    year: 2025,

    mood: ["romantic", "emotional", "dreamy"],
    category: ["2020s", "bollywood", "love"],

    youtubeId: "nDjloeIB3Pc",
    youtubeUrl: "https://youtu.be/nDjloeIB3Pc",

    spotifyUrl: null,
    youtubeMusicUrl: null,
    artwork: null,
  },

  {
    id: "tumhare-hi-rahenge-hum",
    title: "Tumhare Hi Rahenge Hum",
    artist: "Varun Jain, Shilpa Rao, Sachin-Jigar",
    film: "Stree 2",
    year: 2024,

    mood: ["romantic", "love", "emotional"],
    category: ["2020s", "bollywood", "love"],

    youtubeId: "cxKAtmvf-uM",
    youtubeUrl: "https://youtu.be/cxKAtmvf-uM",

    spotifyUrl: null,
    youtubeMusicUrl: null,
    artwork: null,
  },

  {
    id: "tu-chodiyon-na",
    title: "Tu Chodiyon Na",
    artist: "Ronit Vinta",
    year: 2024,

    mood: ["romantic", "soft", "love"],
    category: ["indie", "romantic"],

    youtubeId: "FcGy7VGURtM",
    youtubeUrl: "https://youtu.be/FcGy7VGURtM",

    spotifyUrl: null,
    youtubeMusicUrl: null,
    artwork: null,
  },

  {
    id: "sun-saawariya",
    title: "Sun Saawariya",
    artist: "Accha Insaan, AtharvaMusic, Yaani Karnawat",
    year: 2026,

    mood: ["romantic", "dreamy", "soft", "longing"],
    category: ["indie", "love", "2020s"],

    youtubeId: "go-j1EpaGVo",
    youtubeUrl: "https://youtu.be/go-j1EpaGVo",

    spotifyUrl: null,
    youtubeMusicUrl: null,
    artwork: null,
  },

  {
    id: "arz-kiya-hai",
    title: "Arz Kiya Hai",
    artist: "Anuv Jain",
    album: "Coke Studio Bharat",
    year: 2025,

    mood: ["romantic", "poetic", "dreamy", "soft"],
    category: ["indie", "love", "2020s", "coke-studio"],

    youtubeId: "bP8ATWCvqzw",
    youtubeUrl: "https://youtu.be/bP8ATWCvqzw",

    spotifyUrl: null,
    youtubeMusicUrl: null,
    artwork: null,
  },

  {
    id: "dooron-dooron",
    title: "Dooron Dooron",
    artist: "Paresh Pahuja, Shiv Tandan, Meghdeep Bose",
    year: 2022,

    mood: ["longing", "romantic", "dreamy", "soft"],
    category: ["indie", "love", "2020s"],

    youtubeId: "LV_wiOhO40Q",
    youtubeUrl: "https://youtu.be/LV_wiOhO40Q",

    spotifyUrl: null,
    youtubeMusicUrl: null,
    artwork: null,
  },

  {
    id: "khat",
    title: "Khat",
    artist: "Navjot Ahuja",
    year: 2025,

    mood: ["romantic", "love", "soft", "intimate"],
    category: ["indie", "love", "2020s"],

    youtubeId: "LUgpPmj6nR8",
    youtubeUrl: "https://youtu.be/LUgpPmj6nR8",

    spotifyUrl: null,
    youtubeMusicUrl: null,
    artwork: null,
  },

  { id: "tere-bina-na-guzara-e", title: "Tere Bina Na Guzara E", artist: "Josh Brar", year: 2024, mood: ["romantic", "emotional", "love"], category: ["punjabi", "love", "2020s"], youtubeId: "aYG6oEUXyuQ", youtubeUrl: "https://youtu.be/aYG6oEUXyuQ", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "goat", title: "G.O.A.T.", artist: "Diljit Dosanjh", year: 2020, mood: ["confident", "energetic", "party"], category: ["punjabi", "party", "2020s"], youtubeId: "cl0a3i2wFcc", youtubeUrl: "https://youtu.be/cl0a3i2wFcc", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "boyfriend", title: "Boyfriend", artist: "Karan Aujla, Sunanda", year: 2025, mood: ["romantic", "energetic", "love"], category: ["punjabi", "love", "2020s"], youtubeId: "5GCfYLguTIs", youtubeUrl: "https://youtu.be/5GCfYLguTIs", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "safar", title: "Safar", artist: "Bayaan, Sherazam", album: "Safar", year: 2024, mood: ["reflective", "emotional", "dreamy", "travel"], category: ["indie", "2020s", "travel"], youtubeId: "0QDeSWZdIl4", youtubeUrl: "https://youtu.be/0QDeSWZdIl4", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "jhol", title: "Jhol", artist: "Maanu, Annural Khalid", album: "Jhol - Single", year: 2024, mood: ["romantic", "dreamy", "love"], category: ["pakistani", "coke-studio", "love", "2020s"], youtubeId: "-2RAq5o5pwc", youtubeUrl: "https://youtu.be/-2RAq5o5pwc", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "shaky", title: "Shaky", artist: "Sanju Rathod, G-SPXRK", year: 2025, mood: ["energetic", "playful", "party"], category: ["marathi", "party", "2020s"], youtubeId: "sUf2PtEZris", youtubeUrl: "https://youtu.be/sUf2PtEZris", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "shararat", title: "Shararat", artist: "Shashwat Sachdev, Jasmine Sandlas, Madhubanti Bagchi", film: "Dhurandhar", year: 2025, mood: ["energetic", "playful", "dance"], category: ["bollywood", "dance", "2020s"], youtubeId: "YyepU5ztLf4", youtubeUrl: "https://youtu.be/YyepU5ztLf4", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "vaaroon", title: "Vaaroon", artist: "Romy, Anand Bhaskar", film: "Mirzapur", mood: ["intense", "dramatic", "powerful"], category: ["bollywood", "series", "intense"], youtubeId: "3hq_DhGOzik", youtubeUrl: "https://youtu.be/3hq_DhGOzik", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "tum-se-hi", title: "Tum Se Hi", artist: "Mohit Chauhan", film: "Jab We Met", year: 2007, mood: ["romantic", "nostalgic", "love"], category: ["bollywood", "2000s", "love"], youtubeId: "Cb6wuzOurPc", youtubeUrl: "https://youtu.be/Cb6wuzOurPc", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "bahara", title: "Bahara", artist: "Shreya Ghoshal, Sona Mohapatra", film: "I Hate Luv Storys", year: 2010, mood: ["romantic", "dreamy", "love"], category: ["bollywood", "2010s", "love"], youtubeId: "7N74i_rAfFE", youtubeUrl: "https://youtu.be/7N74i_rAfFE", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "mitwa", title: "Mitwa", artist: "Shafqat Amanat Ali, Shankar Mahadevan", film: "Kabhi Alvida Naa Kehna", year: 2006, mood: ["romantic", "emotional", "nostalgic"], category: ["bollywood", "2000s", "love"], youtubeId: "ru_5PA8cwkE", youtubeUrl: "https://youtu.be/ru_5PA8cwkE", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "dooriyan", title: "Dooriyan", artist: "Mohit Chauhan", film: "Love Aaj Kal", year: 2009, mood: ["romantic", "melancholic", "nostalgic"], category: ["bollywood", "2000s", "love"], youtubeId: "kPtn26x8TZM", youtubeUrl: "https://youtu.be/kPtn26x8TZM", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "zara-sa", title: "Zara Sa", artist: "KK", film: "Jannat", year: 2008, mood: ["romantic", "emotional", "love"], category: ["bollywood", "2000s", "love"], youtubeId: "ZsAOnmByy38", youtubeUrl: "https://youtu.be/ZsAOnmByy38", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "ik-vaari-aa", title: "Ik Vaari Aa", artist: "Arijit Singh", film: "Raabta", year: 2017, mood: ["romantic", "dreamy", "love"], category: ["bollywood", "2010s", "love"], youtubeId: "zXLgYBSdv74", youtubeUrl: "https://youtu.be/zXLgYBSdv74", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "jab-tak", title: "Jab Tak", artist: "Armaan Malik", film: "M.S. Dhoni - The Untold Story", year: 2016, mood: ["romantic", "emotional", "love"], category: ["bollywood", "2010s", "love"], youtubeId: "K-Ts-NFR62o", youtubeUrl: "https://youtu.be/K-Ts-NFR62o", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "jo-tum-mere-ho", title: "Jo Tum Mere Ho", artist: "Anuv Jain", year: 2024, mood: ["romantic", "soft", "intimate", "dreamy"], category: ["indie", "love", "2020s"], youtubeId: "ilNt2bikxDI", youtubeUrl: "https://youtu.be/ilNt2bikxDI", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "dil-ibaadat", title: "Dil Ibaadat", artist: "KK", film: "Tum Mile", year: 2009, mood: ["romantic", "emotional", "melancholic"], category: ["bollywood", "2000s", "love"], youtubeId: "U2QNhsAgIIE", youtubeUrl: "https://youtu.be/U2QNhsAgIIE", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "teri-jhuki-nazar", title: "Teri Jhuki Nazar", artist: "Shafqat Amanat Ali", film: "Murder 3", year: 2013, mood: ["romantic", "emotional", "intense"], category: ["bollywood", "2010s", "love"], youtubeId: "xrSZLa14haA", youtubeUrl: "https://youtu.be/xrSZLa14haA", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "phir-le-aya-dil", title: "Phir Le Aya Dil", artist: "Arijit Singh", film: "Barfi!", year: 2012, mood: ["romantic", "melancholic", "nostalgic"], category: ["bollywood", "2010s", "love"], youtubeId: "k6BnSIs3XUQ", youtubeUrl: "https://youtu.be/k6BnSIs3XUQ", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "tum-ho", title: "Tum Ho", artist: "Mohit Chauhan", film: "Rockstar", year: 2011, mood: ["romantic", "dreamy", "emotional"], category: ["bollywood", "2010s", "love"], youtubeId: "gkCKTuR-ECI", youtubeUrl: "https://youtu.be/gkCKTuR-ECI", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "tujhe-sochta-hoon", title: "Tujhe Sochta Hoon", artist: "KK", film: "Jannat 2", year: 2012, mood: ["romantic", "emotional", "love"], category: ["bollywood", "2010s", "love"], youtubeId: "PkhfKq9m0Uo", youtubeUrl: "https://youtu.be/PkhfKq9m0Uo", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "hosanna", title: "Hosanna", artist: "A.R. Rahman, Leon D'Souza, Suzanne D'Mello", film: "Ekk Deewana Tha", year: 2012, mood: ["romantic", "dreamy", "love"], category: ["bollywood", "2010s", "love"], youtubeId: "dfNdRsNSFx4", youtubeUrl: "https://youtu.be/dfNdRsNSFx4", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
  { id: "jhak-maar-ke", title: "Jhak Maar Ke", artist: "Neeraj Shridhar, Harshdeep Kaur", film: "Desi Boyz", year: 2011, mood: ["energetic", "playful", "party"], category: ["bollywood", "2010s", "party"], youtubeId: "R5CxtjmrIE4", youtubeUrl: "https://youtu.be/R5CxtjmrIE4", spotifyUrl: null, youtubeMusicUrl: null, artwork: null },
];

const R2_AUDIO_BASE_URL = "https://pub-5ef359fff5274b2d95f090ecc084afcd.r2.dev";

const R2_AUDIO_FILES: Record<string, string> = {
  "aa-chal-ke-tujhe": "Aa-Chal-Ke-Tujhe-with-Lyrics-आ-चल-के-तुझे-के-बोल-Door-Gagan-Ki-Chhaon-Mein.mp3",
  "aaja-piya-tohe-pyar-doon": "Aaja-Piya-Tohe-Pyar-Doon-Lata-Mangeshkar-R.D.-Burman-Majrooh-Sultanpuri-Old-Is-Gold.mp3",
  "abhi-na-jao-chhod-kar": "Abhi Na Jao Chhod Kar Hum Dono 320 Kbps.mp3",
  "ajib-dastan-hai-yeh": "Ajib-Dastan-Hai-Yeh-Video-Song-Dil-Apna-Aur-Preet-Parai-Raaj-Kumar-Meena-K-Lata-Mangeshkar.mp3",
  "bade-achhe-lagte-hain": "Bade Achhe Lagte Hain Balika Badhu 320 Kbps.mp3",
  "itna-na-mujhse-tu-pyar-badha-chhaya": "Itna Na Mujhse Tu Pyar Badha Chhaya 320 Kbps.mp3",
  "lata-ji-hum-tere-pyar-mein-sara-aalam": "Lata_ji_-_Hum_tere_pyar_mein_sara_aalam_(mp3.pm).mp3",
  "sar-jo-tera-chakraye-pyaasa": "Sar Jo Tera Chakraye Pyaasa 320 Kbps.mp3",
  "tera-mera-pyar-amar": "Tera Mera Pyar Amar Asli Naqli 320 Kbps.mp3",
  "yeh-raaten-yeh-mausam-dilli-ka-thug": "Yeh Raaten Yeh Mausam Dilli Ka Thug 320 Kbps.mp3",
  "arz-kiya-hai": "Arz Kiya Hai_320(KoshalWorld.Com).mp3",
  bahara: "Bahara I Hate Luv Storys 320 Kbps.mp3",
  boyfriend: "Boyfriend - Karan Aujla.mp3",
  "dil-ibaadat": "Dil Ibaadat Tum Mile Original Motion Picturetrack 320 Kbps.mp3",
  dooriyan: "Dooriyan Love Aaj Kal 320 Kbps.mp3",
  "dooron-dooron": "Dooron Dooron Unplugged Paresh Pahuja 320 Kbps.mp3",
  goat: "G.O.A.T - Diljit Dosanjh.mp3",
  hosanna: "Hosanna Ekk Deewana Tha 320 Kbps.mp3",
  "ik-vaari-aa": "Ik Vaari Aa Raabta 320 Kbps.mp3",
  "jab-tak": "Jab Tak M.s. Dhoni The Untold Story 320 Kbps.mp3",
  "jhak-maar-ke": "Jhak Maar Ke Desi Boyz 320 Kbps.mp3",
  jhol: "Jhol_320(KoshalWorld.Com).mp3",
  "jo-tum-mere-ho": "Jo Tum Mere Ho Anuv Jain 320 Kbps.mp3",
  khat: "Khat Navjot Ahuja 320 Kbps.mp3",
  mitwa: "Mitwa Kabhi Alvida Naa Kehna 320 Kbps.mp3",
  "phir-le-aya-dil": "Phir Le Aya Dil Barfi 320 Kbps.mp3",
  safar: "Safar (PenduJatt.Com.Se).mp3",
  shaky: "Shaky_320(KoshalWorld.Com).mp3",
  shararat: "Shararat Dhurandhar 320 Kbps.mp3",
  sitaare: "Sitaare Ikkis 320 Kbps.mp3",
  "sun-saawariya": "Sun Saawariya Accha Insaan (pagalall.com).mp3",
  "tere-bina-na-guzara-e": "Tere Bina Na Guzara E - Josh Brar.mp3",
  "teri-jhuki-nazar": "Teri Jhuki Nazar Murder 3 320 Kbps.mp3",
  "tu-chodiyon-na": "Tu-Chodiyon-Na-Ronit-Vinta.mp3",
  "tujhe-sochta-hoon": "Tujhe Sochta Hoon Jannat 2 Original Motion Picturetrack 320 Kbps.mp3",
  "tum-ho": "Tum Ho Rockstar 320 Kbps.mp3",
  "tum-se-hi": "Tum Se Hi Jab We Met 320 Kbps.mp3",
  "tumhare-hi-rahenge-hum": "Tumhare Hi Rahenge Hum Stree 2 320 Kbps.mp3",
  vaaroon: "Vaaroon Mirzapur 320 Kbps.mp3",
  "zara-sa": "Zara Sa Jannat 320 Kbps.mp3",
};

export function getAudioUrl(song: Song): string | null {
  const filename = R2_AUDIO_FILES[song.id];
  return filename
    ? `${R2_AUDIO_BASE_URL}/${encodeURIComponent(filename)}`
    : null;
}

export function getSongsForFrequency(frequency: number): Song[] {
  return getFrequencyQueues()[String(frequency)] ?? SONGS;
}

/** Get songs for a given station */
export function getSongsForStation(station: Station): Song[] {
  return SONGS.filter((song) => {
    if (!R2_AUDIO_FILES[song.id]) return false;
    const moodMatch = song.mood?.some((m) => station.moods.includes(m));
    const catMatch = song.category?.some((c) => station.categories.includes(c));
    return moodMatch || catMatch;
  });
}

/** Search songs by query across title, artist, album */
export function searchSongs(query: string): Song[] {
  const q = query.toLowerCase().trim();
  if (!q) return SONGS;
  return SONGS.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.artist?.toLowerCase().includes(q) ||
      s.album?.toLowerCase().includes(q) ||
      s.film?.toLowerCase().includes(q) ||
      s.mood?.some((m) => m.toLowerCase().includes(q))
  );
}
