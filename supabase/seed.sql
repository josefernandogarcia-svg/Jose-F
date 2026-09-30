-- GuateLife: datos de ejemplo (opcional). Corre esto después de schema.sql
-- si quieres que el directorio no arranque vacío. Estos lugares quedan
-- "curados por el administrador" (owner_id = NULL): solo editables desde
-- el SQL Editor de Supabase, no desde el panel de un negocio.

insert into public.venues
  (slug, nombre, tipo, ciudad, direccion, lat, lng, descripcion, tags, precio, calificacion, destacado, plan, telefono, instagram, sitio_web, url_reserva, imagen_color)
values
  ('alux-bar', 'Alux Bar', 'bar', 'Guatemala', '12 Calle 4-30, Zona 10', 14.5975, -90.5133,
   'Bar subterráneo con ambiente místico, coctelería de autor y música en vivo los jueves.',
   array['música en vivo', 'coctelería', 'ambiente único'], 2, 4.6, true, 'destacado',
   null, 'https://instagram.com/aluxbar', null, 'https://wa.me/50212345678', '#7c3aed'),

  ('kloud-discoteca', 'Kloud', 'discoteca', 'Guatemala', '4 Grados Norte, Zona 4', 14.6146, -90.5165,
   'La discoteca más famosa de la zona, con los mejores DJs invitados y pista principal.',
   array['EDM', 'DJ invitado', 'rooftop'], 3, 4.8, true, 'destacado',
   null, null, 'https://example.com/kloud', 'https://example.com/kloud/reservas', '#db2777'),

  ('la-terraza', 'La Terraza', 'bar', 'Guatemala', '6 Avenida 13-01, Zona 10', 14.5952, -90.5104,
   'Bar al aire libre ideal para after-office, con happy hour todos los días.',
   array['happy hour', 'al aire libre', 'after-office'], 1, 4.2, false, 'basico',
   null, null, null, null, '#059669'),

  ('envy-club', 'Envy Club', 'discoteca', 'Guatemala', 'Diagonal 6 10-01, Zona 10', 14.5968, -90.5089,
   'Discoteca exclusiva con sección VIP y los mejores remixes urbanos.',
   array['reggaeton', 'VIP', 'urbano'], 3, 4.4, false, 'basico',
   '+502 1234 5678', null, null, null, '#ea580c'),

  ('cheers-pub', 'Cheers Pub', 'bar', 'Guatemala', '1 Avenida 15-15, Zona 10', 14.6011, -90.5121,
   'Pub estilo americano con deportes en vivo y buena cerveza artesanal.',
   array['deportes en vivo', 'cerveza artesanal', 'trivia'], 2, 4.0, false, 'basico',
   null, null, null, null, '#0284c7'),

  ('cayala-bistro', 'Cayalá Bistro', 'restaurante', 'Guatemala', 'Paseo Cayalá, Zona 16', 14.5218, -90.4658,
   'Cocina de autor con terraza al aire libre, ideal para cenas y sobremesas largas.',
   array['cocina de autor', 'terraza', 'vinos'], 3, 4.7, true, 'destacado',
   null, 'https://instagram.com/cayalabistro', null, 'https://wa.me/50223456789', '#b45309'),

  ('sabor-chapin', 'Sabor Chapín', 'restaurante', 'Guatemala', '4a Avenida 12-25, Zona 10', 14.5941, -90.5127,
   'Comida típica guatemalteca reinventada, ambiente familiar y música en vivo los fines de semana.',
   array['comida típica', 'familiar', 'marimba'], 2, 4.5, false, 'basico',
   null, null, null, null, '#15803d'),

  ('mirador-carretera-el-salvador', 'Mirador Vista Hermosa', 'spot', 'Guatemala', 'Carretera a El Salvador km 14', 14.5389, -90.4526,
   'Mirador con vista panorámica de la ciudad, perfecto para fotos al atardecer y food trucks los fines de semana.',
   array['vista panorámica', 'atardecer', 'food trucks'], 1, 4.3, false, 'basico',
   null, null, null, null, '#0891b2'),

  ('parque-central-antigua', 'Parque Central Antigua Guatemala', 'spot', 'Antigua Guatemala', '5a Avenida Norte, Antigua Guatemala', 14.5586, -90.7339,
   'El corazón de Antigua: arquitectura colonial, cafés alrededor y ambiente para caminar de noche.',
   array['colonial', 'turístico', 'para caminar'], 1, 4.9, false, 'basico',
   null, null, null, null, '#7c2d12')
on conflict (slug) do nothing;

-- Horarios semanales de ejemplo (la app calcula sola cuál mostrar según el día real)
insert into public.venue_actividades (venue_id, dias, nombre, hora, descripcion)
select id, array[4]::smallint[], 'Jazz Nocturno', '21:00', 'Trío de jazz en vivo, entrada libre con consumo mínimo.'
from public.venues where slug = 'alux-bar'
union all
select id, array[5,6]::smallint[], 'Noche de DJ Internacional', '23:00', 'Line-up especial de fin de semana, boletos anticipados recomendados.'
from public.venues where slug = 'kloud-discoteca'
union all
select id, array[1,2,3,4,5]::smallint[], 'Happy Hour Extendido', '17:00', '2x1 en cocteles seleccionados hasta las 20:00.'
from public.venues where slug = 'la-terraza'
union all
select id, array[3]::smallint[], 'Noche de Trivia', '19:30', 'Concurso de trivia con premios para el equipo ganador.'
from public.venues where slug = 'cheers-pub'
union all
select id, array[0,1,2,3,4,5,6]::smallint[], 'Noche de Maridaje', '19:30', 'Menú de 5 tiempos maridado con vinos seleccionados, cupo limitado.'
from public.venues where slug = 'cayala-bistro'
union all
select id, array[5,6]::smallint[], 'Food Trucks al Atardecer', '17:00', 'Feria de food trucks y música ambiental hasta las 21:00.'
from public.venues where slug = 'mirador-carretera-el-salvador';
