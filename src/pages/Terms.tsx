import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface TermsSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const TermsSection = ({ title, children, defaultOpen = false }: TermsSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-sepia/10 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left group"
      >
        <h2 className="text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h2>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted-foreground"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Terms = () => {
  return (
    <div className="min-h-screen bg-background animate-fade-in flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12 w-full">
        {/* Compact Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8 pb-4 border-b border-sepia/20"
        >
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">
            Syarat & Ketentuan
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Terakhir diperbarui: 20 Maret 2025
          </p>
        </motion.div>

        {/* Accordion-style sections */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-sm border border-sepia/10 paper-shadow px-4 md:px-6"
        >
          <TermsSection title="Persetujuan Syarat" defaultOpen={true}>
            <p>
              Dengan mengakses atau menggunakan website dan layanan Perspective, Anda setuju untuk terikat dengan 
              Syarat & Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, Anda tidak 
              diperkenankan untuk mengakses layanan kami.
            </p>
          </TermsSection>

          <TermsSection title="Lisensi Penggunaan">
            <p className="mb-3">
              Izin diberikan untuk mengakses materi di website Perspective secara sementara untuk keperluan pribadi 
              dan non-komersial saja. Berdasarkan lisensi ini, Anda tidak diperkenankan untuk:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Memodifikasi atau menyalin materi</li>
              <li>Menggunakan materi untuk tujuan komersial</li>
              <li>Mencoba mendekompilasi atau merekayasa balik perangkat lunak</li>
              <li>Menghapus notasi hak cipta atau kepemilikan</li>
            </ul>
          </TermsSection>

          <TermsSection title="Konten Pengguna">
            <p>
              Ketika Anda memposting komentar atau konten lainnya di website kami, Anda memberikan kami lisensi 
              non-eksklusif, berlaku di seluruh dunia, dan bebas royalti untuk menggunakan, mereproduksi, dan 
              menampilkan konten tersebut. Anda menyatakan bahwa Anda memiliki atau memiliki hak yang diperlukan 
              atas konten yang Anda posting.
            </p>
          </TermsSection>

          <TermsSection title="Penggunaan yang Dilarang">
            <p className="mb-3">Anda tidak diperkenankan menggunakan website kami untuk:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Melanggar hukum atau peraturan yang berlaku</li>
              <li>Mengirimkan kode berbahaya atau malicious</li>
              <li>Menyamar sebagai Perspective atau karyawannya</li>
              <li>Melecehkan, menyalahgunakan, atau menyakiti orang lain</li>
              <li>Mengirim spam atau komunikasi yang tidak diminta</li>
            </ul>
          </TermsSection>

          <TermsSection title="Hak Kekayaan Intelektual">
            <p>
              Semua konten di Perspective, termasuk artikel, gambar, logo, dan desain, adalah milik Perspective 
              atau pembuat kontennya dan dilindungi oleh undang-undang hak cipta internasional. Penggunaan konten 
              kami tanpa izin dapat melanggar hak cipta, merek dagang, dan hukum lainnya.
            </p>
          </TermsSection>

          <TermsSection title="Penafian & Batasan Tanggung Jawab">
            <p className="mb-3">
              Materi di website Perspective disediakan dalam kondisi "apa adanya". Perspective tidak memberikan 
              jaminan, tersurat maupun tersirat, dan dengan ini menolak semua jaminan lainnya.
            </p>
            <p>
              Dalam keadaan apa pun, Perspective atau pemasoknya tidak bertanggung jawab atas kerugian apa pun 
              yang timbul dari penggunaan atau ketidakmampuan menggunakan materi di website Perspective.
            </p>
          </TermsSection>

          <TermsSection title="Tautan ke Website Lain">
            <p>
              Website kami mungkin berisi tautan ke website pihak ketiga yang tidak dimiliki atau dikendalikan 
              oleh Perspective. Kami tidak memiliki kendali dan tidak bertanggung jawab atas konten, kebijakan 
              privasi, atau praktik website pihak ketiga mana pun.
            </p>
          </TermsSection>

          <TermsSection title="Perubahan & Hukum yang Berlaku">
            <p className="mb-3">
              Perspective dapat merevisi Syarat & Ketentuan ini kapan saja tanpa pemberitahuan. Dengan menggunakan 
              website ini, Anda setuju untuk terikat dengan versi terbaru dari Syarat & Ketentuan ini.
            </p>
            <p>
              Syarat ini diatur dan ditafsirkan sesuai dengan hukum Indonesia, tanpa memperhatikan ketentuan 
              pertentangan hukumnya.
            </p>
          </TermsSection>

          <TermsSection title="Hubungi Kami">
            <p>
              Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi kami di:
            </p>
            <p className="mt-2 font-medium">
              Email: legal@perspective.blog
            </p>
          </TermsSection>
        </motion.div>

        {/* Quick summary note */}
        <p className="text-xs text-muted-foreground text-center mt-6 italic">
          Klik pada setiap bagian untuk membaca selengkapnya
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
