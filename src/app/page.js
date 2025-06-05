'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, FileText, Loader2 } from 'lucide-react';
import DiagramViewer from './components/DiagramViewer';
import DiagramList from './components/DiagramList';
import diagramsData from '../../public/diagrams.json';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDiagram, setSelectedDiagram] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Process diagrams data to add full paths
  const diagrams = diagramsData.diagrams.map(diagram => ({
    ...diagram,
    path: `/diagrams/${diagram.filename}`
  }));

  useEffect(() => {
    const diagramId = searchParams.get('diagram');
    
    if (diagramId) {
      // Find diagram by ID from URL
      const diagram = diagrams.find(d => d.id === diagramId);
      if (diagram) {
        setSelectedDiagram(diagram);
      } else {
        // If diagram not found, redirect to first diagram or home
        if (diagrams.length > 0) {
          router.replace(`/?diagram=${diagrams[0].id}`);
          setSelectedDiagram(diagrams[0]);
        }
      }
    } else {
      // No diagram in URL, select first one and update URL
      if (diagrams.length > 0) {
        router.replace(`/?diagram=${diagrams[0].id}`);
        setSelectedDiagram(diagrams[0]);
      }
    }
  }, [searchParams, router]);

  const handleSelectDiagram = (diagram) => {
    setSelectedDiagram(diagram);
    // Update URL when diagram is selected
    router.push(`/?diagram=${diagram.id}`);
  };

  const filteredDiagrams = diagrams.filter(diagram =>
    diagram.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    diagram.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    diagram.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (diagrams.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <FileText className="h-24 w-24 text-gray-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">No hay diagramas</h2>
          <p className="text-gray-400 mb-4">
            Agrega diagramas al archivo <code className="bg-slate-800 px-2 py-1 rounded">diagrams.json</code> para comenzar.
          </p>
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
            onSelectDiagram={handleSelectDiagram}
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
