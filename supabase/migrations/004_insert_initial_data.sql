-- Insert menu items
INSERT INTO menu_items (id, name_es, name_en, description_es, description_en, category, price, is_available, image_url) VALUES
('b-1', 'Limonada natural', 'Fresh lemonade', 'Zumo de limón natural, agua purificada y jarabe de azúcar.', 'Fresh lemon juice, purified water and sugar cane syrup.', 'bebidas', 350, true, null),
('b-2', 'Jugo de frutas (medio litro)', 'Fruit juice (half liter)', 'Jugo recién exprimido de frutas de estación.', 'Freshly squeezed seasonal fruit juice.', 'bebidas', 500, true, null),
('b-3', 'Refrescos enlatados (355ml)', 'Canned soft drinks (355ml)', 'Gran variedad de marcas nacionales e importadas.', 'Wide variety of local and imported brands.', 'bebidas', 400, true, null),
('b-4', 'Agua (500ml)', 'Water (500ml)', 'Agua mineral con o sin gas.', 'Mineral water, still or sparkling.', 'bebidas', 250, true, null),
('b-5', 'Limonada de fresas naturales', 'Fresh strawberry lemonade', 'Limonada artesanal batida con fresas tropicales selectas.', 'Artisan lemonade blended with premium tropical strawberries.', 'bebidas', 600, true, null),
('b-6', 'Malta Importada', 'Imported Malt Beer', 'Bebida oscura a base de malta dulce y refrescante.', 'Sweet and refreshing imported dark malt beverage.', 'bebidas', 480, true, null),
('b-7', 'Cristal (Jarra 500ml)', 'Cristal (Jug 500ml)', 'La preferida de Cuba, fría de barril.', 'Cuba''s favorite, ice-cold on tap.', 'bebidas', 650, true, null),
('b-8', 'Bucanero Max (botella)', 'Bucanero Max (bottle)', 'Sabor robusto con un toque más de malta.', 'Robust flavor with an extra touch of malt.', 'bebidas', 700, true, null),
('b-9', 'Bucanero (botella)', 'Bucanero (bottle)', 'Cerveza fuerte cubana por excelencia.', 'Strong Cuban premium beer.', 'bebidas', 600, true, null),
('b-10', 'Cubetazo (5 botellas)', 'Cubetazo (5 bottles)', 'Balde helado con 5 cervezas nacionales.', 'Ice bucket with 5 local beers.', 'bebidas', 2800, true, null),
('b-11', 'Chelada', 'Chelada', 'Hielo, sal y el toque ácido del limón caribeño.', 'Ice, salt and the tangy kick of Caribbean lime.', 'bebidas', 800, true, null),
('b-12', 'Vampireza', 'Vampireza', 'Mezcla picante con zumo de tomates y aderezos.', 'Spicy mix with tomato juice and seasonings.', 'bebidas', 950, true, null),
('b-13', 'Catedral', 'Catedral', 'Nuestra especialidad con salsa secreta de la casa.', 'Our house specialty made with secret seasonings.', 'bebidas', 1100, true, null),
('b-14', 'Mojito Tradicional', 'Traditional Mojito', 'Ron blanco, hierbabuena, azúcar, limón y soda.', 'White rum, mint leaves, sugar, lime juice and soda.', 'bebidas', 750, true, null),
('b-15', 'Daiquirí Excelso', 'Classic Daiquiri', 'Ron blanco, limón y azúcar frappé en copa helada.', 'White rum, lime and sugar frozen to perfection.', 'bebidas', 750, true, null),
('b-16', 'Cubalibre', 'Cubalibre', 'Ron añejo, refresco de cola y gotas de limón.', 'Aged rum, cola and a splash of fresh lime.', 'bebidas', 700, true, null),
('b-17', 'Piña Colada del Claustro', 'Cloister Piña Colada', 'Crema de piña natural, leche de coco y ron blanco.', 'Fresh pineapple sauce, coconut milk and white rum.', 'bebidas', 900, true, null),
('b-18', 'Margarita Divina', 'Divine Margarita', 'Tequila Olmeca, triple seco, limón fresco y borde salado.', 'Olmeca tequila, triple sec, fresh lime and salted rim.', 'bebidas', 950, true, null),
('p-1', 'Ensalada fresca del jardín', 'Garden fresh salad', 'Variedad de vegetales frescos de estación con aderezo clásico.', 'Assortment of fresh seasonal vegetables with classic dressing.', 'primeros', 1200, true, null),
('p-2', 'Ensalada de atún del puerto', 'Port tuna salad', 'Hojas frescas, atún premium en aceite de oliva, cebolla morada y aceitunas.', 'Fresh leaves, premium tuna in olive oil, red onions and olives.', 'primeros', 1800, true, null),
('p-3', 'Papas fritas de la sacristía', 'Sacristy french fries', 'Crujientes patatas fritas al momento, espolvoreadas con finas hierbas.', 'Crispy freshly-fried potatoes sprinkled with fine herbs.', 'primeros', 1100, true, null),
('p-4', 'Maripositas chinas crujientes', 'Crispy butterfly dumplings', 'Wontons dorados rellenos de carne sabrosa con salsa agridulce.', 'Golden fried wontons stuffed with savory meat served with sweet and sour sauce.', 'primeros', 1400, true, null),
('p-5', 'Bombones de queso y pollo', 'Cheese and chicken bonbons', 'Esferas crujientes rellenas de pechuga de pollo y abundante queso fundido.', 'Crispy spheres stuffed with chicken breast and rich melted cheese.', 'primeros', 1700, true, null),
('p-6', 'Espaguetis alla Boloñesa', 'Spaghetti alla Bolognese', 'Pasta al dente con salsa estofada de res, tomates y queso parmesano.', 'Pasta al dente with rich slow-cooked beef sauce, tomatoes and parmesan.', 'primeros', 1900, true, null),
('p-7', 'Pizza de jamón de la cúpula', 'Dome ham pizza', 'Base fina, salsa de tomates de la huerta, jamón selecto y queso abundante.', 'Thin crust, garden tomato sauce, premium ham and loaded cheese.', 'primeros', 2100, true, null),
('p-8', 'Hamburguesa de La Catedral', 'La Catedral burger', 'Jugosa carne artesanal con jamón, queso, chorizo cubano y ensalada fresca.', 'Juicy handcrafted beef with ham, cheese, Cuban chorizo and fresh salad.', 'primeros', 2300, true, null),
('m-1', 'Paella Marinera de La Catedral', 'La Catedral seafood paella', 'Arroz sazonado cocido con camarones, pescados, langosta y un aroma celestial.', 'Classic seasoned rice slow-cooked with shrimp, fish, lobster and divine aroma.', 'principales', 4500, true, null),
('m-2', 'Langosta real del trono', 'Royal throne lobster', 'Deliciosa cola de langosta preparada a su elección: a la parrilla, enchilada o frita.', 'Delicious lobster tail prepared to your liking: grilled, spicy Creole sauce, or deep fried.', 'principales', 5200, true, null),
('m-3', 'Vaca frita crujiente del altar', 'Crispy altar vaca frita', 'Carne de res deshebrada, frita con bastante cebolla, mojo cítrico y ajo.', 'Shredded beef fried until crispy with onions, garlic and citrus mojo.', 'principales', 2900, true, null),
('m-4', 'Pollo deshuesado del aprendiz (al grill)', 'Apprentice boneless grilled chicken', 'Pechuga deshuesada marinada, marcada a la plancha a fuego vivo.', 'Marinated chicken breast grilled to perfection over high flame.', 'principales', 2500, true, null),
('m-5', 'Ropa vieja del feligrés', 'Parishioner''s ropa vieja', 'Carne deshebrada estofada en salsa tradicional criolla con pimientos.', 'Traditional slowly stewed shredded beef in Creole sauce with bell peppers.', 'principales', 2700, true, null),
('m-6', 'Masas de cerdo fritas del confesionario', 'Confessional fried pork chunks', 'Dados crujientes de cerdo marinados en mojo criollo, fritos y servidos con cebolla.', 'Crispy pork chunks marinated in Creole mojo, fried and topped with onions.', 'principales', 2800, true, null),
('d-1', 'Flan de la abadía', 'Abbey flan', 'Flan clásico de leche condensada bañado en un caramelo oscuro celestial.', 'Classic custard made of sweetened condensed milk with a crown of dark caramel.', 'postres', 900, true, null),
('d-2', 'Copa del bautismo (tres leches)', 'Baptism cup (tres leches)', 'Bizcocho esponjoso sumergido en una rica salsa de tres leches aromáticas.', 'Sponge cake soaked in a sweet sauce of three milks topped with meringue.', 'postres', 1100, true, null),
('d-3', 'Tarta sagrada de chocolate', 'Sacred chocolate tart', 'Biscocho húmedo y denso de chocolate oscuro cubierto con fudge tibio.', 'Moist and rich dark chocolate cake covered with warm fudge topping.', 'postres', 1200, true, null),
('d-4', 'Capuchino de la cúpula', 'Dome cappuccino', 'Café expresso con espuma cremosa de leche y canela espolvoreada.', 'Espresso coffee with silky steamed milk foam and ground cinnamon sprinkle.', 'postres', 600, true, null),
('e-1', 'Chivas Regal 12 años', 'Chivas Regal 12 Years', 'Trago con hielo o puro del legendario escocés mezclado.', 'A standard pour of the legendary blended Scotch whiskey, on the rocks or neat.', 'espirituosos', 1800, true, null),
('e-2', 'Havana Club 7 Años', 'Havana Club 7 Years', 'El rey de los rones cubanos añejos, con notas de tabaco, vainilla y frutas tropicales.', 'The king of aged Cuban rums, with notes of tobacco, vanilla and tropical fruits.', 'espirituosos', 1200, true, null),
('e-3', 'Torres X', 'Torres X', 'Brandy español de renombre envejecido en barricas de roble.', 'Renowned Spanish brandy carefully aged in American oak barrels.', 'espirituosos', 1400, true, null);

