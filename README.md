# Sistema Lojista Premium

Sistema de gerenciamento de loja com área administrativa e interface para clientes, com integração com Google Sheets e Google Drive.

## 🚀 Tecnologias
- Vite + React 19
- Tailwind CSS
- TypeScript
- React Router DOM 7
- Lucide React (Ícones)
- Google Sheets (Backend)
- Google Apps Script

## 📁 Estrutura do Projeto
- `src/pages`: ClientHome, AdminLogin e AdminDashboard
- `src/components`: UI kit reutilizável
- `src/lib`: Utilitários e Integração de API
- `src/types`: Definições de tipos
- `src/styles`: CSS Global (Tailwind)

## 🛠️ Configuração Inicial

### 1. Dependências
```bash
npm install
```

### 2. Google Sheets & Apps Script
1. Crie uma nova planilha Google.
2. Adicione as abas: `CONFIG`, `PRODUTOS`, `CATEGORIAS`, `PEDIDOS`.
3. Vá em `Extensões > Apps Script`.
4. Copie o conteúdo do arquivo `GoogleAppsScript.gs` para o script.
5. Publique como **App da Web** e defina o acesso para **Qualquer Pessoa**.
6. Crie um arquivo `.env.local` na raiz e adicione:
   ```env
   NEXT_PUBLIC_SHEETS_URL=SUA_URL_DO_APP_SCRIPT
   ```

### 3. Google Drive (Dica para Imagens)
O arquivo `GoogleAppsScript.gs` pode ser expandido para aceitar upload de Base64, convertendo em arquivos no Drive e retornando o ID do arquivo para visualização pública. 

## 👨‍💻 Desenvolvedor
Criado por Antigravity
