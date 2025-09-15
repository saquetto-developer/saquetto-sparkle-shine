import { Button } from "@/components/ui/button";
import productsImage from "@/assets/products-collection.jpg";

export const Products = () => {
  const categories = [
    {
      name: "Bolsas Artesanais",
      description: "Peças únicas em couro selecionado",
      icon: "👜"
    },
    {
      name: "Acessórios Premium", 
      description: "Carteiras e porta-cartões elegantes",
      icon: "🎒"
    },
    {
      name: "Edições Limitadas",
      description: "Criações exclusivas em pequenas quantidades", 
      icon: "💎"
    },
    {
      name: "Presentes Especiais",
      description: "Saquettos para ocasiões memoráveis",
      icon: "🎁"
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-primary mb-6">
            Nossa Coleção
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubra peças cuidadosamente criadas e apresentadas em nossos exclusivos saquettos.
          </p>
        </div>

        {/* Featured Image */}
        <div className="mb-16 relative">
          <div className="rounded-3xl overflow-hidden shadow-elegant">
            <img 
              src={productsImage} 
              alt="Coleção Saquetto de acessórios artesanais"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 gradient-hero opacity-20"></div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {categories.map((category, index) => (
            <div 
              key={index}
              className="gradient-card p-8 rounded-2xl shadow-soft hover:shadow-elegant transition-all duration-300 text-center group cursor-pointer"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <h3 className="text-xl font-medium text-primary mb-3">
                {category.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {category.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="gradient-accent text-primary text-lg px-12 py-6 shadow-elegant hover:shadow-glow transition-all duration-300"
          >
            Explorar Toda Coleção
          </Button>
        </div>
      </div>
    </section>
  );
};