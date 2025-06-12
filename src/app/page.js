'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, FileText, Loader2, Menu, X } from 'lucide-react';
import DiagramViewer from './components/DiagramViewer';
import DiagramList from './components/DiagramList';
import diagramsData from '../../public/diagrams.json';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDiagram, setSelectedDiagram] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    if (selectedDiagram?.id === diagram.id) return; // Don't transition if same diagram
    
    setIsTransitioning(true);
    
    // Small delay to show transition effect
    setTimeout(() => {
      setSelectedDiagram(diagram);
      // Update URL when diagram is selected
      router.push(`/?diagram=${diagram.id}`);
      
      // End transition after a brief moment
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }, 100);
  };

  const filteredDiagrams = diagrams.filter(diagram =>
    (diagram.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (diagram.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (diagram.author || '').toLowerCase().includes(searchTerm.toLowerCase())
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
      <header className="bg-black/20 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700/50"
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Sidebar - Mobile Overlay */}
        <div 
          className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div 
          className={`fixed lg:static inset-y-0 left-0 w-80 bg-slate-900 border-r border-slate-700/50 transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full overflow-y-auto">
            <DiagramList
              diagrams={filteredDiagrams}
              totalDiagrams={diagrams.length}
              selectedDiagram={selectedDiagram}
              onSelectDiagram={(diagram) => {
                handleSelectDiagram(diagram);
                setIsSidebarOpen(false); // Close sidebar on mobile after selection
              }}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 relative">
          {/* Main viewer with fade transition */}
          <div className={`h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {selectedDiagram ? (
              <DiagramViewer diagram={selectedDiagram} />
            ) : (
              <div className="h-full flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                  <FileText className="h-16 w-16 sm:h-24 sm:w-24 text-gray-500 mx-auto mb-4 sm:mb-6" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    Selecciona un diagrama
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base">
                    Elige un diagrama de la lista para visualizarlo
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-2" />
          <p className="text-white text-sm">Cargando aplicación...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
