import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sparkles, ArrowLeft, RefreshCw, Zap, Tag, ShoppingCart } from 'lucide-react';

const OCCASION_THEMES = {
  dussehra: {
    bgGradient: 'from-[#1c0d02] via-[#2a1304] to-[#0d0501]',
    borderColor: 'border-amber-500/60',
    glowShadow: 'shadow-[0_0_60px_rgba(245,158,11,0.3)]',
    titleGradient: 'from-amber-200 via-yellow-400 to-orange-500',
    accentBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    buttonGradient: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-600 text-black',
    emoji: '🏹',
    particleColor: '#f59e0b',
    festiveTag: 'DUSSEHRA CELEBRATION'
  },
  christmas: {
    bgGradient: 'from-[#1a0505] via-[#051a10] to-[#030d08]',
    borderColor: 'border-emerald-500/60',
    glowShadow: 'shadow-[0_0_60px_rgba(16,185,129,0.3)]',
    titleGradient: 'from-red-300 via-rose-400 to-emerald-400',
    accentBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    buttonGradient: 'bg-gradient-to-r from-red-600 via-rose-600 to-emerald-600 text-white',
    emoji: '🎄',
    particleColor: '#10b981',
    festiveTag: 'WINTER HOLIDAY SALE'
  },
  blackfriday: {
    bgGradient: 'from-black via-[#1c0206] to-[#0a0103]',
    borderColor: 'border-rose-500/70',
    glowShadow: 'shadow-[0_0_60px_rgba(244,63,94,0.4)]',
    titleGradient: 'from-slate-100 via-rose-500 to-red-600',
    accentBadge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    buttonGradient: 'bg-gradient-to-r from-rose-600 to-red-700 text-white',
    emoji: '🛍️',
    particleColor: '#f43f5e',
    festiveTag: 'CYBER FLASH SALE'
  },
  newyear: {
    bgGradient: 'from-[#070312] via-[#16042a] to-[#04010a]',
    borderColor: 'border-purple-500/60',
    glowShadow: 'shadow-[0_0_60px_rgba(168,85,247,0.3)]',
    titleGradient: 'from-purple-200 via-indigo-300 to-amber-300',
    accentBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    buttonGradient: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 text-white',
    emoji: '🎆',
    particleColor: '#a855f7',
    festiveTag: 'NEW YEAR CELEBRATION'
  },
  diwali: {
    bgGradient: 'from-[#1b0e02] via-[#241503] to-[#0e0701]',
    borderColor: 'border-yellow-500/60',
    glowShadow: 'shadow-[0_0_60px_rgba(234,179,8,0.3)]',
    titleGradient: 'from-amber-100 via-amber-300 to-yellow-500',
    accentBadge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    buttonGradient: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-black',
    emoji: '🪔',
    particleColor: '#eab308',
    festiveTag: 'FESTIVAL OF LIGHTS'
  },
  seasonal: {
    bgGradient: 'from-[#030712] via-[#090f24] to-[#030712]',
    borderColor: 'border-indigo-500/40',
    glowShadow: 'shadow-[0_0_40px_rgba(99,102,241,0.2)]',
    titleGradient: 'from-indigo-200 via-purple-300 to-cyan-400',
    accentBadge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    buttonGradient: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white',
    emoji: '⚡',
    particleColor: '#6366f1',
    festiveTag: 'SEASONAL SPECIAL'
  }
};

