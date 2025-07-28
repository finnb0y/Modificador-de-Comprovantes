# Modificador de Comprovantes

Um aplicativo web para modificar valores, datas e nomes em comprovantes mantendo a formatação original da imagem.

## 🚀 Funcionalidades

- ✅ Upload de imagens de comprovantes
- ✅ Detecção automática de formato de data (DD/MM/YYYY ou DD MMM YYYY)
- ✅ Modificação de valores monetários
- ✅ Modificação de datas
- ✅ Modificação de nomes
- ✅ Preservação da fonte e formatação original
- ✅ Download da imagem modificada
- ✅ Interface responsiva e intuitiva

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** - Framework React
- **React 18** - Biblioteca JavaScript
- **Tailwind CSS** - Framework CSS
- **Lucide React** - Ícones
- **Canvas API** - Processamento de imagens

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/comprovante-modifier.git
cd comprovante-modifier
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em desenvolvimento:
```bash
npm run dev
```

4. Acesse em: `http://localhost:3000`

## 🚀 Deploy no Vercel

1. Faça push do código para o GitHub
2. Acesse [Vercel](https://vercel.com)
3. Importe o projeto do GitHub
4. O deploy será feito automaticamente

### Deploy via GitHub

1. Conecte sua conta do Vercel com o GitHub
2. Selecione o repositório `comprovante-modifier`
3. Configure as variáveis de ambiente (se necessário)
4. Clique em "Deploy"

## 📋 Como Usar

1. **Upload**: Clique em "Escolher Arquivo" e selecione a imagem do comprovante
2. **Configuração**: Preencha os campos que deseja modificar:
   - Valor: Digite o novo valor monetário
   - Data: Digite a nova data (o formato é detectado automaticamente)
   - Nome: Digite o novo nome
3. **Aplicar**: Clique em "Aplicar" para processar as modificações
4. **Download**: Baixe o comprovante modificado

## 🔧 Formatos Suportados

### Imagens
- JPG/JPEG
- PNG
- WebP
- GIF

### Formatos de Data
- **DD/MM/YYYY**: 28/07/2025
- **DD MMM YYYY**: 28 JUL 2025

O sistema detecta automaticamente o formato usado no comprovante original.

## 📁 Estrutura do Projeto

```
comprovante-modifier/
├── pages/
│   ├── _app.js          # Configuração do App
│   └── index.js         # Página principal
├── styles/
│   └── globals.css      # Estilos globais
├── public/              # Arquivos públicos
├── package.json         # Dependências
├── next.config.js       # Configuração do Next.js
├── tailwind.config.js   # Configuração do Tailwind
└── postcss.config.js    # Configuração do PostCSS
```

## 🎯 Funcionalidades Futuras

- [ ] Integração com API de OCR real (Google Vision, AWS Textract)
- [ ] Suporte a mais formatos de data
- [ ] Detecção automática de campos por IA
- [ ] Histórico de modificações
- [ ] Processamento em lote
- [ ] Marcas d'água personalizadas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ⚠️ Aviso Legal

Este software é destinado apenas para fins educacionais e de teste. O uso inadequado para falsificação de documentos é ilegal e não é incentivado pelos desenvolvedores.

## 📞 Suporte

Se encontrar algum problema ou tiver sugestões:

1. Abra uma [Issue](https://github.com/seu-usuario/comprovante-modifier/issues)
2. Entre em contato via email: seu-email@exemplo.com

---

Desenvolvido com ❤️ usando Next.js e React
