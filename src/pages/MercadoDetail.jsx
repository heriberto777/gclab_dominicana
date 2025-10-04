import { useParams, useNavigate } from 'react-router-dom';
import Hero from '../components/organisms/Hero';
import PageSection from '../components/templates/PageSection';
import Button from '../components/atoms/Button';
import ProveedoresCarousel from '../components/molecules/ProveedoresCarousel';
import './MercadoDetail.css';

const MercadoDetail = () => {
  const { sector } = useParams();
  const navigate = useNavigate();

  const mercados = {
    'industria-farmaceutica': {
      title: 'Industria Farmacéutica',
      displayTitle: 'Industria Farmacéutica y Medical Devices',
      subtitle: 'Para una mejor calidad de los medicamentos y dispositivos.',
      image: 'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=1600',
      description: 'Ahorra tiempo, mejora los procesos, protege la integridad de la marca y garantiza la seguridad del producto. Desde la identificación de la materia prima a través del proceso de fabricación hasta la inspección de los productos terminados y empaquetados.',
      soluciones: [
        'LABORATORIO CONTROL DE CALIDAD',
        'LABORATORIO DE MICROBIOLOGÍA',
        'INVESTIGACIÓN Y DESARROLLO DE NUEVOS PRODUCTOS',
        'ANÁLISIS DE MATERIA PRIMA',
        'LÍNEAS DE PRODUCCIÓN'
      ]
    },
    'alimentos': {
      title: 'Alimentos',
      displayTitle: 'Alimentos & Bebidas',
      subtitle: 'Seguridad alimentaria y pruebas de calidad para alimentar a una población en crecimiento.',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600',
      description: 'Soluciones para el análisis, pesaje e inspección de los alimentos y bebidas, promoviendo la inocuidad de los alimentos.',
      soluciones: [
        'LABORATORIO DE CONTROL DE CALIDAD',
        'LABORATORIO DE MICROBIOLOGÍA',
        'ANÁLISIS EN LÍNEA',
        'PLANTA DE TRATAMIENTO DE AGUA'
      ]
    },
    'energia-minas-cemento': {
      title: 'Energía, Minas y Cemento',
      displayTitle: 'Energía, Minas y Cemento',
      subtitle: 'Garantizar la calidad del producto, mejorar la rentabilidad de la planta y operar plantas más seguras y limpias.',
      image: 'https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg?auto=compress&cs=tinysrgb&w=1600',
      description: 'Desde la fuente hasta la planta de preparación, ofrecemos una variedad de productos para medir tonelajes, determinar la calidad del producto, garantizar la seguridad del personal y cumplir con las regulaciones de emisiones. Entendemos tu proceso y ofrecemos productos que se adaptan a tus aplicaciones.',
      soluciones: [
        'LABORATORIO CONTROL DE CALIDAD',
        'PLANTA DE TRATAMIENTO DE AGUAS',
        'INVESTIGACIÓN Y DESARROLLO DE NUEVOS PRODUCTOS',
        'ANÁLISIS DE MATERIA PRIMA',
        'LÍNEAS DE PRODUCCIÓN'
      ]
    },
    'industria-quimica': {
      title: 'Industria Química',
      displayTitle: 'Industria Química',
      subtitle: 'Ensayos químicos y de materiales para mejores productos.',
      image: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=1600',
      description: 'Partiendo de las materias primas hasta los productos terminados, nuestros equipos están diseñados para brindarle a tu laboratorio la mayor precisión, sensibilidad y facilidad de operación. Desde la preparación de muestras hasta el análisis y los informes, lo tenemos todo cubierto.',
      soluciones: [
        'LABORATORIO DE CONTROL DE CALIDAD',
        'LABORATORIO DE MICROBIOLOGÍA',
        'ANÁLISIS DE MATERIA PRIMA',
        'PLANTA DE TRATAMIENTO DE AGUAS',
        'ANÁLISIS EN LÍNEA'
      ]
    },
    'medio-ambiente': {
      title: 'Medio Ambiente',
      displayTitle: 'Protección del Medio Ambiente',
      subtitle: 'Pruebas de aire, agua y suelo. Por un planeta más seguro.',
      image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1600',
      description: 'Las amenazas ambientales siguen en aumento y las normas y regulaciones junto con ellas. Nuestro portafolio de tecnologías para el análisis ambiental está diseñado para cumplir con estos requisitos, proporcionando resultados rápidos, confiables y precisos que pueden simplificar el cumplimiento de las regulaciones y ayudarte a minimizar los riesgos.',
      soluciones: [
        'LABORATORIO DE CONTROL DE CALIDAD',
        'LABORATORIO DE MICROBIOLOGÍA',
        'ANÁLISIS EN LÍNEA Y CAMPO',
        'PLANTA DE TRATAMIENTO DE AGUAS',
        'ESTACIONES AMBIENTALES'
      ]
    },
    'life-sciences': {
      title: 'Life Sciences',
      displayTitle: 'Life Sciences',
      subtitle: 'Un mundo más saludable con una atención más precisa y eficiente.',
      image: 'https://images.pexels.com/photos/954585/pexels-photo-954585.jpeg?auto=compress&cs=tinysrgb&w=1600',
      description: 'Instrumentos para análisis, equipos de laboratorio y consumibles para la recolección, identificación y análisis de muestras clínicas o para su preservación y protección.',
      soluciones: [
        'BANCO DE SANGRE',
        'CONSERVACIÓN DE VACUNAS Y MEDICAMENTOS',
        'LABORATORIOS CLÍNICOS Y DE DIAGNÓSTICO',
        'FERTILIDAD E INSEMINACIÓN',
        'BANCOS DE TEJIDO Y CÉLULAS MADRES',
        'LABORATORIO DE INVESTIGACIÓN EN CIENCIAS FORENSES'
      ]
    },
    'investigacion-desarrollo': {
      title: 'Investigación y Desarrollo',
      displayTitle: 'Educación, Investigación & Desarrollo',
      subtitle: 'Convertir la teoría en práctica y equipar los laboratorios de enseñanza e investigación con tecnologías de punta.',
      image: 'https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=1600',
      description: 'Desde la investigación básica y el descubrimiento hasta el desarrollo y la fabricación del producto final, ayudamos con nuestros equipos y tecnologías a los investigadores a acelerar el proceso del desarrollo a la comercialización, llevando mejores productos al mercado, más rápido.',
      soluciones: [
        'CIENCIAS DE LA SALUD',
        'FARMACIA',
        'INGENIERÍA',
        'CIENCIAS BÁSICAS (QUÍMICA, FÍSICA Y BIOLOGÍA)'
      ]
    }
  };

  const mercadoData = mercados[sector] || mercados['industria-farmaceutica'];

  return (
    <div className="mercado-detail">
      <Hero
        title={mercadoData.title}
        subtitle=""
        image={mercadoData.image}
      />

      <PageSection>
        <div className="mercado-content">
          <h1 className="mercado-title">{mercadoData.displayTitle}</h1>

          <h2 className="mercado-subtitle">{mercadoData.subtitle}</h2>

          <p className="mercado-description">{mercadoData.description}</p>

          <h3 className="soluciones-title">SOLUCIONES PARA:</h3>

          <ul className="soluciones-list">
            {mercadoData.soluciones.map((solucion, index) => (
              <li key={index}>{solucion}</li>
            ))}
          </ul>

          <div className="productos-button-container">
            <Button onClick={() => navigate('/productos')}>Productos</Button>
          </div>
        </div>
      </PageSection>

      <PageSection background="white">
        <ProveedoresCarousel />
      </PageSection>
    </div>
  );
};

export default MercadoDetail;