export const DemoStorePage = () => {
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState({ isActive: false });
  const [cartCount, setCartCount] = useState(0);
  const [checkoutModal, setCheckoutModal] = useState(null);

  const fetchCampaign = async () => {
    try {
      const data = await api.getCampaignStatus();
      setCampaign(data);
    } catch (err) {
      console.warn('Error fetching campaign status:', err);
    }
  };

  useEffect(() => {
    fetchCampaign();
    const interval = setInterval(fetchCampaign, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleReset = async () => {
    try {
      await api.resetCampaign();
      fetchCampaign();
    } catch (err) {
      alert('Failed to reset store campaign.');
    }
  };

  const activeThemeKey = campaign.isActive ? (campaign.occasionKey || 'seasonal') : 'seasonal';
  const theme = OCCASION_THEMES[activeThemeKey] || OCCASION_THEMES.seasonal;

  const products = [
    {
      id: 'p1',
      name: 'Lumina Pulse Max AR Glasses',
      category: 'Spatial Wearables',
      regularPrice: 34999,
      image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80',
      badge: 'Bestseller'
    },
    {
      id: 'p2',
      name: 'Lumina Studio Pro Spatial Headphones',
      category: 'Audio Architecture',
      regularPrice: 24999,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      badge: 'Hi-Res Audio'
    },
    {
      id: 'p3',
      name: 'Lumina Cyber Chrono Smart Watch',
      category: 'Biometric Tech',
      regularPrice: 19999,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      badge: 'Titanium'
    },
    {
      id: 'p4',
      name: 'Lumina Core AI Home Hub',
      category: 'Smart Home',
      regularPrice: 14999,
      image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=600&q=80',
      badge: 'Neural Engine'
    }
  ];

  const discountRate = campaign.isActive ? (campaign.discountPercentage || 35) : 0;

  const handleAddToCart = (product) => {
    setCartCount((prev) => prev + 1);
    const salePrice = campaign.isActive
      ? Math.round(product.regularPrice * (1 - discountRate / 100))
      : product.regularPrice;

    setCheckoutModal({ ...product, salePrice });
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 } });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.bgGradient} text-slate-100 font-sans selection:bg-amber-500 selection:text-black relative overflow-x-hidden transition-colors duration-700`}>
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white hover:border-indigo-500/40 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>ShadowBoard Console</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center font-black text-black text-xs shadow-md">
              {theme.emoji}
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wider text-white">LUMINA D2C</span>
              <span className="text-[10px] font-mono text-slate-400 block -mt-1">PREMIUM TECH STORE</span>
            </div>
          </div>
        </div>

        {/* Status Indicators & Reset */}
        <div className="flex items-center gap-3">
          {campaign.isActive ? (
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${theme.accentBadge} text-xs font-mono font-bold animate-pulse`}>
              <span>{theme.emoji}</span>
              {campaign.title || 'SPECIAL SALE'}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800 text-xs font-mono">
              STORE NORMAL MODE
            </span>
          )}

          {campaign.isActive && (
            <button
              onClick={handleReset}
              className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-mono transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Store
            </button>
          )}

          <div className="relative">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-white font-bold text-[10px] flex items-center justify-center shadow-lg">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Clean Consumer Top Bar */}
      {campaign.isActive && (
        <div className="w-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-black px-4 py-2 font-mono text-xs font-black flex items-center justify-center gap-3 shadow-xl tracking-wider uppercase">
          <Zap className="w-4 h-4 fill-current text-black animate-bounce" />
          <span>FESTIVE SPECIAL OFFER: FLAT {discountRate}% OFF STOREWIDE</span>
          <span className="bg-black/20 px-2.5 py-0.5 rounded text-[10px] text-white">COUPON: {campaign.promoCode}</span>
        </div>
      )}

      {/* Dynamic Occasion Hero Banner */}
      <section className="relative px-6 py-12 max-w-7xl mx-auto">
        {campaign.isActive ? (
          <motion.div
            key={activeThemeKey}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`relative rounded-3xl p-8 md:p-12 overflow-hidden bg-gradient-to-br ${theme.bgGradient} border ${theme.borderColor} ${theme.glowShadow} text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8`}
          >
            <div className="scanline" />
            <div className="space-y-4 max-w-2xl relative z-10">
              <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${theme.accentBadge} text-xs font-mono font-bold`}>
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                {theme.festiveTag} • {discountRate}% OFF CATALOG
              </div>

              <h1 className={`text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${theme.titleGradient} tracking-tight leading-tight`}>
                {campaign.title || 'FESTIVAL SPECIAL SALE'}
              </h1>

              <p className="text-sm md:text-base text-slate-200 leading-relaxed font-sans">
                {campaign.bannerText || `Special Celebration • Enjoy ${discountRate}% Off Across All Categories!`}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-amber-500/30 text-xs font-mono text-amber-300">
                  APPLY PROMO CODE: <span className="font-extrabold text-white text-sm ml-1">{campaign.promoCode}</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-cyan-300">
                  LIMITED TIME: <span className="font-bold text-white">VALID THIS WEEK</span>
                </div>
              </div>
            </div>

            {/* Glowing Occasion Badge Graphic */}
            <div className="relative shrink-0">
              <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 blur-2xl opacity-40 animate-pulse-glow absolute" />
              <div className={`w-36 h-36 rounded-3xl glass-panel-glow border ${theme.borderColor} flex flex-col items-center justify-center p-4 text-center relative z-10 shadow-2xl`}>
                <span className="text-4xl mb-1">{theme.emoji}</span>
                <span className="text-xs font-mono font-bold text-amber-300">FESTIVE DISCOUNT</span>
                <span className="text-2xl font-black text-white">{discountRate}% OFF</span>
              </div>
            </div>
          </motion.div>
        ) : (
          /* STANDARD STORE HERO BANNER */
          <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden glass-panel border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                LUMINA NEXT-GEN HARDWARE
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Architectural Audio & Spatial Tech
              </h1>
              <p className="text-sm text-slate-400 font-sans leading-relaxed">
                Precision-engineered wearables, spatial soundstages, and neural smart devices.
              </p>
            </div>

            <div className="w-32 h-32 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-4xl shadow-inner">
              ⚡
            </div>
          </div>
        )}
      </section>

      {/* Products Showcase Grid */}
      <section className="px-6 pb-16 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-white">Featured Catalog</h2>
            <p className="text-xs text-slate-400 font-mono">Live dynamic catalog pricing</p>
          </div>
          <span className="text-xs font-mono text-cyan-400">{products.length} ITEMS AVAILABLE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const salePrice = campaign.isActive
              ? Math.round(product.regularPrice * (1 - discountRate / 100))
              : product.regularPrice;

            return (
              <motion.div
                key={product.id}
                whileHover={{ y: -4 }}
                className={`glass-panel rounded-2xl overflow-hidden border transition-all ${
                  campaign.isActive
                    ? `${theme.borderColor} ${theme.glowShadow}`
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {campaign.isActive && (
                    <span className={`absolute top-3 left-3 ${theme.buttonGradient} text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1`}>
                      <Tag className="w-3 h-3" />
                      {discountRate}% OFF
                    </span>
                  )}
                  <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded border border-white/10">
                    {product.badge}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{product.category}</span>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{product.name}</h3>

                  <div className="flex items-baseline gap-2">
                    <span className={`text-base font-extrabold ${campaign.isActive ? 'text-amber-400' : 'text-white'}`}>
                      ₹{salePrice.toLocaleString('en-IN')}
                    </span>
                    {campaign.isActive && (
                      <span className="text-xs font-mono text-slate-500 line-through">
                        ₹{product.regularPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                      campaign.isActive
                        ? theme.buttonGradient
                        : 'bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/40'
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{campaign.isActive ? 'Buy with Festival Discount' : 'Add to Cart'}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Checkout Modal */}
      <AnimatePresence>
        {checkoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`w-full max-w-md glass-panel-glow border ${theme.borderColor} rounded-3xl p-6 shadow-2xl text-center space-y-4`}
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto text-2xl">
                {theme.emoji}
              </div>
              <h3 className="text-lg font-extrabold text-white">Order Confirmed!</h3>
              <p className="text-xs font-mono text-slate-300">
                Purchased <span className="text-white font-bold">{checkoutModal.name}</span> for{' '}
                <span className="text-amber-400 font-bold">₹{checkoutModal.salePrice.toLocaleString('en-IN')}</span>.
              </p>
              {campaign.isActive && (
                <div className={`p-3 rounded-xl ${theme.accentBadge} text-[11px] font-mono`}>
                  Applied Coupon {campaign.promoCode} ({discountRate}% Discount)!
                </div>
              )}
              <button
                onClick={() => setCheckoutModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-white hover:bg-slate-800 transition-all"
              >
                Continue Shopping
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
