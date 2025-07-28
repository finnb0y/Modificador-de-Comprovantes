import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { Upload, Download, Edit3, Save, X, Check } from 'lucide-react';

export default function Home() {
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editableFields, setEditableFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Detectar campos editáveis baseados na proporção da imagem
  const detectEditableFields = (imageElement, containerRect) => {
    // Calcular as proporções baseadas no tamanho real da imagem exibida
    const displayedImg = imageContainerRef.current?.querySelector('img');
    if (!displayedImg) return [];
    
    const imgRect = displayedImg.getBoundingClientRect();
    const containerBounds = imageContainerRef.current.getBoundingClientRect();
    
    // Proporções baseadas na análise da imagem do Nubank
    const fields = [
      {
        id: 'date',
        text: '27 JUL 2025',
        type: 'date',
        x: imgRect.width * 0.06, // 6% da largura
        y: imgRect.height * 0.10, // 10% da altura
        width: imgRect.width * 0.35,
        height: 20,
        fontSize: 14,
        fontFamily: 'Arial, sans-serif',
        color: '#666666',
        textAlign: 'left'
      },
      {
        id: 'time',
        text: '18:04:53',
        type: 'time',
        x: imgRect.width * 0.43,
        y: imgRect.height * 0.10,
        width: imgRect.width * 0.20,
        height: 20,
        fontSize: 14,
        fontFamily: 'Arial, sans-serif',
        color: '#666666',
        textAlign: 'left'
      },
      {
        id: 'value',
        text: 'R$ 100,00',
        type: 'value',
        x: imgRect.width * 0.65,
        y: imgRect.height * 0.15,
        width: imgRect.width * 0.30,
        height: 22,
        fontSize: 16,
        fontFamily: 'Arial, sans-serif',
        color: '#000000',
        textAlign: 'right',
        fontWeight: 'bold'
      },
      {
        id: 'recipient_name',
        text: 'PAULO TERTULIANO FREITAS DE ARAÚJO',
        type: 'name',
        x: imgRect.width * 0.30,
        y: imgRect.height * 0.28,
        width: imgRect.width * 0.65,
        height: 35,
        fontSize: 13,
        fontFamily: 'Arial, sans-serif',
        color: '#000000',
        textAlign: 'right',
        multiline: true
      },
      {
        id: 'recipient_cpf',
        text: '•••.546.681-••',
        type: 'cpf',
        x: imgRect.width * 0.65,
        y: imgRect.height * 0.35,
        width: imgRect.width * 0.30,
        height: 20,
        fontSize: 13,
        fontFamily: 'Arial, sans-serif',
        color: '#000000',
        textAlign: 'right'
      },
      {
        id: 'sender_name',
        text: 'Phillip Tertuliano Lima de Araújo',
        type: 'name',
        x: imgRect.width * 0.30,
        y: imgRect.height * 0.60,
        width: imgRect.width * 0.65,
        height: 20,
        fontSize: 13,
        fontFamily: 'Arial, sans-serif',
        color: '#000000',
        textAlign: 'right'
      },
      {
        id: 'sender_cpf',
        text: '•••.745.561-••',
        type: 'cpf',
        x: imgRect.width * 0.65,
        y: imgRect.height * 0.70,
        width: imgRect.width * 0.30,
        height: 20,
        fontSize: 13,
        fontFamily: 'Arial, sans-serif',
        color: '#000000',
        textAlign: 'right'
      }
    ];

    return fields;
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage({ element: img, file, src: e.target.result });
        setIsProcessing(true);
        
        // Aguardar a imagem ser renderizada no DOM
        setTimeout(() => {
          if (imageContainerRef.current) {
            const fields = detectEditableFields(img, null);
            console.log('Campos detectados:', fields.length); // Debug
            setEditableFields(fields);
          }
          setIsProcessing(false);
        }, 500); // Aumentei o tempo para garantir que a imagem seja renderizada
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFieldClick = (field) => {
    setSelectedField(field.id);
    setEditingField(field.id);
    setTempValue(field.text);
    
    // Focar no input após um pequeno delay
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 10);
  };

  const handleFieldUpdate = () => {
    if (!editingField || !tempValue.trim()) return;
    
    setEditableFields(prev => 
      prev.map(field => 
        field.id === editingField 
          ? { ...field, text: tempValue.trim() }
          : field
      )
    );
    
    setEditingField(null);
    setSelectedField(null);
    setTempValue('');
  };

  const handleFieldCancel = () => {
    setEditingField(null);
    setSelectedField(null);
    setTempValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFieldUpdate();
    } else if (e.key === 'Escape') {
      handleFieldCancel();
    }
  };

  const generatePreview = async () => {
    if (!image?.element || !canvasRef.current) return;

    setIsProcessing(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Configurar canvas com alta qualidade
    canvas.width = image.element.naturalWidth;
    canvas.height = image.element.naturalHeight;
    
    // Desenhar imagem original
    ctx.drawImage(image.element, 0, 0);
    
    // Aplicar modificações mantendo formatação original
    editableFields.forEach(field => {
      const originalField = detectEditableFields(image.element, { width: canvas.width, height: canvas.height })
        .find(f => f.id === field.id);
      
      if (originalField && field.text !== originalField.text) {
        // Calcular posições reais no canvas
        const realX = field.x * (canvas.width / imageContainerRef.current?.offsetWidth || 1);
        const realY = field.y * (canvas.height / imageContainerRef.current?.offsetHeight || 1);
        const realWidth = field.width * (canvas.width / imageContainerRef.current?.offsetWidth || 1);
        const realHeight = field.height * (canvas.height / imageContainerRef.current?.offsetHeight || 1);
        
        // Limpar área do texto original
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(realX - 2, realY - realHeight, realWidth + 4, realHeight + 4);
        
        // Configurar fonte idêntica ao original
        const fontSize = field.fontSize * (canvas.width / 340); // Ajustar escala
        ctx.font = `${field.fontWeight || 'normal'} ${fontSize}px ${field.fontFamily}`;
        ctx.fillStyle = field.color;
        ctx.textAlign = field.textAlign;
        ctx.textBaseline = 'top';
        
        // Desenhar novo texto
        if (field.multiline && field.text.length > 25) {
          // Quebrar texto em múltiplas linhas se necessário
          const words = field.text.split(' ');
          let line = '';
          let y = realY - realHeight + 2;
          
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > realWidth && n > 0) {
              ctx.fillText(line, field.textAlign === 'right' ? realX + realWidth : realX, y);
              line = words[n] + ' ';
              y += fontSize + 2;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, field.textAlign === 'right' ? realX + realWidth : realX, y);
        } else {
          ctx.fillText(
            field.text, 
            field.textAlign === 'right' ? realX + realWidth : realX, 
            realY - realHeight + 2
          );
        }
      }
    });
    
    // Converter para imagem
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      setPreviewImage(url);
      setShowPreview(true);
      setIsProcessing(false);
    }, 'image/png', 1.0);
  };

  const downloadImage = () => {
    if (!previewImage) return;
    
    const link = document.createElement('a');
    link.href = previewImage;
    link.download = 'comprovante_modificado.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAll = () => {
    setImage(null);
    setEditableFields([]);
    setSelectedField(null);
    setEditingField(null);
    setShowPreview(false);
    setPreviewImage(null);
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
              Clique nos campos da imagem para editá-los diretamente
            </p>
          </div>

          {!showPreview ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Painel de Upload */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <Upload className="text-blue-600" />
                  Upload do Comprovante
                </h2>

                {!image ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
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
                  <div className="space-y-4">
                    <button
                      onClick={resetAll}
                      className="mb-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Trocar Imagem
                    </button>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        💡 Clique nos campos da imagem para editá-los
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Painel de Edição Interativa */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                    <Edit3 className="text-green-600" />
                    Edição Interativa
                  </h2>
                  {image && editableFields.length > 0 && (
                    <button
                      onClick={generatePreview}
                      disabled={isProcessing}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Gerar Preview
                        </>
                      )}
                    </button>
                  )}
                </div>

                {image ? (
                  <div className="relative">
                    {isProcessing && (
                      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          <p className="text-gray-600">Processando...</p>
                        </div>
                      </div>
                    )}
                    
                    <div 
                      ref={imageContainerRef}
                      className="relative inline-block"
                      style={{ maxWidth: '100%' }}
                    >
                      <img
                        src={image.src}
                        alt="Comprovante"
                        className="max-w-full h-auto rounded-lg border shadow-sm"
                        style={{ maxHeight: '600px' }}
                      />
                      
                      {/* Campos editáveis sobrepostos */}
                      {editableFields.map((field) => (
                        <div
                          key={field.id}
                          className={`absolute cursor-pointer transition-all duration-200 ${
                            selectedField === field.id 
                              ? 'bg-blue-200 bg-opacity-50 border-2 border-blue-500' 
                              : 'hover:bg-yellow-200 hover:bg-opacity-30 border border-transparent'
                          }`}
                          style={{
                            left: `${field.x}px`,
                            top: `${field.y - field.height}px`,
                            width: `${field.width}px`,
                            height: `${field.height}px`,
                          }}
                          onClick={() => handleFieldClick(field)}
                          title={`Clique para editar: ${field.text}`}
                        >
                          {editingField === field.id && (
                            <div className="absolute -top-12 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-20 min-w-48">
                              <div className="flex gap-2">
                                <input
                                  ref={inputRef}
                                  type="text"
                                  value={tempValue}
                                  onChange={(e) => setTempValue(e.target.value)}
                                  onKeyDown={handleKeyPress}
                                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  style={{
                                    fontSize: `${field.fontSize}px`,
                                    fontFamily: field.fontFamily,
                                    textAlign: field.textAlign
                                  }}
                                />
                                <button
                                  onClick={handleFieldUpdate}
                                  className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                >
                                  <Check className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={handleFieldCancel}
                                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Edit3 className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p>Envie uma imagem para começar a editar</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Painel de Preview */
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  <Download className="text-green-600" />
                  Preview do Resultado
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Voltar para Edição
                  </button>
                  <button
                    onClick={downloadImage}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Baixar Comprovante
                  </button>
                </div>
              </div>

              <div className="text-center">
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Comprovante modificado"
                    className="max-w-full h-auto rounded-lg border shadow-sm mx-auto"
                    style={{ maxHeight: '80vh' }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Canvas oculto para processamento */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Instruções */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Como usar:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <p className="font-medium">Upload</p>
                  <p>Envie a imagem do comprovante</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <p className="font-medium">Clique nos campos</p>
                  <p>Clique diretamente nos textos que quer editar</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <p className="font-medium">Edite</p>
                  <p>Digite o novo valor e confirme com Enter</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                <div>
                  <p className="font-medium">Baixe</p>
                  <p>Gere o preview e baixe o resultado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
