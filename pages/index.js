import React, { useState, useRef } from 'react';
import { Upload, Download, Edit3, Copy, Check, Calendar, DollarSign, User, Building, Hash } from 'lucide-react';

export default function NubankReceiptGenerator() {
  const [originalImage, setOriginalImage] = useState(null);
  const [formData, setFormData] = useState({
    // Data e hora
    date: '27 JUL 2025',
    time: '18:04:53',
    
    // Valor
    value: 'R$ 100,00',
    
    // Destino
    recipientName: 'PAULO TERTULIANO FREITAS DE ARAÚJO',
    recipientCPF: '546.681',
    recipientInstitution: 'BCO SANTANDER (BRASIL) S.A.',
    recipientAgency: '3067',
    recipientAccount: '1086593-4',
    recipientAccountType: 'Conta corrente',
    
    // Origem
    senderName: 'Phillip Tertuliano Lima de Araújo',
    senderAccount: '7141334-7',
    senderCPF: '745.561',
    
    // ID da transação
    transactionId: 'E18236120202507272104e0120d761f9'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Simular extração de dados da imagem original (OCR simplificado)
  const extractDataFromImage = (imageFile) => {
    // Por enquanto, mantém os dados padrão
    // Aqui você poderia integrar com uma API de OCR real
    console.log('Extraindo dados de:', imageFile.name);
    
    // Simular um pequeno delay de processamento
    setTimeout(() => {
      // Os dados já estão no estado inicial como exemplo
      console.log('Dados extraídos com sucesso');
    }, 1000);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage({
        file,
        src: e.target.result
      });
      
      // Extrair dados da imagem
      extractDataFromImage(file);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateReceipt = async () => {
    setIsGenerating(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Configurar canvas (tamanho padrão do comprovante Nubank)
    canvas.width = 390;
    canvas.height = 850;
    
    // Fundo branco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Função helper para texto
    const drawText = (text, x, y, options = {}) => {
      const {
        fontSize = 14,
        fontFamily = 'system-ui, -apple-system, sans-serif',
        fontWeight = 'normal',
        color = '#000000',
        align = 'left',
        maxWidth = null
      } = options;
      
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      
      if (maxWidth && ctx.measureText(text).width > maxWidth) {
        // Quebrar texto se necessário
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        
        for (let word of words) {
          const testLine = line + word + ' ';
          if (ctx.measureText(testLine).width > maxWidth && line !== '') {
            ctx.fillText(line.trim(), x, currentY);
            line = word + ' ';
            currentY += fontSize + 2;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line.trim(), x, currentY);
      } else {
        ctx.fillText(text, x, y);
      }
    };

    // Logo Nubank (simulado com texto)
    drawText('nu', 30, 40, { fontSize: 24, fontWeight: 'bold', color: '#8A05BE' });
    
    // Título
    drawText('Comprovante de', 30, 80, { fontSize: 16, fontWeight: '500' });
    drawText('transferência', 30, 100, { fontSize: 16, fontWeight: '500' });
    
    // Data e hora
    drawText(`${formData.date} • ${formData.time}`, 30, 130, { fontSize: 13, color: '#666666' });
    
    // Valor
    drawText('Valor', 30, 170, { fontSize: 13, color: '#666666' });
    drawText(formData.value, 360, 190, { fontSize: 18, fontWeight: 'bold', align: 'right' });
    
    // Tipo de transferência
    drawText('Tipo de transferência', 30, 230, { fontSize: 13, color: '#666666' });
    drawText('Pix', 360, 230, { fontSize: 13, align: 'right' });
    
    // Seção Destino
    drawText('Destino', 30, 280, { fontSize: 13, color: '#666666' });
    
    drawText('Nome', 30, 310, { fontSize: 13, color: '#666666' });
    drawText(formData.recipientName, 360, 310, { 
      fontSize: 13, 
      align: 'right', 
      maxWidth: 200 
    });
    
    drawText('CPF', 30, 350, { fontSize: 13, color: '#666666' });
    drawText(`•••.${formData.recipientCPF}-••`, 360, 350, { fontSize: 13, align: 'right' });
    
    drawText('Instituição', 30, 390, { fontSize: 13, color: '#666666' });
    drawText(formData.recipientInstitution, 360, 390, { 
      fontSize: 13, 
      align: 'right', 
      maxWidth: 200 
    });
    
    drawText('Agência', 30, 430, { fontSize: 13, color: '#666666' });
    drawText(formData.recipientAgency, 360, 430, { fontSize: 13, align: 'right' });
    
    drawText('Conta', 30, 470, { fontSize: 13, color: '#666666' });
    drawText(formData.recipientAccount, 360, 470, { fontSize: 13, align: 'right' });
    
    drawText('Tipo de conta', 30, 510, { fontSize: 13, color: '#666666' });
    drawText(formData.recipientAccountType, 360, 510, { fontSize: 13, align: 'right' });
    
    // Seção Origem
    drawText('Origem', 30, 570, { fontSize: 13, color: '#666666' });
    
    drawText('Nome', 30, 600, { fontSize: 13, color: '#666666' });
    drawText(formData.senderName, 360, 600, { 
      fontSize: 13, 
      align: 'right', 
      maxWidth: 200 
    });
    
    drawText('Instituição', 30, 640, { fontSize: 13, color: '#666666' });
    drawText('NU PAGAMENTOS - IP', 360, 640, { fontSize: 13, align: 'right' });
    
    drawText('Agência', 30, 680, { fontSize: 13, color: '#666666' });
    drawText('0001', 360, 680, { fontSize: 13, align: 'right' });
    
    drawText('Conta', 30, 720, { fontSize: 13, color: '#666666' });
    drawText(formData.senderAccount, 360, 720, { fontSize: 13, align: 'right' });
    
    drawText('CPF', 30, 760, { fontSize: 13, color: '#666666' });
    drawText(`•••.${formData.senderCPF}-••`, 360, 760, { fontSize: 13, align: 'right' });
    
    // Rodapé
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 790, canvas.width, 60);
    
    drawText('Nu Pagamentos S.A. - Instituição de', 30, 810, { fontSize: 11, color: '#666666' });
    drawText('Pagamento', 30, 825, { fontSize: 11, color: '#666666' });
    drawText('CNPJ 18.236.120/0001-58', 30, 840, { fontSize: 11, color: '#666666' });
    
    drawText('ID da transação:', 30, 865, { fontSize: 11, color: '#666666' });
    drawText(formData.transactionId.substring(0, 24), 30, 880, { fontSize: 11, color: '#666666' });
    drawText(formData.transactionId.substring(24), 30, 895, { fontSize: 11, color: '#666666' });
    
    // Converter para imagem
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      setGeneratedImage(url);
      setIsGenerating(false);
    }, 'image/png', 1.0);
  };

  const downloadReceipt = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'comprovante_nubank.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAll = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-lg">
              nu
            </div>
            Gerador de Comprovantes Nubank
          </h1>
          <p className="text-gray-600 text-lg">
            Crie comprovantes profissionais baseados no modelo oficial
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Painel de Upload */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Upload className="text-purple-600" />
              Comprovante Original
            </h2>
            
            {!originalImage ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                <p className="text-gray-600 mb-3 text-sm">
                  Faça upload do comprovante original para extrair os dados
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Escolher Arquivo
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <img
                  src={originalImage.src}
                  alt="Comprovante original"
                  className="w-full rounded-lg border shadow-sm"
                />
                <button
                  onClick={resetAll}
                  className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Trocar Imagem
                </button>
              </div>
            )}
          </div>

          {/* Painel de Edição */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Edit3 className="text-blue-600" />
              Editar Dados
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Data e Hora */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data e Hora
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="27 JUL 2025"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="18:04:53"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                </div>
              </div>

              {/* Valor */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Valor
                </h3>
                <input
                  type="text"
                  placeholder="R$ 100,00"
                  value={formData.value}
                  onChange={(e) => handleInputChange('value', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                />
              </div>

              {/* Destino */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Destino
                </h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={formData.recipientName}
                    onChange={(e) => handleInputChange('recipientName', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="123.456 (apenas os 6 dígitos do meio)"
                    value={formData.recipientCPF}
                    onChange={(e) => handleInputChange('recipientCPF', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Instituição"
                    value={formData.recipientInstitution}
                    onChange={(e) => handleInputChange('recipientInstitution', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Agência"
                      value={formData.recipientAgency}
                      onChange={(e) => handleInputChange('recipientAgency', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Conta"
                      value={formData.recipientAccount}
                      onChange={(e) => handleInputChange('recipientAccount', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-xs"
                    />
                  </div>
                  <select
                    value={formData.recipientAccountType}
                    onChange={(e) => handleInputChange('recipientAccountType', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  >
                    <option value="Conta corrente">Conta corrente</option>
                    <option value="Conta poupança">Conta poupança</option>
                  </select>
                </div>
              </div>

              {/* Origem */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Origem
                </h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={formData.senderName}
                    onChange={(e) => handleInputChange('senderName', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Número da conta"
                    value={formData.senderAccount}
                    onChange={(e) => handleInputChange('senderAccount', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="123.456 (apenas os 6 dígitos do meio)"
                    value={formData.senderCPF}
                    onChange={(e) => handleInputChange('senderCPF', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                </div>
              </div>

              {/* ID da Transação */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  ID da Transação
                </h3>
                <input
                  type="text"
                  placeholder="ID da transação"
                  value={formData.transactionId}
                  onChange={(e) => handleInputChange('transactionId', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                />
              </div>
            </div>

            <button
              onClick={generateReceipt}
              disabled={isGenerating}
              className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Gerando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Gerar Comprovante
                </>
              )}
            </button>
          </div>

          {/* Painel de Resultado */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Download className="text-green-600" />
              Comprovante Gerado
            </h2>
            
            {generatedImage ? (
              <div className="space-y-4">
                <img
                  src={generatedImage}
                  alt="Comprovante gerado"
                  className="w-full rounded-lg border shadow-sm"
                />
                <button
                  onClick={downloadReceipt}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Baixar Comprovante
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Download className="h-8 w-8 text-gray-400" />
                </div>
                <p>Clique em "Gerar Comprovante" para visualizar o resultado</p>
              </div>
            )}
          </div>
        </div>

        {/* Canvas oculto */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Instruções */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Como usar:</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <div>
                <p className="font-medium">Upload (Opcional)</p>
                <p>Envie um comprovante para extrair dados automaticamente</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div>
                <p className="font-medium">Edite os dados</p>
                <p>Preencha ou modifique as informações nos campos</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <div>
                <p className="font-medium">Gere o comprovante</p>
                <p>Clique para criar o comprovante com base no modelo Nubank</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
              <div>
                <p className="font-medium">Baixe o resultado</p>
                <p>Salve o comprovante gerado em alta qualidade</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
