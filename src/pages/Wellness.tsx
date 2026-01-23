import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/data/articles";
import { Heart, Leaf, Moon } from "lucide-react";

const Wellness = () => {
  const wellnessArticles = articles.filter(article => 
    article.category.toLowerCase() === "wellness"
  );

  return (
    <div className="min-h-screen paper-page animate-fade-in">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section with Paper Style */}
        <div className="mb-16 text-center space-y-6">
          <div className="ornament-divider justify-center animate-fade-in">
            <span className="font-script text-2xl text-accent">✿</span>
          </div>
          <span className="font-caps text-xs tracking-widest text-muted-foreground">Category</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight animate-slide-down">
            Wellness & Self-Care
          </h1>
          <p className="text-lg font-body text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up stagger-1">
            Discover practices, insights, and strategies to nurture your physical, mental, and emotional wellbeing. 
            From mindful routines to holistic health approaches, explore ways to create balance and vitality in your daily life.
          </p>
          <div className="ornament-divider justify-center animate-fade-in stagger-2">
            <span className="text-sm">✦ ✦ ✦</span>
          </div>
        </div>

        {/* Articles Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wellnessArticles.map((article, index) => (
              <div key={article.id} className={`animate-slide-up stagger-${Math.min(index + 2, 6)}`}>
                <ArticleCard {...article} />
              </div>
            ))}
          </div>
        </section>

        {/* Featured Content with Paper Effects */}
        <section className="mt-16 paper-section paper-shadow paper-stack p-8 md:p-12 relative overflow-hidden">
          {/* Decorative paper elements */}
          <div className="absolute top-4 right-4 opacity-10">
            <Heart className="w-24 h-24 text-accent" />
          </div>
          
          <div className="max-w-4xl mx-auto relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-2">
                <Heart className="w-5 h-5 text-accent" />
                <Leaf className="w-5 h-5 text-accent" />
                <Moon className="w-5 h-5 text-accent" />
              </div>
              <div className="h-px flex-1 bg-border" />
            </div>
            
            <h2 className="text-3xl font-editorial font-semibold mb-6">
              <span className="font-script text-accent text-4xl">W</span>hy Wellness Matters
            </h2>
            <div className="space-y-4 font-body text-muted-foreground">
              <p>
                Wellness is not just about physical health—it's about creating harmony between body, mind, and spirit. 
                In our fast-paced world, taking time to nurture ourselves isn't a luxury; it's essential for sustainable living.
              </p>
              <p>
                Through thoughtful self-care practices, we can build resilience, improve our relationships, enhance our 
                productivity, and ultimately, live more fulfilling lives. Whether it's through nutrition, movement, 
                meditation, or simply learning to rest, every small step toward wellness counts.
              </p>
            </div>
            
            <blockquote className="pull-quote mt-8">
              "The greatest wealth is health." — Virgil
            </blockquote>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Wellness;
