-- Migration: Create mercados table
-- Description: Table for managing market sectors with independent pages and heroes

CREATE TABLE IF NOT EXISTS mercados (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  titulo_hero VARCHAR(500),
  subtitulo_hero TEXT,
  imagen_hero_url TEXT,
  descripcion TEXT,
  contenido TEXT,
  soluciones TEXT[],
  orden INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mercados_slug ON mercados(slug);
CREATE INDEX IF NOT EXISTS idx_mercados_activo ON mercados(activo);
CREATE INDEX IF NOT EXISTS idx_mercados_orden ON mercados(orden);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_mercados_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_mercados_timestamp
BEFORE UPDATE ON mercados
FOR EACH ROW
EXECUTE FUNCTION update_mercados_updated_at();

-- Insertar mercados de ejemplo
INSERT INTO mercados (nombre, slug, titulo_hero, subtitulo_hero, imagen_hero_url, descripcion, soluciones, orden, activo) VALUES
  (
    'Industria Farmacéutica',
    'industria-farmaceutica',
    'Industria Farmacéutica y Medical Devices',
    'Para una mejor calidad de los medicamentos y dispositivos.',
    'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Ahorra tiempo, mejora los procesos, protege la integridad de la marca y garantiza la seguridad del producto. Desde la identificación de la materia prima a través del proceso de fabricación hasta la inspección de los productos terminados y empaquetados.',
    ARRAY['LABORATORIO CONTROL DE CALIDAD', 'LABORATORIO DE MICROBIOLOGÍA', 'INVESTIGACIÓN Y DESARROLLO DE NUEVOS PRODUCTOS', 'ANÁLISIS DE MATERIA PRIMA', 'LÍNEAS DE PRODUCCIÓN'],
    1,
    true
  ),
  (
    'Alimentos y Bebidas',
    'alimentos',
    'Alimentos & Bebidas',
    'Seguridad alimentaria y pruebas de calidad para alimentar a una población en crecimiento.',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Soluciones para el análisis, pesaje e inspección de los alimentos y bebidas, promoviendo la inocuidad de los alimentos.',
    ARRAY['LABORATORIO DE CONTROL DE CALIDAD', 'LABORATORIO DE MICROBIOLOGÍA', 'ANÁLISIS EN LÍNEA', 'PLANTA DE TRATAMIENTO DE AGUA'],
    2,
    true
  ),
  (
    'Energía, Minas y Cemento',
    'energia-minas-cemento',
    'Energía, Minas y Cemento',
    'Garantizar la calidad del producto, mejorar la rentabilidad de la planta y operar plantas más seguras y limpias.',
    'https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Desde la fuente hasta la planta de preparación, ofrecemos una variedad de productos para medir tonelajes, determinar la calidad del producto, garantizar la seguridad del personal y cumplir con las regulaciones de emisiones.',
    ARRAY['LABORATORIO CONTROL DE CALIDAD', 'PLANTA DE TRATAMIENTO DE AGUAS', 'INVESTIGACIÓN Y DESARROLLO DE NUEVOS PRODUCTOS', 'ANÁLISIS DE MATERIA PRIMA', 'LÍNEAS DE PRODUCCIÓN'],
    3,
    true
  ),
  (
    'Industria Química',
    'industria-quimica',
    'Industria Química',
    'Ensayos químicos y de materiales para mejores productos.',
    'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Partiendo de las materias primas hasta los productos terminados, nuestros equipos están diseñados para brindarle a tu laboratorio la mayor precisión, sensibilidad y facilidad de operación.',
    ARRAY['LABORATORIO DE CONTROL DE CALIDAD', 'LABORATORIO DE MICROBIOLOGÍA', 'ANÁLISIS DE MATERIA PRIMA', 'PLANTA DE TRATAMIENTO DE AGUAS', 'ANÁLISIS EN LÍNEA'],
    4,
    true
  ),
  (
    'Medio Ambiente',
    'medio-ambiente',
    'Protección del Medio Ambiente',
    'Pruebas de aire, agua y suelo. Por un planeta más seguro.',
    'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Las amenazas ambientales siguen en aumento y las normas y regulaciones junto con ellas. Nuestro portafolio de tecnologías para el análisis ambiental está diseñado para cumplir con estos requisitos.',
    ARRAY['LABORATORIO DE CONTROL DE CALIDAD', 'LABORATORIO DE MICROBIOLOGÍA', 'ANÁLISIS EN LÍNEA Y CAMPO', 'PLANTA DE TRATAMIENTO DE AGUAS', 'ESTACIONES AMBIENTALES'],
    5,
    true
  ),
  (
    'Life Sciences',
    'life-sciences',
    'Life Sciences',
    'Un mundo más saludable con una atención más precisa y eficiente.',
    'https://images.pexels.com/photos/954585/pexels-photo-954585.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Instrumentos para análisis, equipos de laboratorio y consumibles para la recolección, identificación y análisis de muestras clínicas o para su preservación y protección.',
    ARRAY['BANCO DE SANGRE', 'CONSERVACIÓN DE VACUNAS Y MEDICAMENTOS', 'LABORATORIOS CLÍNICOS Y DE DIAGNÓSTICO', 'FERTILIDAD E INSEMINACIÓN', 'BANCOS DE TEJIDO Y CÉLULAS MADRES'],
    6,
    true
  ),
  (
    'Investigación y Desarrollo',
    'investigacion-desarrollo',
    'Educación, Investigación & Desarrollo',
    'Convertir la teoría en práctica y equipar los laboratorios de enseñanza e investigación con tecnologías de punta.',
    'https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Desde la investigación básica y el descubrimiento hasta el desarrollo y la fabricación del producto final, ayudamos a acelerar el proceso del desarrollo a la comercialización.',
    ARRAY['CIENCIAS DE LA SALUD', 'FARMACIA', 'INGENIERÍA', 'CIENCIAS BÁSICAS (QUÍMICA, FÍSICA Y BIOLOGÍA)'],
    7,
    true
  )
ON CONFLICT (slug) DO NOTHING;