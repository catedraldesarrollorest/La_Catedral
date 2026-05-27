/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem, GalleryItem, GeneralInfo, CoverPage } from './types.js';

export const initialMenuItems: MenuItem[] = [
  // BEBIDAS
  {
    id: 'b-1',
    category: 'bebidas',
    subcategory: 'Sin Alcohol',
    nameEs: 'Limonada natural',
    nameEn: 'Fresh lemonade',
    descEs: 'Zumo de limón natural, agua purificada y jarabe de azúcar.',
    descEn: 'Fresh lemon juice, purified water and sugar cane syrup.',
    price: '350 CUP',
    available: true
  },
  {
    id: 'b-2',
    category: 'bebidas',
    subcategory: 'Sin Alcohol',
    nameEs: 'Jugo de frutas (medio litro)',
    nameEn: 'Fruit juice (half liter)',
    descEs: 'Jugo recién exprimido de frutas de estación.',
    descEn: 'Freshly squeezed seasonal fruit juice.',
    price: '500 CUP',
    available: true
  },
  {
    id: 'b-3',
    category: 'bebidas',
    subcategory: 'Sin Alcohol',
    nameEs: 'Refrescos enlatados (355ml)',
    nameEn: 'Canned soft drinks (355ml)',
    descEs: 'Gran variedad de marcas nacionales e importadas.',
    descEn: 'Wide variety of local and imported brands.',
    price: '400 CUP',
    available: true
  },
  {
    id: 'b-4',
    category: 'bebidas',
    subcategory: 'Sin Alcohol',
    nameEs: 'Agua (500ml)',
    nameEn: 'Water (500ml)',
    descEs: 'Agua mineral con o sin gas.',
    descEn: 'Mineral water, still or sparkling.',
    price: '250 CUP',
    available: true
  },
  {
    id: 'b-5',
    category: 'bebidas',
    subcategory: 'Sin Alcohol',
    nameEs: 'Limonada de fresas naturales',
    nameEn: 'Fresh strawberry lemonade',
    descEs: 'Limonada artesanal batida con fresas tropicales selectas.',
    descEn: 'Artisan lemonade blended with premium tropical strawberries.',
    price: '600 CUP',
    available: true
  },
  {
    id: 'b-6',
    category: 'bebidas',
    subcategory: 'Sin Alcohol',
    nameEs: 'Malta Importada',
    nameEn: 'Imported Malt Beer',
    descEs: 'Bebida oscura a base de malta dulce y refrescante.',
    descEn: 'Sweet and refreshing imported dark malt beverage.',
    price: '480 CUP',
    available: true
  },
  // CERVEZAS
  {
    id: 'b-7',
    category: 'bebidas',
    subcategory: 'Cervezas',
    nameEs: 'Cristal (Jarra 500ml)',
    nameEn: 'Cristal (Jug 500ml)',
    descEs: 'La preferida de Cuba, fría de barril.',
    descEn: 'Cuba\'s favorite, ice-cold on tap.',
    price: '650 CUP',
    available: true
  },
  {
    id: 'b-8',
    category: 'bebidas',
    subcategory: 'Cervezas',
    nameEs: 'Bucanero Max (botella)',
    nameEn: 'Bucanero Max (bottle)',
    descEs: 'Sabor robusto con un toque más de malta.',
    descEn: 'Robust flavor with an extra touch of malt.',
    price: '700 CUP',
    available: true
  },
  {
    id: 'b-9',
    category: 'bebidas',
    subcategory: 'Cervezas',
    nameEs: 'Bucanero (botella)',
    nameEn: 'Bucanero (bottle)',
    descEs: 'Cerveza fuerte cubana por excelencia.',
    descEn: 'Strong Cuban premium beer.',
    price: '600 CUP',
    available: true
  },
  {
    id: 'b-10',
    category: 'bebidas',
    subcategory: 'Cervezas',
    nameEs: 'Cubetazo (5 botellas)',
    nameEn: 'Cubetazo (5 bottles)',
    descEs: 'Balde helado con 5 cervezas nacionales.',
    descEn: 'Ice bucket with 5 local beers.',
    price: '2800 CUP',
    available: true
  },
  // MICHELADAS
  {
    id: 'b-11',
    category: 'bebidas',
    subcategory: 'Micheladas',
    nameEs: 'Chelada',
    nameEn: 'Chelada',
    descEs: 'Hielo, sal y el toque ácido del limón caribeño.',
    descEn: 'Ice, salt and the tangy kick of Caribbean lime.',
    price: '800 CUP',
    available: true
  },
  {
    id: 'b-12',
    category: 'bebidas',
    subcategory: 'Micheladas',
    nameEs: 'Vampireza',
    nameEn: 'Vampireza',
    descEs: 'Mezcla picante con zumo de tomates y aderezos.',
    descEn: 'Spicy mix with tomato juice and seasonings.',
    price: '950 CUP',
    available: true
  },
  {
    id: 'b-13',
    category: 'bebidas',
    subcategory: 'Micheladas',
    nameEs: 'Catedral',
    nameEn: 'Catedral',
    descEs: 'Nuestra especialidad con salsa secreta de la casa.',
    descEn: 'Our house specialty made with secret seasonings.',
    price: '1100 CUP',
    available: true
  },
  // COCTELES
  {
    id: 'b-14',
    category: 'bebidas',
    subcategory: 'Cocteles',
    nameEs: 'Mojito Tradicional',
    nameEn: 'Traditional Mojito',
    descEs: 'Ron blanco, hierbabuena, azúcar, limón y soda.',
    descEn: 'White rum, mint leaves, sugar, lime juice and soda.',
    price: '750 CUP',
    available: true
  },
  {
    id: 'b-15',
    category: 'bebidas',
    subcategory: 'Cocteles',
    nameEs: 'Daiquirí Excelso',
    nameEn: 'Classic Daiquiri',
    descEs: 'Ron blanco, limón y azúcar frappé en copa helada.',
    descEn: 'White rum, lime and sugar frozen to perfection.',
    price: '750 CUP',
    available: true
  },
  {
    id: 'b-16',
    category: 'bebidas',
    subcategory: 'Cocteles',
    nameEs: 'Cubalibre',
    nameEn: 'Cubalibre',
    descEs: 'Ron añejo, refresco de cola y gotas de limón.',
    descEn: 'Aged rum, cola and a splash of fresh lime.',
    price: '700 CUP',
    available: true
  },
  {
    id: 'b-17',
    category: 'bebidas',
    subcategory: 'Cocteles',
    nameEs: 'Piña Colada del Claustro',
    nameEn: 'Cloister Piña Colada',
    descEs: 'Crema de piña natural, leche de coco y ron blanco.',
    descEn: 'Fresh pineapple sauce, coconut milk and white rum.',
    price: '900 CUP',
    available: true
  },
  {
    id: 'b-18',
    category: 'bebidas',
    subcategory: 'Cocteles',
    nameEs: 'Margarita Divina',
    nameEn: 'Divine Margarita',
    descEs: 'Tequila Olmeca, triple seco, limón fresco y borde salado.',
    descEn: 'Olmeca tequila, triple sec, fresh lime and salted rim.',
    price: '950 CUP',
    available: true
  },

  // PRIMEROS - ENSALADAS
  {
    id: 'p-1',
    category: 'primeros',
    subcategory: 'Jardines Frescos — Ensaladas',
    nameEs: 'Ensalada fresca del jardín',
    nameEn: 'Garden fresh salad',
    descEs: 'Variedad de vegetales frescos de estación con aderezo clásico.',
    descEn: 'Assortment of fresh seasonal vegetables with classic dressing.',
    price: '1200 CUP',
    available: true
  },
  {
    id: 'p-2',
    category: 'primeros',
    subcategory: 'Jardines Frescos — Ensaladas',
    nameEs: 'Ensalada de atún del puerto',
    nameEn: 'Port tuna salad',
    descEs: 'Hojas frescas, atún premium en aceite de oliva, cebolla morada y aceitunas.',
    descEn: 'Fresh leaves, premium tuna in olive oil, red onions and olives.',
    price: '1800 CUP',
    available: true
  },
  {
    id: 'p-3',
    category: 'primeros',
    subcategory: 'Tesoros para Compartir — Entrantes',
    nameEs: 'Papas fritas de la sacristía',
    nameEn: 'Sacristy french fries',
    descEs: 'Crujientes patatas fritas al momento, espolvoreadas con finas hierbas.',
    descEn: 'Crispy freshly-fried potatoes sprinkled with fine herbs.',
    price: '1100 CUP',
    available: true
  },
  {
    id: 'p-4',
    category: 'primeros',
    subcategory: 'Tesoros para Compartir — Entrantes',
    nameEs: 'Maripositas chinas crujientes',
    nameEn: 'Crispy butterfly dumplings',
    descEs: 'Wontons dorados rellenos de carne sabrosa con salsa agridulce.',
    descEn: 'Golden fried wontons stuffed with savory meat served with sweet and sour sauce.',
    price: '1400 CUP',
    available: true
  },
  {
    id: 'p-5',
    category: 'primeros',
    subcategory: 'Tesoros para Compartir — Entrantes',
    nameEs: 'Bombones de queso y pollo',
    nameEn: 'Cheese and chicken bonbons',
    descEs: 'Esferas crujientes rellenas de pechuga de pollo y abundante queso fundido.',
    descEn: 'Crispy spheres stuffed with chicken breast and rich melted cheese.',
    price: '1700 CUP',
    available: true
  },
  {
    id: 'p-6',
    category: 'primeros',
    subcategory: 'Legado Italiano — Pastas',
    nameEs: 'Espaguetis alla Boloñesa',
    nameEn: 'Spaghetti alla Bolognese',
    descEs: 'Pasta al dente con salsa estofada de res, tomates y queso parmesano.',
    descEn: 'Pasta al dente with rich slow-cooked beef sauce, tomatoes and parmesan.',
    price: '1900 CUP',
    available: true
  },
  {
    id: 'p-7',
    category: 'primeros',
    subcategory: 'Creaciones de la Cúpula — Pizzas',
    nameEs: 'Pizza de jamón de la cúpula',
    nameEn: 'Dome ham pizza',
    descEs: 'Base fina, salsa de tomates de la huerta, jamón selecto y queso abundante.',
    descEn: 'Thin crust, garden tomato sauce, premium ham and loaded cheese.',
    price: '2100 CUP',
    available: true
  },
  {
    id: 'p-8',
    category: 'primeros',
    subcategory: 'Placeres Terrenales — Hamburguesas',
    nameEs: 'Hamburguesa de La Catedral',
    nameEn: 'La Catedral burger',
    descEs: 'Jugosa carne artesanal con jamón, queso, chorizo cubano y ensalada fresca.',
    descEn: 'Juicy handcrafted beef with ham, cheese, Cuban chorizo and fresh salad.',
    price: '2300 CUP',
    available: true
  },

  // PRINCIPALES
  {
    id: 'm-1',
    category: 'principales',
    subcategory: 'Los Altares de la Casa — Chef Sugiere',
    nameEs: 'Paella Marinera de La Catedral',
    nameEn: 'La Catedral seafood paella',
    descEs: 'Arroz sazonado cocido con camarones, pescados, langosta y un aroma celestial.',
    descEn: 'Classic seasoned rice slow-cooked with shrimp, fish, lobster and divine aroma.',
    price: '4500 CUP',
    available: true
  },
  {
    id: 'm-2',
    category: 'principales',
    subcategory: 'Los Altares de la Casa — Chef Sugiere',
    nameEs: 'Langosta real del trono',
    nameEn: 'Royal throne lobster',
    descEs: 'Deliciosa cola de langosta preparada a su elección: a la parrilla, enchilada o frita.',
    descEn: 'Delicious lobster tail prepared to your liking: grilled, spicy Creole sauce, or deep fried.',
    price: '5200 CUP',
    available: true
  },
  {
    id: 'm-3',
    category: 'principales',
    subcategory: 'Sabores Tradicionales',
    nameEs: 'Vaca frita crujiente del altar',
    nameEn: 'Crispy altar vaca frita',
    descEs: 'Carne de res deshebrada, frita con bastante cebolla, mojo cítrico y ajo.',
    descEn: 'Shredded beef fried until crispy with onions, garlic and citrus mojo.',
    price: '2900 CUP',
    available: true
  },
  {
    id: 'm-4',
    category: 'principales',
    subcategory: 'Sabores Tradicionales',
    nameEs: 'Pollo deshuesado del aprendiz (al grill)',
    nameEn: 'Apprentice boneless grilled chicken',
    descEs: 'Pechuga deshuesada marinada, marcada a la plancha a fuego vivo.',
    descEn: 'Marinated chicken breast grilled to perfection over high flame.',
    price: '2500 CUP',
    available: true
  },
  {
    id: 'm-5',
    category: 'principales',
    subcategory: 'Lo Más Vendido',
    nameEs: 'Ropa vieja del feligrés',
    nameEn: 'Parishioner\'s ropa vieja',
    descEs: 'Carne deshebrada estofada en salsa tradicional criolla con pimientos.',
    descEn: 'Traditional slowly stewed shredded beef in Creole sauce with bell peppers.',
    price: '2700 CUP',
    available: true
  },
  {
    id: 'm-6',
    category: 'principales',
    subcategory: 'Lo Más Vendido',
    nameEs: 'Masas de cerdo fritas del confesionario',
    nameEn: 'Confessional fried pork chunks',
    descEs: 'Dados crujientes de cerdo marinados en mojo criollo, fritos y servidos con cebolla.',
    descEn: 'Crispy pork chunks marinated in Creole mojo, fried and topped with onions.',
    price: '2800 CUP',
    available: true
  },

  // POSTRES
  {
    id: 'd-1',
    category: 'postres',
    subcategory: 'Pastelería',
    nameEs: 'Flan de la abadía',
    nameEn: 'Abbey flan',
    descEs: 'Flan clásico de leche condensada bañado en un caramelo oscuro celestial.',
    descEn: 'Classic custard made of sweetened condensed milk with a crown of dark caramel.',
    price: '900 CUP',
    available: true
  },
  {
    id: 'd-2',
    category: 'postres',
    subcategory: 'Pastelería',
    nameEs: 'Copa del bautismo (tres leches)',
    nameEn: 'Baptism cup (tres leches)',
    descEs: 'Bizcocho esponjoso sumergido en una rica salsa de tres leches aromáticas.',
    descEn: 'Sponge cake soaked in a sweet sauce of three milks topped with meringue.',
    price: '1100 CUP',
    available: true
  },
  {
    id: 'd-3',
    category: 'postres',
    subcategory: 'Pastelería',
    nameEs: 'Tarta sagrada de chocolate',
    nameEn: 'Sacred chocolate tart',
    descEs: 'Biscocho húmedo y denso de chocolate oscuro cubierto con fudge tibio.',
    descEn: 'Moist and rich dark chocolate cake covered with warm fudge topping.',
    price: '1200 CUP',
    available: true
  },
  {
    id: 'd-4',
    category: 'postres',
    subcategory: 'Infusiones',
    nameEs: 'Capuchino de la cúpula',
    nameEn: 'Dome cappuccino',
    descEs: 'Café expresso con espuma cremosa de leche y canela espolvoreada.',
    descEn: 'Espresso coffee with silky steamed milk foam and ground cinnamon sprinkle.',
    price: '600 CUP',
    available: true
  },

  // ESPIRITUOSOS
  {
    id: 'e-1',
    category: 'espirituosos',
    subcategory: 'Whisky',
    nameEs: 'Chivas Regal 12 años',
    nameEn: 'Chivas Regal 12 Years',
    descEs: 'Trago con hielo o puro del legendario escocés mezclado.',
    descEn: 'A standard pour of the legendary blended Scotch whiskey, on the rocks or neat.',
    price: '1800 CUP',
    available: true
  },
  {
    id: 'e-2',
    category: 'espirituosos',
    subcategory: 'Ron',
    nameEs: 'Havana Club 7 Años',
    nameEn: 'Havana Club 7 Years',
    descEs: 'El rey de los rones cubanos añejos, con notas de tabaco, vainilla y frutas tropicales.',
    descEn: 'The king of aged Cuban rums, with notes of tobacco, vanilla and tropical fruits.',
    price: '1200 CUP',
    available: true
  },
  {
    id: 'e-3',
    category: 'espirituosos',
    subcategory: 'Brandys',
    nameEs: 'Torres X',
    nameEn: 'Torres X',
    descEs: 'Brandy español de renombre envejecido en barricas de roble.',
    descEn: 'Renowned Spanish brandy carefully aged in American oak barrels.',
    price: '1400 CUP',
    available: true
  }
];

