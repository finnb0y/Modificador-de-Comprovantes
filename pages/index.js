import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { Upload, Download, Edit3, Calendar, DollarSign, User, Wand2 } from 'lucide-react';

export default function Home() {
  const [image, setImage] = useState(null);
  const [modifiedImage, setModifiedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedTexts, setDetectedTexts] = useState([]);
  const [modifications, setModifications] = useState({
    value: '',
    date: '',
    name: ''
  });
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Detectar textos na imagem usando Canvas e simulação de OCR
  const detectTextsInImage = async (imageElement) => {
    return new Promise((resolve) => {
      // Simulação de detecção de texto - em produção, usaria uma API de OCR
      const mockTexts = [
        { text: '1.250,50', type: 'value', x: 300, y: 200, width: 80, height: 20 },
        { text: '27/07/2025', type: 'date', x: 250, y: 150, width: 100, height: 18 },
        { text: 'JOÃO SILVA', type: 'name', x: 200, y: 100, width: 120, height: 16 }
      ];
      
      // Detectar formato de data
      const dateText = mockTexts.find(t => t.type === 'date')?.text || '';
      if (dateText.includes('JUL') || dateText.includes('JAN') || dateText.includes('FEV')) {
        setDateFormat('DD MMM YYYY');
      } else {
        setDateFormat('DD/MM/YYYY');
      }
      
      setTimeout(() => resolve(mockTexts), 1000);
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.onload = async () => {
        setImage({ element: img, file });
        setIsProcessing(true);
        
        try {
          const texts = await detectTextsInImage(img);
          setDetectedTexts(texts);
        } catch (error) {
          console.error('Erro ao detectar textos:', error);
        } finally {
          setIsProcessing(false);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const formatDate = (dateString, format) => {
    if (!dateString) return '';
    
    const months = {
      '01': 'JAN', '02': 'FEV', '03': 'MAR', '04': 'ABR',
      '05': 'MAI', '06': 'JUN', '07': 'JUL', '08': 'AGO',
      '09': 'SET', '10': 'OUT', '11': 'NOV', '12': 'DEZ'
    };
    
    if (format === 'DD MMM YYYY') {
      const [day, month, year] = dateString.split('/');
      return `${day} ${months[month]} ${year}`;
    }
    
    return dateString;
  };

  const applyModifications = async () => {
    if (!image?.element || !canvasRef.current) return;

    setIsProcessing(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Configurar canvas com o tamanho da imagem
    canvas.width = image.element.width;
    canvas.height = image.element.height;
    
    // Desenhar imagem original
    ctx.drawImage(image.element, 0, 0);
    
    // Aplicar modificações
    detectedTexts.forEach(textItem => {
      let newText = '';
      
      // Determinar o novo texto baseado no tipo
      switch (textItem.type) {
        case 'value':
          newText = modifications.value || textItem.text;
          break;
        case 'date':
          newText = modifications.date ? formatDate(modifications.date, dateFormat) : textItem.text;
          break;
        case 'name':
          newText = modifications.name || textItem.text;
          break;
        default:
          newText = textItem.text;
      }
      
      if (newText !== textItem.text) {
        // Remover texto original (aproximação com retângulo branco)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(textItem.x - 2, textItem.y - textItem.height, textItem.width + 4, textItem.height + 4);
        
        // Configurar fonte similar ao original
        ctx.fillStyle = '#000000';
        ctx.font = `${textItem.height}px Arial, sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        
        // Desenhar novo texto
        ctx.fillText(newText, textItem.x, textItem.y);
      }
    });
    
    // Converter canvas para imagem
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      setModifiedImage(url);
      setIsProcessing(false);
    }, 'image/png');
  };

  const downloadImage = () => {
    if (!modifiedImage) return;
    
    const link = document.createElement('a');
    link.href = modifiedImage;
    link.download = 'comprovante_modificado.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAll = () => {
    setImage(null);
    setModifiedImage(null);
    setDetectedTexts([]);
    setModifications({ value: '', date: '', name: '' });
    setDateFormat('DD/MM/YYYY');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <Head>
        <title>Modificador de Comprovantes</title>
        <meta name="description" content="Modifique valores, datas e nomes em comprovantes mantendo a formatação original" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
              <Edit3 className="text-blue-600" />
              Modificador de Comprovantes
            </h1>
            <p className="text-gray-600 text-lg">
              Modifique valores, datas e nomes em comprovantes mantendo a formatação original
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Painel de Upload e Controles */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Upload className="text-blue-600" />
                Upload e Configuração
              </h2>

              {!image ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors upload-area">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Clique para enviar um comprovante</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Escolher Arquivo
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <img
                      src={image.element.src}
                      alt="Comprovante original"
                      className="max-w-full h-auto rounded-lg border shadow-sm"
                      style={{ maxHeight: '300px' }}
                    />
                    <p className="text-sm text-gray-500 mt-2">Imagem original</p>
                  </div>

                  {isProcessing && (
                    <div className="text-center py-4">
                      <div className="inline-flex items-center gap-2 text-blue-600">
                        <div className="loading-spinner h-4 w-4 border-blue-600"></div>
                        Processando imagem...
                      </div>
                    </div>
                  )}

                  {detectedTexts.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                        <Wand2 className="h-5 w-5" />
                        Modificações
                      </h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                            <DollarSign className="h-4 w-4" />
                            Valor
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: 2.500,00"
                            value={modifications.value}
                            onChange={(e) => setModifications(prev => ({ ...prev, value: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                            <Calendar className="h-4 w-4" />
                            Data (formato detectado: {dateFormat})
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: 28/07/2025"
                            value={modifications.date}
                            onChange={(e) => setModifications(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                            <User className="h-4 w-4" />
                            Nome
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: MARIA SANTOS"
                            value={modifications.name}
                            onChange={(e) => setModifications(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={applyModifications}
                          disabled={isProcessing}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <div className="loading-spinner h-4 w-4 border-white"></div>
                              Processando...
                            </>
                          ) : (
                            <>
                              <Wand2 className="h-4 w-4" />
                              Aplicar
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={resetAll}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Painel de Resultado */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Download className="text-green-600" />
                Resultado
              </h2>

              {modifiedImage ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <img
                      src={modifiedImage}
                      alt="Comprovante modificado"
                      className="max-w-full h-auto rounded-lg border shadow-sm"
                      style={{ maxHeight: '400px' }}
                    />
                    <p className="text-sm text-gray-500 mt-2">Comprovante modificado</p>
                  </div>

                  <button
                    onClick={downloadImage}
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Baixar Comprovante Modificado
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Download className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>O comprovante modificado aparecerá aqui</p>
                </div>
              )}
            </div>
          </div>

          {/* Canvas oculto para processamento */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Informações sobre o projeto */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Como usar:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <p className="font-medium">Envie o comprovante</p>
                  <p>Faça upload da imagem do comprovante que deseja modificar</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <p className="font-medium">Configure as modificações</p>
                  <p>Preencha os campos que deseja alterar (valor, data ou nome)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <p className="font-medium">Baixe o resultado</p>
                  <p>Clique em "Aplicar" e depois baixe o comprovante modificado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