-- Insert gallery items
INSERT INTO gallery_items (id, category, image_url) VALUES
('g-local-1', 'local', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600'),
('g-local-2', 'local', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600'),
('g-bebidas-1', 'bebidas', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600'),
('g-bebidas-2', 'bebidas', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=600'),
('g-platos-1', 'platos', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600'),
('g-platos-2', 'platos', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600'),
('g-postres-1', 'postres', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600'),
('g-postres-2', 'postres', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600');

-- Insert general info
INSERT INTO general_info (id, phone, email, address, map_url, schedule_es, schedule_en, whatsapp, instagram, facebook, whatsapp_group, updated_at) VALUES
('default', '+53 7 830 0793', 'catedralrestaurantecuba@gmail.com', 'Calle 8 entre Calzada y 5ta, Vedado, La Habana, Cuba', 'https://www.google.com/maps?q=23.1302190,-82.4032210', 'Desayuno: 8:30 – 11:00 am  ·  Almuerzo & Cena: 12:00 m – 10:00 pm', 'Breakfast: 8:30 – 11:00 am  ·  Lunch & Dinner: 12:00 pm – 10:00 pm', '5378300793', 'lacatedralcuba', 'mirestaurantencuba', 'https://chat.whatsapp.com/BoaqXwjmrjsEPLkzYY3bLI?mode=gi_t', NOW());