export const initialGalleryItems: GalleryItem[] = [
  // LOCAL
  {
    id: 'g-local-1',
    category: 'local',
    imageSrc: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'g-local-2',
    category: 'local',
    imageSrc: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600'
  },
  // BEBIDAS
  {
    id: 'g-bebidas-1',
    category: 'bebidas',
    imageSrc: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'g-bebidas-2',
    category: 'bebidas',
    imageSrc: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=600'
  },
  // PLATOS
  {
    id: 'g-platos-1',
    category: 'platos',
    imageSrc: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'g-platos-2',
    category: 'platos',
    imageSrc: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600'
  },
  // POSTRES
  {
    id: 'g-postres-1',
    category: 'postres',
    imageSrc: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'g-postres-2',
    category: 'postres',
    imageSrc: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600'
  }
];

export const initialGeneralInfo: GeneralInfo = {
  phone: '+53 7 830 0793',
  email: 'catedralrestaurantecuba@gmail.com',
  address: 'Calle 8 entre Calzada y 5ta, Vedado, La Habana, Cuba',
  mapUrl: 'https://www.google.com/maps?q=23.1302190,-82.4032210',
  scheduleEs: 'Desayuno: 8:30 – 11:00 am  ·  Almuerzo & Cena: 12:00 m – 10:00 pm',
  scheduleEn: 'Breakfast: 8:30 – 11:00 am  ·  Lunch & Dinner: 12:00 pm – 10:00 pm',
  whatsapp: '5378300793',
  instagram: 'lacatedralcuba',
  facebook: 'mirestaurantencuba',
  whatsappGroup: 'https://chat.whatsapp.com/BoaqXwjmrjsEPLkzYY3bLI?mode=gi_t'
};

export const initialCoverPage: CoverPage = {
  imageSrc: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200',
  imageHeight: 250,
  titleEs: 'La Catedral',
  titleEn: 'La Catedral',
  subtitleEs: 'Restaurante Cubano Auténtico',
  subtitleEn: 'Authentic Cuban Restaurant',
  galleryPhoto1: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400',
  galleryPhoto2: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400',
  galleryPhoto3: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400'
};
