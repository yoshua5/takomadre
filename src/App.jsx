import React, { useState, useEffect } from 'react';
import { 
  Menu as MenuIcon, 
  X, 
  Phone, 
  MapPin, 
  Clock, 
  Settings, 
  Lock, 
  Trash2, 
  Edit, 
  Plus, 
  RotateCcw, 
  LogOut, 
  ChevronRight, 
  Sparkles, 
  Utensils,
  Upload
} from 'lucide-react';

// --- Default Seed Data ---
const DEFAULT_PRODUCTS = [
  {
    id: "1",
    name: "Tacos",
    category: "Tacos",
    price: "115",
    img: "https://color-inspiration-ai.lovable.app/assets/tacos-G3OVRV4Q.jpg",
    desc: "Tortilla recién hecha, carne al carbón, cilantro, cebolla y salsa de la casa."
  },
  {
    id: "2",
    name: "Tortas",
    category: "Tortas",
    price: "70",
    img: "https://color-inspiration-ai.lovable.app/assets/torta-Cv_4YxIm.jpg",
    desc: "Pan crujiente relleno hasta el tope. La que mata el hambre de verdad."
  },
  {
    id: "3",
    name: "Alambres",
    category: "Alambres",
    price: "200",
    img: "https://color-inspiration-ai.lovable.app/assets/alambre-Dc9n9I27.jpg",
    desc: "Carne, pimientos, cebolla y queso fundido. Para compartir (o no)."
  },
  {
    id: "4",
    name: "Gringas",
    category: "Más",
    price: "85",
    img: "https://color-inspiration-ai.lovable.app/assets/gringa-DI0euVLW.jpg",
    desc: "Tortilla de harina, queso derretido y pastor. Simple. Perfecto."
  },
  {
    id: "5",
    name: "Burritos",
    category: "Burritos",
    price: "110",
    img: "https://color-inspiration-ai.lovable.app/assets/burrito-sdhvJfWk.jpg",
    desc: "Grandes, generosos, envueltos como Dios manda."
  },
  {
    id: "6",
    name: "Volcanes",
    category: "Más",
    price: "45",
    img: "https://color-inspiration-ai.lovable.app/assets/tacos-G3OVRV4Q.jpg",
    desc: "Tostada de queso fundido coronada con la carne de tu elección."
  }
];

const DEFAULT_CONFIG = {
  whatsappNumber: "525633227404",
  hours: "Lun — Dom · 6:00 PM — 1:00 AM",
  address: "Av. Palo Solo, esquina del campo",
  subAddress: "Junto a Plomería El Soplete · Naucalpan, Edo. de México",
  heroTitle: "Takonmadre",
  heroSubtitle: "Pastor al carbón girando lento. Tortilla recién hecha. Salsa que pica donde tiene que picar. Esto no es comida rápida — es tradición servida en segundos.",
  heroImage: "https://color-inspiration-ai.lovable.app/assets/hero-trompo-nsR5IOm3.jpg",
  mapLink: "https://www.google.com/maps/search/?api=1&query=Av.+Palo+Solo+Plomeria+El+Soplete+Naucalpan",
  mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.6372076044703!2d-99.27318182478546!3d19.428073881855663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d2011b98f2b7ad%3A0xe54e60bf76bc7e4c!2sAv%20Palo%20Solo%2C%20Naucalpan%20de%20Ju%C3%A1rez%2C%20M%C3%A9x.!5e0!3m2!1ses-419!2smx!4v1715690000000!5m2!1ses-419!2smx"
};

const LOCAL_STORAGE_KEYS = {
  products: "tkm_products_v1",
  config: "tkm_config_v1",
  adminAuth: "tkm_admin_auth"
};

