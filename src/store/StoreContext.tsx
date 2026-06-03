import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, Promotion, Banner, StoreConfig, Order, OpeningHours } from '@/types';
import { supabase } from '@/lib/supabase';

const STORE_ID = (import.meta as any).env.VITE_STORE_ID || '1';
console.log(`[Store] Initialized for Store ID: ${STORE_ID}`);

const DEFAULT_OPENING_HOURS: OpeningHours = {
  'Segunda': { open: '08:00', close: '18:00', isOpen: true },
  'Terça': { open: '08:00', close: '18:00', isOpen: true },
  'Quarta': { open: '08:00', close: '18:00', isOpen: true },
  'Quinta': { open: '08:00', close: '18:00', isOpen: true },
  'Sexta': { open: '08:00', close: '18:00', isOpen: true },
  'Sábado': { open: '08:00', close: '12:00', isOpen: true },
  'Domingo': { open: '00:00', close: '00:00', isOpen: false },
};

const DEFAULT_CONFIG: StoreConfig = {
  name: 'Minha Loja',
  font: 'Inter',
  primaryColor: '#0284c7',
  logoUrl: '',
  address: '',
  lat: 0,
  lng: 0,
  deliveryFeePerKm: 2.5,
  slogan: 'O melhor sabor da cidade!',
  whatsapp: '',
  pixKey: '',
  openingHours: DEFAULT_OPENING_HOURS,
  informativeText: '',
};

