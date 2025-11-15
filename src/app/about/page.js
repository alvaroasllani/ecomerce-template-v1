import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-8 text-center">Sobre Tech Accessories</h1>
        
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Historia</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Tech Accessories fue fundada con una misión simple: proporcionar accesorios tecnológicos premium 
            que mejoren tu espacio de trabajo y aumenten la productividad. Creemos 
            que la tecnología debe ser tanto funcional como hermosa.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Cada producto en nuestra colección es cuidadosamente seleccionado y probado para asegurar que cumple 
            con nuestros altos estándares de calidad, diseño y funcionalidad. Trabajamos directamente con 
            los mejores fabricantes para ofrecerte los mejores productos a precios justos.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Calidad Primero</h3>
              <p className="text-gray-700">
                Nunca comprometemos la calidad. Cada producto es rigurosamente probado antes 
                de llegar a nuestra tienda.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Diseño Minimalista</h3>
              <p className="text-gray-700">
                Creemos en el poder de la simplicidad. Nuestros productos presentan diseños limpios y atemporales 
                que nunca pasan de moda.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Satisfacción del Cliente</h3>
              <p className="text-gray-700">
                Tu satisfacción es nuestra prioridad. Ofrecemos devoluciones sin complicaciones y 
                atención al cliente receptiva.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contáctanos</h2>
          <p className="text-gray-700 mb-4">
            ¿Tienes preguntas? Nos encantaría saber de ti. Contacta a nuestro equipo:
          </p>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> hello@techaccessories.com
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Teléfono:</span> (555) 123-4567
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Horario:</span> Lunes - Viernes, 9am - 6pm EST
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
