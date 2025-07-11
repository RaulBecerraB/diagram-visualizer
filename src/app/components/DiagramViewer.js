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
  MousePointer,
  Share2
} from 'lucide-react';

export default function DiagramViewer({ diagram }) {
  const [svgContent, setSvgContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

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

  const shareDiagram = async () => {
    const url = `${window.location.origin}/?diagram=${diagram.id}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setShareMessage('¡URL copiada!');
      setTimeout(() => setShareMessage(''), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      setShareMessage('URL: ' + url);
      setTimeout(() => setShareMessage(''), 5000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
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
          minScale={0.5}
          maxScale={5}
          centerOnInit={true}
          wheel={{ step: 0.1, smoothStep: 0.001 }}
          pinch={{ step: 5 }}
          doubleClick={{ mode: 'reset' }}
          panning={{ 
            disabled: false, 
            velocityDisabled: true,
            lockAxisX: false,
            lockAxisY: false,
            activationKeys: [],
            excluded: [],
            wheelPanning: false
          }}
          limitToBounds={false}
          centerZoomedOut={true}
          disablePadding={false}
          smooth={false}
          animationTime={0}
          velocityAnimation={{ disabled: true }}
          alignmentAnimation={{ disabled: true }}
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
                  className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  title="Acercar"
                >
                  <ZoomIn className="h-5 w-5 text-white" />
                </button>
                
                <button
                  onClick={() => zoomOut()}
                  className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  title="Alejar"
                >
                  <ZoomOut className="h-5 w-5 text-white" />
                </button>
                
                <button
                  onClick={() => resetTransform()}
                  className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  title="Restablecer vista"
                >
                  <RotateCcw className="h-5 w-5 text-white" />
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
      <div className="absolute top-6 right-4 z-10 flex space-x-2">
        <button
          onClick={shareDiagram}
          className="flex items-center justify-center w-10 h-10 bg-blue-600 backdrop-blur-sm hover:bg-blue-700 rounded-lg transition-colors"
          title="Compartir diagrama"
        >
          <Share2 className="h-5 w-5 text-white" />
        </button>
        
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center justify-center w-10 h-10 bg-blue-600 backdrop-blur-sm hover:bg-blue-700 rounded-lg transition-colors"
          title="Información del diagrama"
        >
          <Info className="h-5 w-5 text-white" />
        </button>
        
        <button
          onClick={downloadSvg}
          className="flex items-center justify-center w-10 h-10 bg-blue-600 backdrop-blur-sm hover:bg-blue-700 rounded-lg transition-colors"
          title="Descargar SVG"
        >
          <Download className="h-5 w-5 text-white" />
        </button>
      </div>
      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-16 right-4 z-20 bg-black/80 backdrop-blur-sm rounded-lg p-4 max-w-sm">
          <h3 className="text-white font-semibold mb-2">{diagram.title}</h3>
          <p className="text-gray-300 text-sm mb-3">{diagram.description}</p>
          
          <div className="mb-3">
            <span className="text-blue-400 text-xs font-medium">Categoría:</span>
            <span className="text-white text-sm ml-2">{diagram.category}</span>
          </div>
        </div>
      )}

      {/* Share Message */}
      {shareMessage && (
        <div className="absolute top-16 right-4 z-20 bg-green-600/90 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
          {shareMessage}
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
        
        /* Disable all transitions and animations to prevent momentum */
        .react-transform-wrapper,
        .react-transform-wrapper *,
        .react-transform-component,
        .react-transform-component * {
          transition: none !important;
          animation: none !important;
          transform-origin: 0 0 !important;
        }
        
        /* Force immediate transform updates */
        .react-transform-element {
          transition: none !important;
          animation: none !important;
        }
      `}</style>
    </div>
  );
} 