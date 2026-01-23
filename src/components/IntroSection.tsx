const IntroSection = () => {
  return (
    <section className="max-w-4xl mx-auto py-16 md:py-24 px-4 animate-fade-in">
      <div className="text-center space-y-8">
        {/* Decorative element */}
        <div className="ornament-divider justify-center animate-fade-in">
          <span className="font-script text-3xl text-accent">§</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-editorial font-semibold leading-tight animate-slide-up">
          Sophrosyne is a sanctuary for those who seek 
          <span className="font-script text-accent"> balance</span>, 
          <span className="font-script text-accent"> wisdom</span>, and the 
          <span className="font-script text-accent"> art of mindful living</span>.
        </h2>
        
        <div className="ornament-divider justify-center animate-fade-in stagger-1">
          <span className="text-lg">✦ ✦ ✦</span>
        </div>
        
        <p className="text-lg md:text-xl font-body text-muted-foreground leading-relaxed max-w-3xl mx-auto animate-slide-up stagger-2">
          From the gentle rituals of self-care to the bold adventures of exploration, 
          we curate perspectives that inspire thoughtful living. Each article is crafted 
          with care—like a handwritten letter to a dear friend—inviting you to pause, 
          reflect, and discover new ways of seeing the world.
        </p>

        {/* Paper note decoration */}
        <div className="relative inline-block animate-paper-drop stagger-3">
          <div className="paper-texture paper-shadow px-8 py-4 transform rotate-[-1deg]">
            <p className="font-script text-xl md:text-2xl text-accent">
              "Where every word is a brushstroke on the canvas of understanding"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
