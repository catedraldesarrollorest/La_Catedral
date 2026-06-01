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
  ChevronDown, Settings
} from 'lucide-react';
import { MenuItem, GalleryItem, GeneralInfo, CoverPage, AppState } from './types.js';
import { initialMenuItems, initialGalleryItems, initialGeneralInfo, initialCoverPage } from './initialData.js';

// === VALIDATION & NORMALIZATION LAYER ===
const normalizeMenuItem = (item: any): MenuItem => {
  if (!item || typeof item !== 'object') {
    throw new Error('Invalid item: not an object');
  }
  try {
    return {
      id: String(item.id || '').trim() || 'unknown-' + Date.now(),
      category: item.category as any || 'bebidas',
      subcategory: String(item.subcategory || '').trim() || 'General',
      nameEs: String(item.nameEs || '').trim() || '[Sin nombre ES]',
      nameEn: String(item.nameEn || '').trim() || '[No name EN]',
      descEs: String(item.descEs || '').trim() || '',
      descEn: String(item.descEn || '').trim() || '',
      price: String(item.price || '').trim() || '0 CUP',
      available: item.available === true || item.available === 1 || false
    };
  } catch (e) {
    console.error('Error normalizing item:', e);
    throw new Error(`Failed to normalize item: ${(e as any).message}`);
  }
};

const validateMenuItem = (item: MenuItem): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (!item.id) errors.push('Missing ID');
  if (!item.category) errors.push('Missing category');
  if (!item.nameEs) errors.push('Missing Spanish name');
  if (!item.price) errors.push('Missing price');
  return { valid: errors.length === 0, errors };
};

