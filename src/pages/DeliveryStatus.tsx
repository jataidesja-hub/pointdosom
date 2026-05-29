import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/StoreContext';
import { CheckCircle2, Clock, MapPin, Phone, Package, DollarSign, Loader2, House, Navigation } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function DeliveryStatus() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, updateOrderStatus, updateOrderPayment, isLoading } = useStore();
  const [status, setStatus] = useState<'loading' | 'confirming' | 'success' | 'notFound' | 'updating'>('loading');

  const order = orders.find(o => o.id === id);

  useEffect(() => {
    if (!isLoading) {
      if (!order) {
        setStatus('notFound');
      } else if (order.status === 'delivered') {
        setStatus('success');
      } else {
        setStatus('confirming');
      }
    }
  }, [isLoading, order]);

  const handleConfirm = async () => {
    if (!id || !order) return;
    setStatus('updating');
    
    // Atualiza para entregue e pago
    await updateOrderStatus(id, 'delivered');
    await updateOrderPayment(id, true);
    
    setStatus('success');
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="font-bold text-zinc-400 uppercase tracking-widest text-xs">Carregando Pedido...</p>
      </div>
    );
  }

  if (status === 'notFound') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20">
          <Clock className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-tight italic">Pedido não encontrado</h1>
        <p className="text-zinc-500 text-sm mb-8 max-w-xs">Verifique o link enviado pelo administrador ou entre em contato com a loja.</p>
        <button onClick={() => navigate('/')} className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 mx-auto">
          <House className="w-4 h-4" /> Voltar para Início
        </button>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mb-6 border border-emerald-500/20 animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight italic">Entregue com Sucesso!</h1>
        <p className="text-emerald-500 text-sm font-bold uppercase tracking-widest mb-12">Status atualizado no sistema</p>
        
        <div className="w-full max-w-sm bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 text-left space-y-4 mx-auto">
           <div className="flex gap-3">
             <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
               <Package className="w-5 h-5 text-zinc-400" />
             </div>
             <div>
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Pedido</p>
               <p className="text-white font-black uppercase tracking-tight italic">#{id}</p>
             </div>
           </div>
           <div className="flex gap-3">
             <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
               <DollarSign className="w-5 h-5 text-zinc-400" />
             </div>
             <div>
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Valor Total</p>
               <p className="text-white font-black text-xl italic">{formatCurrency(order?.total || 0)}</p>
             </div>
           </div>
        </div>
        
        <button onClick={() => navigate('/')} className="mt-12 px-8 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 mx-auto transition-all active:scale-95">
          <House className="w-4 h-4 text-emerald-500" /> Painel Loja
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6 flex flex-col max-w-md mx-auto">
      <header className="mb-10 pt-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl">
            <Package className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tight italic leading-none">Entrega Pendente</h1>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1 italic">Confirme a Entrega</p>
          </div>
        </div>
      </header>

      <div className="space-y-6 flex-1">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Navigation className="w-16 h-16 text-white" />
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                <House className="w-5 h-5 text-zinc-500" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Cliente</p>
                <p className="text-white font-black uppercase italic">{order?.customerName}</p>
                <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-1 border-t border-zinc-800 pt-1">
                  <Phone className="w-3 h-3 text-emerald-500" /> {order?.customerWhatsapp}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700/50">
                <MapPin className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Endereço</p>
                <p className="text-zinc-200 text-sm font-medium leading-tight">{order?.customerAddress}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Total a Receber</p>
              <p className="text-3xl font-black italic text-emerald-500">{formatCurrency(order?.total || 0)}</p>
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-0.5 whitespace-nowrap">
                Frete Incluído: {formatCurrency(order?.deliveryFee || 0)}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shrink-0 ${order?.isPaid ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-500 animate-pulse'}`}>
              {order?.isPaid ? 'Pago' : 'Cobra Entrega'}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-3xl max-h-48 overflow-y-auto">
          <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2 sticky top-0 bg-zinc-950/80 backdrop-blur-sm -mt-2 pt-2 pb-2">
            <Package className="w-4 h-4 text-emerald-500" /> Itens ({order?.items.length})
          </h3>
          <div className="space-y-3">
            {order?.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-zinc-800/20 p-3 rounded-2xl border border-zinc-800 transition-all active:scale-[0.98]">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-black text-white">
                      {item.quantity}x
                   </div>
                   <span className="text-zinc-300 text-[11px] font-bold uppercase truncate max-w-[120px] italic">{item.product.name}</span>
                </div>
                <span className="text-zinc-500 text-[10px] font-bold">{formatCurrency(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 pb-8 space-y-4">
        {status === 'updating' ? (
          <div className="w-full h-16 bg-zinc-900 rounded-[1.5rem] flex items-center justify-center gap-3 text-zinc-400 font-black uppercase text-sm tracking-widest border border-zinc-800 shadow-2xl">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" /> Sincronizando...
          </div>
        ) : (
          <button 
            onClick={handleConfirm}
            className="w-full h-20 bg-emerald-500 hover:bg-emerald-600 text-zinc-900 rounded-[1.5rem] flex items-center justify-center gap-4 text-xl font-black uppercase italic tracking-tighter shadow-[0_10px_40px_rgba(16,185,129,0.3)] active:scale-95 transition-all group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <div className="relative flex items-center gap-4">
              <CheckCircle2 className="w-8 h-8" /> 
              <span>Confirmar Entrega</span>
            </div>
          </button>
        )}
        <div className="flex flex-col items-center gap-1 opacity-60">
           <p className="text-[9px] text-center text-zinc-500 font-black uppercase tracking-[0.2em] italic">Ao confirmar, o pagamento será baixado</p>
           <p className="text-[9px] text-center text-zinc-600 font-black uppercase tracking-[0.2em]">Sincronizado com Supabase Realtime</p>
        </div>
      </div>
    </div>
  );
}
