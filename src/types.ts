/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Producto base con información core
export interface Product {
  id: string;
  nameEs: string;
  nameEn: string;
  descEs: string;
  descEn: string;
  price: string;
  available: boolean;
}

// Especialidad (agrupa productos con mismo tipo dentro de categoría)
export interface Specialty {
  id: string;
  nameEs: string;
  nameEn: string;
  products: Product[];
}

// Categoría principal (bebidas, primeros, etc.)
export interface MenuCategory {
  id: 'bebidas' | 'primeros' | 'principales' | 'postres' | 'espirituosos';
  nameEs: string;
  nameEn: string;
  specialties: Specialty[];
}

// Para compatibilidad con código existente
export interface MenuItem {
  id: string;
  category: 'bebidas' | 'primeros' | 'principales' | 'postres' | 'espirituosos';
  subcategory: string;
  nameEs: string;
  nameEn: string;
  descEs: string;
  descEn: string;
  price: string;
  available: boolean;
}

export interface GalleryItem {
  id: string;
  category: 'local' | 'bebidas' | 'platos' | 'postres';
  imageSrc: string; // Base64 string or URL
}

export interface GeneralInfo {
  phone: string;
  email: string;
  address: string;
  mapUrl: string;
  scheduleEs: string;
  scheduleEn: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  whatsappGroup: string;
}

export interface AppState {
  menuItems: MenuItem[];
  galleryItems: GalleryItem[];
  generalInfo: GeneralInfo;
}
