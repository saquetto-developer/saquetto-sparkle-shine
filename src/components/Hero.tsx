import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bag.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Elegant Saquetto leather bag" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 gradient-hero opacity-80"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-light text-primary-foreground mb-8 tracking-wide">
          Saquetto
        </h1>
        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-4 font-light max-w-2xl mx-auto">
          Elegância artesanal italiana
        </p>
        <p className="text-lg text-primary-foreground/70 mb-12 max-w-xl mx-auto">
          Cada criação é cuidadosamente envolvida em nossos exclusivos saquettos, 
          transformando cada produto em uma experiência única.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button variant="secondary" size="lg" className="text-lg px-8 py-6 shadow-elegant">
            Descobrir Coleção
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
            Nossa História
          </Button>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-primary-foreground/50">
        <div className="animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  );
};