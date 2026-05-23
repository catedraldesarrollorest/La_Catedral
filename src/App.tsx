/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, Trash2, Edit, Phone, Mail, MapPin, 
  Clock, Check, X, Shield, RefreshCw, Upload, 
  Save, Eye, EyeOff, MessageSquare, ChevronRight, 
  ExternalLink, AlertCircle, Image as ImageIcon, ArrowLeft,
  ChevronDown, Settings, FileText, Printer, ArrowUp, ArrowDown, Layers
} from 'lucide-react';
import { MenuItem, GalleryItem, GeneralInfo, AppState } from './types.js';
import { initialMenuItems, initialGalleryItems, initialGeneralInfo } from './initialData.js';

export interface MenuPageConfig {
  id: string;
  type: 'cover' | 'menu';
  coverTitle: string;
  coverSubtitle: string;
  backgroundImage: string;
  bgOpacity: number;
  categories: Array<'bebidas' | 'primeros' | 'principales' | 'postres' | 'espirituosos'>;
  columns: 1 | 2;
  fontSize: 'sm' | 'base' | 'lg';
  hideDescriptions: boolean;
}

export default function App() {
  // --- STATE ---
  const [state, setState] = useState<AppState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [isLocalMode, setIsLocalMode] = useState<boolean>(false);
  
  // Client Tabs
  const [activeGalleryTab, setActiveGalleryTab] = useState<'local' | 'bebidas' | 'platos' | 'postres'>('local');
  const [activeMenuTab, setActiveMenuTab] = useState<'bebidas' | 'primeros' | 'principales' | 'postres' | 'espirituosos'>('bebidas');

  // Admin Panel Auth
  const [adminOpen, setAdminOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const DEFAULT_PIN = '1059';

  // Admin Dashboard States
  const [adminCategory, setAdminCategory] = useState<'menu' | 'galeria' | 'general' | 'pdf'>('menu');
  const [pdfPages, setPdfPages] = useState<MenuPageConfig[]>([
    {
      id: 'page-1',
      type: 'cover',
      coverTitle: 'LA CATEDRAL',
      coverSubtitle: 'RESTAURANTE & BAR',
      backgroundImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop',
      bgOpacity: 55,
      categories: [],
      columns: 1,
      fontSize: 'base',
      hideDescriptions: false
    },
    {
      id: 'page-2',
      type: 'menu',
      coverTitle: 'NUESTRA COCINA',
      coverSubtitle: 'Entrantes & Platos Principales',
      backgroundImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
      bgOpacity: 15,
      categories: ['primeros', 'principales'],
      columns: 2,
      fontSize: 'sm',
      hideDescriptions: false
    },
    {
      id: 'page-3',
      type: 'menu',
      coverTitle: 'BODEGA & BAR',
      coverSubtitle: 'Bebidas de Selección',
      backgroundImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop',
      bgOpacity: 15,
      categories: ['bebidas', 'espirituosos'],
      columns: 2,
      fontSize: 'sm',
      hideDescriptions: false
    },
    {
      id: 'page-4',
      type: 'menu',
      coverTitle: 'DULCES TENTACIONES',
      coverSubtitle: 'Postres Artesanales',
      backgroundImage: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1200&auto=format&fit=crop',
      bgOpacity: 12,
      categories: ['postres'],
      columns: 1,
      fontSize: 'base',
      hideDescriptions: false
    }
  ]);
  const [selectedPdfPageId, setSelectedPdfPageId] = useState<string>('page-1');
  const selectedPage = pdfPages.find(p => p.id === selectedPdfPageId) || pdfPages[0];
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [toastMessage, setToastMessage] = useState<string>('');

  // Menu management inside Admin
  const [menuFilter, setMenuFilter] = useState<string>('');
  const [menuEditCategory, setMenuEditCategory] = useState<'all' | 'bebidas' | 'primeros' | 'principales' | 'postres' | 'espirituosos'>('all');
  const [priceMultiplier, setPriceMultiplier] = useState<number>(1);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // General setting inputs (temp until saved)
  const [editedInfo, setEditedInfo] = useState<GeneralInfo | null>(null);

  // --- PDF Page Mutation Handlers ---
  const movePageUp = (index: number) => {
    if (index === 0) return;
    const newPages = [...pdfPages];
    const temp = newPages[index];
    newPages[index] = newPages[index - 1];
    newPages[index - 1] = temp;
    setPdfPages(newPages);
  };

  const movePageDown = (index: number) => {
    if (index === pdfPages.length - 1) return;
    const newPages = [...pdfPages];
    const temp = newPages[index];
    newPages[index] = newPages[index + 1];
    newPages[index + 1] = temp;
    setPdfPages(newPages);
  };

  const deletePage = (id: string) => {
    if (pdfPages.length <= 1) {
      alert('Debe conservar al menos una página en el documento.');
      return;
    }
    const newPages = pdfPages.filter(p => p.id !== id);
    setPdfPages(newPages);
    if (selectedPdfPageId === id) {
      setSelectedPdfPageId(newPages[0].id);
    }
  };

  const addPage = () => {
    const newId = `page-${Date.now()}`;
    const newPage: MenuPageConfig = {
      id: newId,
      type: 'menu',
      coverTitle: 'NUEVA SECCIÓN',
      coverSubtitle: 'Escribe una descripción breve',
      backgroundImage: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200&auto=format&fit=crop',
      bgOpacity: 12,
      categories: ['principales'],
      columns: 1,
      fontSize: 'base',
      hideDescriptions: false
    };
    setPdfPages([...pdfPages, newPage]);
    setSelectedPdfPageId(newId);
  };

  const updateSelectedPage = (fields: Partial<MenuPageConfig>) => {
    setPdfPages(pdfPages.map(p => p.id === selectedPdfPageId ? { ...p, ...fields } : p));
  };

  // Image upload helper reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingForCategory, setUploadingForCategory] = useState<'local' | 'bebidas' | 'platos' | 'postres' | null>(null);

  // --- FETCH & SAVE ON LIVE VPS BACKEND ---
  useEffect(() => {
    fetchState();

    // Check for secret hashtag to trigger administration backoffice invisibly
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setAdminOpen(true);
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const fetchState = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/state');
      if (!response.ok) {
        throw new Error('API returned non-ok response.');
      }
      const data: AppState = await response.json();
      setState(data);
      setEditedInfo(data.generalInfo);
      setError(null);
      setIsLocalMode(false);
    } catch (err: any) {
      console.warn('Backend API not available, falling back to LocalStorage Mode.', err);
      setIsLocalMode(true);
      
      // Attempt to load from local storage
      const localDataStr = localStorage.getItem('catedral_rest_state');
      if (localDataStr) {
        try {
          const localData: AppState = JSON.parse(localDataStr);
          setState(localData);
          setEditedInfo(localData.generalInfo);
          setError(null);
          return;
        } catch (parseErr) {
          console.error('Error parsing localStorage state', parseErr);
        }
      }
      
      // Fallback to initial default data
      const defaultState: AppState = {
        menuItems: initialMenuItems,
        galleryItems: initialGalleryItems,
        generalInfo: initialGeneralInfo
      };
      setState(defaultState);
      setEditedInfo(initialGeneralInfo);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const saveStateToServer = async (updatedState: AppState, message: string = 'Cambios guardados con éxito') => {
    setSaveStatus('saving');
    
    // Always persist to localStorage for local/hybrid support
    localStorage.setItem('catedral_rest_state', JSON.stringify(updatedState));

    if (isLocalMode) {
      setTimeout(() => {
        setState(updatedState);
        setSaveStatus('success');
        showToast(message + ' (Guardado en este navegador)');
      }, 300);
      return;
    }

    try {
      const response = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedState)
      });
      if (!response.ok) {
        throw new Error('Error al escribir en data.json');
      }
      const resData = await response.json();
      setState(resData.state);
      setSaveStatus('success');
      showToast(message);
    } catch (err) {
      console.error('Failed to save to server, falling back to local state save', err);
      setState(updatedState);
      setSaveStatus('success');
      showToast(message + ' (Guardado localmente)');
    }
  };

  const resetStateToDefault = async () => {
    if (!window.confirm('¿Está seguro de querer restablecer todos los productos, fotos de ejemplo y precios de fábrica? Esta acción no se puede deshacer.')) {
      return;
    }
    setSaveStatus('saving');
    
    const defaultState: AppState = {
      menuItems: initialMenuItems,
      galleryItems: initialGalleryItems,
      generalInfo: initialGeneralInfo
    };

    localStorage.setItem('catedral_rest_state', JSON.stringify(defaultState));

    if (isLocalMode) {
      setTimeout(() => {
        setState(defaultState);
        setEditedInfo(initialGeneralInfo);
        setSaveStatus('success');
        showToast('Se han reestablecido los datos originales del restaurante (local).');
        setIsAuthenticated(false);
        setAdminOpen(false);
      }, 300);
      return;
    }

    try {
      const response = await fetch('/api/state/reset', { method: 'POST' });
      const resData = await response.json();
      setState(resData.state);
      setEditedInfo(resData.state.generalInfo);
      setSaveStatus('success');
      showToast('Se han reestablecido los datos originales del restaurante.');
      setIsAuthenticated(false);
      setAdminOpen(false);
    } catch (err) {
      setState(defaultState);
      setEditedInfo(initialGeneralInfo);
      setSaveStatus('success');
      showToast('Se han reestablecido los datos del restaurante (local).');
      setIsAuthenticated(false);
      setAdminOpen(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // --- ADMIN AUTH HANDLING ---
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === DEFAULT_PIN) {
      setIsAuthenticated(true);
      setPinError(null);
      setPinInput('');
    } else {
      setPinError('PIN incorrecto. Inténtelo de nuevo.');
    }
  };

  // --- MENU ITEM OPERATIONS ----
  const handleSaveMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state || !editingItem) return;

    let updatedMenuItems = [...state.menuItems];
    
    if (isAddingNew) {
      // Add new
      updatedMenuItems.unshift(editingItem);
    } else {
      // Edit existing
      updatedMenuItems = updatedMenuItems.map(item => 
        item.id === editingItem.id ? editingItem : item
      );
    }

    const updatedState = { ...state, menuItems: updatedMenuItems };
    saveStateToServer(updatedState, isAddingNew ? '¡Nuevo plato añadido exitosamente!' : '¡Plato actualizado!');
    setEditingItem(null);
    setIsAddingNew(false);
  };

  const handleDeleteMenuItem = (id: string, name: string) => {
    if (!state) return;
    if (!window.confirm(`¿Está seguro de querer eliminar "${name}" del menú?`)) return;

    const updatedMenuItems = state.menuItems.filter(item => item.id !== id);
    const updatedState = { ...state, menuItems: updatedMenuItems };
    saveStateToServer(updatedState, 'Producto eliminado de la carta.');
    if (editingItem?.id === id) {
      setEditingItem(null);
    }
  };

  const handleToggleAvailability = (id: string) => {
    try {
      if (!state) {
        console.warn('State is null/undefined in handleToggleAvailability');
        return;
      }
      const updatedMenuItems = state.menuItems.map(item => {
        if (item.id === id) {
          const nextVal = !item.available;
          showToast(`${item.nameEs} ahora está ${nextVal ? 'Disponible' : 'Agotado'}`);
          return { ...item, available: nextVal };
        }
        return item;
      });
      const updatedState = { ...state, menuItems: updatedMenuItems };
      saveStateToServer(updatedState, 'Disponibilidad actualizada.');
    } catch (err) {
      console.error('Error in handleToggleAvailability:', err);
      showToast('Error al cambiar disponibilidad');
    }
  };

  const applyPriceMultiplier = (multiplier: number) => {
    if (!state || multiplier <= 0) return;

    const updatedMenuItems = state.menuItems.map(item => {
      const categoryMatch = menuEditCategory === 'all' || item.category === menuEditCategory;
      if (categoryMatch) {
        const currentPrice = parseFloat(item.price.toString());
        const newPrice = Math.round(currentPrice * multiplier * 100) / 100;
        return { ...item, price: newPrice.toString() };
      }
      return item;
    });

    const updatedState = { ...state, menuItems: updatedMenuItems };
    const categoryLabel = menuEditCategory === 'all' ? 'todo el menú' : `${menuEditCategory}`;
    saveStateToServer(updatedState, `Precios actualizados para ${categoryLabel} (${multiplier.toFixed(2)}x)`);
    setPriceMultiplier(1);
  };

  const initiateAddNewItem = () => {
    const newItem: MenuItem = {
      id: 'item-' + Date.now().toString(),
      category: activeMenuTab,
      subcategory: activeMenuTab === 'bebidas' ? 'Sin Alcohol' : 'Sabores Tradicionales',
      nameEs: '',
      nameEn: '',
      descEs: '',
      descEn: '',
      price: '$5.00 USD o CUP equivalente',
      available: true
    };
    setEditingItem(newItem);
    setIsAddingNew(true);
  };

  // --- PHOTO ARCHITECTURE WITH CANVAS COMPRESSION ---
  const handlePhotoClickAndUpload = (category: 'local' | 'bebidas' | 'platos' | 'postres') => {
    setUploadingForCategory(category);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !uploadingForCategory || !state) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target?.result) return;
      const originalBase64 = event.target.result as string;

      // Let's compress the image using standard canvas technique to ensure the JSON database isn't bloated
      const img = new Image();
      img.src = originalBase64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimension 800px
        const MAX_SIZE = 800;
        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress carefully as jpeg
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

          // Insert into dynamic gallery state
          const newGalleryItem: GalleryItem = {
            id: 'g-img-' + Date.now().toString(),
            category: uploadingForCategory,
            imageSrc: compressedBase64
          };

          // Limit count per category to maintain high-end performance
          const MAX_PER_CAT = uploadingForCategory === 'local' ? 6 : 5;
          const otherCategories = state.galleryItems.filter(item => item.category !== uploadingForCategory);
          const currentCatItems = state.galleryItems.filter(item => item.category === uploadingForCategory);
          
          let updatedCatItems = [...currentCatItems, newGalleryItem];
          if (updatedCatItems.length > MAX_PER_CAT) {
            updatedCatItems = updatedCatItems.slice(updatedCatItems.length - MAX_PER_CAT);
          }

          const updatedState = {
            ...state,
            galleryItems: [...otherCategories, ...updatedCatItems]
          };

          saveStateToServer(updatedState, '¡Imagen subida y optimizada exitosamente!');
        }
      };
    };

    reader.readAsDataURL(file);
    // Reset file input value to allow uploading same file again
    e.target.value = '';
    setUploadingForCategory(null);
  };

  const handleDeletePhoto = (id: string, category: string) => {
    if (!state) return;
    if (!window.confirm('¿Está seguro de querer eliminar esta fotografía de la galería?')) return;

    const updatedGallery = state.galleryItems.filter(item => item.id !== id);
    const updatedState = { ...state, galleryItems: updatedGallery };
    saveStateToServer(updatedState, 'Fotografía eliminada de la galería.');
  };

  // --- GENERAL VALUES UPDATE ---
  const handleSaveGeneralInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state || !editedInfo) return;

    const updatedState = { ...state, generalInfo: editedInfo };
    saveStateToServer(updatedState, 'Información general actualizada.');
  };

  // Organize menu items inside category by subcategory
  const getSubcategories = (cat: MenuItem['category']): string[] => {
    if (!state) return [];
    const filtered = state.menuItems.filter(item => item.category === cat);
    return Array.from(new Set(filtered.map(item => item.subcategory)));
  };

  // Get items by subcategory
  const getMenuItemsBySubcategory = (cat: MenuItem['category'], sub: string) => {
    if (!state) return [];
    return state.menuItems.filter(item => item.category === cat && item.subcategory === sub);
  };

  const getFilteredItemsForAdmin = () => {
    if (!state) return [];
    return state.menuItems.filter(item => {
      const matchCat = menuEditCategory === 'all' || item.category === menuEditCategory;
      const searchLower = menuFilter.toLowerCase();
      const matchSearch = item.nameEs.toLowerCase().includes(searchLower) || 
                          item.nameEn.toLowerCase().includes(searchLower) ||
                          item.subcategory.toLowerCase().includes(searchLower);
      return matchCat && matchSearch;
    });
  };

  return (
    <div id="app_root" className="min-h-screen flex flex-col bg-editorial-cream text-editorial-dark selection:bg-editorial-red/10 selection:text-editorial-red">
      
      {/* Dynamic Saving Notification Status */}
      {toastMessage && (
        <div id="status_toast" className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-editorial-dark text-white text-xs tracking-wider uppercase py-3 px-6 shadow-xl border border-white/10 animate-fade-in">
          {saveStatus === 'saving' ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-stone-400" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* FIXED LANGUAGE BAR */}
      <header id="top_language_bar" className="fixed top-0 left-0 right-0 z-50 bg-editorial-dark text-white h-10 px-6 sm:px-12 flex justify-between items-center text-[10px] sm:text-xs tracking-[0.25em] font-cinzel font-semibold">
        <span className="opacity-65 truncate max-w-[50vw]">LA CATEDRAL · VEDADO · LA HABANA</span>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setLang('es')} 
            className={`cursor-pointer px-3 py-1 transition-all ${lang === 'es' ? 'bg-editorial-red text-white' : 'text-stone-400 hover:text-white'}`}
          >
            ES
          </button>
          <div className="h-4 w-[1px] bg-stone-700 mx-1"></div>
          <button 
            onClick={() => setLang('en')} 
            className={`cursor-pointer px-3 py-1 transition-all ${lang === 'en' ? 'bg-editorial-red text-white' : 'text-stone-400 hover:text-white'}`}
          >
            EN
          </button>
        </div>
      </header>

      {/* HEADER / NAVIGATION */}
      <nav id="navbar" className="fixed top-10 left-0 right-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-editorial-dark/10 h-16 px-6 sm:px-12 flex justify-between items-center">
        {/* Mobile Left Spacer is now a discreet, secret button that opens the backoffice */}
        <button 
          onClick={() => setAdminOpen(true)}
          className="block md:hidden text-[11px] font-cinzel text-stone-400 font-bold hover:text-editorial-red active:scale-95 transition-all bg-transparent border-none outline-none cursor-pointer p-1"
          title="Ver"
        >
          ✛
        </button>

        {/* Desktop Left Nav Links */}
        <div className="hidden md:flex gap-8">
          <a href="#nosotros" className="text-[10px] uppercase tracking-[0.2em] font-medium hover:text-editorial-red transition-all">
            {lang === 'es' ? 'Nosotros' : 'About Us'}
          </a>
          <a href="#galeria" className="text-[10px] uppercase tracking-[0.2em] font-medium hover:text-editorial-red transition-all">
            {lang === 'es' ? 'Galería' : 'Gallery'}
          </a>
        </div>

        {/* Elegant Center Emblem Logo (Secret Trigger) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="font-cinzel text-sm sm:text-lg font-bold tracking-[0.25em] flex items-center gap-2">
            {/* The templar cross symbol opens the administration portal when clicked */}
            <button 
              onClick={() => setAdminOpen(true)}
              className="text-editorial-red text-md sm:text-l leading-none hover:opacity-75 cursor-pointer bg-transparent border-none outline-none transition-all p-1"
              title="Portal"
            >
              ✛
            </button>
            <span className="text-editorial-dark select-none">LA CATEDRAL</span>
          </div>
        </div>

        {/* Desktop Right Nav Links */}
        <div className="hidden md:flex gap-8 items-center">
          <a href="#menu" className="text-[10px] uppercase tracking-[0.2em] font-medium hover:text-editorial-red transition-all">
            {lang === 'es' ? 'La Carta' : 'The Menu'}
          </a>
          <a href="#contacto" className="text-[10px] uppercase tracking-[0.2em] font-medium hover:text-editorial-red transition-all">
            {lang === 'es' ? 'Visítanos' : 'Find Us'}
          </a>
        </div>
      </nav>

      {/* MAIN LAYOUT CONTAINER */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-48 text-stone-500">
          <RefreshCw className="w-8 h-8 animate-spin text-editorial-red mb-4" />
          <p className="font-cinzel text-xs tracking-widest uppercase">Cargando Templo Gastronómico...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 py-48 text-center text-stone-500">
          <AlertCircle className="w-12 h-12 text-editorial-red mb-4" />
          <h3 className="font-cinzel text-md tracking-widest uppercase text-editorial-dark mb-2">Error de Conexión</h3>
          <p className="text-sm max-w-md mx-auto">{error}</p>
          <button onClick={fetchState} className="mt-6 border border-editorial-dark px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-editorial-dark hover:text-white transition-all">
            Reintentar Conexión
          </button>
        </div>
      ) : (
        <main className="flex-1 mt-26">

          {/* 1. HERO MAIN EDITORIAL PRESENTATION */}
          <section id="hero" className="relative border-b border-editorial-dark/15 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, #000 40px, #000 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, #000 40px, #000 41px)'
            }}></div>
            
            <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left text column */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
                <div className="space-y-3">
                  <span className="text-[11px] uppercase tracking-[0.4em] text-stone-400 font-semibold block">
                    {lang === 'es' ? 'Establecido en 2013 · Vedado' : 'Established in 2013 · Vedado'}
                  </span>
                  <h1 className="text-6xl sm:text-8xl font-cinzel font-semibold tracking-wide leading-none text-editorial-dark">
                    LA <br className="hidden sm:inline" />
                    CATEDRAL
                  </h1>
                </div>

                <div className="space-y-4 max-w-xl">
                  <p className="font-serif italic text-2xl sm:text-3xl text-editorial-red leading-snug">
                    {lang === 'es' ? '“Rindiendo culto permanente a la buena mesa en La Habana”' : '“A permanent devotion to fine culinary art in Havana”'}
                  </p>
                  
                  {/* Active schedule displayed elegantly */}
                  <div className="flex items-start gap-3 pt-3 border-t border-stone-200">
                    <Clock className="w-4 h-4 text-editorial-red mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs uppercase tracking-widest font-semibold text-editorial-dark mb-1">
                        {lang === 'es' ? 'Horario de Servicios' : 'Open Daily'}
                      </p>
                      <p className="text-xs text-stone-600 font-normal">
                        {lang === 'es' ? state?.generalInfo.scheduleEs : state?.generalInfo.scheduleEn}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <a 
                    href="#menu" 
                    className="inline-block bg-editorial-dark text-white hover:bg-editorial-red px-10 py-4 text-[10px] uppercase tracking-[0.25em] font-semibold transition-all shadow-lg"
                  >
                    {lang === 'es' ? 'Explorar la Carta' : 'Explore the Menu'}
                  </a>
                </div>
              </div>

              {/* Right column - Main Editorial Graphic showcase (Feature image from El Local category) */}
              <div className="lg:col-span-5 relative">
                <div className="border border-editorial-dark/10 p-4 bg-white shadow-xl relative z-10">
                  <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                    {state?.galleryItems.filter(item => item.category === 'local')[0] ? (
                      <img 
                        src={state.galleryItems.filter(item => item.category === 'local')[0].imageSrc} 
                        alt="Restaurante La Catedral" 
                        className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 p-8 text-center">
                        <ImageIcon className="w-12 h-12 stroke-[1] mb-2 text-stone-300" />
                        <span className="text-[10px] uppercase tracking-widest">Atmósfera Catedral</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 to-transparent p-6 text-white flex flex-col justify-end">
                      <span className="text-[9px] uppercase tracking-[0.3em] font-semibold opacity-80 mb-1">
                        {lang === 'es' ? 'Reservar mesa' : 'Book a table'}
                      </span>
                      <p className="font-cinzel text-md tracking-wider">
                        {state?.generalInfo.phone}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Visual backframe matching the editorial guidelines */}
                <div className="absolute -bottom-6 -right-6 w-full h-full bg-[#EFECE5] border border-editorial-dark/5 -z-10"></div>
              </div>
            </div>
          </section>

          {/* 2. NOSOTROS / THE MANIFESTO */}
          <section id="nosotros" className="bg-editorial-wood border-b border-editorial-dark/15 py-20 sm:py-28">
            <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
              <span className="text-[11px] uppercase tracking-[0.4em] text-editorial-red font-semibold block">
                {lang === 'es' ? 'Nuestra Historia' : 'Our Legacy'}
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif italic text-editorial-dark tracking-tight leading-tight">
                {lang === 'es' ? 'Un remanso gastronómico en el corazón de El Vedado' : 'A culinary sanctuary nestled in Vedado'}
              </h2>
              <div className="w-16 h-[1px] bg-editorial-red mx-auto"></div>
              <p className="text-stone-700 font-sans font-light text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                {lang === 'es' ? (
                  <>
                    Desde 2013, <strong>La Catedral</strong> ha consagrado sus fogones a exaltar tanto los sabores de raíz criolla cubana como las técnicas clásicas internacionales. No somos simplemente un restaurante; somos un punto de peregrinación para quienes adoran <em>las recetas sinceras, las raciones generosas, la coctelería impecable y las noches con espectáculos en directo de primer nivel</em>.
                  </>
                ) : (
                  <>
                    Since 2013, <strong>La Catedral</strong> has blessed Havanas palate, merging bold Cuban criollo heritage with international masterworks. We represent more than a simple restaurant; we are a vibrant social hub, acclaimed for <em>honest and generous dishes, immaculate signature cocktails, and passionate live evening shows</em>.
                  </>
                )}
              </p>
            </div>
          </section>

          {/* 3. DYNAMIC INTERACTIVE GALLERY SECTION */}
          <section id="galeria" className="py-20 sm:py-24 border-b border-editorial-dark/15 bg-white">
            <div className="max-w-7xl mx-auto px-6 sm:px-12">
              <div className="flex flex-col md:flex-row justify-between items-baseline gap-6 mb-12">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.4em] text-editorial-red font-semibold block mb-2">
                    {lang === 'es' ? 'Galería' : 'Visual Gallery'}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-cinzel font-light text-editorial-dark">
                    {lang === 'es' ? 'Nuestros Espacios y Creaciones' : 'Our Sacred Spaces & Creation'}
                  </h2>
                </div>

                {/* Elegant Gallery Category Toggles */}
                <div className="flex flex-wrap gap-1 border border-editorial-dark/10 p-1 self-start">
                  {(['local', 'bebidas', 'platos', 'postres'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveGalleryTab(cat)}
                      className={`cursor-pointer px-4 py-2 font-cinzel text-[10px] uppercase tracking-widest transition-all ${
                        activeGalleryTab === cat 
                          ? 'bg-editorial-dark text-white' 
                          : 'text-stone-500 hover:text-editorial-dark'
                      }`}
                    >
                      {lang === 'es' ? (
                        cat === 'local' ? 'El Local' :
                        cat === 'bebidas' ? 'Bebidas' :
                        cat === 'platos' ? 'Platos' : 'Postres'
                      ) : (
                        cat === 'local' ? 'The Venue' :
                        cat === 'bebidas' ? 'Drinks' :
                        cat === 'platos' ? 'Dishes' : 'Desserts'
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid content loaded straight from JSON state database */}
              {(() => {
                const filteredImgs = state?.galleryItems.filter(img => img.category === activeGalleryTab) || [];
                if (filteredImgs.length === 0) {
                  return (
                    <div className="border border-dashed border-stone-300 rounded-sm py-20 text-center text-stone-400">
                      <ImageIcon className="w-10 h-10 stroke-[1] mx-auto mb-3 text-stone-300 animate-pulse" />
                      <p className="text-xs uppercase tracking-widest font-cinema">
                        {lang === 'es' ? 'Próximamente más fotos' : 'No photos available yet'}
                      </p>
                      {isAuthenticated && (
                        <button 
                          onClick={() => {
                            setAdminCategory('galeria');
                            setAdminOpen(true);
                          }} 
                          className="mt-4 text-[10px] text-editorial-red uppercase tracking-widest underline underline-offset-4"
                        >
                          Subir primera foto ahora
                        </button>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredImgs.map((img) => (
                      <div 
                        key={img.id} 
                        className="group relative aspect-[4/3] bg-stone-100 border border-editorial-dark/5 overflow-hidden shadow-sm"
                      >
                        <img 
                          src={img.imageSrc} 
                          alt="La Catedral" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            // Fallback if image fails to render
                            (e.target as any).src = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600";
                          }}
                        />
                        {/* Overlay text styling inspired by the high fashion prompt layout */}
                        <div className="absolute inset-0 bg-editorial-dark/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                          <span className="text-white text-[9px] uppercase tracking-[0.3em] font-medium font-cinzel">
                            LA CATEDRAL · {activeGalleryTab.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </section>

          {/* 4. LA CARTA / MENU SECTION */}
          <section id="menu" className="py-20 sm:py-28 bg-[#FCFAF5] relative">
            <div className="max-w-7xl mx-auto px-6 sm:px-12">
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                <span className="text-[11px] uppercase tracking-[0.4em] text-editorial-red font-semibold block">
                  {lang === 'es' ? 'La Carta' : 'Exclusive Menu'}
                </span>
                <h2 className="text-4xl sm:text-5xl font-cinzel text-editorial-dark font-light">
                  {lang === 'es' ? 'Rendir Culto al Buen Saborear' : 'A Rite of Gastronomy'}
                </h2>
                <div className="w-12 h-[1px] bg-editorial-red mx-auto mt-4"></div>
                <p className="text-stone-500 font-light text-xs sm:text-sm tracking-wide">
                  {lang === 'es' ? 'Selecciona una categoría de la liturgia culinaria' : 'Select a chapter from our exclusive culinary devotion'}
                </p>
              </div>

              {/* Menu Categories Tab bar */}
              <div className="flex flex-wrap justify-center border-b border-editorial-dark/10 gap-x-2 sm:gap-x-8 gap-y-2 mb-16 px-4">
                {(['bebidas', 'primeros', 'principales', 'postres', 'espirituosos'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveMenuTab(cat)}
                    className={`cursor-pointer pb-4 font-cinzel text-xs sm:text-sm uppercase tracking-widest border-b-2 transition-all font-medium ${
                      activeMenuTab === cat 
                        ? 'border-editorial-red text-editorial-dark' 
                        : 'border-transparent text-stone-400 hover:text-editorial-dark'
                    }`}
                  >
                    {lang === 'es' ? (
                      cat === 'bebidas' ? 'Bebidas' :
                      cat === 'primeros' ? 'Primeros / Entradas' :
                      cat === 'principales' ? 'Principales' :
                      cat === 'postres' ? 'Postres' : 'Espirituosos'
                    ) : (
                      cat === 'bebidas' ? 'Beverages' :
                      cat === 'primeros' ? 'Starters & Pasta' :
                      cat === 'principales' ? 'Mains' :
                      cat === 'postres' ? 'Desserts' : 'Spirits & Cellar'
                    )}
                  </button>
                ))}
              </div>

              {/* Dynamic menu list grouped by subcategories */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
                
                {/* Left side summary detail */}
                <div className="md:col-span-4 space-y-6">
                  <div className="bg-editorial-wood border border-editorial-dark/10 p-8 sticky top-32">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-400">
                      {lang === 'es' ? 'Recomendación de la Casa' : 'House Curation'}
                    </span>
                    <h3 className="font-serif italic text-2xl mt-2 mb-4 text-editorial-dark">
                      {activeMenuTab === 'bebidas' && (lang === 'es' ? 'La Coctelería del Convento' : 'The Cloister Craft Cocktails')}
                      {activeMenuTab === 'primeros' && (lang === 'es' ? 'Tesoros y Legado de Trigo' : 'Crispy Treasures & Pastas')}
                      {activeMenuTab === 'principales' && (lang === 'es' ? 'Altares de los Fogones' : 'Altars of Fire & Sea')}
                      {activeMenuTab === 'postres' && (lang === 'es' ? 'Pecados Dulces y Café' : 'Dessert Sins & Espresso')}
                      {activeMenuTab === 'espirituosos' && (lang === 'es' ? 'Reserva del Arca Sagrada' : 'The Sacred Oak Barrel Barrel Selection')}
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed font-light mb-6">
                      {lang === 'es' ? (
                        'Cada opción refleja ingredientes de primera selección fresca. Si cuenta con alguna intolerancia alimentaria, coméntelo amablemente a su camarero para adaptar el preparado.'
                      ) : (
                        'Each choice reflects top-quality fresh local ingredients. If you have any food allergies or specific inquiries, please briefly inform your host.'
                      )}
                    </p>
                    <div className="pt-4 border-t border-stone-200">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-editorial-red block mb-1">
                        {lang === 'es' ? 'MONEDAS ACEPTADAS' : 'CURRENCIES ACCEPTED'}
                      </span>
                      <p className="text-[11px] text-stone-600 font-semibold uppercase">
                        CUP · USD · EUR · MLC · TRANSFERENCIA
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right side item list */}
                <div className="md:col-span-8 space-y-12">
                  {getSubcategories(activeMenuTab).length === 0 ? (
                    <div className="text-stone-400 text-center py-12 border border-dashed border-stone-300">
                      <p className="text-xs uppercase tracking-widest font-cinzel">No hay platos activos en esta categoría</p>
                    </div>
                  ) : (
                    getSubcategories(activeMenuTab).map(sub => (
                      <div key={sub} className="space-y-6">
                        <h4 className="text-xs uppercase tracking-[0.25em] font-semibold text-editorial-red border-b border-editorial-dark/10 pb-2">
                          {sub}
                        </h4>
                        
                        <div className="space-y-6 divide-y divide-stone-100">
                          {getMenuItemsBySubcategory(activeMenuTab, sub).map(item => (
                            <div 
                              key={item.id} 
                              className={`pt-6 first:pt-0 flex flex-col justify-between transition-opacity ${
                                item.available ? 'opacity-100' : 'opacity-40'
                              }`}
                            >
                              <div className="flex justify-between items-baseline gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h5 className="font-serif text-lg text-editorial-dark leading-tight">
                                      {lang === 'es' ? item.nameEs : item.nameEn || item.nameEs}
                                    </h5>
                                    {!item.available && (
                                      <span className="bg-editorial-red/10 text-editorial-red text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold">
                                        {lang === 'es' ? 'Agotado' : 'Sold Out'}
                                      </span>
                                    )}
                                  </div>
                                  {(lang === 'es' ? item.descEs : item.descEn || item.descEs) && (
                                    <p className="text-xs text-stone-500 font-sans font-light leading-relaxed max-w-xl">
                                      {lang === 'es' ? item.descEs : item.descEn || item.descEs}
                                    </p>
                                  )}
                                </div>
                                <span className="font-cinzel text-xs sm:text-sm font-semibold tracking-wider text-editorial-dark shrink-0">
                                  {item.price}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>
          </section>

          {/* 5. VISÍTANOS & CONTACTO */}
          <section id="contacto" className="bg-editorial-dark text-white py-24 border-t border-stone-800">
            <div className="max-w-7xl mx-auto px-6 sm:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                
                {/* Left side general branding */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="font-cinzel font-bold text-xl tracking-[0.25em] flex items-center gap-2">
                    <span className="text-editorial-red text-2xl">✛</span>
                    <span>LA CATEDRAL</span>
                  </div>
                  <p className="text-xs text-stone-400 font-light leading-relaxed max-w-md">
                    {lang === 'es' ? (
                      'Consagrados desde 2013 al servicio premium en La Habana. Disfrute de nuestra atmósfera colonial selecta con espectáculos en vivo, showtimes de humor, música trovadoresca y rumba fina con una carta divina.'
                    ) : (
                      'Consecrated since 2013 to premium food service in Havana. Revel in our tailored colonial atmosphere featuring live music, comedy acts, and craft bar cocktail service.'
                    )}
                  </p>
                  
                  <div className="pt-6 border-t border-stone-800 space-y-4">
                    <span className="text-[10px] uppercase tracking-widest text-editorial-red font-semibold block">
                      {lang === 'es' ? 'NUESTRAS PLATAFORMAS' : 'MEMBERSHIP & CHATS'}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <a 
                        href={`https://instagram.com/${state?.generalInfo.instagram}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="bg-transparent hover:bg-[#8B1A1A] border border-stone-700 hover:border-[#8B1A1A] text-stone-300 hover:text-white px-3 sm:px-4 py-1.5 text-[9px] uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        <span>Instagram</span>
                      </a>
                      <a 
                        href={`https://facebook.com/${state?.generalInfo.facebook}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="bg-transparent hover:bg-[#8B1A1A] border border-stone-700 hover:border-[#8B1A1A] text-stone-300 hover:text-white px-3 sm:px-4 py-1.5 text-[9px] uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        <span>Facebook</span>
                      </a>
                      {state?.generalInfo.whatsappGroup && (
                        <a 
                          href={state?.generalInfo.whatsappGroup} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="bg-stone-800 hover:bg-emerald-600 text-stone-300 hover:text-white px-3 sm:px-4 py-1.5 text-[9px] uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-2.5 h-2.5 text-emerald-400" />
                          <span>{lang === 'es' ? 'Grupo WhatsApp de Clientes' : 'WhatsApp Client Group'}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side contact channels */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
                  
                  {/* Channel 1: Direccion */}
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-editorial-red font-semibold block">
                      {lang === 'es' ? 'La Dirección' : 'Find Us'}
                    </span>
                    <h4 className="font-cinzel text-xs tracking-widest text-stone-300">VEDADO · LA HABANA</h4>
                    <p className="text-xs text-stone-400 leading-relaxed font-light">
                      {state?.generalInfo.address}
                    </p>
                    <a 
                      href={state?.generalInfo.mapUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-1 text-[10px] text-white underline underline-offset-4 tracking-widest uppercase hover:text-editorial-red transition-colors"
                    >
                      <span>{lang === 'es' ? 'Ver mapa satelital →' : 'View satellite map →'}</span>
                    </a>
                  </div>

                  {/* Channel 2: Llamar y chatear */}
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-editorial-red font-semibold block">
                      {lang === 'es' ? 'Contacto Diario' : 'Reservations'}
                    </span>
                    <h4 className="font-cinzel text-xs tracking-widest text-stone-300">{lang === 'es' ? 'TELÉFONO & WHATSAPP' : 'DIRECT RESERVES'}</h4>
                    <p className="text-sm font-semibold tracking-wider font-cinzel">
                      <a href={`tel:${state?.generalInfo.phone}`} className="hover:text-editorial-red transition-all">
                        {state?.generalInfo.phone}
                      </a>
                    </p>
                    <p className="text-xs text-stone-400 font-light">
                      <a href={`mailto:${state?.generalInfo.email}`} className="hover:text-editorial-red transition-all break-all">
                        {state?.generalInfo.email}
                      </a>
                    </p>
                    
                    {/* Floating WhatsApp reservation tool */}
                    <a 
                      href={`https://wa.me/${state?.generalInfo.whatsapp}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE57] text-white px-5 py-2.5 text-[9px] uppercase tracking-[0.15em] font-semibold transition-all shadow-md font-sans"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.852L.057 23.5l5.797-1.452A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.032-1.385l-.361-.214-3.44.862.878-3.351-.235-.374A9.808 9.808 0 012.182 12c0-5.419 4.399-9.818 9.818-9.818 5.419 0 9.818 4.399 9.818 9.818 0 5.419-4.399 9.818-9.818 9.818z"/>
                      </svg>
                      <span>Reservar vía WhatsApp</span>
                    </a>
                  </div>

                </div>

              </div>
            </div>
          </section>

          {/* EDITORIAL FOOTER BACKGROUND */}
          <footer id="footer" className="bg-[#0D0D0D] text-stone-500 py-10 text-center text-[10px] tracking-[0.25em] font-cinzel font-medium px-4">
            <span className="text-editorial-red">✛</span> {lang === 'es' ? 'LA CATEDRAL RESTAURANTE' : 'LA CATEDRAL BISTRO'} &copy; {new Date().getFullYear()} · VEDADO · LA HABANA · CUBA
          </footer>

        </main>
      )}

      {/* ==========================================
          6. ELEGANT ADMIN PANEL OVERLAY BACKOFFICE 
          ========================================== */}
      {adminOpen && (
        <div id="admin_overlay" className="fixed inset-0 bg-editorial-dark/85 backdrop-blur-md z-50 flex items-center justify-end animate-fade-in">
          
          <div className="bg-editorial-cream w-full max-w-4xl h-full shadow-2xl flex flex-col overflow-hidden relative">
            
            {/* Admin Header */}
            <header className="bg-editorial-dark text-white px-6 py-4 flex justify-between items-center shrink-0 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-editorial-red" />
                <h2 className="font-cinzel text-xs sm:text-sm tracking-widest font-semibold uppercase flex items-center gap-2 flex-wrap">
                  <span>Backoffice Catedral</span>
                  {isLocalMode ? (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[8px] font-sans font-medium uppercase tracking-wider px-2 py-0.5 rounded ml-2">
                      Modo local (Vercel)
                    </span>
                  ) : (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[8px] font-sans font-medium uppercase tracking-wider px-2 py-0.5 rounded ml-2">
                      Servidor Activo
                    </span>
                  )}
                </h2>
              </div>
              <button 
                onClick={() => {
                  setAdminOpen(false);
                  setPinError(null);
                  setEditingItem(null);
                  setIsAddingNew(false);
                  // Remove hashtag silently from navigation history bar if present
                  if (window.location.hash === '#admin') {
                    window.history.pushState("", document.title, window.location.pathname + window.location.search);
                  }
                }}
                className="text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </header>

            {!isAuthenticated ? (
              /* Auth Form Box */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto">
                <div className="w-12 h-12 rounded-full bg-editorial-dark/5 flex items-center justify-center mb-6 border border-editorial-dark/10">
                  <Shield className="w-6 h-6 text-editorial-red" />
                </div>
                <h3 className="font-cinzel text-sm tracking-widest uppercase mb-2">Editor del Restaurante</h3>
                <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                  Para editar las fotos de la galería, actualizar precios y platos, introduzca el código secreto de la Catedral.
                </p>
                
                <form onSubmit={handleVerifyPin} className="w-full space-y-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-400 block">
                      Código de Acceso
                    </label>
                    <input 
                      type="password"
                      placeholder="••••"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      className="w-full bg-white border border-stone-300 px-4 py-3 text-center text-sm font-semibold tracking-[0.5em] focus:outline-none focus:border-editorial-red focus:ring-1 focus:ring-editorial-red"
                      autoFocus
                    />
                  </div>

                  {pinError && (
                    <p className="text-xs text-editorial-red font-medium flex items-center justify-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{pinError}</span>
                    </p>
                  )}

                  <button 
                    type="submit"
                    className="w-full bg-editorial-dark hover:bg-editorial-red text-white py-3.5 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer shadow-md"
                  >
                    Verificar Código
                  </button>
                </form>
              </div>
            ) : (
              /* FULLY CHOSEN DASHBOARD AND FORMS */
              <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Section selection slider tabs */}
                <div className="bg-editorial-dark text-stone-400 px-4 sm:px-6 flex gap-2 sm:gap-6 border-b border-stone-800 shrink-0">
                  <button 
                    onClick={() => {
                      setAdminCategory('menu');
                      setEditingItem(null);
                      setIsAddingNew(false);
                    }}
                    className={`cursor-pointer py-3.5 px-2 text-[10px] uppercase tracking-widest border-b-2 font-medium transition-all ${
                      adminCategory === 'menu' ? 'border-editorial-red text-white' : 'border-transparent hover:text-white'
                    }`}
                  >
                    🍜 {lang === 'es' ? 'Platos y Precios' : 'Menu & Prices'}
                  </button>
                  <button 
                    onClick={() => {
                      setAdminCategory('galeria');
                      setEditingItem(null);
                      setIsAddingNew(false);
                    }}
                    className={`cursor-pointer py-3.5 px-2 text-[10px] uppercase tracking-widest border-b-2 font-medium transition-all ${
                      adminCategory === 'galeria' ? 'border-editorial-red text-white' : 'border-transparent hover:text-white'
                    }`}
                  >
                    🖼️ {lang === 'es' ? 'Editar Fotos' : 'Manage Gallery'}
                  </button>
                  <button 
                    onClick={() => {
                      setAdminCategory('general');
                      setEditingItem(null);
                      setIsAddingNew(false);
                    }}
                    className={`cursor-pointer py-3.5 px-2 text-[10px] uppercase tracking-widest border-b-2 font-medium transition-all ${
                      adminCategory === 'general' ? 'border-editorial-red text-white' : 'border-transparent hover:text-white'
                    }`}
                  >
                    ⚙️ {lang === 'es' ? 'Contactos y Redes' : 'Contacts & Hours'}
                  </button>
                  <button 
                    onClick={() => {
                      setAdminCategory('pdf');
                      setEditingItem(null);
                      setIsAddingNew(false);
                    }}
                    className={`cursor-pointer py-3.5 px-2 text-[10px] uppercase tracking-widest border-b-2 font-medium transition-all ${
                      adminCategory === 'pdf' ? 'border-editorial-red text-white' : 'border-transparent hover:text-white'
                    }`}
                  >
                    🖨️ {lang === 'es' ? 'Menú Impreso (PDF)' : 'Printed Menu (PDF)'}
                  </button>
                </div>

                {/* Main panel inner screen (can scroll) */}
                <div className="flex-1 overflow-y-auto bg-editorial-cream">

                  {/* SUB PANEL A: MENU ITEMS LIST OR EDIT/FORM */}
                  {adminCategory === 'menu' && state && (
                    <div className="p-4 sm:p-8 space-y-6">

                      {!editingItem ? (
                        /* Default screen of A: List of items + filters */
                        <div className="space-y-6">
                          
                          {/* Search and Action Toolbar */}
                          <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center bg-white p-4 border border-editorial-dark/10">
                            <div className="flex-1 flex items-center bg-stone-50 border border-stone-200 px-3 py-1.5 max-w-md">
                              <Search className="w-4 h-4 text-stone-400 shrink-0 mr-2" />
                              <input 
                                type="text"
                                placeholder={lang === 'es' ? 'Buscar plato, precio o subcategoría...' : 'Search item, price or group...'}
                                value={menuFilter}
                                onChange={(e) => setMenuFilter(e.target.value)}
                                className="w-full bg-transparent text-xs focus:outline-none"
                              />
                              {menuFilter && (
                                <button onClick={() => setMenuFilter('')} className="text-stone-400 hover:text-stone-700">
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>

                            <button 
                              onClick={initiateAddNewItem}
                              className="bg-editorial-dark hover:bg-editorial-red text-white px-5 py-2.5 text-[10px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>{lang === 'es' ? 'Añadir Nuevo Plato' : 'Add Menu Item'}</span>
                            </button>
                          </div>

                          {/* Quick category filter selector pill row */}
                          <div className="flex flex-wrap gap-1.5">
                            {(['all', 'bebidas', 'primeros', 'principales', 'postres', 'espirituosos'] as const).map(cat => (
                              <button
                                key={cat}
                                onClick={() => setMenuEditCategory(cat)}
                                className={`cursor-pointer px-3 py-1.5 text-[9px] uppercase tracking-wider font-semibold border ${
                                  menuEditCategory === cat 
                                    ? 'bg-editorial-dark text-white border-editorial-dark' 
                                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                                }`}
                              >
                                {cat === 'all' ? (lang === 'es' ? 'Todos' : 'All') : cat.toUpperCase()}
                              </button>
                            ))}
                          </div>

                          {/* Price Multiplier Slider */}
                          <div className="bg-white border border-editorial-dark/10 p-6 space-y-4">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex-1">
                                <label className="block text-xs uppercase tracking-widest font-semibold text-stone-700 mb-3">
                                  {lang === 'es' ? 'Ajustar Precios' : 'Price Adjustment'} ({priceMultiplier.toFixed(2)}x)
                                </label>
                                <input
                                  type="range"
                                  min="0.5"
                                  max="2.5"
                                  step="0.1"
                                  value={priceMultiplier}
                                  onChange={(e) => setPriceMultiplier(parseFloat(e.target.value))}
                                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-editorial-red"
                                />
                                <div className="flex justify-between text-[9px] text-stone-500 mt-2">
                                  <span>0.5x</span>
                                  <span>1.0x</span>
                                  <span>2.5x</span>
                                </div>
                              </div>
                              <button
                                onClick={() => applyPriceMultiplier(priceMultiplier)}
                                disabled={priceMultiplier === 1}
                                className={`px-4 py-2 text-[10px] uppercase tracking-widest font-semibold rounded transition-all shrink-0 ${
                                  priceMultiplier === 1
                                    ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                    : 'bg-editorial-red text-white hover:bg-editorial-dark'
                                }`}
                              >
                                {lang === 'es' ? 'Aplicar' : 'Apply'}
                              </button>
                            </div>
                            <p className="text-[9px] text-stone-500">
                              {lang === 'es'
                                ? `Se aplicará a ${menuEditCategory === 'all' ? 'TODO EL MENÚ' : menuEditCategory.toUpperCase()}`
                                : `Will apply to ${menuEditCategory === 'all' ? 'ALL MENU' : menuEditCategory.toUpperCase()}`
                              }
                            </p>
                          </div>

                          {/* Render Items Table or Grid rows */}
                          <div className="bg-white border border-editorial-dark/10 divide-y divide-stone-100">
                            {getFilteredItemsForAdmin().length === 0 ? (
                              <div className="p-12 text-center text-stone-400">
                                <AlertCircle className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                                <p className="text-xs uppercase tracking-widest font-cinzel">No se encontraron platos</p>
                              </div>
                            ) : (
                              <div className="p-4 space-y-2">
                                <p className="text-sm text-stone-600">{getFilteredItemsForAdmin().length} productos encontrados</p>
                                {getFilteredItemsForAdmin().map(item => (
                                  <div key={item.id} className="p-3 bg-white border border-stone-200 rounded">
                                    <p className="text-sm font-semibold">{item.nameEs}</p>
                                    <p className="text-xs text-stone-500">Precio: {item.price}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>
                      ) : (
                        /* Edit item active subform editor */
                        <form onSubmit={handleSaveMenuItem} className="bg-white border border-editorial-dark/10 p-6 sm:p-8 space-y-6">
                          
                          <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                            <h3 className="font-cinzel text-xs tracking-widest font-semibold uppercase text-editorial-red">
                              {isAddingNew ? (lang === 'es' ? 'NUEVO ELEMENTO DE LA CARTA' : 'ADD NEW MENU ITEM') : (lang === 'es' ? 'MODIFICAR ELEMENTO DE LA CARTA' : 'EDIT MENU ITEM')}
                            </h3>
                            <button 
                              type="button" 
                              onClick={() => {
                                setEditingItem(null);
                                setIsAddingNew(false);
                              }}
                              className="text-stone-400 hover:text-stone-700 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                              <span>{lang === 'es' ? 'Cancelar / Volver' : 'Back'}</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            
                            {/* Category Selector */}
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">
                                Categoría General
                              </label>
                              <select 
                                value={editingItem.category}
                                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                                className="w-full bg-stone-50 border border-stone-300 px-3 py-2.5 text-xs focus:outline-none focus:border-editorial-red"
                              >
                                <option value="bebidas">Bebidas (Drinks)</option>
                                <option value="primeros">Primeros / Entradas / Pastas</option>
                                <option value="principales">Platos Principales (Mains)</option>
                                <option value="postres">Postres (Desserts)</option>
                                <option value="espirituosos">Espirituosos (Spirits / Vinos)</option>
                              </select>
                            </div>

                            {/* Subcategory Label editable */}
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">
                                Subcategoría del menú
                              </label>
                              <input 
                                type="text"
                                placeholder="Ej: Sin Alcohol, Carnes, Tradicionales Cubanos"
                                value={editingItem.subcategory}
                                onChange={(e) => setEditingItem({ ...editingItem, subcategory: e.target.value })}
                                className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-xs focus:outline-none focus:border-editorial-red"
                                required
                              />
                            </div>

                            {/* Spanish Product Name */}
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">
                                Nombre Oficial (Español)
                              </label>
                              <input 
                                type="text"
                                placeholder="..."
                                value={editingItem.nameEs}
                                onChange={(e) => setEditingItem({ ...editingItem, nameEs: e.target.value })}
                                className="w-full bg-stone-50 border border-stone-300 px-3 py-2.5 text-xs focus:outline-none focus:border-editorial-red font-serif font-semibold"
                                required
                              />
                            </div>

                            {/* English Product Name */}
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">
                                Nombre Traducido (Inglés)
                              </label>
                              <input 
                                type="text"
                                placeholder="Ej: Fresh Strawberry Lemonade..."
                                value={editingItem.nameEn}
                                onChange={(e) => setEditingItem({ ...editingItem, nameEn: e.target.value })}
                                className="w-full bg-stone-50 border border-stone-300 px-3 py-2.5 text-xs focus:outline-none focus:border-editorial-red font-serif"
                              />
                            </div>

                            {/* Price selector */}
                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">
                                Precio de venta visible (CUP / USD / EUR)
                              </label>
                              <input 
                                type="text"
                                placeholder="Ej. 1200 CUP o 5.00 USD"
                                value={editingItem.price}
                                onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                                className="w-full bg-stone-50 border border-stone-300 px-3 py-2.5 text-xs focus:outline-none focus:border-editorial-red font-semibold"
                                required
                              />
                            </div>

                            {/* Spanish Description */}
                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">
                                Descripción en Español
                              </label>
                              <textarea 
                                rows={2}
                                placeholder="Ingredientes, modo de preparación..."
                                value={editingItem.descEs}
                                onChange={(e) => setEditingItem({ ...editingItem, descEs: e.target.value })}
                                className="w-full bg-stone-50 border border-stone-300 p-3 text-xs focus:outline-none focus:border-editorial-red"
                              />
                            </div>

                            {/* English Description */}
                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">
                                Descripción en Inglés
                              </label>
                              <textarea 
                                rows={2}
                                placeholder="..."
                                value={editingItem.descEn}
                                onChange={(e) => setEditingItem({ ...editingItem, descEn: e.target.value })}
                                className="w-full bg-stone-50 border border-stone-300 p-3 text-xs focus:outline-none focus:border-editorial-red"
                              />
                            </div>

                            {/* Availability switch checkbox */}
                            <div className="flex items-center gap-2 sm:col-span-2 pt-2">
                              <input 
                                type="checkbox"
                                id="item_available_check"
                                checked={editingItem.available}
                                onChange={(e) => setEditingItem({ ...editingItem, available: e.target.checked })}
                                className="w-4 h-4 text-editorial-red accent-editorial-red"
                              />
                              <label htmlFor="item_available_check" className="text-xs uppercase tracking-wider font-semibold text-stone-700 cursor-pointer">
                                {lang === 'es' ? 'Plato disponible en almacén para la venta' : 'Item is available/in stock for clients'}
                              </label>
                            </div>

                          </div>

                          <div className="pt-4 flex gap-4">
                            <button 
                              type="submit"
                              className="flex-1 bg-[#1A1A1A] hover:bg-editorial-red text-white py-3 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                            >
                              <Save className="w-4 h-4" />
                              <span>{isAddingNew ? (lang === 'es' ? 'Añadir plato a la carta' : 'Publish to menu') : (lang === 'es' ? 'Guardar Cambios' : 'Save alterations')}</span>
                            </button>
                            
                            <button 
                              type="button"
                              onClick={() => {
                                setEditingItem(null);
                                setIsAddingNew(false);
                              }}
                              className="border border-stone-300 py-3 px-6 text-xs uppercase tracking-widest hover:bg-stone-50 transition-colors"
                            >
                              {lang === 'es' ? 'Volver' : 'Back'}
                            </button>
                          </div>

                        </form>
                      )}

                    </div>
                  )}

                  {/* SUB PANEL B: PHOTO GALLERY EDITING */}
                  {adminCategory === 'galeria' && (
                    <div className="p-4 sm:p-8 space-y-8">
                      <div className="bg-white border border-editorial-dark/10 p-5 space-y-2">
                        <h3 className="font-cinzel text-xs tracking-widest font-semibold uppercase text-editorial-dark">
                          📁 {lang === 'es' ? 'Subir fotos en alta definición' : 'Upload responsive photos'}
                        </h3>
                        <p className="text-xs text-stone-500 leading-relaxed font-light">
                          {lang === 'es' ? (
                            'Puedes subir fotos haciendo click en el botón "Subir Foto" de cada sección. El sistema optimiza automáticamente las resoluciones para asegurar que carguen velozmente en los móviles de los comensales.'
                          ) : (
                            'You may upload images straight from your phone/camera to showcase with high-definition rendering. They will be resized automatically to maintain extreme speed on Havanas 3G/4G network.'
                          )}
                        </p>
                      </div>

                      {/* Input file helper element */}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*"
                        className="hidden"
                      />

                      {/* Display Categories visual slots */}
                      {(['local', 'bebidas', 'platos', 'postres'] as const).map(cat => {
                        const items = state?.galleryItems.filter(item => item.category === cat) || [];
                        const limit = cat === 'local' ? 6 : 5;
                        
                        return (
                          <div key={cat} className="space-y-4">
                            <div className="flex justify-between items-baseline border-b border-stone-200 pb-2">
                              <h4 className="text-xs uppercase tracking-[0.25em] font-bold text-editorial-red">
                                {cat === 'local' ? (lang === 'es' ? 'El Local (Atmósfera)' : 'The Venue Atmosphere') :
                                 cat === 'bebidas' ? (lang === 'es' ? 'Bebidas y Cócteles' : 'Drinks & Cocktails') :
                                 cat === 'platos' ? (lang === 'es' ? 'Platos y Entrantes' : 'Dishes & Foods') :
                                 (lang === 'es' ? 'Postres y Dulces' : 'Desserts & Sweets')}
                              </h4>
                              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-mono">
                                {items.length}/{limit} {lang === 'es' ? 'ranuras' : 'photo slots'}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                              {/* Loaded photos */}
                              {items.map(item => (
                                <div key={item.id} className="relative aspect-[4/3] bg-stone-100 border border-stone-200 group overflow-hidden shadow-sm">
                                  <img 
                                    src={item.imageSrc} 
                                    alt="Catedral backoffice thumbnail" 
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleDeletePhoto(item.id, cat)}
                                    className="absolute inset-0 bg-editorial-red/80 text-white font-cinzel text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4 mr-1.5" />
                                    <span>Eliminar</span>
                                  </button>
                                </div>
                              ))}

                              {/* Slot for new upload if not at capacity */}
                              {items.length < limit && (
                                <button
                                  type="button"
                                  onClick={() => handlePhotoClickAndUpload(cat)}
                                  className="cursor-pointer aspect-[4/3] border-2 border-dashed border-stone-300 hover:border-editorial-red rounded-sm flex flex-col items-center justify-center p-3 text-stone-400 hover:text-editorial-red transition-all bg-white"
                                >
                                  <Upload className="w-5 h-5 mb-1 text-stone-300 hover:text-editorial-red" />
                                  <span className="text-[9px] uppercase tracking-widest font-bold">Subir Foto</span>
                                  <span className="text-[8px] text-stone-400 mt-0.5">Ranura {items.length+1}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}

                    </div>
                  )}

                  {/* SUB PANEL C: GENERAL RESTAURANTE INFO SETTINGS */}
                  {adminCategory === 'general' && editedInfo && (
                    <form onSubmit={handleSaveGeneralInfo} className="p-4 sm:p-8 space-y-6">
                      
                      <div className="bg-white border border-editorial-dark/10 p-6 space-y-6">
                        
                        <h3 className="font-cinzel text-xs tracking-widest font-semibold uppercase text-editorial-red border-b border-stone-100 pb-3">
                          ⚙️ {lang === 'es' ? 'CONFIGURAR CANALES DE CONTACTO' : 'RESTAURANT OUTLETS'}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                          
                          {/* Phone */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">
                              Teléfono de Reservas
                            </label>
                            <input 
                              type="text"
                              value={editedInfo.phone}
                              onChange={(e) => setEditedInfo({ ...editedInfo, phone: e.target.value })}
                              className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-xs focus:outline-none focus:border-editorial-red font-semibold"
                              required
                            />
                          </div>

                          {/* Email */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">
                              Correo electrónico institucional
                            </label>
                            <input 
                              type="email"
                              value={editedInfo.email}
                              onChange={(e) => setEditedInfo({ ...editedInfo, email: e.target.value })}
                              className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-xs focus:outline-none focus:border-editorial-red"
                              required
                            />
                          </div>

                          {/* Address */}
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">
                              Dirección Física (Vedado)
                            </label>
                            <input 
                              type="text"
                              value={editedInfo.address}
                              onChange={(e) => setEditedInfo({ ...editedInfo, address: e.target.value })}
                              className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-xs focus:outline-none focus:border-editorial-red"
                              required
                            />
                          </div>

                          {/* Google Maps Link */}
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">
                              URL en Google Maps
                            </label>
                            <input 
                              type="url"
                              value={editedInfo.mapUrl}
                              onChange={(e) => setEditedInfo({ ...editedInfo, mapUrl: e.target.value })}
                              className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-xs focus:outline-none focus:border-editorial-red"
                              required
                            />
                          </div>

                          {/* WhatsApp number for direct clicks */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">
                              ID de WhatsApp (Sin signos, ej. 5378300793)
                            </label>
                            <input 
                              type="text"
                              value={editedInfo.whatsapp}
                              onChange={(e) => setEditedInfo({ ...editedInfo, whatsapp: e.target.value })}
                              className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-xs focus:outline-none focus:border-editorial-red"
                              required
                            />
                          </div>

                          {/* WhatsApp Group chat invitation link */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">
                              Enlace de Grupo de WhatsApp de Clientes
                            </label>
                            <input 
                              type="url"
                              value={editedInfo.whatsappGroup}
                              onChange={(e) => setEditedInfo({ ...editedInfo, whatsappGroup: e.target.value })}
                              className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-xs focus:outline-none focus:border-editorial-red"
                            />
                          </div>

                          {/* Instagram Username */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">
                              Usuario de Instagram (sin @)
                            </label>
                            <input 
                              type="text"
                              value={editedInfo.instagram}
                              onChange={(e) => setEditedInfo({ ...editedInfo, instagram: e.target.value })}
                              className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-xs focus:outline-none focus:border-editorial-red"
                              required
                            />
                          </div>

                          {/* Facebook Page Username */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">
                              Usuario de Facebook
                            </label>
                            <input 
                              type="text"
                              value={editedInfo.facebook}
                              onChange={(e) => setEditedInfo({ ...editedInfo, facebook: e.target.value })}
                              className="w-full bg-stone-50 border border-stone-350 px-3 py-2 text-xs focus:outline-none focus:border-editorial-red"
                              required
                            />
                          </div>

                          {/* Horario de la catedral ES */}
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">
                              Horario Visible (Español)
                            </label>
                            <input 
                              type="text"
                              value={editedInfo.scheduleEs}
                              onChange={(e) => setEditedInfo({ ...editedInfo, scheduleEs: e.target.value })}
                              className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-xs focus:outline-none focus:border-editorial-red"
                              required
                            />
                          </div>

                          {/* Horario de la catedral EN */}
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">
                              Horario Visible (Inglés)
                            </label>
                            <input 
                              type="text"
                              value={editedInfo.scheduleEn}
                              onChange={(e) => setEditedInfo({ ...editedInfo, scheduleEn: e.target.value })}
                              className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-xs focus:outline-none focus:border-editorial-red"
                              required
                            />
                          </div>

                        </div>

                        <div className="pt-4">
                          <button 
                            type="submit"
                            className="w-full bg-editorial-dark hover:bg-editorial-red text-white py-3 px-6 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                          >
                            <Save className="w-4 h-4" />
                            <span>Guardar Configuración General</span>
                          </button>
                        </div>

                      </div>
                    </form>
                  )}

                  {/* SUB PANEL D: PRINTED PDF MENU GENERATOR */}
                  {adminCategory === 'pdf' && (
                    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:h-[calc(100vh-210px)] min-h-[600px] items-stretch bg-stone-100 text-stone-800">
                      
                      {/* Left Column: controls */}
                      <div className="w-full lg:w-[350px] shrink-0 bg-white p-5 border border-stone-200 flex flex-col justify-between overflow-y-auto shadow-sm gap-6">
                        <div className="space-y-5">
                          <header className="border-b border-stone-100 pb-3">
                            <h3 className="font-cinzel text-xs tracking-widest font-semibold uppercase text-editorial-dark flex items-center gap-1.5">
                              <FileText className="w-4 h-4 text-editorial-red" />
                              <span>Generador de Menú PDF</span>
                            </h3>
                            <p className="text-[10px] text-stone-500 font-light mt-1 pb-1">
                              Organiza tu menú por páginas, añade portadas, escoge fondos y descarga como PDF listo para imprimir en tu restaurante.
                            </p>
                          </header>

                          {/* Quick Actions / Print */}
                          <div className="space-y-2">
                            <button
                              type="button"
                              onClick={() => window.print()}
                              className="w-full bg-editorial-red hover:bg-[#A92222] text-white py-3 px-4 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm rounded-sm"
                            >
                              <Printer className="w-4 h-4" />
                              <span>Exportar / Imprimir PDF</span>
                            </button>
                            <div className="bg-amber-50 border border-amber-200/50 p-2.5 rounded-sm text-[9px] text-amber-700 font-light leading-relaxed">
                              💡 <strong>Para el mejor resultado al imprimir:</strong> En la ventana de impresión del navegador, activa la opción <strong>"Gráficos de fondo"</strong> (Background graphics) y ajusta los márgenes a <strong>"Ninguno"</strong> o "Predeterminado" (Letter o A4).
                            </div>
                          </div>

                          {/* Pages List Selector */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">Páginas del Documento</label>
                              <button
                                type="button"
                                onClick={addPage}
                                className="text-[9px] uppercase tracking-widest font-bold text-editorial-red hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none"
                              >
                                <Plus className="w-3 h-3" /> Añadir Página
                              </button>
                            </div>

                            <div className="border border-stone-200 divide-y divide-stone-100 bg-stone-50 max-h-[160px] overflow-y-auto">
                              {pdfPages.map((page, index) => (
                                <div 
                                  key={page.id}
                                  onClick={() => setSelectedPdfPageId(page.id)}
                                  className={`flex items-center justify-between p-2.5 cursor-pointer hover:bg-white transition-all ${
                                    selectedPdfPageId === page.id ? 'bg-editorial-cream border-l-2 border-editorial-red font-medium text-stone-950' : 'text-stone-600'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-[8px] font-mono text-stone-400 font-semibold">{index + 1}</span>
                                    <span className="text-[10px] truncate max-w-[120px] uppercase tracking-wider">
                                      {page.type === 'cover' ? `📙 Portada: ${page.coverTitle || 'Sin tít.'}` : `📄 Menú: ${page.categories.join(' + ').toUpperCase() || 'Vacío'}`}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                                    <button 
                                      onClick={() => movePageUp(index)} 
                                      className="text-stone-400 hover:text-stone-700 p-0.5"
                                      disabled={index === 0}
                                      title="Subir"
                                    >
                                      <ArrowUp className="w-3 h-3" />
                                    </button>
                                    <button 
                                      onClick={() => movePageDown(index)} 
                                      className="text-stone-400 hover:text-stone-700 p-0.5"
                                      disabled={index === pdfPages.length - 1}
                                      title="Bajar"
                                    >
                                      <ArrowDown className="w-3 h-3" />
                                    </button>
                                    <button 
                                      onClick={() => deletePage(page.id)} 
                                      className="text-stone-400 hover:text-editorial-red p-0.5"
                                      title="Eliminar"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Selected Page Controls Settings */}
                          {selectedPage && (
                            <div className="border-t border-stone-200 pt-3 space-y-4">
                              <h4 className="text-[10px] uppercase tracking-widest font-bold text-editorial-red">
                                Configurar Página {pdfPages.findIndex(p => p.id === selectedPdfPageId) + 1}
                              </h4>

                              {/* Page Type Selector */}
                              <div className="space-y-1">
                                <label className="text-[9px] uppercase tracking-wider font-bold text-stone-400">Tipo de Página</label>
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => updateSelectedPage({ type: 'cover' })}
                                    className={`px-3 py-1.5 text-[9px] uppercase tracking-wider font-semibold border text-center rounded-sm transition-all cursor-pointer ${
                                      selectedPage.type === 'cover' ? 'bg-editorial-dark text-white border-editorial-dark' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                                    }`}
                                  >
                                    📙 Portada
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateSelectedPage({ type: 'menu' })}
                                    className={`px-3 py-1.5 text-[9px] uppercase tracking-wider font-semibold border text-center rounded-sm transition-all cursor-pointer ${
                                      selectedPage.type === 'menu' ? 'bg-editorial-dark text-white border-editorial-dark' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                                    }`}
                                  >
                                    📄 Menú Carta
                                  </button>
                                </div>
                              </div>

                              {/* Title / Subtitle Text Override */}
                              <div className="grid grid-cols-1 gap-2">
                                <div className="space-y-0.5">
                                  <label className="text-[9px] uppercase tracking-wider font-bold text-stone-400">Título de la Página</label>
                                  <input
                                    type="text"
                                    value={selectedPage.coverTitle}
                                    onChange={e => updateSelectedPage({ coverTitle: e.target.value })}
                                    placeholder="Ej: NUESTRA COCINA"
                                    className="w-full bg-stone-50 border border-stone-200 px-2 py-1 text-xs focus:outline-none focus:border-editorial-red rounded-sm"
                                  />
                                </div>
                                <div className="space-y-0.5">
                                  <label className="text-[9px] uppercase tracking-wider font-bold text-stone-400">Subtítulo o Descripción</label>
                                  <input
                                    type="text"
                                    value={selectedPage.coverSubtitle}
                                    onChange={e => updateSelectedPage({ coverSubtitle: e.target.value })}
                                    placeholder="Ej: Plato Principal & Selección de la Casa"
                                    className="w-full bg-stone-50 border border-stone-200 px-2 py-1 text-xs focus:outline-none focus:border-editorial-red rounded-sm"
                                  />
                                </div>
                              </div>

                              {/* Background Options */}
                              <div className="space-y-2">
                                <label className="text-[9px] uppercase tracking-wider font-bold text-stone-400 block">Fondo de la Página</label>
                                
                                {/* Direct URL Input */}
                                <input
                                  type="text"
                                  value={selectedPage.backgroundImage}
                                  onChange={e => updateSelectedPage({ backgroundImage: e.target.value })}
                                  placeholder="URL personalizada de fondo..."
                                  className="w-full bg-stone-50 border border-stone-200 px-2 py-1 text-[10px] focus:outline-none focus:border-editorial-red rounded-sm font-light"
                                />

                                {/* Gallery Quick Selector Carousel */}
                                {state && state.galleryItems.length > 0 && (
                                  <div className="space-y-1">
                                    <span className="text-[8px] text-stone-400 uppercase tracking-widest font-semibold">Tus Fotos Subidas:</span>
                                    <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-[310px] scrollbar-thin">
                                      {state.galleryItems.map(item => (
                                        <button
                                          key={item.id}
                                          type="button"
                                          onClick={() => updateSelectedPage({ backgroundImage: item.imageSrc })}
                                          className={`w-12 h-9 shrink-0 relative overflow-hidden rounded-sm border transition-all cursor-pointer ${
                                            selectedPage.backgroundImage === item.imageSrc ? 'border-editorial-red scale-90 ring-1 ring-editorial-red' : 'border-stone-300 hover:border-stone-450'
                                          }`}
                                        >
                                          <img src={item.imageSrc} className="w-full h-full object-cover" />
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Stock Classy Background presets */}
                                <div className="space-y-1 pt-1">
                                  <span className="text-[8px] text-stone-400 uppercase tracking-widest font-semibold">Fondos de Catálogo:</span>
                                  <div className="grid grid-cols-2 gap-1">
                                    {[
                                      { name: 'Portada Bodega', url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop' },
                                      { name: 'Copas Vino', url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200&auto=format&fit=crop' },
                                      { name: 'Copa Cockt.', url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop' },
                                      { name: 'Mármol Blanco', url: 'https://images.unsplash.com/photo-1533038590840-1cde6b66b706?q=80&w=1200&auto=format&fit=crop' },
                                      { name: 'Páginas Claras', url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1200&auto=format&fit=crop' }
                                    ].map(b => (
                                      <button
                                        key={b.name}
                                        type="button"
                                        onClick={() => updateSelectedPage({ backgroundImage: b.url })}
                                        className="text-[8px] uppercase tracking-wider font-semibold py-1 px-1.5 border border-stone-200 text-stone-600 bg-stone-50 hover:bg-stone-100 rounded-sm hover:border-stone-300 cursor-pointer"
                                      >
                                        {b.name}
                                      </button>
                                    ))}
                                    <button
                                      type="button"
                                      onClick={() => updateSelectedPage({ backgroundImage: '' })}
                                      className="text-[8px] col-span-2 uppercase tracking-wider font-semibold py-1 px-1.5 border border-dashed border-stone-300 text-stone-500 bg-white hover:bg-stone-50 rounded-sm text-center cursor-pointer"
                                    >
                                      ❌ Sin fondo (Blanco Puro)
                                    </button>
                                  </div>
                                </div>

                                {/* Opacity slider */}
                                {selectedPage.backgroundImage && (
                                  <div className="space-y-0.5 pt-1">
                                    <div className="flex justify-between text-[8px] uppercase tracking-wider font-bold text-stone-400">
                                      <span>Opacidad de Imagen</span>
                                      <span>{selectedPage.bgOpacity}%</span>
                                    </div>
                                    <input 
                                      type="range"
                                      min="0"
                                      max="100"
                                      value={selectedPage.bgOpacity}
                                      onChange={e => updateSelectedPage({ bgOpacity: parseInt(e.target.value) })}
                                      className="w-full accent-editorial-red h-1 bg-stone-200 rounded-sm appearance-none cursor-pointer"
                                    />
                                    <p className="text-[7.5px] text-stone-400 leading-none mt-1">
                                      * Ajuste a un nivel bajo (12% - 15%) en menús de platos para asegurar que la tipografía de precios sea totalmente legible.
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Menu Settings Category selection (Only on Menu Page) */}
                              {selectedPage.type === 'menu' && (
                                <div className="space-y-2 border-t border-stone-100 pt-3">
                                  <label className="text-[9px] uppercase tracking-wider font-bold text-stone-400 block">Agrupar platos en esta página</label>
                                  <div className="space-y-1.5">
                                    {([
                                      { id: 'bebidas', label: '🍹 Bebidas y Tragos' },
                                      { id: 'primeros', label: '🥗 Entrantes y Tapas' },
                                      { id: 'principales', label: '🍖 Platos Principales' },
                                      { id: 'postres', label: '🎂 Postres Dulces' },
                                      { id: 'espirituosos', label: '🍷 Licores y Bodega' }
                                    ] as const).map(cat => {
                                      const isChecked = selectedPage.categories.includes(cat.id);
                                      return (
                                        <button
                                          key={cat.id}
                                          type="button"
                                          onClick={() => {
                                            const newCats = isChecked
                                              ? selectedPage.categories.filter(c => c !== cat.id)
                                              : [...selectedPage.categories, cat.id];
                                            updateSelectedPage({ categories: newCats });
                                          }}
                                          className={`w-full flex items-center justify-between px-3 py-2 text-[10px] tracking-wider text-left uppercase border rounded-sm transition-all cursor-pointer ${
                                            isChecked 
                                              ? 'bg-editorial-cream border-editorial-red text-stone-900 font-semibold' 
                                              : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'
                                          }`}
                                        >
                                          <span>{cat.label}</span>
                                          <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
                                            isChecked ? 'bg-editorial-red border-editorial-red text-white' : 'border-stone-300 bg-white'
                                          }`}>
                                            {isChecked && <Check className="w-2.5 h-2.5" />}
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Layout Design Customization Columns-Font Font Scale (Only on Menu Page) */}
                              {selectedPage.type === 'menu' && (
                                <div className="space-y-3 border-t border-stone-100 pt-3">
                                  <label className="text-[9px] uppercase tracking-wider font-bold text-stone-400 block">Ajustes de Diseño</label>
                                  
                                  {/* Columns selector */}
                                  <div className="space-y-0.5">
                                    <span className="text-[8px] uppercase tracking-wider font-bold text-stone-400">Columnas</span>
                                    <div className="grid grid-cols-2 gap-2">
                                      <button
                                        type="button"
                                        onClick={() => updateSelectedPage({ columns: 1 })}
                                        className={`py-1 text-[9px] border text-center transition-all cursor-pointer ${
                                          selectedPage.columns === 1 ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-600 border-stone-200'
                                        }`}
                                      >
                                        1 Columna
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => updateSelectedPage({ columns: 2 })}
                                        className={`py-1 text-[9px] border text-center transition-all cursor-pointer ${
                                          selectedPage.columns === 2 ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-600 border-stone-200'
                                        }`}
                                      >
                                        2 Columnas
                                      </button>
                                    </div>
                                  </div>

                                  {/* Font Size Selector */}
                                  <div className="space-y-0.5">
                                    <span className="text-[8px] uppercase tracking-wider font-bold text-stone-400">Tamaño del Texto</span>
                                    <div className="grid grid-cols-3 gap-1">
                                      {(['sm', 'base', 'lg'] as const).map(sz => (
                                        <button
                                          key={sz}
                                          type="button"
                                          onClick={() => updateSelectedPage({ fontSize: sz })}
                                          className={`py-1 text-[8px] uppercase border text-center transition-all font-semibold cursor-pointer ${
                                            selectedPage.fontSize === sz ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-600 border-stone-200'
                                          }`}
                                        >
                                          {sz === 'sm' ? 'Pequeño' : sz === 'lg' ? 'Grande' : 'Normal'}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Hide descriptions */}
                                  <div className="flex items-center gap-2 pt-1">
                                    <input
                                      type="checkbox"
                                      id="hide_desc_check"
                                      checked={selectedPage.hideDescriptions}
                                      onChange={e => updateSelectedPage({ hideDescriptions: e.target.checked })}
                                      className="w-3.5 h-3.5 accent-editorial-red cursor-pointer"
                                    />
                                    <label htmlFor="hide_desc_check" className="text-[9px] uppercase tracking-wider text-stone-600 font-semibold cursor-pointer select-none">
                                      Ocultar descripción de platos
                                    </label>
                                  </div>

                                </div>
                              )}
                            </div>
                          )}

                        </div>

                        {/* Vercel GitHub comment footer block */}
                        <div className="border-t border-stone-100 pt-3 text-[9px] text-stone-400 font-light leading-relaxed">
                          🏠 <strong>Alojamiento Vercel / GitHub:</strong> El portal de administración guardará datos permanentes usando nuestro Cloud API. Para guardar localmente si cambias a un servidor estático, puedes importar/exportar la base de datos completa.
                        </div>
                      </div>

                      {/* Right Column: Beautiful live high fidelity canvas preview */}
                      <div className="flex-1 bg-stone-300 border border-stone-400 p-6 flex flex-col items-center justify-start overflow-y-auto rounded-sm select-none shadow-inner min-h-[500px]">
                        <div className="mb-4 text-center">
                          <span className="text-[9px] uppercase tracking-[0.2em] bg-stone-400 text-stone-900 font-bold px-3 py-1 rounded-full shadow-sm">
                            VISTA PREVIA DEL DOCUMENTO IMPRESO (ESC. 1:1)
                          </span>
                        </div>

                        {/* High fidelity interactive printed page render wrapper */}
                        {selectedPage ? (
                          <div className="w-[100%] max-w-[480px] aspect-[210/297] bg-white text-stone-900 relative shadow-2xl overflow-hidden flex flex-col justify-between p-[8%] animate-fade-in border border-white">
                            
                            {/* Overlay background */}
                            {selectedPage.backgroundImage && (
                              <div 
                                className="absolute inset-0 pointer-events-none z-0"
                                style={{ 
                                  backgroundImage: `url(${selectedPage.backgroundImage})`,
                                  backgroundPosition: 'center',
                                  backgroundSize: 'cover',
                                  backgroundRepeat: 'no-repeat',
                                  opacity: selectedPage.bgOpacity / 100
                                }}
                              />
                            )}

                            {/* Render Cover inside Live Preview */}
                            {selectedPage.type === 'cover' ? (
                              <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-4 border-2 border-double border-stone-800">
                                <div className="text-xl font-cinzel text-editorial-red mb-1">✛</div>
                                <h3 className="font-cinzel text-2xl sm:text-3xl font-extrabold tracking-[0.2em] text-stone-900 uppercase">
                                  {selectedPage.coverTitle || 'LA CATEDRAL'}
                                </h3>
                                <div className="w-16 h-[1px] bg-stone-400 my-4"></div>
                                <h4 className="font-sans text-[8px] uppercase tracking-[0.25em] text-stone-600 font-semibold">
                                  {selectedPage.coverSubtitle || 'RESTAURANTE & BAR'}
                                </h4>
                                
                                <div className="absolute bottom-4 text-[7px] uppercase tracking-widest text-stone-400 font-serif">
                                  La Habana, Cuba
                                </div>
                              </div>
                            ) : (
                              /* Render Menu list inside Live Preview */
                              <div className="relative z-10 flex-1 flex flex-col border border-stone-300/40 p-4 justify-between h-full">
                                <div>
                                  {/* Page Header */}
                                  <header className="border-b border-stone-800 pb-1.5 mb-4 text-center">
                                    <div className="font-cinzel text-stone-400 text-[7px] tracking-widest uppercase">
                                      La Catedral Restaurante
                                    </div>
                                    <h3 className="font-cinzel text-sm font-bold tracking-[0.15em] text-stone-900 uppercase">
                                      {selectedPage.coverTitle || 'NOT DEFINED'}
                                    </h3>
                                    {selectedPage.coverSubtitle && (
                                      <p className="text-[7.5px] text-stone-500 tracking-wider font-light">
                                        {selectedPage.coverSubtitle}
                                      </p>
                                    )}
                                  </header>

                                  {/* Categories mapping */}
                                  <div className={selectedPage.columns === 2 ? "grid grid-cols-2 gap-x-4 gap-y-3" : "space-y-4"}>
                                    {selectedPage.categories.length === 0 ? (
                                      <div className="col-span-full text-center py-10 text-stone-400 text-[9px] italic">
                                        (Selecciona una o más categorías de comida en el menú de la izquierda para ver su contenido aquí)
                                      </div>
                                    ) : (
                                      selectedPage.categories.map(cat => {
                                        const items = state?.menuItems.filter(item => item.category === cat && item.available) || [];
                                        if (items.length === 0) return null;

                                        return (
                                          <div key={cat} className="space-y-2">
                                            <h4 className="font-cinzel text-[8.5px] tracking-[0.15em] font-extrabold text-editorial-red border-b border-stone-300 pb-0.5 uppercase">
                                              {cat === 'bebidas' ? 'Bebidas' : 
                                               cat === 'primeros' ? 'Entrantes' : 
                                               cat === 'principales' ? 'Principales' : 
                                               cat === 'postres' ? 'Postres' : 
                                               'Licores'}
                                            </h4>

                                            <div className="space-y-1.5">
                                              {items.map(item => {
                                                const textClass = selectedPage.fontSize === 'sm' ? {
                                                  title: "text-[8px]", desc: "text-[7px]", price: "text-[8px]"
                                                } : selectedPage.fontSize === 'lg' ? {
                                                  title: "text-[10px]", desc: "text-[8px]", price: "text-[10px]"
                                                } : {
                                                  title: "text-[9px]", desc: "text-[7.5px]", price: "text-[9px]"
                                                };

                                                return (
                                                  <div key={item.id} className="space-y-0.5 animate-fade-in">
                                                    <div className="flex justify-between items-baseline gap-1">
                                                      <span className={`font-cinzel font-semibold text-stone-900 tracking-wide ${textClass.title}`}>
                                                        {lang === 'es' ? item.nameEs : item.nameEn}
                                                      </span>
                                                      <div className="flex-1 border-b border-dotted border-stone-200 mx-1"></div>
                                                      <span className={`font-mono font-bold text-stone-800 shrink-0 ${textClass.price}`}>
                                                        {item.price}
                                                      </span>
                                                    </div>
                                                    {!selectedPage.hideDescriptions && (item.descEs || item.descEn) && (
                                                      <p className={`text-stone-400 italic font-mono leading-none ${textClass.desc}`}>
                                                        {lang === 'es' ? item.descEs : item.descEn}
                                                      </p>
                                                    )}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        );
                                      })
                                    )}
                                  </div>
                                </div>

                                <footer className="text-center pt-2 border-t border-stone-100 text-[7px] text-stone-400 font-mono flex justify-between items-center relative z-10 mt-4">
                                  <span>Mesa Reservas: {state?.generalInfo.phone || 'La Catedral'}</span>
                                  <span>Página {pdfPages.findIndex(p => p.id === selectedPdfPageId) + 1}</span>
                                </footer>
                              </div>
                            )}

                          </div>
                        ) : (
                          <div className="p-12 text-center text-stone-500 bg-white shadow-xl rounded-sm">
                            No has seleccionado o creado ninguna página. Pulsa "Añadir Página" a la izquierda.
                          </div>
                        )}
                        
                        {/* Page counter bar */}
                        <div className="mt-4 flex gap-1.5">
                          {pdfPages.map((p, idx) => (
                            <button
                              key={p.id}
                              onClick={() => setSelectedPdfPageId(p.id)}
                              className={`w-7 h-7 rounded-full text-[10px] font-semibold border flex items-center justify-center transition-all cursor-pointer ${
                                p.id === selectedPdfPageId 
                                  ? 'bg-editorial-red text-white border-editorial-red shadow' 
                                  : 'bg-white text-stone-600 border-stone-300 hover:border-stone-500'
                              }`}
                            >
                              {idx + 1}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                </div>

                {/* Bottom Danger utilities panel */}
                <footer className="bg-stone-100 border-t border-stone-200 px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shrink-0">
                  <div className="text-[10px] text-stone-500 font-light max-w-sm">
                    🔒 {lang === 'es' ? 'Los datos se guardan de forma permanente e inmediata en el servidor.' : 'Server-persisted database engine.'}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={resetStateToDefault}
                      type="button"
                      className="cursor-pointer border border-editorial-red/30 bg-white hover:bg-editorial-red/10 text-editorial-red/90 px-4 py-2 text-[9px] uppercase tracking-widest font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{lang === 'es' ? 'Valores de Fábrica' : 'Reset defaults'}</span>
                    </button>
                    
                    <button 
                      onClick={() => setIsAuthenticated(false)}
                      type="button"
                      className="cursor-pointer bg-editorial-dark hover:bg-stone-800 text-stone-200 px-4 py-2 text-[9px] uppercase tracking-widest font-semibold transition-all"
                    >
                      🛡️ {lang === 'es' ? 'Cerrar Sesión' : 'Lock session'}
                    </button>
                  </div>
                </footer>

              </div>
            )}

          </div>

        </div>
      )}

      {/* EXCLUSIVO PARA IMPRENTAS / COPIA FISICA (PRINT-ONLY) */}
      <div id="print-container" className="hidden print:block print-container-only absolute left-0 top-0 w-full bg-white text-stone-900 pointer-events-none">
        <style>{`
          @media print {
            body {
              background: white !important;
              color: black !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            /* Hide entire reactive interactive client/admin SPA tree from physical print layout */
            #root > div:not(#print-container) {
              display: none !important;
            }
            #navbar, #admin_overlay, #main-client-container, footer {
              display: none !important;
            }
            #print-container {
              display: block !important;
              width: 100% !important;
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              z-index: 9999999 !important;
            }
            .print-page {
              page-break-after: always !important;
              break-after: page !important;
              height: 295mm !important;
              width: 210mm !important;
              margin: 0 auto !important;
              padding: 18mm !important;
              position: relative !important;
              box-sizing: border-box !important;
              background-color: white !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              overflow: hidden !important;
            }
            @page {
              size: A4 portrait;
              margin: 0mm;
            }
          }
        `}</style>

        {pdfPages.map((page, index) => (
          <div 
            key={page.id} 
            className="print-page flex flex-col justify-between"
            style={{ pageBreakAfter: index === pdfPages.length - 1 ? 'avoid' : 'always' }}
          >
            {/* Background Image Container */}
            {page.backgroundImage && (
              <div 
                className="absolute inset-0 pointer-events-none z-0"
                style={{ 
                  backgroundImage: `url(${page.backgroundImage})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  opacity: page.bgOpacity / 100
                }}
              />
            )}

            {/* Cover Layout Rendering */}
            {page.type === 'cover' ? (
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-8 border-4 border-double border-stone-800 h-full">
                <div className="text-3xl font-cinzel text-editorial-red mb-2">✛</div>
                <h1 className="font-cinzel text-4xl sm:text-5xl font-bold tracking-[0.25em] text-stone-900 uppercase">
                  {page.coverTitle || 'LA CATEDRAL'}
                </h1>
                <div className="w-24 h-[1px] bg-stone-500 my-6"></div>
                <h2 className="font-sans text-[11px] uppercase tracking-[0.3em] text-stone-600 font-semibold">
                  {page.coverSubtitle || 'RESTAURANTE & BAR'}
                </h2>
                
                <div className="absolute bottom-8 text-[9px] uppercase tracking-[0.25em] text-stone-400 font-serif">
                  {state?.generalInfo.address || 'Calle 13, El Vedado, La Habana'}
                </div>
              </div>
            ) : (
              /* Menu Content Categories Listing Layout */
              <div className="relative z-10 flex-1 flex flex-col border border-stone-300/40 p-10 h-full justify-between">
                <div>
                  {/* Category Page Header Section */}
                  <header className="border-b-2 border-stone-800 pb-3 mb-6 text-center">
                    <div className="font-cinzel text-stone-500 text-[10px] tracking-widest font-bold mb-1 uppercase">
                      La Catedral Restaurante
                    </div>
                    <h2 className="font-cinzel text-xl font-bold tracking-[0.2em] text-stone-900 uppercase">
                      {page.coverTitle || 'CARTA'}
                    </h2>
                    {page.coverSubtitle && (
                      <p className="text-[10px] text-stone-500 tracking-wider font-light mt-0.5">
                        {page.coverSubtitle}
                      </p>
                    )}
                  </header>

                  {/* Dual Grid Column and Single Page groupings */}
                  <div className={page.columns === 2 ? "grid grid-cols-2 gap-x-8 gap-y-6" : "space-y-6"}>
                    {page.categories.length === 0 ? (
                      <div className="col-span-full text-center py-20 text-stone-400 text-xs italic">
                        (Seleccione una o más categorías de comida para listar en esta página)
                      </div>
                    ) : (
                      page.categories.map(cat => {
                        const items = state?.menuItems.filter(item => item.category === cat && item.available) || [];
                        if (items.length === 0) return null;

                        return (
                          <div key={cat} className="space-y-4">
                            <h3 className="font-cinzel text-[11px] tracking-[0.2em] font-extrabold text-editorial-red border-b border-stone-350 pb-1 uppercase">
                              {cat === 'bebidas' ? (lang === 'es' ? 'Bebidas y Tragos' : 'Drinks & Cocktails') : 
                               cat === 'primeros' ? (lang === 'es' ? 'Entrantes y Tapas' : 'Starters & Salads') : 
                               cat === 'principales' ? (lang === 'es' ? 'Platos Fuertes' : 'Main Courses') : 
                               cat === 'postres' ? (lang === 'es' ? 'Postres Artesanales' : 'Homemade Desserts') : 
                               (lang === 'es' ? 'Licores y Bodega' : 'Liquors & Selection')}
                            </h3>

                            <div className="space-y-3">
                              {items.map(item => {
                                const textClass = page.fontSize === 'sm' ? {
                                  title: "text-[10px]", desc: "text-[8.5px] leading-snug", price: "text-[10px]"
                                } : page.fontSize === 'lg' ? {
                                  title: "text-[12px]", desc: "text-[10.5px] leading-relaxed", price: "text-[12px]"
                                } : {
                                  title: "text-[11px]", desc: "text-[9.5px] leading-relaxed", price: "text-[11px]"
                                };

                                return (
                                  <div key={item.id} className="space-y-0.5 break-inside-avoid">
                                    <div className="flex justify-between items-baseline gap-1">
                                      <h4 className={`font-cinzel font-semibold text-stone-900 tracking-wide ${textClass.title}`}>
                                        {lang === 'es' ? item.nameEs : item.nameEn}
                                      </h4>
                                      <div className="flex-1 border-b border-dotted border-stone-300 mx-1"></div>
                                      <span className={`font-mono font-bold text-stone-800 shrink-0 ${textClass.price}`}>
                                        {item.price}
                                      </span>
                                    </div>
                                    {!page.hideDescriptions && (item.descEs || item.descEn) && (
                                      <p className={`text-stone-500 italic font-mono ${textClass.desc}`}>
                                        {lang === 'es' ? item.descEs : item.descEn}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Footer printed catalog reference row */}
                <footer className="text-center pt-4 border-t border-stone-100 text-[8.5px] text-stone-400 font-mono flex justify-between items-center mt-auto">
                  <span>Tel: {state?.generalInfo.phone || 'La Catedral'}</span>
                  <span>Mesa Reservas - Página {index + 1}</span>
                </footer>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
