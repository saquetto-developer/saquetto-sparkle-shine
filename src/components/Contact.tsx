import { Button } from "@/components/ui/button";

export const Contact = () => {
  return (
    <section className="py-24 px-6 gradient-hero">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-light text-primary-foreground mb-8">
          Entre em Contato
        </h2>
        <p className="text-xl text-primary-foreground/90 mb-12 max-w-2xl mx-auto">
          Tem alguma dúvida sobre nossos saquettos? Gostaríamos de ouvir você.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-foreground/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-foreground">
                <path d="M21 10C21 17 12 23 12 23S3 17 3 10A9 9 0 0 1 12 1A9 9 0 0 1 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-primary-foreground mb-2">Localização</h3>
            <p className="text-primary-foreground/70">Milano, Itália</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-foreground/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-foreground">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-primary-foreground mb-2">Email</h3>
            <p className="text-primary-foreground/70">hello@saquetto.it</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-foreground/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-foreground">
                <path d="M22 16.92V19.92A2 2 0 0 1 20.18 22H20.11A19.79 19.79 0 0 1 2 4.18A2 2 0 0 1 4.11 2H7.09A2 2 0 0 1 9.09 3.53L10.26 7.09A2 2 0 0 1 9.81 8.94L8.09 10.6A16 16 0 0 0 13.4 15.91L15.06 14.19A2 2 0 0 1 16.91 13.74L20.47 14.91A2 2 0 0 1 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-primary-foreground mb-2">Telefone</h3>
            <p className="text-primary-foreground/70">+39 02 1234 5678</p>
          </div>
        </div>
        
        <Button 
          variant="secondary" 
          size="lg" 
          className="text-lg px-12 py-6 shadow-elegant"
        >
          Enviar Mensagem
        </Button>
      </div>
    </section>
  );
};