interface StoreContextType {
  config: StoreConfig;
  setConfig: (c: StoreConfig) => void;
  products: Product[];
  setProducts: (p: Product[]) => void;
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  categories: Category[];
  setCategories: (c: Category[]) => void;
  addCategory: (c: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  promotions: Promotion[];
  setPromotions: (p: Promotion[]) => void;
  addPromotion: (p: Omit<Promotion, 'id'>) => void;
  updatePromotion: (p: Promotion) => void;
  deletePromotion: (id: string) => void;
  orders: Order[];
  addOrder: (o: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updateOrderPayment: (id: string, isPaid: boolean) => void;
  deleteOrder: (id: string) => void;
  banners: Banner[];
  addBanner: (b: Omit<Banner, 'id'>) => void;
  updateBanner: (b: Banner) => void;
  deleteBanner: (id: string) => void;
  uploadImage: (file: File) => Promise<string>;

  isLoading: boolean;
  isSaving: boolean;
  realtimeStatus: string;
}


const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<StoreConfig>(DEFAULT_CONFIG);
  const [products, setProductsState] = useState<Product[]>([]);
  const [categories, setCategoriesState] = useState<Category[]>([]);
  const [promotions, setPromotionsState] = useState<Promotion[]>([]);
  const [banners, setBannersState] = useState<Banner[]>([]);
  const [orders, setOrdersState] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState('connecting');


  // Initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch config separately since .single() can throw if no row exists
        try {
          const confRes = await supabase.from('config').select('*').eq('id', STORE_ID).limit(1).single();
          if (confRes.data) {
            const loadedConfig = { ...DEFAULT_CONFIG, ...Object.fromEntries(Object.entries(confRes.data).filter(([_, v]) => v != null)) as Partial<StoreConfig> };
            // Ensure openingHours is not empty
            if (!loadedConfig.openingHours || Object.keys(loadedConfig.openingHours).length === 0) {
              loadedConfig.openingHours = DEFAULT_OPENING_HOURS;
            }
            setConfigState(loadedConfig);
          }
        } catch (confErr) {
          console.warn("Config não encontrada no Supabase, usando padrão:", confErr);
        }

        const [prodRes, catRes, promRes, ordRes, banRes] = await Promise.all([
          supabase.from('products').select('*').eq('store_id', STORE_ID),
          supabase.from('categories').select('*').eq('store_id', STORE_ID),
          supabase.from('promotions').select('*').eq('store_id', STORE_ID),
          supabase.from('orders').select('*').eq('store_id', STORE_ID),
          supabase.from('banners').select('*').eq('store_id', STORE_ID)
        ]);

        if (prodRes.data) setProductsState(prodRes.data);
        if (catRes.data) setCategoriesState(catRes.data);
        if (promRes.data) setPromotionsState(promRes.data);
        if (ordRes.data) setOrdersState(ordRes.data);
        if (banRes.data) setBannersState(banRes.data);
      } catch (err) {
        console.error("Erro ao carregar do Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sync listener (real-time all tables)
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'config', filter: `id=eq.${STORE_ID}` }, payload => {
        console.log('[Real-time] Config updated', payload.new);
        if (payload.new) setConfigState(prev => ({ ...prev, ...payload.new }));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products', filter: `store_id=eq.${STORE_ID}` }, payload => {
        console.log('[Real-time] Products changed', payload.eventType);
        if (payload.eventType === 'INSERT') {
          setProductsState(prev => prev.some(p => p.id === payload.new.id) ? prev : [...prev, payload.new as Product]);
        }
        if (payload.eventType === 'UPDATE') setProductsState(prev => prev.map(p => p.id === payload.new.id ? { ...p, ...payload.new } as Product : p));
        if (payload.eventType === 'DELETE') setProductsState(prev => prev.filter(p => p.id !== payload.old.id));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories', filter: `store_id=eq.${STORE_ID}` }, payload => {
        console.log('[Real-time] Categories changed', payload.eventType);
        if (payload.eventType === 'INSERT') {
          setCategoriesState(prev => prev.some(c => c.id === payload.new.id) ? prev : [...prev, payload.new as Category]);
        }
        if (payload.eventType === 'DELETE') setCategoriesState(prev => prev.filter(c => c.id !== payload.old.id));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'promotions', filter: `store_id=eq.${STORE_ID}` }, payload => {
        console.log('[Real-time] Promotions changed', payload.eventType);
        if (payload.eventType === 'INSERT') {
          setPromotionsState(prev => prev.some(p => p.id === payload.new.id) ? prev : [...prev, payload.new as Promotion]);
        }
        if (payload.eventType === 'UPDATE') setPromotionsState(prev => prev.map(p => p.id === payload.new.id ? { ...p, ...payload.new } as Promotion : p));
        if (payload.eventType === 'DELETE') setPromotionsState(prev => prev.filter(p => p.id !== payload.old.id));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `store_id=eq.${STORE_ID}` }, payload => {
        console.log('[Real-time] Orders changed', payload.eventType);
        if (payload.eventType === 'INSERT') {
          setOrdersState(prev => {
            if (prev.some(o => o.id === payload.new.id)) return prev;
            
            // Som de "Ding-Dong" Sintetizado (Campainha)
          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            
            // DING (Nota mais alta)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // Mi (E5)
            gain1.gain.setValueAtTime(0, ctx.currentTime);
            gain1.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
            gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            osc1.start(ctx.currentTime);
            osc1.stop(ctx.currentTime + 0.5);

            // DONG (Nota mais baixa, soa logo após o Ding)
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(523.25, ctx.currentTime + 0.4); // Dó (C5)
            gain2.gain.setValueAtTime(0, ctx.currentTime + 0.4);
            gain2.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.45);
            gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
            osc2.start(ctx.currentTime + 0.4);
            osc2.stop(ctx.currentTime + 1.2);
          } catch(e) {
            console.error("Erro ao tocar som:", e);
          }
          
          return [...prev, payload.new as Order];
        });
        }
        if (payload.eventType === 'UPDATE') setOrdersState(prev => prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } as Order : o));
        if (payload.eventType === 'DELETE') setOrdersState(prev => prev.filter(o => o.id !== payload.old.id));
      })

      .subscribe((status) => {
        console.log(`[Store] Supabase Realtime Subscription: ${status}`);
        setRealtimeStatus(status);
      });



    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


  const uploadImage = async (file: File): Promise<string> => {
    setIsSaving(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('images').upload(fileName, file);
      
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
      return publicUrl;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  // CONFIG
  const setConfig = async (c: StoreConfig) => {
    setConfigState(c);
    setIsSaving(true);
    try {
      const { error } = await supabase.from('config').upsert({ id: STORE_ID, ...c });
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      alert('Erro ao salvar no banco (verifique permissões do Supabase): ' + err.message);
    } finally { setIsSaving(false); }
  };

  // PRODUCTS
  const addProduct = async (p: Omit<Product, 'id'>) => {
    const newP = { id: genId(), store_id: STORE_ID, ...p };
    setProductsState(prev => [...prev, newP]);
    setIsSaving(true);
    const { error } = await supabase.from('products').insert([newP]);
    setIsSaving(false);
    if (error) {
      alert('Erro ao salvar produto: ' + error.message);
      setProductsState(prev => prev.filter(x => x.id !== newP.id)); // Reverte em caso de erro
    }
  };
  const updateProduct = async (p: Product) => {
    const previous = products.find(x => x.id === p.id);
    setProductsState(prev => prev.map(x => x.id === p.id ? p : x));
    setIsSaving(true);
    const { error } = await supabase.from('products').upsert({ ...p, store_id: STORE_ID });
    setIsSaving(false);
    if (error) {
      alert('Erro ao atualizar produto: ' + error.message);
      if (previous) setProductsState(prev => prev.map(x => x.id === p.id ? previous : x));
    }
  };
  const deleteProduct = async (id: string) => {
    const previous = products.find(x => x.id === id);
    setProductsState(prev => prev.filter(x => x.id !== id));
    setIsSaving(true);
    const { error } = await supabase.from('products').delete().eq('id', id);
    setIsSaving(false);
    if (error && previous) {
      alert('Erro ao excluir produto: ' + error.message);
      setProductsState(prev => [...prev, previous]);
    }
  };

  const setProducts = (p: Product[]) => setProductsState(p);

  // CATEGORIES
  const addCategory = async (c: Omit<Category, 'id'>) => {
    const newC = { id: genId(), store_id: STORE_ID, ...c };
    setCategoriesState(prev => [...prev, newC]);
    setIsSaving(true);
    const { error } = await supabase.from('categories').insert([newC]);
    setIsSaving(false);
    if (error) {
      alert('Erro ao criar categoria: ' + error.message);
      setCategoriesState(prev => prev.filter(x => x.id !== newC.id));
    }
  };
  const deleteCategory = async (id: string) => {
    const previous = categories.find(x => x.id === id);
    setCategoriesState(prev => prev.filter(x => x.id !== id));
    setIsSaving(true);
    const { error } = await supabase.from('categories').delete().eq('id', id);
    setIsSaving(false);
    if (error && previous) {
      alert('Erro ao deletar categoria: ' + error.message);
      setCategoriesState(prev => [...prev, previous]);
    }
  };

  const setCategories = (c: Category[]) => setCategoriesState(c);

  // PROMOTIONS
  const addPromotion = async (p: Omit<Promotion, 'id'>) => {
    const newP = { id: genId(), store_id: STORE_ID, ...p };
    setPromotionsState(prev => [...prev, newP]);
    setIsSaving(true);
    const { error } = await supabase.from('promotions').insert([newP]);
    setIsSaving(false);
    if (error) {
      alert('Erro ao criar promoção: ' + error.message);
      setPromotionsState(prev => prev.filter(x => x.id !== newP.id));
    }
  };
  const updatePromotion = async (p: Promotion) => {
    const previous = promotions.find(x => x.id === p.id);
    setPromotionsState(prev => prev.map(x => x.id === p.id ? p : x));
    setIsSaving(true);
    const { error } = await supabase.from('promotions').upsert({ ...p, store_id: STORE_ID });
    setIsSaving(false);
    if (error && previous) {
      alert('Erro ao atualizar: ' + error.message);
      setPromotionsState(prev => prev.map(x => x.id === p.id ? previous : x));
    }
  };
  const deletePromotion = async (id: string) => {
    const previous = promotions.find(x => x.id === id);
    setPromotionsState(prev => prev.filter(x => x.id !== id));
    setIsSaving(true);
    const { error } = await supabase.from('promotions').delete().eq('id', id);
    setIsSaving(false);
    if (error && previous) {
      alert('Erro ao excluir: ' + error.message);
      setPromotionsState(prev => [...prev, previous]);
    }
  };

  const setPromotions = (p: Promotion[]) => setPromotionsState(p);

  // BANNERS
  const addBanner = async (b: Omit<Banner, 'id'>) => {
    const newB: Banner = { id: genId(), store_id: STORE_ID, ...b } as Banner;
    setBannersState(prev => [...prev, newB]);
    const { error } = await supabase.from('banners').insert([newB]);
    if (error) { alert('Erro ao criar banner: ' + error.message); setBannersState(prev => prev.filter(x => x.id !== newB.id)); }
  };
  const updateBanner = async (b: Banner) => {
    setBannersState(prev => prev.map(x => x.id === b.id ? b : x));
    const { error } = await supabase.from('banners').upsert({ ...b, store_id: STORE_ID });
    if (error) alert('Erro ao atualizar banner: ' + error.message);
  };
  const deleteBanner = async (id: string) => {
    setBannersState(prev => prev.filter(x => x.id !== id));
    await supabase.from('banners').delete().eq('id', id);
  };

  // ORDERS
  const addOrder = async (o: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newO: Order = { ...o, id: genId(), createdAt: new Date().toISOString(), status: 'pending' };
    const dbOrder = { ...newO, store_id: STORE_ID };
    setOrdersState(prev => [...prev, newO]);
    setIsSaving(true);
    
    // Baixa no estoque
    try {
      for (const item of o.items) {
        const prod = products.find(p => p.id === item.product.id);
        if (prod && prod.stock !== undefined && prod.stock > 0) {
          const newStock = Math.max(0, prod.stock - item.quantity);
          // Atualiza localmente o produto para refletir a baixa imediatamente
          setProductsState(prev => prev.map(p => p.id === prod.id ? { ...p, stock: newStock } : p));
          // Sincroniza com Supabase
          await supabase.from('products').update({ stock: newStock }).eq('id', prod.id);
        }
      }
    } catch (stockErr) {
      console.error("Erro ao dar baixa no estoque:", stockErr);
    }

    const { error } = await supabase.from('orders').insert([dbOrder]);
    setIsSaving(false);
    if (error) console.error("Erro ao salvar pedido no DB:", error.message);
  };
  const updateOrderStatus = async (id: string, status: Order['status']) => {
    const previous = orders.find(x => x.id === id);
    setOrdersState(prev => prev.map(x => x.id === id ? { ...x, status } : x));
    setIsSaving(true);
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    setIsSaving(false);
    if (error && previous) {
      alert('Erro ao atualizar: ' + error.message);
      setOrdersState(prev => prev.map(x => x.id === id ? previous : x));
    }
  };
  const updateOrderPayment = async (id: string, isPaid: boolean) => {
    const previous = orders.find(x => x.id === id);
    setOrdersState(prev => prev.map(x => x.id === id ? { ...x, isPaid } : x));
    setIsSaving(true);
    const { error } = await supabase.from('orders').update({ isPaid }).eq('id', id);
    setIsSaving(false);
    if (error && previous) {
      alert('Erro ao atualizar pagamento: ' + error.message);
      setOrdersState(prev => prev.map(x => x.id === id ? previous : x));
    }
  };

  const deleteOrder = async (id: string) => {
    const previous = orders.find(x => x.id === id);
    if (!previous) return;
    
    // RESTORE STOCK
    try {
      for (const item of previous.items) {
        const prod = products.find(p => p.id === item.product.id);
        if (prod && prod.stock !== undefined) {
          const newStock = prod.stock + item.quantity;
          // Prevent restoring if it was marked as unlimited (e.g. 999 or above)
          if (prod.stock < 990) {
            setProductsState(prev => prev.map(p => p.id === prod.id ? { ...p, stock: newStock } : p));
            await supabase.from('products').update({ stock: newStock }).eq('id', prod.id);
          }
        }
      }
    } catch (err) {
      console.error("Erro ao retornar estoque:", err);
    }

    setOrdersState(prev => prev.filter(x => x.id !== id));
    setIsSaving(true);
    const { error } = await supabase.from('orders').delete().eq('id', id);
    setIsSaving(false);
    if (error && previous) {
      alert('Erro ao excluir pedido: ' + error.message);
      setOrdersState(prev => [...prev, previous]);
    }
  };



  return (
    <StoreContext.Provider value={{
      config, setConfig,
      products, setProducts, addProduct, updateProduct, deleteProduct,
      categories, setCategories, addCategory, deleteCategory,
      promotions, setPromotions, addPromotion, updatePromotion, deletePromotion,
      orders, addOrder, updateOrderStatus, updateOrderPayment, deleteOrder,
      uploadImage, isLoading, isSaving, realtimeStatus,
      banners, addBanner, updateBanner, deleteBanner


    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