// === ERROR BOUNDARY COMPONENT ===
// === ULTRA-SIMPLE EDIT FORM ===
function SimpleEditForm({
  item,
  state,
  onSave,
  onCancel
}: {
  item: MenuItem
  state: AppState | null
  onSave: (newState: AppState) => void
  onCancel: () => void
}) {
  if (!state) return <div>No state</div>;

  return (
    <div style={{ padding: '20px', background: '#fff', border: '1px solid #ddd' }}>
      <h2 style={{ marginBottom: '20px' }}>{item.nameEs}</h2>

      <div style={{ marginBottom: '15px' }}>
        <label>Nombre (ES):</label><br />
        <input
          id="nameEs"
          type="text"
          defaultValue={item.nameEs}
          style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Precio:</label><br />
        <input
          id="price"
          type="text"
          defaultValue={item.price}
          style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>
          <input
            id="available"
            type="checkbox"
            defaultChecked={item.available}
          />
          {' '}Disponible
        </label>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => {
            try {
              // Get form values
              const nameEs = (document.getElementById('nameEs') as HTMLInputElement)?.value || item.nameEs;
              const price = (document.getElementById('price') as HTMLInputElement)?.value || item.price;
              const available = (document.getElementById('available') as HTMLInputElement)?.checked ?? item.available;

              // Update item
              const updatedItem = { ...item, nameEs, price, available };

              // Update state
              const updatedMenuItems = state.menuItems.map(i =>
                i.id === item.id ? updatedItem : i
              );
              const newState = { ...state, menuItems: updatedMenuItems };

              // Save
              onSave(newState);
            } catch (err) {
              alert('Error: ' + (err as any).message);
            }
          }}
          style={{ flex: 1, padding: '10px', background: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Guardar
        </button>
        <button
          onClick={onCancel}
          style={{ padding: '10px 20px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('React Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-red-900 text-white p-8 flex flex-col justify-center items-center z-50">
          <h1 className="text-4xl font-bold mb-4">⚠️ RENDER ERROR</h1>
          <p className="text-xl mb-4 text-center max-w-2xl">{this.state.error?.message}</p>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="bg-white text-red-900 px-6 py-3 font-bold rounded hover:bg-gray-200 transition"
          >
            RELOAD PAGE
          </button>
        </div>
      );
    }

    return this.props.children;
  }
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
  const [adminCategory, setAdminCategory] = useState<'portada' | 'menu' | 'galeria' | 'general'>('portada');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [toastMessage, setToastMessage] = useState<string>('');

  // Menu management inside Admin
  const [menuFilter, setMenuFilter] = useState<string>('');
  const [menuEditCategory, setMenuEditCategory] = useState<'all' | 'bebidas' | 'primeros' | 'principales' | 'postres' | 'espirituosos'>('all');
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [priceMultiplier, setPriceMultiplier] = useState<number>(1);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // General setting inputs (temp until saved)
  const [editedInfo, setEditedInfo] = useState<GeneralInfo | null>(null);


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
        generalInfo: initialGeneralInfo,
        coverPage: initialCoverPage
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
      generalInfo: initialGeneralInfo,
      coverPage: initialCoverPage
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

  const addDebugLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const fullMsg = `[${timestamp}] ${msg}`;
    console.log(fullMsg);
    setDebugLogs(prev => [...prev.slice(-9), fullMsg]);
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
            className={`cursor-pointer px-3 py-1 rounded-sm transition-all font-medium ${lang === 'es' ? 'bg-editorial-red text-white' : 'text-editorial-dark hover:bg-stone-100'}`}
          >
            ES
          </button>
          <div className="h-4 w-[1px] bg-stone-700 mx-1"></div>
          <button 
            onClick={() => setLang('en')} 
            className={`cursor-pointer px-3 py-1 rounded-sm transition-all font-medium ${lang === 'en' ? 'bg-editorial-red text-white' : 'text-editorial-dark hover:bg-stone-100'}`}
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
                  <div className="flex items-start gap-3 pt-12 border-t border-stone-200">
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
                    <div className="border-2 border-dashed border-stone-200 rounded-lg bg-stone-50/40 py-24 px-6 text-center">
                      <div className="flex flex-col items-center max-w-sm mx-auto space-y-3">
                        <div className="w-14 h-14 rounded-full bg-editorial-red/5 flex items-center justify-center">
                          <ImageIcon className="w-7 h-7 stroke-[1.5] text-editorial-red/50" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-editorial-dark">
                            {lang === 'es' ? 'Galería sin fotos aún' : 'Gallery Empty'}
                          </p>
                          <p className="text-xs text-stone-500 leading-relaxed">
                            {lang === 'es'
                              ? 'Sube las primeras fotos para que los clientes vean la atmósfera'
                              : 'Upload photos to showcase your venue'}
                          </p>
                        </div>
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
                        {/* Premium hover overlay with gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-editorial-dark via-editorial-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                          <div className="space-y-2 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <span className="text-white text-[10px] uppercase tracking-[0.4em] font-semibold font-cinzel block">
                              LA CATEDRAL
                            </span>
                            <p className="text-white/90 text-xs font-light font-sans">
                              {activeGalleryTab === 'local' && (lang === 'es' ? 'Atmósfera & Ambiente' : 'Venue & Atmosphere')}
                              {activeGalleryTab === 'bebidas' && (lang === 'es' ? 'Cócteles Artesanales' : 'Craft Cocktails')}
                              {activeGalleryTab === 'platos' && (lang === 'es' ? 'Creaciones Culinarias' : 'Culinary Creations')}
                              {activeGalleryTab === 'postres' && (lang === 'es' ? 'Postres Decadentes' : 'Decadent Desserts')}
                            </p>
                          </div>
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
                              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 sm:gap-6">
                                <div className="space-y-2 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h5 className="font-serif text-xl sm:text-2xl font-semibold text-editorial-dark leading-tight">
                                      {lang === 'es' ? item.nameEs : item.nameEn || item.nameEs}
                                    </h5>
                                    {!item.available && (
                                      <span className="bg-editorial-red/10 text-editorial-red text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold">
                                        {lang === 'es' ? 'Agotado' : 'Sold Out'}
                                      </span>
                                    )}
                                  </div>
                                  {(lang === 'es' ? item.descEs : item.descEn || item.descEs) && (
                                    <p className="text-sm text-stone-600 font-sans font-light leading-relaxed max-w-xl">
                                      {lang === 'es' ? item.descEs : item.descEn || item.descEs}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-baseline gap-2 sm:flex-col sm:items-end shrink-0">
                                  <span className="text-[11px] uppercase tracking-widest text-stone-400 font-semibold">
                                    {lang === 'es' ? 'Precio' : 'Price'}
                                  </span>
                                  <span className="font-cinzel text-lg sm:text-xl font-bold text-editorial-red">
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
                      setAdminCategory('portada');
                      setEditingItem(null);
                      setIsAddingNew(false);
                    }}
                    className={`cursor-pointer py-3.5 px-2 text-[10px] uppercase tracking-widest border-b-2 font-medium transition-all ${
                      adminCategory === 'portada' ? 'border-editorial-red text-white' : 'border-transparent hover:text-white'
                    }`}
                  >
                    📘 {lang === 'es' ? 'Portada' : 'Cover Page'}
                  </button>
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
                </div>

                {/* Main panel inner screen (can scroll) */}
                <div className="flex-1 overflow-y-auto bg-white border-l border-stone-200">

                  {/* COVER PAGE EDITOR */}
                  {adminCategory === 'portada' && state && (
                    <div className="p-4 sm:p-8 space-y-8">
                      <div>
                        <h2 className="font-cinzel text-2xl font-bold text-editorial-dark mb-6">
                          📘 {lang === 'es' ? 'Editor de Portada' : 'Cover Page Editor'}
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Left: Editor Controls */}
                          <div className="space-y-6 bg-white p-6 border border-stone-200 rounded">
                            <div>
                              <label className="text-sm font-bold text-stone-700 block mb-2">
                                {lang === 'es' ? 'Imagen de Portada' : 'Cover Image'}
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file && state) {
                                    const reader = new FileReader();
                                    reader.onload = (evt) => {
                                      if (evt.target?.result && state.coverPage) {
                                        const newCoverPage = { ...state.coverPage, imageSrc: evt.target.result as string };
                                        saveStateToServer({ ...state, coverPage: newCoverPage }, '📸 Imagen actualizada');
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="w-full border border-stone-300 rounded p-3 text-sm focus:outline-none focus:border-editorial-red"
                              />
                            </div>

                            <div>
                              <label className="text-sm font-bold text-stone-700 block mb-3">
                                {lang === 'es' ? 'Altura de Imagen (px)' : 'Image Height (px)'}
                              </label>
                              <input
                                type="range"
                                min="100"
                                max="600"
                                value={state.coverPage?.imageHeight || 250}
                                onChange={(e) => {
                                  if (state && state.coverPage) {
                                    const newCoverPage = { ...state.coverPage, imageHeight: parseInt(e.target.value) || 250 };
                                    saveStateToServer({ ...state, coverPage: newCoverPage }, 'Altura actualizada');
                                  }
                                }}
                                className="w-full h-2 bg-stone-300 rounded appearance-none cursor-pointer accent-editorial-red mb-3"
                              />
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    if (state && state.coverPage) {
                                      const height = Math.max(100, state.coverPage.imageHeight - 10);
                                      const newCoverPage = { ...state.coverPage, imageHeight: height };
                                      saveStateToServer({ ...state, coverPage: newCoverPage }, 'Altura actualizada');
                                    }
                                  }}
                                  className="px-3 py-2 bg-stone-200 hover:bg-stone-300 border border-stone-300 text-stone-700 font-bold text-sm rounded transition-all"
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  min="100"
                                  max="600"
                                  value={state.coverPage?.imageHeight || 250}
                                  onChange={(e) => {
                                    if (state && state.coverPage) {
                                      const height = Math.max(100, Math.min(600, parseInt(e.target.value) || 250));
                                      const newCoverPage = { ...state.coverPage, imageHeight: height };
                                      saveStateToServer({ ...state, coverPage: newCoverPage }, 'Altura actualizada');
                                    }
                                  }}
                                  className="flex-1 border border-stone-300 rounded p-3 text-sm text-center font-semibold focus:outline-none focus:border-editorial-red"
                                />
                                <span className="text-sm font-semibold text-stone-600 whitespace-nowrap">px</span>
                                <button
                                  onClick={() => {
                                    if (state && state.coverPage) {
                                      const height = Math.min(600, state.coverPage.imageHeight + 10);
                                      const newCoverPage = { ...state.coverPage, imageHeight: height };
                                      saveStateToServer({ ...state, coverPage: newCoverPage }, 'Altura actualizada');
                                    }
                                  }}
                                  className="px-3 py-2 bg-stone-200 hover:bg-stone-300 border border-stone-300 text-stone-700 font-bold text-sm rounded transition-all"
                                >
                                  +
                                </button>
                              </div>
                              <div className="text-xs text-stone-500 text-center mt-2">
                                {lang === 'es' ? 'Rango: 100px - 600px' : 'Range: 100px - 600px'}
                              </div>
                            </div>

                            {/* Spanish Title */}
                            <div>
                              <label className="text-sm font-bold text-stone-700 block mb-2">
                                {lang === 'es' ? 'Título (Español)' : 'Title (Spanish)'}
                              </label>
                              <input
                                type="text"
                                value={state.coverPage?.titleEs || ''}
                                onChange={(e) => {
                                  if (state && state.coverPage) {
                                    const newCoverPage = { ...state.coverPage, titleEs: e.target.value };
                                    saveStateToServer({ ...state, coverPage: newCoverPage }, 'Título actualizado');
                                  }
                                }}
                                className="w-full border border-stone-300 rounded p-3 text-sm focus:outline-none focus:border-editorial-red"
                              />
                            </div>

                            {/* English Title */}
                            <div>
                              <label className="text-sm font-bold text-stone-700 block mb-2">
                                {lang === 'es' ? 'Título (Inglés)' : 'Title (English)'}
                              </label>
                              <input
                                type="text"
                                value={state.coverPage?.titleEn || ''}
                                onChange={(e) => {
                                  if (state && state.coverPage) {
                                    const newCoverPage = { ...state.coverPage, titleEn: e.target.value };
                                    saveStateToServer({ ...state, coverPage: newCoverPage }, 'Título actualizado');
                                  }
                                }}
                                className="w-full border border-stone-300 rounded p-3 text-sm focus:outline-none focus:border-editorial-red"
                              />
                            </div>

                            {/* Spanish Subtitle */}
                            <div>
                              <label className="text-sm font-bold text-stone-700 block mb-2">
                                {lang === 'es' ? 'Subtítulo (Español)' : 'Subtitle (Spanish)'}
                              </label>
                              <textarea
                                value={state.coverPage?.subtitleEs || ''}
                                onChange={(e) => {
                                  if (state && state.coverPage) {
                                    const newCoverPage = { ...state.coverPage, subtitleEs: e.target.value };
                                    saveStateToServer({ ...state, coverPage: newCoverPage }, 'Subtítulo actualizado');
                                  }
                                }}
                                rows={3}
                                className="w-full border border-stone-300 rounded p-3 text-sm focus:outline-none focus:border-editorial-red"
                              />
                            </div>

                            {/* English Subtitle */}
                            <div>
                              <label className="text-sm font-bold text-stone-700 block mb-2">
                                {lang === 'es' ? 'Subtítulo (Inglés)' : 'Subtitle (English)'}
                              </label>
                              <textarea
                                value={state.coverPage?.subtitleEn || ''}
                                onChange={(e) => {
                                  if (state && state.coverPage) {
                                    const newCoverPage = { ...state.coverPage, subtitleEn: e.target.value };
                                    saveStateToServer({ ...state, coverPage: newCoverPage }, 'Subtítulo actualizado');
                                  }
                                }}
                                rows={3}
                                className="w-full border border-stone-300 rounded p-3 text-sm focus:outline-none focus:border-editorial-red"
                              />
                            </div>

                            {/* Gallery Photos Section */}
                            <div className="border-t border-stone-200 pt-6">
                              <h3 className="text-sm font-bold text-stone-700 mb-4">
                                {lang === 'es' ? 'Fotos de Galería' : 'Gallery Photos'}
                              </h3>
                              <div className="space-y-4">
                                {[
                                  { key: 'galleryPhoto1' as const, label: lang === 'es' ? 'Foto 1' : 'Photo 1' },
                                  { key: 'galleryPhoto2' as const, label: lang === 'es' ? 'Foto 2' : 'Photo 2' },
                                  { key: 'galleryPhoto3' as const, label: lang === 'es' ? 'Foto 3' : 'Photo 3' }
                                ].map(({ key, label }) => {
                                  const photoKey = key;
                                  return (
                                    <div key={photoKey}>
                                      <label className="text-xs font-bold text-stone-700 block mb-2">{label}</label>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file && state?.coverPage) {
                                            const reader = new FileReader();
                                            reader.onload = (evt) => {
                                              if (evt.target?.result && state.coverPage) {
                                                const newCoverPage = { ...state.coverPage, [photoKey]: evt.target.result as string };
                                                saveStateToServer({ ...state, coverPage: newCoverPage }, `📸 ${label} actualizada`);
                                              }
                                            };
                                            reader.readAsDataURL(file);
                                          }
                                        }}
                                        className="w-full border border-stone-300 rounded p-2 text-xs focus:outline-none focus:border-editorial-red"
                                      />
                                      {state.coverPage && state.coverPage[photoKey] && (
                                        <img
                                          src={state.coverPage[photoKey]}
                                          alt={label}
                                          className="mt-2 w-full h-24 rounded border border-stone-200 object-cover"
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Right: Preview */}
                          <div className="bg-stone-100 rounded border border-stone-300 p-6 flex flex-col items-center justify-center min-h-[600px]">
                            <div className="w-full max-w-sm space-y-4">
                              <h3 className="text-xs uppercase tracking-widest font-bold text-stone-500 text-center">
                                {lang === 'es' ? 'Vista Previa' : 'Preview'}
                              </h3>

                              {state.coverPage?.imageSrc && (
                                <img
                                  src={state.coverPage.imageSrc}
                                  alt="Cover"
                                  className="w-full rounded border border-stone-200"
                                  style={{ height: `${state.coverPage.imageHeight}px`, objectFit: 'cover' }}
                                />
                              )}

                              <div className="text-center space-y-2">
                                <h1 className="font-cinzel text-3xl font-bold text-editorial-dark">
                                  {lang === 'es' ? state.coverPage?.titleEs : state.coverPage?.titleEn}
                                </h1>
                                <p className="font-serif italic text-lg text-editorial-red">
                                  {lang === 'es' ? state.coverPage?.subtitleEs : state.coverPage?.subtitleEn}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB PANEL A: MENU ITEMS LIST OR EDIT/FORM */}
                  {adminCategory === 'menu' && state && (
                    <div className="p-4 sm:p-8 space-y-6">

                      {/* DEBUG LOG PANEL */}
                      {debugLogs.length > 0 && (
                        <div className="fixed bottom-4 right-4 bg-stone-900 text-stone-100 text-[10px] p-3 rounded border border-stone-700 max-w-xs max-h-40 overflow-y-auto font-mono z-40">
                          <div className="font-bold mb-2 text-stone-400">DEBUG:</div>
                          {debugLogs.map((log, i) => (
                            <div key={i} className="text-stone-300 whitespace-pre-wrap break-words">{log}</div>
                          ))}
                        </div>
                      )}

                      {!editingItem && (
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
                                  <div key={item.id} className="flex items-center gap-3 p-3 bg-white border border-stone-200 rounded hover:bg-stone-50 transition-colors">
                                    <input
                                      type="checkbox"
                                      checked={item.available}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleToggleAvailability(item.id);
                                      }}
                                      className="w-4 h-4 rounded border-stone-300 cursor-pointer shrink-0"
                                    />
                                    <div
                                      className="flex-1 cursor-pointer"
                                      onClick={() => {
                                        setEditingItem(item);
                                      }}
                                    >
                                      <p className="text-sm font-semibold">{item.nameEs}</p>
                                      <p className="text-xs text-stone-500">Precio: {item.price}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>
                      )}

                      {editingItem && (
                        <div style={{ padding: '20px', background: '#f5f5f5', border: '2px solid #333' }}>
                          <h3>{editingItem.nameEs}</h3>
                          <div style={{ marginBottom: '10px' }}>
                            <label>Nombre:</label>
                            <input
                              type="text"
                              defaultValue={editingItem.nameEs}
                              id="edit_nameEs"
                              style={{ width: '100%', padding: '5px' }}
                            />
                          </div>
                          <div style={{ marginBottom: '10px' }}>
                            <label>Precio:</label>
                            <input
                              type="text"
                              defaultValue={editingItem.price}
                              id="edit_price"
                              style={{ width: '100%', padding: '5px' }}
                            />
                          </div>
                          <div style={{ marginBottom: '10px' }}>
                            <label>
                              <input type="checkbox" id="edit_available" defaultChecked={editingItem.available} />
                              Disponible
                            </label>
                          </div>
                          <button
                            onClick={() => {
                              if (!state) return;
                              const nameEs = (document.getElementById('edit_nameEs') as HTMLInputElement).value;
                              const price = (document.getElementById('edit_price') as HTMLInputElement).value;
                              const available = (document.getElementById('edit_available') as HTMLInputElement).checked;

                              const updated = { ...editingItem, nameEs, price, available };
                              const newMenuItems = state.menuItems.map(item => item.id === editingItem.id ? updated : item);
                              saveStateToServer({ ...state, menuItems: newMenuItems }, 'Guardado');
                              setEditingItem(null);
                            }}
                            style={{ padding: '10px 20px', background: '#333', color: '#fff', marginRight: '10px' }}
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            style={{ padding: '10px 20px', background: '#ddd' }}
                          >
                            Cancelar
                          </button>
                        </div>
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


    </div>
  );
}
