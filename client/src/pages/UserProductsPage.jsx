import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../api';

// Category config — icon, accent colour, border colour
const CATEGORY_CONFIG = {
    'Solar Panels': {
        icon: '🌞',
        accent: 'text-yellow-400',
        border: 'border-yellow-500/30',
        badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        glow: 'bg-yellow-500/5',
    },
    'Solar Inverter': {
        icon: '⚡',
        accent: 'text-blue-400',
        border: 'border-blue-500/30',
        badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        glow: 'bg-blue-500/5',
    },
    Others: {
        icon: '📦',
        accent: 'text-slate-400',
        border: 'border-white/10',
        badge: 'bg-white/5 text-slate-400 border-white/10',
        glow: 'bg-white/5',
    },
};

const CATEGORY_ORDER = ['Solar Panels', 'Solar Inverter', 'Others'];

const getConfig = (cat) =>
    CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['Others'];

export default function UserProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState(0);

    useEffect(() => {
        api
            .get('/api/admin/products/catalog')
            .then((res) => setProducts(res.data.products || []))
            .catch(() => setError('Failed to load product catalog. Please try again later.'))
            .finally(() => setLoading(false));
    }, []);

    // ── Filter state derived values ──
    const maxPrice = products.length
        ? Math.max(...products.map((p) => Number(p.productPrice) || 0))
        : 0;

    // Initialise slider ceiling whenever products first load
    const [sliderMax, setSliderMax] = useState(0);
    React.useEffect(() => {
        if (maxPrice > 0 && sliderMax === 0) setSliderMax(maxPrice);
    }, [maxPrice]);

    // Combined filter: search (name OR category) AND price ≤ sliderMax
    const filteredProducts = products.filter((p) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
            !q ||
            (p.productName || '').toLowerCase().includes(q) ||
            (p.productCategory || '').toLowerCase().includes(q);
        const matchesPrice = Number(p.productPrice) <= sliderMax;
        return matchesSearch && matchesPrice;
    });

    // Group FILTERED products by category, preserving CATEGORY_ORDER
    const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
        const items = filteredProducts.filter((p) => p.productCategory === cat);
        if (items.length > 0) acc[cat] = items;
        return acc;
    }, {});

    // Any categories not in CATEGORY_ORDER go to Others
    filteredProducts.forEach((p) => {
        if (!CATEGORY_ORDER.includes(p.productCategory)) {
            if (!grouped['Others']) grouped['Others'] = [];
            grouped['Others'].push(p);
        }
    });

    const totalProducts = products.length;
    const isFiltering = searchQuery.trim() !== '' || sliderMax !== maxPrice;
    const filteredCount = filteredProducts.length;

    return (
        <DashboardLayout title="Product Prices">
            <div className="space-y-10 animate-in fade-in duration-700">

                {/* ── Page Header ── */}
                <div className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl group">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/15 transition-all duration-700 pointer-events-none" />
                    <div className="relative z-10">
                        {/* Title row */}
                        <div className="flex items-center gap-6 mb-4">
                            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
                                🏷️
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                                    Product Catalog
                                </h1>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                                    View-Only · Solar Aid Price List · 2026
                                </p>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl italic font-medium mb-7">
                            Browse the latest solar product offerings available through Solar Aid. Prices are
                            listed in Sri Lankan Rupees (Rs.). Contact support to place an order.
                        </p>

                        {/* ── Search & Filter Controls ── */}
                        {!loading && !error && (
                            <div className="flex flex-col sm:flex-row gap-6 pt-6 border-t border-white/10">

                                {/* Search bar */}
                                <div className="flex-1 min-w-0">
                                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">
                                        🔍 Search by Name or Category
                                    </label>
                                    <div className="relative">
                                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                                        </svg>
                                        <input
                                            id="product-search"
                                            type="text"
                                            placeholder="e.g. Solar Panel 400W or Solar Inverter…"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                                aria-label="Clear search"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Price Range Slider */}
                                <div className="flex-1 min-w-0">
                                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">
                                        💰 Price Range
                                    </label>
                                    {/* Range display */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider">
                                            Rs. 0
                                        </span>
                                        <span className="px-3 py-1 bg-blue-500/15 border border-blue-500/30 rounded-lg text-xs font-black text-blue-300 tracking-wide">
                                            Up to Rs. {Number(sliderMax).toLocaleString('en-LK')}
                                        </span>
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider">
                                            Rs. {Number(maxPrice).toLocaleString('en-LK')}
                                        </span>
                                    </div>
                                    {/* Slider */}
                                    <div className="relative">
                                        <style>{`
                                            #price-slider {
                                                -webkit-appearance: none;
                                                appearance: none;
                                                width: 100%;
                                                height: 6px;
                                                border-radius: 9999px;
                                                outline: none;
                                                cursor: pointer;
                                                background: linear-gradient(
                                                    to right,
                                                    #3b82f6 0%,
                                                    #3b82f6 ${maxPrice > 0 ? (sliderMax / maxPrice) * 100 : 100}%,
                                                    rgba(255,255,255,0.08) ${maxPrice > 0 ? (sliderMax / maxPrice) * 100 : 100}%,
                                                    rgba(255,255,255,0.08) 100%
                                                );
                                            }
                                            #price-slider::-webkit-slider-thumb {
                                                -webkit-appearance: none;
                                                appearance: none;
                                                width: 20px;
                                                height: 20px;
                                                border-radius: 50%;
                                                background: #3b82f6;
                                                border: 3px solid #1e3a8a;
                                                box-shadow: 0 0 0 3px rgba(59,130,246,0.3), 0 2px 8px rgba(59,130,246,0.4);
                                                cursor: pointer;
                                                transition: box-shadow 0.15s ease, transform 0.15s ease;
                                            }
                                            #price-slider::-webkit-slider-thumb:hover {
                                                box-shadow: 0 0 0 5px rgba(59,130,246,0.4), 0 2px 10px rgba(59,130,246,0.6);
                                                transform: scale(1.15);
                                            }
                                            #price-slider::-moz-range-thumb {
                                                width: 20px;
                                                height: 20px;
                                                border-radius: 50%;
                                                background: #3b82f6;
                                                border: 3px solid #1e3a8a;
                                                box-shadow: 0 0 0 3px rgba(59,130,246,0.3);
                                                cursor: pointer;
                                            }
                                        `}</style>
                                        <input
                                            id="price-slider"
                                            type="range"
                                            min={0}
                                            max={maxPrice || 1}
                                            step={Math.max(1, Math.ceil(maxPrice / 500))}
                                            value={sliderMax}
                                            onChange={(e) => setSliderMax(Number(e.target.value))}
                                        />
                                    </div>
                                    {/* Reset link */}
                                    {sliderMax !== maxPrice && (
                                        <button
                                            onClick={() => setSliderMax(maxPrice)}
                                            className="mt-1.5 text-[9px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest transition-colors"
                                        >
                                            Reset range
                                        </button>
                                    )}
                                </div>

                            </div>
                        )}

                        {/* Active filter result count */}
                        {!loading && !error && isFiltering && (
                            <p className="mt-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                Showing{' '}
                                <span className="text-blue-400">{filteredCount}</span>
                                {' '}of{' '}
                                <span className="text-white">{totalProducts}</span>
                                {' '}products
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Summary Strip ── */}
                {!loading && !error && (
                    <div className="flex flex-wrap gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4">
                            <span className="text-2xl">📦</span>
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Products</p>
                                <p className="text-xl font-black text-white">{totalProducts}</p>
                            </div>
                        </div>
                        {CATEGORY_ORDER.map((cat) =>
                            grouped[cat] ? (
                                <div key={cat} className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4">
                                    <span className="text-2xl">{getConfig(cat).icon}</span>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{cat}</p>
                                        <p className={`text-xl font-black ${getConfig(cat).accent}`}>{grouped[cat].length}</p>
                                    </div>
                                </div>
                            ) : null
                        )}
                    </div>
                )}

                {/* ── Loading ── */}
                {loading && (
                    <div className="flex items-center justify-center h-64 bg-white/5 border border-white/5 rounded-3xl">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
                            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
                                Fetching Product Catalog...
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Error ── */}
                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 flex items-start gap-4 text-rose-400">
                        <span className="text-2xl flex-shrink-0">⚠️</span>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest">{error}</p>
                        </div>
                    </div>
                )}

                {/* ── Category Sections ── */}
                {!loading && !error && (
                    <div className="space-y-12">
                        {Object.entries(grouped).map(([category, items]) => {
                            const cfg = getConfig(category);
                            return (
                                <section key={category}>
                                    {/* Category Header */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${cfg.glow} border ${cfg.border}`}>
                                            {cfg.icon}
                                        </div>
                                        <div>
                                            <h2 className={`text-lg font-black uppercase tracking-widest ${cfg.accent}`}>
                                                {category}
                                            </h2>
                                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                                                {items.length} product{items.length !== 1 ? 's' : ''} available
                                            </p>
                                        </div>
                                        <div className={`flex-1 h-px ${cfg.glow} border-t ${cfg.border} ml-2`} />
                                    </div>

                                    {/* Product Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                        {items.map((p) => (
                                            <div
                                                key={p._id}
                                                className={`bg-white/5 backdrop-blur-md border ${cfg.border} rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 group relative`}
                                            >
                                                {/* Category badge top-right */}
                                                <div className="absolute top-3 right-3 z-10">
                                                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${cfg.badge}`}>
                                                        {category}
                                                    </span>
                                                </div>

                                                {/* Product Image */}
                                                <div className="w-full aspect-video bg-white/5 border-b border-white/5 flex items-center justify-center overflow-hidden">
                                                    {p.productPicture ? (
                                                        <img
                                                            src={`/${p.productPicture}`}
                                                            alt={p.productName}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center gap-2 text-slate-600 w-full h-full">
                                                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                                                                {cfg.icon}
                                                            </div>
                                                            <span className="text-[9px] font-black uppercase tracking-widest">No image</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Info */}
                                                <div className="p-5 space-y-3">
                                                    <h3 className="font-black text-white text-base uppercase tracking-tight leading-tight line-clamp-2">
                                                        {p.productName}
                                                    </h3>

                                                    {/* Brand */}
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                        Brand:{' '}
                                                        <span className="text-slate-300">{p.productBrand || '—'}</span>
                                                    </p>

                                                    {/* Price — highlighted green */}
                                                    <div className="flex items-end gap-2 pt-1">
                                                        <span className="text-2xl font-black text-emerald-400 tracking-tight">
                                                            Rs. {Number(p.productPrice).toLocaleString('en-LK')}
                                                        </span>
                                                    </div>
                                                    <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">
                                                        Price in Sri Lankan Rupees · 2026
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        })}

                        {/* Empty State — no products at all */}
                        {Object.keys(grouped).length === 0 && !isFiltering && (
                            <div className="flex flex-col items-center justify-center bg-white/5 border border-white/5 rounded-3xl p-16 text-center">
                                <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex items-center justify-center text-4xl mb-6">
                                    📦
                                </div>
                                <h3 className="text-base font-black text-white uppercase tracking-tight mb-2">
                                    No Products Available
                                </h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest max-w-xs">
                                    The product catalog is currently empty. Check back soon.
                                </p>
                            </div>
                        )}

                        {/* Empty State — filters returned nothing */}
                        {Object.keys(grouped).length === 0 && isFiltering && (
                            <div className="flex flex-col items-center justify-center bg-white/5 border border-white/5 rounded-3xl p-16 text-center">
                                <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex items-center justify-center text-4xl mb-6">
                                    🔍
                                </div>
                                <h3 className="text-base font-black text-white uppercase tracking-tight mb-2">
                                    No Matching Products
                                </h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest max-w-xs mb-5">
                                    Try adjusting your search term or expanding the price range.
                                </p>
                                <button
                                    onClick={() => { setSearchQuery(''); setSliderMax(maxPrice); }}
                                    className="px-5 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-blue-300 text-xs font-black uppercase tracking-widest transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Footer Note ── */}
                {!loading && !error && totalProducts > 0 && (
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-wrap gap-6">
                        {[
                            { label: 'Access Level', value: 'Read-Only View', color: 'text-slate-300' },
                            { label: 'Currency', value: 'Sri Lankan Rupee (Rs.)', color: 'text-emerald-400' },
                            { label: 'Data Source', value: 'Solar Aid Inventory', color: 'text-blue-400' },
                            { label: 'Reference Year', value: '2026', color: 'text-yellow-400' },
                        ].map((item) => (
                            <div key={item.label}>
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{item.label}</p>
                                <p className={`text-xs font-black ${item.color} uppercase tracking-wide mt-0.5`}>{item.value}</p>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
}