export default function App() {
  // --- States ---
  const [products, setProducts] = useState([]);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  
  // Navigation & UI States
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");
  
  // Admin Login States
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // Admin Dashboard States
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: "", category: "Tacos", price: "", img: "", desc: "" });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [adminConfig, setAdminConfig] = useState(DEFAULT_CONFIG);

  // Custom Confirmation Dialog & Toast States
  const [productToDelete, setProductToDelete] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Navigation & Routing Helpers
  const navigateToHome = () => {
    setShowPasscodeModal(false);
    setShowAdminPanel(false);
    setPasscodeError("");
    // Push home route state to clean URL bar back to / without refreshing
    if (window.location.pathname !== '/' || window.location.hash !== '') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new Event('popstate'));
    }
  };

  // --- Initial Data Hydration ---
  useEffect(() => {
    // 1. Hydrate Products
    const storedProducts = localStorage.getItem(LOCAL_STORAGE_KEYS.products);
    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts));
      } catch (e) {
        setProducts(DEFAULT_PRODUCTS);
      }
    } else {
      setProducts(DEFAULT_PRODUCTS);
      localStorage.setItem(LOCAL_STORAGE_KEYS.products, JSON.stringify(DEFAULT_PRODUCTS));
    }

    // 2. Hydrate Configuration
    const storedConfig = localStorage.getItem(LOCAL_STORAGE_KEYS.config);
    if (storedConfig) {
      try {
        const parsed = JSON.parse(storedConfig);
        setConfig(parsed);
        setAdminConfig(parsed);
      } catch (e) {
        setConfig(DEFAULT_CONFIG);
        setAdminConfig(DEFAULT_CONFIG);
      }
    } else {
      setConfig(DEFAULT_CONFIG);
      setAdminConfig(DEFAULT_CONFIG);
      localStorage.setItem(LOCAL_STORAGE_KEYS.config, JSON.stringify(DEFAULT_CONFIG));
    }

    // 3. Hydrate Admin Authentication State
    const storedAuth = sessionStorage.getItem(LOCAL_STORAGE_KEYS.adminAuth);
    if (storedAuth === "true") {
      setIsAdmin(true);
    }

    // 4. URL Router Check
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const isAuth = sessionStorage.getItem(LOCAL_STORAGE_KEYS.adminAuth) === "true";
      
      if (path === '/admin' || hash === '#admin' || hash === '#/admin') {
        if (isAuth) {
          setIsAdmin(true);
          setShowAdminPanel(true);
          setShowPasscodeModal(false);
        } else {
          setShowPasscodeModal(true);
          setShowAdminPanel(false);
        }
      } else {
        setShowAdminPanel(false);
        setShowPasscodeModal(false);
      }
    };

    // Navbar Scroll Listener
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    
    // Initial routing execution on load
    handleLocationChange();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // --- Helper Functions ---
  const saveProductsToStorage = (updatedProducts) => {
    setProducts(updatedProducts);
    localStorage.setItem(LOCAL_STORAGE_KEYS.products, JSON.stringify(updatedProducts));
  };

  const saveConfigToStorage = (updatedConfig) => {
    setConfig(updatedConfig);
    setAdminConfig(updatedConfig);
    localStorage.setItem(LOCAL_STORAGE_KEYS.config, JSON.stringify(updatedConfig));
  };

  // WhatsApp Message Generator
  const getWhatsAppLink = (productName = "", productPrice = "") => {
    const baseUrl = `https://wa.me/${config.whatsappNumber}`;
    let text = "";
    if (productName && productPrice) {
      text = `Hola! Me gustaría ordenar un platillo de *${productName}* ($${productPrice}). ¿Me podrían tomar el pedido?`;
    } else {
      text = `Hola! Me gustaría ver la carta de hoy y hacer un pedido. ¿Me podrían atender?`;
    }
    return `${baseUrl}?text=${encodeURIComponent(text)}`;
  };

  // Local File Image Compressor and Optimizer
  const handleImageUpload = (file, callback) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with 0.75 quality for minimum storage footprint in localStorage
        const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
        callback(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // --- Admin Authentication Handlers ---
  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    if (passcode === "takon2024") {
      setIsAdmin(true);
      sessionStorage.setItem(LOCAL_STORAGE_KEYS.adminAuth, "true");
      setShowPasscodeModal(false);
      setPasscode("");
      setPasscodeError("");
      setShowAdminPanel(true);
    } else {
      setPasscodeError("Contraseña incorrecta. Intenta de nuevo.");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem(LOCAL_STORAGE_KEYS.adminAuth);
    navigateToHome();
  };

  // --- Admin Menu Management ---
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.desc) {
      alert("Por favor completa los campos principales (nombre, precio y descripción).");
      return;
    }
    const productToAdd = {
      ...newProduct,
      id: Date.now().toString(),
      img: newProduct.img || "https://color-inspiration-ai.lovable.app/assets/tacos-G3OVRV4Q.jpg"
    };
    const updated = [...products, productToAdd];
    saveProductsToStorage(updated);
    
    // Reset form
    setNewProduct({ name: "", category: "Tacos", price: "", img: "", desc: "" });
    setIsAddingNew(false);
  };

  const handleStartEdit = (product) => {
    setEditingProduct({ ...product });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingProduct.name || !editingProduct.price || !editingProduct.desc) {
      alert("Por favor completa los campos principales.");
      return;
    }
    const updated = products.map(p => p.id === editingProduct.id ? editingProduct : p);
    saveProductsToStorage(updated);
    setEditingProduct(null);
  };

  // --- Admin Config Management ---
  const handleSaveConfig = (e) => {
    e.preventDefault();
    saveConfigToStorage(adminConfig);
    setShowSaveToast(true);
    setTimeout(() => {
      setShowSaveToast(false);
    }, 4000);
  };

  // --- Categories Setup ---
  // Get all unique categories
  const categories = ["Todos", ...new Set(products.map(p => p.category))];

  // Filter products by category
  const filteredProducts = activeCategory === "Todos" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="app-root">
      
      {/* ==========================================
         CUSTOMER VIEW
         ========================================== */}
      
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <a href="#top" className="logo">
            <span>🌮</span>TAKONMADRE
          </a>
          
          <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <li><a href="#menu" onClick={() => setMobileMenuOpen(false)}>Menú</a></li>
            <li><a href="#carnes" onClick={() => setMobileMenuOpen(false)}>Carnes</a></li>
            <li><a href="#visita" onClick={() => setMobileMenuOpen(false)}>Visítanos</a></li>
            {isAdmin && (
              <li>
                <button 
                  onClick={() => { setMobileMenuOpen(false); setShowAdminPanel(true); }}
                  className="tab-btn active"
                  style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Settings size={14} /> Backoffice
                </button>
              </li>
            )}
          </ul>
          
          <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
            <button className="nav-btn">
              <Phone size={16} /> Ordena Ya
            </button>
          </a>
          
          <button className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="top" className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${config.heroImage})` }}></div>
        <div className="hero-overlay"></div>
        <div className="hero-overlay-bottom"></div>
        
        <div className="container">
          <div className="hero-content">
            <h1>
              {config.heroTitle}
              <span>El verdadero sabor</span>
            </h1>
            <p>{config.heroSubtitle}</p>
            <div className="hero-actions">
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                <button className="btn btn-primary">
                  <Phone size={18} /> Ordenar por WhatsApp
                </button>
              </a>
              <a href="#visita">
                <button className="btn btn-secondary">
                  Ver ubicación
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 01 — Lo que servimos (Menú) */}
      <section id="menu" className="section section-dark">
        <div className="container">
          <span className="section-number">01 — La carta</span>
          <h2 className="section-title">Lo que servimos</h2>
          <p className="section-subtitle">Sin menús kilométricos. Solo lo bueno, hecho como debe ser, todos los días.</p>
          
          {/* Menu Categories */}
          <div className="menu-tabs">
            {categories.map(cat => (
              <button 
                key={cat}
                className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="menu-grid">
            {filteredProducts.map(product => (
              <div className="menu-card" key={product.id}>
                <div className="card-img-wrapper">
                  <img src={product.img} alt={product.name} className="card-img" />
                  <div className="card-overlay"></div>
                  <span className="card-badge badge badge-red">{product.category}</span>
                </div>
                
                <div className="card-body">
                  <div className="card-header-row">
                    <h3 className="card-title">{product.name}</h3>
                    <span className="card-price">${product.price}</span>
                  </div>
                  <p className="card-desc">{product.desc}</p>
                  
                  <a href={getWhatsAppLink(product.name, product.price)} target="_blank" rel="noopener noreferrer">
                    <button className="card-btn">
                      <Phone size={14} /> Ordenar
                    </button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 02 — Las carnes (Elige tu guisado) */}
      <section id="carnes" className="section section-charcoal">
        <div className="container">
          <span className="section-number">02 — Las carnes</span>
          <h2 className="section-title">Elige tu guisado</h2>
          <p className="section-subtitle">La calidad de nuestra carne es innegociable. Trabajamos con los mejores cortes y recetas artesanales de la casa.</p>
          
          <div className="meats-grid">
            <div className="meat-card">
              <span className="meat-icon">🍍</span>
              <h3 className="meat-name">Pastor</h3>
              <p className="meat-desc">El rey del trompo. Carne de cerdo marinada con achiote y especias, cocinada a fuego lento al carbón y coronada con piña fresca.</p>
            </div>
            <div className="meat-card">
              <span className="meat-icon">🥩</span>
              <h3 className="meat-name">Suadero</h3>
              <p className="meat-desc">Carne de res tierna y jugosa, confitada lentamente en su propia grasa con el toque perfecto de sazón y cocción de la casa.</p>
            </div>
            <div className="meat-card">
              <span className="meat-icon">🌭</span>
              <h3 className="meat-name">Longaniza</h3>
              <p className="meat-desc">Longaniza premium de cerdo, doradita a la plancha con cebollitas asadas y sazón picante tradicional muy equilibrado.</p>
            </div>
            <div className="meat-card">
              <span className="meat-icon">🥘</span>
              <h3 className="meat-name">Tripa</h3>
              <p className="meat-desc">Dorada por fuera, tierna por dentro. Limpia a la perfección y frita al punto exacto de tostado que tú decidas ordenar.</p>
            </div>
            <div className="meat-card">
              <span className="meat-icon">👅</span>
              <h3 className="meat-name">Lengua</h3>
              <p className="meat-desc">Super suave y extremadamente jugosa, cocida al vapor lentamente con hierbas aromáticas. Una verdadera delicia mexicana.</p>
            </div>
            <div className="meat-card">
              <span className="meat-icon">👑</span>
              <h3 className="meat-name">Campechano</h3>
              <p className="meat-desc">La combinación ideal para indecisos: la jugosidad del suadero deshebrado mezclado con el sabor audaz de la longaniza dorada.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 03 — Visítanos (Aquí te esperamos) */}
      <section id="visita" className="section section-dark">
        <div className="container">
          <span className="section-number">03 — Visítanos</span>
          <h2 className="section-title">Aquí te esperamos</h2>
          <p className="section-subtitle">Llega con hambre. Vete con la panza llena y la gran promesa de regresar mañana.</p>
          
          <div className="contact-layout">
            <div className="contact-info">
              {/* Card 1: Location */}
              <div className="contact-card">
                <div className="contact-icon-wrapper">
                  <MapPin size={24} />
                </div>
                <div className="contact-details">
                  <h3>Nueva ubicación</h3>
                  <p><strong>{config.address}</strong></p>
                  <p>{config.subAddress}</p>
                  <a href={config.mapLink} target="_blank" rel="noopener noreferrer">
                    Cómo llegar <ChevronRight size={14} />
                  </a>
                </div>
              </div>
              
              {/* Card 2: Hours */}
              <div className="contact-card">
                <div className="contact-icon-wrapper">
                  <Clock size={24} />
                </div>
                <div className="contact-details">
                  <h3>Horarios</h3>
                  <p>{config.hours}</p>
                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                    Pide por WhatsApp <ChevronRight size={14} />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Embed Map */}
            <div className="map-wrapper">
              <iframe 
                src={config.mapEmbed}
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Takonmadre Ubicación Palo Solo"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              🌮TAKON<span>MADRE</span>
            </div>
            <div className="footer-address">
              {config.address} · Naucalpan, EdoMex
            </div>
            <ul className="footer-links">
              <li><a href="#menu">Menú</a></li>
              <li><a href="#carnes">Carnes</a></li>
              <li><a href="#visita">Ubicación</a></li>
            </ul>
          </div>
          
          <div className="footer-bottom">
            <div>
              © 2026 Takonmadre · Naucalpan, México. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>

      {/* ==========================================
         MODALS & BACKOFFICE PANEL
         ========================================== */}
      
      {/* 1. PASSCODE LOGIN MODAL */}
      {showPasscodeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={navigateToHome}>
              <X size={18} />
            </button>
            
            <form onSubmit={handlePasscodeSubmit} className="passcode-form">
              <div style={{ color: 'var(--brand-yellow)', marginBottom: '16px', display: 'inline-block' }}>
                <Lock size={40} />
              </div>
              <h2>Acceso Backoffice</h2>
              <p>Introduce la contraseña de administrador de Takonmadre para realizar cambios.</p>
              
              <div className="form-group">
                <label>Contraseña de acceso</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={passcode} 
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  required
                />
                {passcodeError && <span className="error-text">{passcodeError}</span>}
              </div>
              
              <button type="submit" className="btn btn-primary btn-block">
                Desbloquear Panel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. ADMIN LARGE DASHBOARD OVERLAY */}
      {showAdminPanel && isAdmin && (
        <div className="admin-overlay">
          <header className="admin-header">
            <div className="container">
              <div className="admin-logo">
                🌮 TAKONMADRE <span>BACKOFFICE</span>
              </div>
              <div className="admin-actions-top">
                <button 
                  onClick={navigateToHome} 
                  className="btn btn-secondary" 
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Volver al Sitio
                </button>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-primary" 
                  style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#331110', border: '1px solid rgba(255, 74, 74, 0.2)', boxShadow: 'none' }}
                >
                  <LogOut size={14} style={{ marginRight: '6px' }} /> Cerrar Sesión
                </button>
              </div>
            </div>
          </header>

          <main className="admin-body">
            <div className="container">
              <div className="admin-grid">
                
                {/* Column Left: Products List & Edit Forms */}
                <div>
                  <div className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                      <h2 style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
                        <Utensils size={18} /> Gestión de la Carta ({products.length})
                      </h2>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => setShowResetConfirm(true)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <RotateCcw size={14} /> Restaurar Menú
                        </button>
                        <button 
                          onClick={() => { setIsAddingNew(true); setEditingProduct(null); }}
                          className="btn btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Plus size={14} /> Nuevo Platillo
                        </button>
                      </div>
                    </div>

                    <div className="admin-table-wrapper">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map(p => (
                            <tr key={p.id}>
                              <td>
                                <img src={p.img} alt={p.name} className="table-img" />
                              </td>
                              <td style={{ fontWeight: '600' }}>{p.name}</td>
                              <td>
                                <span className="badge badge-red">{p.category}</span>
                              </td>
                              <td style={{ color: 'var(--brand-yellow)', fontWeight: '600' }}>${p.price}</td>
                              <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.desc}</td>
                              <td>
                                <div className="table-actions">
                                  <button 
                                    className="icon-btn icon-btn-edit" 
                                    onClick={() => handleStartEdit(p)}
                                    title="Editar platillo"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button 
                                    className="icon-btn icon-btn-delete" 
                                    onClick={() => setProductToDelete(p)}
                                    title="Eliminar platillo"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Column Right: Action Panel (Edit Form or Add Form or Config Form) */}
                <div>
                  
                  {/* Option A: Editing Product Form */}
                  {editingProduct && (
                    <div className="admin-card" style={{ border: '1px solid var(--brand-yellow)' }}>
                      <h2>Editar Platillo</h2>
                      <form onSubmit={handleSaveEdit}>
                        <div className="form-group">
                          <label>Nombre del Platillo</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            required
                          />
                        </div>

                        <div className="admin-row">
                          <div className="form-group">
                            <label>Categoría</label>
                            <select 
                              className="form-control"
                              value={editingProduct.category}
                              onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                            >
                              <option value="Tacos">Tacos</option>
                              <option value="Tortas">Tortas</option>
                              <option value="Alambres">Alambres</option>
                              <option value="Burritos">Burritos</option>
                              <option value="Más">Más</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Precio ($ MXN)</label>
                            <input 
                              type="number" 
                              className="form-control"
                              value={editingProduct.price}
                              onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Imagen del Platillo</label>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input 
                              type="text" 
                              className="form-control"
                              value={editingProduct.img}
                              onChange={(e) => setEditingProduct({ ...editingProduct, img: e.target.value })}
                              placeholder="Enlace de la imagen o sube una desde tu PC..."
                              style={{ flexGrow: 1 }}
                            />
                            <div className="file-upload-trigger" style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                              <button type="button" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', padding: '10px 14px' }}>
                                <Upload size={14} /> Subir Foto
                              </button>
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  handleImageUpload(file, (base64) => {
                                    setEditingProduct({ ...editingProduct, img: base64 });
                                  });
                                }}
                                style={{ position: 'absolute', left: 0, top: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                              />
                            </div>
                          </div>
                          {editingProduct.img && editingProduct.img.startsWith('data:') && (
                            <small style={{ color: 'var(--brand-yellow)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                              ✓ Imagen cargada desde tu equipo (optimizada).
                            </small>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Descripción / Ingredientes</label>
                          <textarea 
                            className="form-control"
                            rows="3"
                            value={editingProduct.desc}
                            onChange={(e) => setEditingProduct({ ...editingProduct, desc: e.target.value })}
                            required
                          ></textarea>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                          <button type="submit" className="btn btn-primary" style={{ flexGrow: 1, padding: '12px' }}>
                            Guardar Cambios
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setEditingProduct(null)} 
                            className="btn btn-secondary"
                            style={{ padding: '12px 20px' }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Option B: Adding Product Form */}
                  {isAddingNew && (
                    <div className="admin-card" style={{ border: '1px solid var(--brand-red)' }}>
                      <h2>Añadir Nuevo Platillo</h2>
                      <form onSubmit={handleAddProduct}>
                        <div className="form-group">
                          <label>Nombre del Platillo</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            placeholder="Ej. Tacos al Pastor"
                            required
                          />
                        </div>

                        <div className="admin-row">
                          <div className="form-group">
                            <label>Categoría</label>
                            <select 
                              className="form-control"
                              value={newProduct.category}
                              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            >
                              <option value="Tacos">Tacos</option>
                              <option value="Tortas">Tortas</option>
                              <option value="Alambres">Alambres</option>
                              <option value="Burritos">Burritos</option>
                              <option value="Más">Más</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Precio ($ MXN)</label>
                            <input 
                              type="number" 
                              className="form-control"
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                              placeholder="25"
                              required
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Imagen del Platillo</label>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input 
                              type="text" 
                              className="form-control"
                              value={newProduct.img}
                              onChange={(e) => setNewProduct({ ...newProduct, img: e.target.value })}
                              placeholder="URL de la imagen o sube una desde tu PC..."
                              style={{ flexGrow: 1 }}
                            />
                            <div className="file-upload-trigger" style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                              <button type="button" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', padding: '10px 14px' }}>
                                <Upload size={14} /> Subir Foto
                              </button>
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  handleImageUpload(file, (base64) => {
                                    setNewProduct({ ...newProduct, img: base64 });
                                  });
                                }}
                                style={{ position: 'absolute', left: 0, top: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                              />
                            </div>
                          </div>
                          {newProduct.img && newProduct.img.startsWith('data:') && (
                            <small style={{ color: 'var(--brand-yellow)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                              ✓ Imagen cargada desde tu equipo (optimizada).
                            </small>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Descripción / Ingredientes</label>
                          <textarea 
                            className="form-control"
                            rows="3"
                            value={newProduct.desc}
                            onChange={(e) => setNewProduct({ ...newProduct, desc: e.target.value })}
                            placeholder="Ingredientes principales del platillo..."
                            required
                          ></textarea>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                          <button type="submit" className="btn btn-primary" style={{ flexGrow: 1, padding: '12px' }}>
                            Agregar a la Carta
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setIsAddingNew(false)} 
                            className="btn btn-secondary"
                            style={{ padding: '12px 20px' }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Option C: Global Site Config Settings Form (Always visible if no product is being edited/added) */}
                  {!editingProduct && !isAddingNew && (
                    <div className="admin-card">
                      <h2>Configuración General</h2>
                      <form onSubmit={handleSaveConfig}>
                        <div className="form-group">
                          <label>Teléfono de Pedidos (WhatsApp)</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={adminConfig.whatsappNumber}
                            onChange={(e) => setAdminConfig({ ...adminConfig, whatsappNumber: e.target.value })}
                            placeholder="525500000000"
                            required
                          />
                          <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                            Prefijo de país + número sin espacios (Ej: 52 para México + 10 dígitos).
                          </small>
                        </div>

                        <div className="form-group">
                          <label>Horarios del Establecimiento</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={adminConfig.hours}
                            onChange={(e) => setAdminConfig({ ...adminConfig, hours: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Dirección Principal</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={adminConfig.address}
                            onChange={(e) => setAdminConfig({ ...adminConfig, address: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Detalles de Ubicación (Cruces / Referencia)</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={adminConfig.subAddress}
                            onChange={(e) => setAdminConfig({ ...adminConfig, subAddress: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Google Maps Link de Navegación</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={adminConfig.mapLink}
                            onChange={(e) => setAdminConfig({ ...adminConfig, mapLink: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Google Maps Link de Embed (Iframe SRC)</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={adminConfig.mapEmbed}
                            onChange={(e) => setAdminConfig({ ...adminConfig, mapEmbed: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Título de la Portada (Hero)</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={adminConfig.heroTitle}
                            onChange={(e) => setAdminConfig({ ...adminConfig, heroTitle: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Subtítulo de la Portada</label>
                          <textarea 
                            className="form-control"
                            rows="3"
                            value={adminConfig.heroSubtitle}
                            onChange={(e) => setAdminConfig({ ...adminConfig, heroSubtitle: e.target.value })}
                            required
                          ></textarea>
                        </div>

                        <div className="form-group">
                          <label>Imagen de Portada (URL)</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={adminConfig.heroImage}
                            onChange={(e) => setAdminConfig({ ...adminConfig, heroImage: e.target.value })}
                            required
                          />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '20px' }}>
                          Guardar Configuración General
                        </button>
                      </form>
                    </div>
                  )}

                </div>

              </div>
            </div>
          </main>
        </div>
      )}

      {/* ==========================================
         CUSTOM MODALS & BANNER OVERLAYS (FOR RELIABLE INTERACTIVE FLOW)
         ========================================== */}
      
      {/* 3. DELETE CONFIRMATION MODAL */}
      {productToDelete && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
            <div style={{ color: 'var(--brand-red)', marginBottom: '16px', display: 'inline-block' }}>
              <Trash2 size={48} />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>¿Eliminar Platillo?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem', lineHeight: '1.5' }}>
              ¿Estás seguro de que deseas eliminar <strong>{productToDelete.name}</strong> de la carta? Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => {
                  const updated = products.filter(p => p.id !== productToDelete.id);
                  saveProductsToStorage(updated);
                  setProductToDelete(null);
                }}
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px' }}
              >
                Sí, Eliminar
              </button>
              <button 
                onClick={() => setProductToDelete(null)}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '12px' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. RESET CONFIRMATION MODAL */}
      {showResetConfirm && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
            <div style={{ color: 'var(--brand-yellow)', marginBottom: '16px', display: 'inline-block' }}>
              <RotateCcw size={48} />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>¿Restaurar Menú?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem', lineHeight: '1.5' }}>
              ¿Estás seguro de que deseas restaurar el menú original de <strong>Takonmadre</strong>? Se perderán todos tus platillos nuevos y cambios actuales.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => {
                  saveProductsToStorage(DEFAULT_PRODUCTS);
                  setShowResetConfirm(false);
                }}
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px' }}
              >
                Sí, Restaurar
              </button>
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '12px' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. GORGEOUS FLOATING SAVE TOAST */}
      {showSaveToast && (
        <div className="save-toast" style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(27, 25, 24, 0.95)',
          border: '1px solid var(--brand-yellow)',
          boxShadow: '0 0 25px rgba(255, 204, 51, 0.3)',
          padding: '16px 24px',
          borderRadius: '8px',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 9999,
          animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <Sparkles size={20} style={{ color: 'var(--brand-yellow)' }} />
          <span style={{ fontWeight: '500' }}>¡Configuración general guardada exitosamente!</span>
        </div>
      )}

    </div>
  );
}
