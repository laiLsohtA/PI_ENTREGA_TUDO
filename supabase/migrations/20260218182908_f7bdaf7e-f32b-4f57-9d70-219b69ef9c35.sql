
-- Create products table
CREATE TABLE public.products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read products (public marketplace)
CREATE POLICY "Products are viewable by everyone"
  ON public.products
  FOR SELECT
  USING (true);

-- Allow anyone to insert products (no auth required for this marketplace)
CREATE POLICY "Anyone can insert products"
  ON public.products
  FOR INSERT
  WITH CHECK (true);

-- Insert mock data
INSERT INTO public.products (name, description, price, category) VALUES
  ('Furadeira Bosch 650W', 'Furadeira de impacto profissional com velocidade variável e mandril de 13mm. Ideal para alvenaria, madeira e metal.', 299.90, 'Ferramentas'),
  ('Kit Chaves de Fenda 10 peças', 'Conjunto completo de chaves de fenda e philips em aço inox com cabo emborrachado antiderrapante.', 49.90, 'Ferramentas'),
  ('Nível a Laser Digital', 'Nível a laser autonivelante com alcance de 30 metros e precisão de ±0.3mm/m. Perfeito para instalações.', 189.90, 'Ferramentas'),
  ('Camiseta Básica Algodão Premium', 'Camiseta 100% algodão penteado, corte regular fit. Disponível em diversas cores. Lavagem a máquina.', 59.90, 'Roupas'),
  ('Calça Jeans Skinny', 'Calça jeans de alta qualidade com lycra para maior conforto e mobilidade. Lavagem estonada moderna.', 149.90, 'Roupas'),
  ('Tênis Esportivo Running', 'Tênis leve e confortável para corridas e caminhadas. Solado antiderrapante e cabedal respirável.', 299.90, 'Roupas'),
  ('Smartphone Samsung Galaxy A55', 'Smartphone 5G com tela AMOLED 6.6", câmera tripla de 50MP, bateria 5000mAh e 8GB RAM.', 2199.90, 'Eletrônicos'),
  ('Fone de Ouvido Bluetooth JBL', 'Fone over-ear com cancelamento ativo de ruído, 30h de bateria e driver de 40mm para som premium.', 399.90, 'Eletrônicos'),
  ('Tablet iPad Air 11"', 'Tablet Apple com chip M2, tela Liquid Retina 11", compatível com Apple Pencil e Magic Keyboard.', 4999.90, 'Eletrônicos'),
  ('Arroz Integral Orgânico 5kg', 'Arroz integral orgânico certificado, rico em fibras e sem agrotóxicos. Produzido por agricultores locais.', 32.90, 'Alimentos'),
  ('Azeite Extra Virgem Português', 'Azeite de oliva extra virgem importado de Portugal, acidez máxima 0.3%. Frasco de 500ml premium.', 45.90, 'Alimentos'),
  ('Granola Artesanal Sem Glúten', 'Granola feita com aveia, mel, castanhas e frutas secas. Sem glúten, sem lactose. Pacote 500g.', 28.90, 'Alimentos'),
  ('Mochila Notebook 15.6"', 'Mochila com compartimento acolchoado para notebook, porta USB, material impermeável e ergonômica.', 179.90, 'Acessórios'),
  ('Relógio Smartwatch Fitness', 'Smartwatch com monitor cardíaco, GPS, resistência à água IP68, e autonomia de 7 dias.', 549.90, 'Acessórios'),
  ('Carteira de Couro Legítimo', 'Carteira slim em couro legítimo com proteção RFID, múltiplos compartimentos e porta cédulas.', 89.90, 'Acessórios'),
  ('Sofá 3 Lugares Cinza', 'Sofá moderno 3 lugares com estrutura em madeira maciça, espuma D33 e revestimento em tecido suede.', 1599.90, 'Casa'),
  ('Panela de Pressão Tramontina 6L', 'Panela de pressão em aço inox com válvula de segurança tripla, tampa removível e fundo difusor.', 229.90, 'Casa'),
  ('Luminária LED de Mesa', 'Luminária LED com braço articulado, 3 temperaturas de cor, intensidade ajustável e porta USB lateral.', 129.90, 'Casa'),
  ('Bicicleta Mountain Bike Aro 29', 'Mountain bike com quadro em alumínio, 21 velocidades Shimano, suspensão dianteira e freios a disco.', 1899.90, 'Esportes'),
  ('Tapete Yoga Antiderrapante', 'Tapete de yoga em PVC ecológico, espessura 6mm, dimensão 183x61cm, alça de transporte inclusa.', 89.90, 'Esportes'),
  ('Garrafa Térmica Inox 1L', 'Garrafa térmica com parede dupla em aço inox, mantém bebidas quentes por 12h e frias por 24h.', 99.90, 'Esportes'),
  ('Kit Reparo para Bicicleta', 'Kit completo com bombinha, câmaras reservas, desmontadores e remendo vulcanizável para emergências.', 39.90, 'Outros'),
  ('Caixa Organizadora Grande', 'Caixa organizadora multiuso em plástico resistente com tampa, capacidade 60L. Ideal para mudanças.', 69.90, 'Outros');
