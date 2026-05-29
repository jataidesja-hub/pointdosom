const SHEETS_URL = process.env.NEXT_PUBLIC_SHEETS_URL;

export async function fetchFromSheets(action: string, method: 'GET' | 'POST' = 'GET', data?: any) {
  if (!SHEETS_URL) {
    console.warn("URL da planilha não configurada. Usando mock.");
    return null;
  }

  try {
    const url = new URL(SHEETS_URL);
    if (method === 'GET') url.searchParams.append('action', action);

    const response = await fetch(url.toString(), {
      method: method,
      body: method === 'POST' ? JSON.stringify({ action, ...data }) : undefined,
    });

    return await response.json();
  } catch (error) {
    console.error("Erro na API Sheets:", error);
    return null;
  }
}

// MOCKS PARA DESENVOLVIMENTO
export const MOCK_API = {
  getProducts: async () => {
    return [
        { id: "1", nome: "Classic Burger", descricao: "Pão brioche, carne de 180g, queijo cheddar...", preco: 34.90, categoria: "Hambúrgueres", imagem_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600" },
        { id: "2", nome: "Pizza Calabresa", descricao: "Massa artesanal, molho de tomate pelado...", preco: 49.90, categoria: "Pizzas", imagem_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600" },
    ];
  },
  getConfig: async () => {
    return {
      nome_loja: "Minha Loja",
      cor_primaria: "#0ea5e9",
      cor_secundaria: "#0c4a6e",
      logo_url: "",
      endereco: "Av. Paulista, 1000",
      latitude: -23.561684,
      longitude: -46.655981,
      taxa_km: 2.50
    };
  }
};
