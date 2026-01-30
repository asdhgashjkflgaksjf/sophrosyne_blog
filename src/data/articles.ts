export interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  content: {
    introduction: string;
    sections: {
      heading: string;
      content: string;
    }[];
    conclusion: string;
  };
  tags: string[];
}

import profileSilhouette from "@/assets/profile-silhouette.png";

const farhanAuthor = {
  name: "Farhan",
  avatar: profileSilhouette,
  bio: "Penulis, pemikir, dan pencari makna melalui filsafat dan literatur",
};

export const articles: Article[] = [
  {
    id: "001",
    title: "Stoikisme di Era Digital",
    subtitle: "Bagaimana kebijaksanaan kuno membantu kita menghadapi kecemasan modern",
    category: "Filsafat",
    date: "Jan 16, 2025",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&q=80",
    author: farhanAuthor,
    content: {
      introduction: "Di tengah notifikasi yang tak pernah berhenti dan tekanan untuk selalu 'on', kebijaksanaan Stoik yang berusia ribuan tahun menawarkan jangkar ketenangan yang mungkin lebih relevan dari sebelumnya. Marcus Aurelius, Seneca, dan Epictetus tidak pernah membayangkan smartphone, tetapi mereka memahami sifat pikiran manusia dengan sangat dalam.",
      sections: [
        {
          heading: "Dichotomy of Control",
          content: "Inti dari Stoikisme adalah pemahaman sederhana namun transformatif: ada hal-hal yang bisa kita kontrol, dan ada yang tidak. Kita tidak bisa mengontrol cuaca, pendapat orang lain, atau bahkan hasil dari usaha kita. Yang bisa kita kontrol hanyalah respons kita, nilai-nilai kita, dan tindakan kita. Di era digital, ini berarti memilih dengan bijak apa yang kita konsumsi, bagaimana kita merespons kritik online, dan kapan kita perlu menutup layar.",
        },
        {
          heading: "Memento Mori dan FOMO",
          content: "Stoik sering merenungkan kematian bukan untuk menjadi morbid, tapi untuk menghargai kehidupan. Ironisnya, FOMO (Fear of Missing Out) adalah kebalikannya—kita begitu takut kehilangan momen bahwa kita lupa mengalami momen yang ada di depan kita. Praktik memento mori mengajarkan kita bahwa waktu terbatas, jadi gunakanlah untuk hal-hal yang benar-benar bermakna.",
        },
        {
          heading: "Journaling ala Stoik",
          content: "Marcus Aurelius menulis 'Meditations' sebagai catatan pribadi, bukan untuk dipublikasikan. Praktik refleksi harian ini—mengevaluasi tindakan kita, mengidentifikasi area perbaikan, dan bersyukur—tetap relevan. Di era digital, journaling bisa menjadi jeda dari stimulasi konstan, ruang untuk berpikir tanpa gangguan.",
        },
        {
          heading: "Virtue Ethics di Media Sosial",
          content: "Stoik percaya bahwa karakter lebih penting dari reputasi. Tapi media sosial mendorong kita untuk mengutamakan penampilan. Bagaimana jika kita menerapkan empat kebajikan Stoik—kebijaksanaan, keberanian, keadilan, dan moderasi—dalam interaksi online kita? Bagaimana jika kita lebih peduli menjadi orang baik daripada terlihat baik?",
        },
      ],
      conclusion: "Stoikisme bukan tentang menekan emosi atau menjadi apatis. Ini tentang mengembangkan resiliensi batin, fokus pada apa yang penting, dan hidup selaras dengan nilai-nilai kita—terlepas dari badai digital di sekitar kita. Seperti kata Epictetus, 'Bukan hal-hal yang mengganggu kita, tetapi penilaian kita tentang hal-hal itu.'",
    },
    tags: ["stoikisme", "filsafat", "kesehatan mental", "digital wellness"],
  },
  {
    id: "002",
    title: "Membaca 'Meditations' Marcus Aurelius",
    subtitle: "Catatan pribadi kaisar Romawi yang mengubah hidup jutaan orang",
    category: "Book Review",
    date: "Jan 10, 2025",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1920&q=80",
    author: farhanAuthor,
    content: {
      introduction: "Ada sesuatu yang sangat intim tentang membaca buku yang tidak pernah dimaksudkan untuk dibaca orang lain. 'Meditations' adalah jurnal pribadi Marcus Aurelius, ditulis selama kampanye militer yang melelahkan, sebagai cara untuk mengingatkan dirinya sendiri tentang prinsip-prinsip yang ia yakini. Hampir dua ribu tahun kemudian, kata-katanya masih bergema.",
      sections: [
        {
          heading: "Konteks Sejarah",
          content: "Marcus Aurelius adalah kaisar Romawi dari tahun 161 hingga 180 M, periode yang penuh perang, wabah, dan intrik politik. Meski memegang kekuasaan absolut, ia memilih untuk hidup dengan disiplin dan refleksi. 'Meditations' ditulis dalam bahasa Yunani, bukan Latin, menunjukkan ini adalah percakapan dengan dirinya sendiri, bukan dokumen resmi.",
        },
        {
          heading: "Tema-Tema Utama",
          content: "Buku ini penuh dengan pengingat tentang kematian, kefanaan segala sesuatu, dan pentingnya fokus pada saat ini. Marcus berulang kali mengingatkan dirinya untuk tidak terganggu oleh pendapat orang lain, untuk menerima apa yang tidak bisa diubah, dan untuk bertindak dengan kebaikan bahkan ketika orang lain tidak melakukannya. 'Hidup yang baik adalah hidup yang sesuai dengan alam'—ini adalah mantra yang ia ulangi.",
        },
        {
          heading: "Pelajaran yang Saya Ambil",
          content: "Yang paling menyentuh saya adalah kerendahan hati Marcus. Meski kaisar paling berkuasa di dunia, ia terus mengingatkan dirinya bahwa ia hanyalah 'titik kecil dalam ruang, momen singkat dalam waktu.' Perspektif ini—yang ia sebut 'view from above'—membantu melihat masalah sehari-hari dalam konteks yang lebih besar.",
        },
        {
          heading: "Relevansi untuk Hari Ini",
          content: "Ketika saya membaca tentang frustrasi Marcus dengan orang-orang yang 'menghalangi' pekerjaannya, saya tertawa mengenali diri sendiri. Ketika ia menulis tentang pentingnya memulai hari dengan mengantisipasi akan bertemu orang-orang sulit, saya merasa ini bisa jadi pengingat sebelum membuka email atau media sosial. Kearifan manusia tidak banyak berubah.",
        },
      ],
      conclusion: "Saya merekomendasikan membaca 'Meditations' sedikit demi sedikit—beberapa paragraf setiap pagi atau malam. Ini bukan buku untuk dikonsumsi sekali habis, tapi untuk direnungkan berulang kali sepanjang hidup. Seperti kata Marcus sendiri, 'Jangan bertindak seolah kamu akan hidup sepuluh ribu tahun. Sementara kamu masih hidup, sementara kamu masih bisa, jadilah baik sekarang.'",
    },
    tags: ["book review", "stoikisme", "marcus aurelius", "filsafat kuno"],
  },
  {
    id: "003",
    title: "Eksistensialisme untuk Pemula",
    subtitle: "Menemukan makna di dunia yang tampak tanpa makna",
    category: "Filsafat",
    date: "Dec 28, 2024",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1920&q=80",
    author: farhanAuthor,
    content: {
      introduction: "Eksistensialisme sering disalahpahami sebagai filosofi yang suram dan nihilistik. Padahal, di balik pertanyaan-pertanyaan berat tentang keberadaan, ada pesan pembebasan yang mendalam: kita bebas menciptakan makna hidup kita sendiri. Dari Kierkegaard hingga Camus, mari jelajahi ide-ide yang telah mengubah cara manusia memahami dirinya.",
      sections: [
        {
          heading: "Existence Precedes Essence",
          content: "Jean-Paul Sartre merangkum eksistensialisme dalam frasa ini: keberadaan mendahului esensi. Artinya, kita tidak dilahirkan dengan tujuan atau makna yang sudah ditentukan—kita harus menciptakannya. Berbeda dengan pisau yang dibuat dengan tujuan tertentu, manusia hadir dulu ke dunia, lalu menentukan siapa ia ingin menjadi. Ini menakutkan sekaligus membebaskan.",
        },
        {
          heading: "Kecemasan dan Kebebasan",
          content: "Kierkegaard menyebut 'anxiety' sebagai 'dizziness of freedom'—pusing karena kebebasan. Ketika kita menyadari betapa bebasnya kita, ada rasa cemas yang muncul. Tidak ada skrip yang harus diikuti, tidak ada jalan yang 'benar'. Setiap pilihan adalah milik kita, dan dengan itu datang tanggung jawab penuh atas hidup kita.",
        },
        {
          heading: "Absurditas dan Pemberontakan",
          content: "Albert Camus mengembangkan konsep 'absurd'—konflik antara keinginan manusia untuk makna dan ketidakpedulian alam semesta. Dalam 'The Myth of Sisyphus,' ia membayangkan Sisyphus bahagia meski terkutuk menggulung batu selamanya. Mengapa? Karena ia memilih untuk terus mendorong batu—itu adalah pemberontakannya terhadap absurditas.",
        },
        {
          heading: "Living Authentically",
          content: "Hidup autentik berarti mengakui kebebasan kita dan membuat pilihan yang benar-benar milik kita—bukan karena tekanan sosial, ekspektasi keluarga, atau ketakutan. Ini tidak mudah. Kita sering lari ke 'bad faith,' menipu diri sendiri bahwa kita tidak punya pilihan. Eksistensialisme menantang kita untuk jujur tentang agensi yang kita miliki.",
        },
      ],
      conclusion: "Eksistensialisme tidak memberikan jawaban, tapi mengajukan pertanyaan yang tepat. Dalam dunia yang sering terasa tanpa makna, filosofi ini mengingatkan kita bahwa makna tidak ditemukan—ia diciptakan. Dan tanggung jawab untuk menciptakannya ada di tangan kita masing-masing. Seperti kata Sartre, 'Kita dikutuk untuk bebas.'",
    },
    tags: ["eksistensialisme", "filsafat", "sartre", "camus", "makna hidup"],
  },
  {
    id: "P001",
    title: "Seni Berpikir Jernih",
    subtitle: "Pelajaran dari para filsuf tentang kejernihan mental",
    category: "Filsafat",
    date: "Jan 5, 2025",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=1920&q=80",
    author: farhanAuthor,
    content: {
      introduction: "Di era informasi yang berlebihan, kemampuan untuk berpikir jernih menjadi semakin langka dan berharga. Para filsuf sepanjang sejarah telah mengembangkan metode untuk menjernihkan pikiran—dari Socratic questioning hingga meditation Zen. Mari pelajari teknik-teknik yang telah teruji waktu ini.",
      sections: [
        {
          heading: "Socratic Method",
          content: "Socrates mengajarkan bahwa kebijaksanaan dimulai dengan mengakui ketidaktahuan kita. Metodenya—bertanya terus-menerus hingga mencapai inti—membantu mengungkap asumsi tersembunyi dan bias dalam pemikiran kita. Coba terapkan ini: ketika Anda yakin tentang sesuatu, tanyakan 'mengapa saya percaya ini?' dan terus gali lebih dalam.",
        },
        {
          heading: "Via Negativa",
          content: "Kadang cara terbaik untuk menemukan kebenaran adalah dengan mengeliminasi kesalahan. Ini adalah pendekatan 'via negativa'—mengurangi yang tidak penting untuk menemukan yang esensial. Dalam berpikir, ini berarti menyingkirkan bias, asumsi yang tidak diperiksa, dan informasi yang tidak relevan.",
        },
        {
          heading: "Meditation dan Mindfulness",
          content: "Tradisi Buddhis dan Stoik sama-sama menekankan observasi pikiran tanpa penghakiman. Dengan memperhatikan pikiran kita seperti awan yang lewat, kita mendapat jarak dari mereka. Kita mulai melihat pikiran sebagai 'pikiran,' bukan sebagai kebenaran absolut. Ini memberikan ruang untuk respons yang lebih bijak.",
        },
        {
          heading: "Writing to Think",
          content: "Menulis bukan hanya mengekspresikan pikiran—menulis adalah berpikir. Ketika kita menulis, kita dipaksa untuk mengklarifikasi apa yang sebenarnya kita maksud. Ide yang kabur di kepala menjadi jelas (atau terungkap kekurangannya) di atas kertas. Inilah mengapa journaling adalah alat berpikir yang powerful.",
        },
        {
          heading: "First Principles Thinking",
          content: "Elon Musk populer menyebut 'first principles thinking,' tapi konsep ini berasal dari Aristoteles. Idenya: alih-alih berpikir dengan analogi (X mirip Y, jadi...), kita memecah masalah ke komponen paling dasar dan membangun kembali dari sana. Ini membantu menemukan solusi yang benar-benar baru.",
        },
      ],
      conclusion: "Berpikir jernih bukanlah bakat alami—ini adalah keterampilan yang bisa dipelajari dan dilatih. Seperti otot, ia menguat dengan latihan. Mulailah dengan memperlambat, mempertanyakan asumsi Anda, dan menciptakan ruang untuk refleksi. Di dunia yang ramai, kejernihan pikiran adalah superpower.",
    },
    tags: ["berpikir", "filsafat", "mindfulness", "produktivitas"],
  },
  {
    id: "B001",
    title: "Review: 'Man's Search for Meaning'",
    subtitle: "Kisah bertahan hidup dan menemukan makna di Auschwitz",
    category: "Book Review",
    date: "Dec 20, 2024",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1920&q=80",
    author: farhanAuthor,
    content: {
      introduction: "Viktor Frankl menulis buku ini dalam sembilan hari setelah dibebaskan dari kamp konsentrasi Nazi. Hasilnya adalah salah satu karya paling penting abad ke-20—sebuah kesaksian tentang kekuatan manusia untuk menemukan makna bahkan dalam penderitaan yang paling ekstrem.",
      sections: [
        {
          heading: "Pengalaman di Kamp",
          content: "Bagian pertama buku menggambarkan kehidupan di Auschwitz dengan detail yang menyakitkan tapi penting. Frankl mengobservasi bagaimana tahanan yang berbeda merespons penderitaan—beberapa menyerah, beberapa menjadi brutal, dan beberapa mempertahankan kemanusiaan mereka. Perbedaannya, ia menyimpulkan, terletak pada apakah mereka memiliki sesuatu untuk hidup.",
        },
        {
          heading: "Logotherapy",
          content: "Dari pengalamannya, Frankl mengembangkan 'logotherapy'—bentuk psikoterapi yang berpusat pada pencarian makna. Berbeda dengan Freud yang fokus pada kesenangan dan Adler yang fokus pada kekuasaan, Frankl percaya bahwa motivasi utama manusia adalah menemukan makna. Dan makna bisa ditemukan dalam tiga cara: melalui karya, melalui cinta, dan melalui sikap terhadap penderitaan.",
        },
        {
          heading: "Kebebasan Terakhir",
          content: "Kutipan paling terkenal dari buku ini: 'Segala sesuatu bisa diambil dari manusia kecuali satu hal: kebebasan terakhir—untuk memilih sikap dalam setiap keadaan, untuk memilih jalannya sendiri.' Bahkan di kamp kematian, ada ruang untuk pilihan—bagaimana merespons, bagaimana memperlakukan sesama tahanan, bagaimana memandang penderitaan.",
        },
        {
          heading: "Relevansi Hari Ini",
          content: "Meski konteks Frankl ekstrem, pesannya universal. Kita semua menghadapi penderitaan dalam bentuk berbeda. Pertanyaannya bukan bagaimana menghindari penderitaan—itu tidak mungkin—tapi bagaimana menemukan makna di dalamnya. Apakah kita tumbuh dari kesulitan, atau hancur karenanya, sebagian besar ditentukan oleh perspektif kita.",
        },
      ],
      conclusion: "Ini bukan buku yang mudah dibaca, tapi buku yang penting. Frankl menunjukkan bahwa bahkan dalam kegelapan terdalam, ada cahaya—jika kita memilih untuk melihatnya. 'Mereka yang memiliki 'mengapa' untuk hidup,' ia mengutip Nietzsche, 'bisa menanggung hampir semua 'bagaimana.''",
    },
    tags: ["book review", "viktor frankl", "psikologi", "makna hidup", "holocaust"],
  },
  {
    id: "G001",
    title: "Hidup dengan Intensionalitas",
    subtitle: "Seni menjalani hidup yang direncanakan dengan sengaja",
    category: "Growth",
    date: "Dec 15, 2024",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1920&q=80",
    author: farhanAuthor,
    content: {
      introduction: "Kebanyakan dari kita menjalani hidup secara reaktif—merespons apa yang terjadi, mengikuti arus, membuat keputusan berdasarkan kebiasaan atau tekanan eksternal. Hidup intensional adalah kebalikannya: secara sadar memilih bagaimana kita menghabiskan waktu, energi, dan perhatian kita.",
      sections: [
        {
          heading: "Audit Waktu",
          content: "Langkah pertama adalah kesadaran. Coba lacak bagaimana Anda menghabiskan waktu selama seminggu—setiap jam, setiap aktivitas. Hasilnya sering mengejutkan. Kita mungkin berpikir media sosial hanya '15 menit,' tapi akumulasinya bisa berjam-jam. Hanya dengan melihat realita, kita bisa mulai mengubahnya.",
        },
        {
          heading: "Klarifikasi Nilai",
          content: "Apa yang benar-benar penting bagi Anda? Bukan apa yang 'seharusnya' penting, tapi apa yang benar-benar menggerakkan Anda. Kesehatan? Keluarga? Kreativitas? Pelayanan? Ketika nilai-nilai jelas, keputusan menjadi lebih mudah—kita punya kompas untuk mengarahkan pilihan kita.",
        },
        {
          heading: "Design Your Day",
          content: "Hari yang baik tidak terjadi secara kebetulan—ia didesain. Ini tidak berarti menjadwalkan setiap menit, tapi memiliki struktur yang mendukung prioritas Anda. Kapan waktu terbaik untuk deep work? Kapan untuk istirahat? Bagaimana memulai dan mengakhiri hari? Design, lalu iterate.",
        },
        {
          heading: "Mengatakan Tidak",
          content: "Setiap 'ya' adalah 'tidak' untuk sesuatu yang lain. Hidup intensional berarti belajar mengatakan tidak pada yang baik untuk mengatakan ya pada yang terbaik. Ini sulit—kita tidak ingin mengecewakan orang. Tapi tanpa batas, kita hidup menurut prioritas orang lain, bukan milik kita.",
        },
        {
          heading: "Review dan Adjust",
          content: "Intensionalitas bukan tentang perencanaan sempurna, tapi tentang kesadaran berkelanjutan. Luangkan waktu mingguan untuk review: Apa yang berjalan baik? Apa yang perlu diubah? Kehidupan berubah, prioritas bergeser, dan rencana perlu menyesuaikan. Yang konstan adalah komitmen untuk hidup dengan sadar.",
        },
      ],
      conclusion: "Hidup intensional bukan tentang produktivitas tanpa henti atau mengoptimalkan setiap momen. Ini tentang keselarasan—memastikan cara kita menghabiskan hari-hari kita mencerminkan apa yang paling kita hargai. Seperti kata Annie Dillard, 'Cara kita menghabiskan hari-hari kita adalah cara kita menghabiskan hidup kita.'",
    },
    tags: ["intensionalitas", "produktivitas", "growth", "self-improvement"],
  },
];

export function getArticleById(id: string): Article | undefined {
  return articles.find((article) => article.id === id);
}

export function getRelatedArticles(currentId: string, limit: number = 3): Article[] {
  const currentArticle = getArticleById(currentId);
  if (!currentArticle) return articles.slice(0, limit);

  // First try to find articles in the same category
  const sameCategory = articles.filter(
    (article) => article.id !== currentId && article.category === currentArticle.category
  );

  // If not enough, add from other categories
  const otherCategories = articles.filter(
    (article) => article.id !== currentId && article.category !== currentArticle.category
  );

  return [...sameCategory, ...otherCategories].slice(0, limit);
}
