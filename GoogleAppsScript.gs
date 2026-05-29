/**
 * BACKEND GOOGLE APPS SCRIPT - SISTEMA LOJISTA
 * 
 * Instruções:
 * 1. Crie uma Planilha Google (Google Sheets).
 * 2. Crie as abas: CONFIG, PRODUTOS, CATEGORIAS, PEDIDOS.
 * 3. Vá em Extensões > Apps Script.
 * 4. Cole o código abaixo.
 * 5. Clique em Implantar > Nova Implantação > App da Web.
 * 6. Em "Quem pode acessar", selecione "Qualquer pessoa".
 * 7. Copie a URL gerada e coloque-a em seu arquivo `.env.local` como `NEXT_PUBLIC_SHEETS_URL`.
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const ss = SpreadsheetApp.getActiveSpreadsheet();

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getStoreData') {
    return getStoreData();
  }
  
  if (action === 'getProducts') {
    return getProducts();
  }
  
  if (action === 'getCategories') {
    return getCategories();
  }
  
  return jsonResponse({ error: 'Ação inválida' });
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;
  
  if (action === 'saveOrder') {
    return saveOrder(data.order);
  }
  
  if (action === 'updateConfig') {
    return updateConfig(data.config);
  }

  if (action === 'addProduct') {
    return addProduct(data.product);
  }
  
  return jsonResponse({ error: 'Ação inválida' });
}

function getStoreData() {
  const sheet = ss.getSheetByName('CONFIG');
  const values = sheet.getDataRange().getValues();
  const config = {};
  
  // Assume que a primeira coluna é a chave e a segunda o valor
  values.forEach(row => {
    config[row[0]] = row[1];
  });
  
  return jsonResponse(config);
}

function getProducts() {
  const sheet = ss.getSheetByName('PRODUTOS');
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const products = values.slice(1).map(row => {
    const p = {};
    headers.forEach((h, i) => p[h] = row[i]);
    return p;
  });
  
  return jsonResponse(products);
}

function getCategories() {
    const sheet = ss.getSheetByName('CATEGORIAS');
    const values = sheet.getDataRange().getValues();
    const categories = values.slice(1).map(row => ({ id: row[0], nome: row[1] }));
    return jsonResponse(categories);
}

function saveOrder(order) {
  const sheet = ss.getSheetByName('PEDIDOS');
  sheet.appendRow([
    new Date(),
    order.id,
    order.nome_cliente,
    order.whatsapp,
    order.total,
    JSON.stringify(order.itens),
    order.endereco
  ]);
  return jsonResponse({ success: true });
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
