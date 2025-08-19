# 🎬 Alex 2.0 - Plataforma Premium +18

Uma plataforma moderna de conteúdo premium desenvolvida com Next.js 15, Appwrite e TailwindCSS.

## ✨ Funcionalidades

- 🎥 **Reprodução de vídeos** na mesma tela (sem thumbnails)
- ☁️ **Armazenamento Appwrite** configurado
- 📱 **Design responsivo** e moderno
- 🔒 **Controle de acesso** +18
- 💳 **Comprovantes de pagamento** dinâmicos
- 🚀 **Deploy otimizado** para Vercel
- ⚡ **Performance** otimizada

## 🛠️ Tecnologias

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **TailwindCSS 4**
- **Appwrite** (Backend as a Service)
- **Lucide React** (Ícones)

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Appwrite Cloud

## 🚀 Instalação

### 1. Clone e instale dependências:
```bash
git clone <seu-repositorio>
cd alex-nextjs-site
npm install
```

### 2. Configure variáveis de ambiente:
```bash
# Copie o arquivo de exemplo
cp env.example .env.local

# Edite .env.local com suas configurações do Appwrite
```

### 3. Configure o Appwrite:

#### 3.1. Crie um projeto no [Appwrite Cloud](https://cloud.appwrite.io)

#### 3.2. Configure o Database:
```javascript
// Crie um database com ID: main_database
// Crie as seguintes collections:

// Collection: videos
{
  "title": "string",
  "description": "string", 
  "duration": "string",
  "uploadDate": "string",
  "status": "string", // published, draft, processing
  "views": "integer",
  "tags": "array",
  "videoFileId": "string", // ID do arquivo no Storage
  "videoUrl": "string" // URL direta do vídeo
}

// Collection: payment_proofs
{
  "customerName": "string",
  "amount": "float",
  "paymentMethod": "string",
  "uploadDate": "string",
  "imageUrl": "string",
  "isVisible": "boolean"
}

// Collection: site_config
{
  "telegramUsername": "string",
  "siteName": "string", 
  "description": "string"
}
```

#### 3.3. Configure o Storage:
```javascript
// Crie um bucket com ID: main_storage
// Configurações recomendadas:
{
  "name": "Main Storage",
  "permissions": ["read('any')"], // Para acesso público aos vídeos
  "fileSecurity": false,
  "maximumFileSize": 104857600, // 100MB
  "allowedFileExtensions": ["mp4", "webm", "ogg", "jpg", "png"]
}
```

#### 3.4. Configure as variáveis:
```env
NEXT_PUBLIC_APPWRITE_URL=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=seu_project_id_aqui
NEXT_PUBLIC_APPWRITE_DATABASE_ID=main_database
NEXT_PUBLIC_APPWRITE_STORAGE_ID=main_storage
NEXT_PUBLIC_APPWRITE_VIDEOS_COLLECTION_ID=videos
NEXT_PUBLIC_APPWRITE_PAYMENT_PROOFS_COLLECTION_ID=payment_proofs
NEXT_PUBLIC_APPWRITE_SITE_CONFIG_COLLECTION_ID=site_config
```

## 🎥 Upload de Vídeos

### Via Console Appwrite:
1. Acesse o Storage no console
2. Faça upload dos vídeos (.mp4, .webm, .ogg)
3. Copie o File ID
4. Crie um documento na collection "videos" com o videoFileId

### Via Código:
```typescript
import { useAppwriteStorage } from '@/hooks/useAppwriteStorage'

const { uploadFile } = useAppwriteStorage()

const handleVideoUpload = async (file: File) => {
  const result = await uploadFile(file)
  console.log('Video uploaded:', result.fileId)
}
```

## 🏃‍♂️ Executar Localmente

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Executar build
npm start
```

Acesse: http://localhost:3000

## 🚀 Deploy

### Vercel (Recomendado):
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Outras opções:
- **Netlify**: Conecte o repositório GitHub
- **Railway**: Deploy automático via Git
- **DigitalOcean**: App Platform

Ver `DEPLOY_OPTIONS.md` para mais detalhes.

## 📁 Estrutura do Projeto

```
alex-nextjs-site/
├── src/
│   ├── app/                 # App Router (Next.js 15)
│   │   ├── admin/          # Painel administrativo
│   │   ├── login/          # Página de login
│   │   ├── globals.css     # Estilos globais
│   │   ├── layout.tsx      # Layout principal
│   │   └── page.tsx        # Homepage
│   ├── components/         # Componentes React
│   │   └── VideoPlayer.tsx # Player de vídeo customizado
│   ├── context/           # Contextos React
│   │   ├── AuthContext.tsx
│   │   ├── PaymentProofContext.tsx
│   │   └── SiteConfigContext.tsx
│   ├── hooks/             # Hooks customizados
│   │   ├── useAppwriteStorage.ts
│   │   └── useVideos.ts
│   ├── lib/               # Utilitários
│   │   └── appwrite.ts    # Configuração Appwrite
│   └── types/             # Definições TypeScript
│       ├── auth.ts
│       ├── payment.ts
│       └── video.ts
├── public/                # Arquivos estáticos
├── DEPLOY_OPTIONS.md      # Guia de deploy
└── README.md             # Este arquivo
```

## 🎮 Funcionalidades do Player

- ▶️ **Play/Pause** com clique
- 🔊 **Controle de volume** 
- ⏯️ **Barra de progresso** interativa
- 🔄 **Restart** do vídeo
- 🖥️ **Fullscreen**
- 📱 **Responsivo** (mobile-friendly)
- ⏰ **Timer** de duração
- 🎨 **Controles customizados**

## 🔒 Segurança

### Medidas implementadas:
- ✅ Aviso de conteúdo +18
- ✅ HTTPS obrigatório (em produção)
- ✅ Validação de tipos TypeScript
- ✅ Sanitização de dados

### Recomendações adicionais:
- 🔐 Implementar autenticação real
- 🌍 Geo-blocking por país
- ⏱️ Rate limiting
- 🛡️ WAF (Web Application Firewall)

## 📊 Analytics

### Vercel Analytics (Gratuito):
- Pageviews
- Países dos usuários
- Performance metrics
- Core Web Vitals

## 🐛 Troubleshooting

### Vídeos não carregam:
1. Verifique as variáveis de ambiente
2. Confirme permissões do Storage
3. Teste URLs dos vídeos diretamente

### Build falha:
1. Verifique erros de TypeScript
2. Execute `npm run lint`
3. Limpe cache: `rm -rf .next`

### Performance lenta:
1. Otimize tamanho dos vídeos
2. Use CDN para assets
3. Implemente lazy loading

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Add nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é privado e confidencial.

## 📞 Suporte

Para dúvidas ou problemas:
- 📧 Email: [seu-email]
- 💬 Telegram: [@seu-usuario]

---

⚠️ **AVISO LEGAL**: Este projeto destina-se exclusivamente a maiores de 18 anos. Todo conteúdo deve ser acessado de forma responsável e de acordo com as leis locais.