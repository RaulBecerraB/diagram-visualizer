'use client';

import { useState, useEffect } from 'react';
import { Search, FileText, Loader2 } from 'lucide-react';
import DiagramViewer from './components/DiagramViewer';
import DiagramList from './components/DiagramList';

export default function Home() {
  const [diagrams, setDiagrams] = useState([]);
  const [selectedDiagram, setSelectedDiagram] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDiagrams = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/diagrams');
        if (!response.ok) {
          throw new Error(`Error al cargar diagramas: ${response.status}`);
        }
        
        const data = await response.json();
        setDiagrams(data.diagrams || []);
        
        // Auto-select first diagram if available
        if (data.diagrams && data.diagrams.length > 0) {
          setSelectedDiagram(data.diagrams[0]);
        }
      } catch (err) {
        console.error('Error loading diagrams:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDiagrams();
  }, []);

  const filteredDiagrams = diagrams.filter(diagram =>
    diagram.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    diagram.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    diagram.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Cargando Diagramas</h2>
          <p className="text-gray-400">Escaneando archivos SVG...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-400 mb-2">Error</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (diagrams.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <FileText className="h-24 w-24 text-gray-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">No hay diagramas</h2>
          <p className="text-gray-400 mb-4">
            Coloca archivos SVG en la carpeta <code className="bg-slate-800 px-2 py-1 rounded">public/diagrams/</code> para comenzar.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Actualizar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-slate-700/50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src="/favicon.svg" alt="Logo" className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Visor de Diagramas
                  </h1>
                  <div className="text-xs text-gray-400">
                    {diagrams.length} diagrama{diagrams.length !== 1 ? 's' : ''} disponible{diagrams.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                Raul Becerra Archives
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-700/50">
          <DiagramList
            diagrams={filteredDiagrams}
            selectedDiagram={selectedDiagram}
            onSelectDiagram={setSelectedDiagram}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {selectedDiagram ? (
            <DiagramViewer diagram={selectedDiagram} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-24 w-24 text-gray-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  Selecciona un diagrama
                </h2>
                <p className="text-gray-400">
                  Elige un diagrama de la lista para visualizarlo
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
