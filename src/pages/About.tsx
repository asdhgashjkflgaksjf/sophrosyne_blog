import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, BookOpen, Heart, Globe, Palette, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import profileSilhouette from "@/assets/profile-silhouette.png";

const About = () => {
  return (
    <div className="min-h-screen paper-page animate-fade-in">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section with Profile */}
        <div className="mb-16 text-center space-y-6">
          <div className="ornament-divider justify-center animate-fade-in">
            <span className="font-script text-2xl text-accent">❧</span>
          </div>
          
          {/* Profile Image */}
          <div className="flex justify-center animate-slide-down">
            <img
              src={profileSilhouette}
              alt="Farhan"
              className="w-32 h-32 rounded-full object-cover border-4 border-border paper-shadow bg-[hsl(var(--paper-cream))]"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight animate-slide-down">
            Tentang Saya
          </h1>
          <h2 className="text-2xl font-editorial text-accent animate-slide-up">Farhan</h2>
          <p className="text-lg font-body text-muted-foreground leading-relaxed animate-slide-up stagger-1 max-w-2xl mx-auto">
            Penulis & pemikir yang mengeksplorasi filsafat, stoikisme, dan kebijaksanaan hidup 
            melalui tulisan. Selamat datang di ruang refleksi pribadi saya.
          </p>
          <div className="ornament-divider justify-center animate-fade-in stagger-2">
            <span className="text-sm">✦ ✦ ✦</span>
          </div>
        </div>

        {/* Story Section with Paper Texture */}
        <section className="mb-16 paper-section paper-shadow p-8 md:p-12 animate-slide-up stagger-2">
          <h2 className="text-3xl font-editorial font-semibold text-foreground mb-6">
            <span className="font-script text-accent text-4xl">O</span>ur Story
          </h2>
          <div className="space-y-6 font-body text-muted-foreground article-body">
            <p>
              Sophrosyne began with a simple question: What if we could create a space where thoughtful ideas, 
              meaningful stories, and practical wisdom come together to enrich our daily lives?
            </p>
            <p>
              In a world saturated with information, we felt the need for something different—a publication that 
              prioritizes depth over speed, quality over quantity, and authentic connection over viral content. 
              Sophrosyne is our answer to that need.
            </p>
            <p>
              We explore topics that matter: wellness practices that actually work, travel experiences that transform 
              us, creative pursuits that bring joy, and personal growth strategies that lead to lasting change. 
              Our approach is grounded in curiosity, backed by research, and enriched by lived experience.
            </p>
          </div>
        </section>

        {/* Mission Section with Paper Effects */}
        <section className="mb-16 paper-section paper-shadow p-8 md:p-12 paper-corner">
          <h2 className="text-3xl font-editorial font-semibold mb-6">
            <span className="font-script text-accent text-4xl">O</span>ur Mission
          </h2>
          <div className="space-y-4 font-body text-muted-foreground">
            <p>
              We believe that how we see the world shapes how we experience it. Sophrosyne is dedicated to 
              offering fresh viewpoints, practical insights, and inspiring stories that help readers:
            </p>
            <ul className="space-y-4 ml-6">
              <li className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Cultivate mindful, balanced lifestyles that prioritize wellbeing</span>
              </li>
              <li className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Explore the world with curiosity and respect</span>
              </li>
              <li className="flex items-start gap-3">
                <Palette className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Express themselves authentically through creative pursuits</span>
              </li>
              <li className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Embrace personal growth as a lifelong journey</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Values Section with Paper Cards */}
        <section className="mb-16">
          <h2 className="text-3xl font-editorial font-semibold mb-8">
            <span className="font-script text-accent text-4xl">O</span>ur Values
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 paper-value-card paper-shadow">
              <h3 className="text-xl font-editorial font-semibold mb-3">Authenticity</h3>
              <p className="font-body text-muted-foreground">
                We share real experiences, honest reflections, and genuine insights—not curated perfection.
              </p>
            </div>
            <div className="p-6 paper-value-card paper-shadow">
              <h3 className="text-xl font-editorial font-semibold mb-3">Thoughtfulness</h3>
              <p className="font-body text-muted-foreground">
                Every article is carefully researched, thoughtfully written, and designed to add real value.
              </p>
            </div>
            <div className="p-6 paper-value-card paper-shadow">
              <h3 className="text-xl font-editorial font-semibold mb-3">Inclusivity</h3>
              <p className="font-body text-muted-foreground">
                We welcome diverse perspectives and believe everyone's journey deserves respect and representation.
              </p>
            </div>
            <div className="p-6 paper-value-card paper-shadow">
              <h3 className="text-xl font-editorial font-semibold mb-3">Sustainability</h3>
              <p className="font-body text-muted-foreground">
                We promote practices that are sustainable for individuals, communities, and the planet.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section with Paper Style */}
        <section className="text-center py-12 paper-section paper-shadow paper-stack relative">
          <div className="relative z-10">
            <div className="ornament-divider justify-center mb-6">
              <span className="font-script text-xl text-accent">§</span>
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">Join Our Community</h2>
            <p className="font-body text-muted-foreground mb-8 max-w-2xl mx-auto">
              Subscribe to receive our latest articles, insights, and inspiration directly in your inbox.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-body paper-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              <Mail className="mr-2 h-4 w-4" />
              Subscribe Now
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
