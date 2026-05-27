/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  category: 'bebidas' | 'primeros' | 'principales' | 'postres' | 'espirituosos';
  subcategory: string; // e.g. "Sin Alcohol", "Cervezas", "Tesoros para Compartir — Entrantes"
  nameEs: string;
  nameEn: string;
  descEs: string;
  descEn: string;
  price: string; // String to support multiple currencies / formats (e.g. "300 CUP", "$5.00 USD")
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

export interface CoverPage {
  imageSrc: string;
  imageHeight: number;
  titleEs: string;
  titleEn: string;
  subtitleEs: string;
  subtitleEn: string;
  galleryPhoto1: string; // Base64 or URL for first gallery photo
  galleryPhoto2: string; // Base64 or URL for second gallery photo
  galleryPhoto3: string; // Base64 or URL for third gallery photo
}

export interface AppState {
  menuItems: MenuItem[];
  galleryItems: GalleryItem[];
  generalInfo: GeneralInfo;
  coverPage: CoverPage;
}
