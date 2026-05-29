import { ReactNode, useEffect } from 'react';
import { useStore } from '@/store/StoreContext';

export function StoreLayout({ children }: { children: ReactNode }) {
  const { config } = useStore();

  useEffect(() => {
    // Aplicar fonte globalmente
    document.body.style.fontFamily = `'${config.font}', sans-serif`;
    
    // Injetar variáveis CSS para cores primárias
    document.documentElement.style.setProperty('--primary-500', config.primaryColor);
    
    // Carregar a fonte do Google Fonts se necessário
    const fontId = 'google-font-link';
    let link = document.getElementById(fontId) as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    const fontName = config.font.replace(/\s+/g, '+');
    link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@300;400;500;600;700;800;900&display=swap`;
  }, [config.font, config.primaryColor]);

  return <>{children}</>;
}
