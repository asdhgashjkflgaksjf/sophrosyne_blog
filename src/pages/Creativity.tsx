import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/data/articles";
import { Palette, Sparkles, Pencil } from "lucide-react";

const Creativity = () => {
  const creativityArticles = articles.filter(article => 
    article.category.toLowerCase() === "creativity"
  );

  return (
    <div className="min-h-screen paper-page animate-fade-in">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section with Paper Style */}
        <div className="mb-16 text-center space-y-6">
          <div className="ornament-divider justify-center animate-fade-in">
            <span className="font-script text-2xl text-accent">✎</span>
          </div>
          <span className="font-caps text-xs tracking-widest text-muted-foreground">Category</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight animate-slide-down">
            Creativity & Expression
          </h1>
          <p className="text-lg font-body text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up stagger-1">
            Unlock your creative potential and explore the art of authentic self-expression. 
            From overcoming blocks to building sustainable creative practices, discover insights that nurture your artistic journey.
          </p>
          <div className="ornament-divider justify-center animate-fade-in stagger-2">
            <span className="text-sm">✦ ✦ ✦</span>
          </div>
        </div>

        {/* Articles Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {creativityArticles.map((article, index) => (
              <div key={article.id} className={`animate-slide-up stagger-${Math.min(index + 2, 6)}`}>
                <ArticleCard {...article} />
              </div>
            ))}
          </div>
        </section>

        {/* About Creativity with Paper Effects */}
        <section className="mt-16 paper-section paper-shadow paper-stack p-8 md:p-12 relative overflow-hidden">
          {/* Decorative paper elements */}
          <div className="absolute top-4 right-4 opacity-10">
            <Palette className="w-24 h-24 text-accent" />
          </div>
          
          <div className="max-w-4xl mx-auto relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-2">
                <Palette className="w-5 h-5 text-accent" />
                <Sparkles className="w-5 h-5 text-accent" />
                <Pencil className="w-5 h-5 text-accent" />
              </div>
              <div className="h-px flex-1 bg-border" />
            </div>
            
            <h2 className="text-3xl font-editorial font-semibold mb-6">
              <span className="font-script text-accent text-4xl">N</span>urturing Creative Spirit
            </h2>
            <div className="space-y-4 font-body text-muted-foreground">
              <p>
                Creativity isn't reserved for artists—it's a fundamental human capacity that enriches every aspect of life. 
                Whether you're writing, designing, problem-solving, or simply reimagining your daily routine, 
                creative thinking opens doors to innovation and fulfillment.
              </p>
              <p>
                We explore the practices, mindsets, and tools that help creatives of all kinds stay inspired, 
                overcome obstacles, and build sustainable creative lives. From finding your unique voice to 
                navigating the practical challenges of creative work, we're here to support your journey.
              </p>
            </div>
            
            <blockquote className="pull-quote mt-8">
              "Creativity takes courage." — Henri Matisse
            </blockquote>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Creativity;
