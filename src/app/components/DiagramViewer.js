'use client';

import { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize, 
  Download, 
  Info,
  Move,
  MousePointer
} from 'lucide-react';

export default function DiagramViewer({ diagram }) {
  const [svgContent, setSvgContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const loadSvg = async () => {
      if (!diagram) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(diagram.path);
        if (!response.ok) {
          throw new Error(`Error al cargar el diagrama: ${response.status}`);
        }
        const svgText = await response.text();
        setSvgContent(svgText);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSvg();
  }, [diagram]);

  const downloadSvg = () => {
    if (!svgContent) return;
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${diagram.title.replace(/\s+/g, '-').toLowerCase()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white">Cargando diagrama...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 max-w-md">
            <h3 className="text-red-400 font-semibold mb-2">Error al cargar el diagrama</h3>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-slate-800/50 overflow-hidden">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
        <TransformWrapper
          initialScale={1}
          minScale={0.1}
          maxScale={5}
          centerOnInit={true}
          wheel={{ step: 0.1 }}
          pinch={{ step: 5 }}
          doubleClick={{ mode: 'reset' }}
          limitToBounds={false}
          centerZoomedOut={false}
          disablePadding={true}
          smooth={false}
          wrapperStyle={{
            width: '100%',
            height: '100%',
            overflow: 'hidden'
          }}
          contentStyle={{
            width: '100%',
            height: '100%'
          }}
        >
          {({ zoomIn, zoomOut, resetTransform, centerView }) => (
            <>
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-2 flex space-x-2">
                <button
                  onClick={() => zoomIn()}
                  className="flex items-center justify-center w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  title="Acercar"
                >
                  <ZoomIn className="h-5 w-5 text-white" />
                </button>
                
                <button
                  onClick={() => zoomOut()}
                  className="flex items-center justify-center w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  title="Alejar"
                >
                  <ZoomOut className="h-5 w-5 text-white" />
                </button>
                
                <button
                  onClick={() => resetTransform()}
                  className="flex items-center justify-center w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  title="Restablecer vista"
                >
                  <RotateCcw className="h-5 w-5 text-white" />
                </button>
                
                <button
                  onClick={() => centerView()}
                  className="flex items-center justify-center w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  title="Centrar"
                >
                  <Maximize className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Main viewer */}
              <TransformComponent
                wrapperClass="!w-full !h-full !overflow-hidden"
                contentClass="!w-auto !h-auto !min-w-full !min-h-full flex items-start justify-center p-8"
              >
                <div 
                  className="svg-container bg-white rounded-lg shadow-2xl p-4 inline-block"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      {/* Info and Download Controls */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center justify-center w-10 h-10 bg-black/40 backdrop-blur-sm hover:bg-black/60 rounded-lg transition-colors"
          title="Información del diagrama"
        >
          <Info className="h-5 w-5 text-white" />
        </button>
        
        <button
          onClick={downloadSvg}
          className="flex items-center justify-center w-10 h-10 bg-black/40 backdrop-blur-sm hover:bg-black/60 rounded-lg transition-colors"
          title="Descargar SVG"
        >
          <Download className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 text-white text-sm max-w-xs">
          <div className="flex items-center space-x-2 mb-2">
            <MousePointer className="h-4 w-4 text-purple-400" />
            <span className="font-medium">Controles:</span>
          </div>
          <ul className="space-y-1 text-xs text-gray-300">
            <li>• Arrastra para mover el diagrama</li>
            <li>• Rueda del mouse para zoom</li>
            <li>• Doble clic para restablecer</li>
            <li>• Pellizca en móvil para zoom</li>
          </ul>
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-16 right-4 z-20 bg-black/80 backdrop-blur-sm rounded-lg p-4 max-w-sm">
          <h3 className="text-white font-semibold mb-2">{diagram.title}</h3>
          <p className="text-gray-300 text-sm mb-3">{diagram.description}</p>
          
          <div className="mb-3">
            <span className="text-purple-400 text-xs font-medium">Categoría:</span>
            <span className="text-white text-sm ml-2">{diagram.category}</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {diagram.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-600/30 text-purple-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <style jsx global>{`
        .svg-container svg {
          max-width: none !important;
          max-height: none !important;
          width: auto !important;
          height: auto !important;
          display: block !important;
        }
        
        /* Ensure the transform component allows scrolling for large content */
        .react-transform-wrapper {
          width: 100% !important;
          height: 100% !important;
        }
        
        .react-transform-component {
          width: 100% !important;
          height: 100% !important;
          overflow: auto !important;
        }
      `}</style>
    </div>
  );
} 