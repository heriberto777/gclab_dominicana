-- Migration: Create servicios_tecnicos table
-- Description: Table for managing technical services sections

CREATE TABLE IF NOT EXISTS servicios_tecnicos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  descripcion TEXT,
  imagen_url TEXT,
  orden INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_servicios_tecnicos_slug ON servicios_tecnicos(slug);
CREATE INDEX IF NOT EXISTS idx_servicios_tecnicos_activo ON servicios_tecnicos(activo);
CREATE INDEX IF NOT EXISTS idx_servicios_tecnicos_orden ON servicios_tecnicos(orden);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_servicios_tecnicos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_servicios_tecnicos_timestamp
BEFORE UPDATE ON servicios_tecnicos
FOR EACH ROW
EXECUTE FUNCTION update_servicios_tecnicos_updated_at();

-- Insertar servicios técnicos de ejemplo
INSERT INTO servicios_tecnicos (titulo, slug, descripcion, orden, activo) VALUES
  (
    'SERVICIO TÉCNICO',
    'servicio-tecnico',
    'La revisión de cada instrumento antes de su despacho al laboratorio, la correcta instalación, así como también sus respectivos mantenimientos y reparaciones con repuestos originales y suministrados con celeridad, son actividades primordiales para incrementar la productividad de los equipos y por consiguiente de su laboratorio.',
    1,
    true
  ),
  (
    'ENTRENAMIENTOS EN TÉCNICAS ANALÍTICAS',
    'entrenamientos',
    'La capacitación al personal es esencial para el aseguramiento de la calidad de los métodos analíticos, garantizando resultados confiables que permiten la toma de decisiones de alto impacto, la innovación en los procesos productivos y la correcta implementación de normas técnicas. Durante los cursos se discuten en detalle las aplicaciones del cliente, los eventuales problemas que se están presentando y se exponen recomendaciones de optimización. Todos nuestros programas pueden ser dictados de manera virtual / interactivos, de forma presencial en las instalaciones del cliente, en las instalaciones de GCLAB Dominicana o cursos abiertos en fechas y lugares predeterminados.',
    2,
    true
  ),
  (
    'CALIBRACIÓN DE EQUIPOS',
    'calibracion-equipos',
    'Se implementan las calibraciones necesarias en su instrumento para el control óptimo de su proceso bien sea en el laboratorio o en la planta. Las visitas por parte de nuestro personal para la validación y ajuste de las curvas de calibraciones, proporcionan herramientas que evalúan su proceso de preparación de muestras, la repetitividad del mismo y el desempeño en precisión e incertidumbre del propio instrumento de análisis.',
    3,
    true
  ),
  (
    'CERTIFICACIÓN Y CALIFICACIÓN DE EQUIPOS',
    'certificacion-calificacion',
    'Entendemos que hay una necesidad creciente por la validación de procesos, métodos y el cumplimiento de conformidad, por lo que ofrecemos procesos de Calificación de la Instalación y Calificación Operativa de manera integral para los clientes que deseen incluir evidencias de conformidad en sus aplicaciones analíticas. Los procesos de IQ/OQ están diseñados para cada configuración y le brindan una solución eficiente para lograr y mantener la conformidad de sus sistemas y son ejecutados por nuestros Ingenieros de Servicio debidamente entrenados para completar los procedimientos de Calificación.',
    4,
    true
  ),
  (
    'MONTAJE DE MÉTODOS',
    'montaje-metodos',
    'Desarrollamos soluciones y metodologías en las áreas de análisis aplicado en ciencias químicas. Le acompañaremos en el trabajo de validación de métodos donde un Especialista le brindará asesoría integral y continua en el proceso de diseño, desarrollo y seguimiento en la implementación y validación de metodologías en las diferentes áreas analíticas.',
    5,
    true
  ),
  (
    'CONTRATOS DE MANTENIMIENTO',
    'contratos-mantenimiento',
    'Ofrecemos diferentes tipos de contratos de servicio para los equipos de las marcas representadas que incluyen asesorías, visitas de mantenimiento preventivo, correctivos y pueden incluir los consumibles y repuestos, garantizando el correcto funcionamiento de su instrumento evitando perdidas de tiempo y recursos.',
    6,
    true
  )
ON CONFLICT (slug) DO NOTHING;