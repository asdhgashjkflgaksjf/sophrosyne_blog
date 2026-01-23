import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/data/articles";
import { Sprout, Target, Lightbulb } from "lucide-react";

const Growth = () => {
  const growthArticles = articles.filter(article => 
    article.category.toLowerCase() === "growth"
  );

  return (
    <div className="min-h-screen paper-page animate-fade-in">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section with Paper Style */}
        <div className="mb-16 text-center space-y-6">
          <div className="ornament-divider justify-center animate-fade-in">
            <span className="font-script text-2xl text-accent">❦</span>
          </div>
          <span className="font-caps text-xs tracking-widest text-muted-foreground">Category</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight animate-slide-down">
            Personal Growth
          </h1>
          <p className="text-lg font-body text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up stagger-1">
            Embark on a journey of self-discovery and continuous improvement. 
            Explore insights, practices, and perspectives that support your evolution into your best self.
          </p>
          <div className="ornament-divider justify-center animate-fade-in stagger-2">
            <span className="text-sm">✦ ✦ ✦</span>
          </div>
        </div>

        {/* Articles Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {growthArticles.map((article, index) => (
              <div key={article.id} className={`animate-slide-up stagger-${Math.min(index + 2, 6)}`}>
                <ArticleCard {...article} />
              </div>
            ))}
          </div>
        </section>

        {/* Growth Philosophy with Paper Effects */}
        <section className="mt-16 paper-section paper-shadow paper-stack p-8 md:p-12 relative overflow-hidden">
          {/* Decorative paper elements */}
          <div className="absolute top-4 right-4 opacity-10">
            <Sprout className="w-24 h-24 text-accent" />
          </div>
          
          <div className="max-w-4xl mx-auto relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-2">
                <Sprout className="w-5 h-5 text-accent" />
                <Target className="w-5 h-5 text-accent" />
                <Lightbulb className="w-5 h-5 text-accent" />
              </div>
              <div className="h-px flex-1 bg-border" />
            </div>
            
            <h2 className="text-3xl font-editorial font-semibold mb-6">
              <span className="font-script text-accent text-4xl">T</span>he Path of Growth
            </h2>
            <div className="space-y-4 font-body text-muted-foreground">
              <p>
                Personal growth isn't about perfection—it's about progress, self-awareness, and the courage to evolve. 
                It's the daily practice of becoming more aligned with our values, more compassionate toward ourselves 
                and others, and more intentional in how we live.
              </p>
              <p>
                Through thoughtful reflection, practical strategies, and inspiring stories, we explore what it means 
                to grow as individuals. From building resilience to letting go of what no longer serves us, 
                every step on this journey matters. Join us as we navigate the beautiful, challenging work of 
                becoming who we're meant to be.
              </p>
            </div>
            
            <blockquote className="pull-quote mt-8">
              "The only journey is the one within." — Rainer Maria Rilke
            </blockquote>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Growth;
