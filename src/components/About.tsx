export const About = () => {
  return (
    <section className="py-24 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-light text-primary mb-8">
              A Arte do Saquetto
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Inspirados pela tradição italiana de embalagens artesanais, cada Saquetto 
                representa nossa dedicação à excelência e ao cuidado com cada detalhe.
              </p>
              <p>
                Nossos artesãos trabalham com materiais selecionados, criando não apenas 
                produtos, mas experiências que começam no momento em que você recebe 
                seu exclusivo saquetto.
              </p>
              <p>
                Cada peça conta uma história, cada embalagem preserva um momento, 
                cada abertura revela a paixão por criar algo verdadeiramente especial.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="gradient-card p-8 rounded-2xl shadow-elegant">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 gradient-accent rounded-full mx-auto flex items-center justify-center shadow-soft">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                    <path d="M20.84 4.61A5.5 5.5 0 0 0 15.5 2.16L12 5.66L8.5 2.16A5.5 5.5 0 0 0 3.34 7.34L12 16L20.66 7.34A5.5 5.5 0 0 0 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-light text-primary">Feito com Amor</h3>
                <p className="text-muted-foreground">
                  Cada saquetto carrega a assinatura de nossos artesãos, 
                  garantindo que você receba uma peça única e especial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};