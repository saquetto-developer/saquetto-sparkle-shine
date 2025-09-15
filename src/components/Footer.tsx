export const Footer = () => {
  return (
    <footer className="bg-card py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-light text-primary mb-4">Saquetto</h3>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
              Cada produto é uma obra de arte artesanal italiana, cuidadosamente 
              apresentada em nossos exclusivos saquettos.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-accent/30 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                  <path d="M18 2H15A5 5 0 0 0 10 7V10H7V14H10V22H14V14H17L18 10H14V7A1 1 0 0 1 15 6H18V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-accent/30 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8A4 4 0 0 1 16 11.37Z" stroke="currentColor" strokeWidth="2"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div>
            <h4 className="text-lg font-medium text-primary mb-4">Navegação</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Coleção</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Nossa História</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Artesãos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-lg font-medium text-primary mb-4">Suporte</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Envios</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Devoluções</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cuidados</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2024 Saquetto. Todos os direitos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
            <a href="#" className="hover:text-primary transition-colors">Termos</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};