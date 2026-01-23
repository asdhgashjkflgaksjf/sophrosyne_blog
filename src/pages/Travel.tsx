import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/data/articles";
import { Compass, Map, Plane } from "lucide-react";

const Travel = () => {
  const travelArticles = articles.filter(article => 
    article.category.toLowerCase() === "travel"
  );

  return (
    <div className="min-h-screen paper-page animate-fade-in">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section with Paper Style */}
        <div className="mb-16 text-center space-y-6">
          <div className="ornament-divider justify-center animate-fade-in">
            <span className="font-script text-2xl text-accent">✈</span>
          </div>
          <span className="font-caps text-xs tracking-widest text-muted-foreground">Category</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight animate-slide-down">
            Travel & Exploration
          </h1>
          <p className="text-lg font-body text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up stagger-1">
            Journey through inspiring destinations, cultural insights, and mindful travel practices. 
            Discover how to explore the world with intention, curiosity, and respect for local communities and environments.
          </p>
          <div className="ornament-divider justify-center animate-fade-in stagger-2">
            <span className="text-sm">✦ ✦ ✦</span>
          </div>
        </div>

        {/* Articles Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {travelArticles.map((article, index) => (
              <div key={article.id} className={`animate-slide-up stagger-${Math.min(index + 2, 6)}`}>
                <ArticleCard {...article} />
              </div>
            ))}
          </div>
        </section>

        {/* Travel Philosophy with Paper Effects */}
        <section className="mt-16 paper-section paper-shadow paper-stack p-8 md:p-12 relative overflow-hidden">
          {/* Decorative paper elements */}
          <div className="absolute top-4 right-4 opacity-10">
            <Compass className="w-24 h-24 text-accent" />
          </div>
          
          <div className="max-w-4xl mx-auto relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-2">
                <Compass className="w-5 h-5 text-accent" />
                <Map className="w-5 h-5 text-accent" />
                <Plane className="w-5 h-5 text-accent" />
              </div>
              <div className="h-px flex-1 bg-border" />
            </div>
            
            <h2 className="text-3xl font-editorial font-semibold mb-6">
              <span className="font-script text-accent text-4xl">O</span>ur Travel Philosophy
            </h2>
            <div className="space-y-4 font-body text-muted-foreground">
              <p>
                Travel is more than visiting new places—it's about opening ourselves to new perspectives, cultures, 
                and ways of being. We believe in slow, intentional travel that prioritizes meaningful connections 
                over checking off bucket list items.
              </p>
              <p>
                Whether you're exploring your own backyard or venturing to distant lands, we share stories and 
                insights that inspire mindful exploration, sustainable practices, and genuine cultural exchange. 
                Join us in discovering that the journey itself is often the most valuable destination.
              </p>
            </div>
            
            <blockquote className="pull-quote mt-8">
              "The world is a book, and those who do not travel read only one page." — Saint Augustine
            </blockquote>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Travel;
