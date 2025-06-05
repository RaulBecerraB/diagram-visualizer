'use client';

import { Search, FileText, Calendar, User } from 'lucide-react';

export default function DiagramList({ diagrams, totalDiagrams, selectedDiagram, onSelectDiagram, searchTerm, onSearchChange }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/50 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar diagramas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-400">
          {diagrams.length} de {totalDiagrams} diagramas
        </div>
      </div>

      {/* Diagram List */}
      <div className="flex-1 overflow-y-auto">
        {diagrams.length === 0 ? (
          <div className="p-4 text-center">
            <FileText className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No se encontraron diagramas</p>
            <p className="text-gray-500 text-sm mt-1">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {diagrams.map((diagram) => (
              <div
                key={diagram.id}
                onClick={() => onSelectDiagram(diagram)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                  selectedDiagram?.id === diagram.id
                    ? 'bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-500/10'
                    : 'bg-slate-800/30 border-slate-700/30 hover:bg-slate-700/40 hover:border-slate-600/50'
                }`}
              >
                {/* Title */}
                <h3 className="font-semibold text-white mb-2 line-clamp-2">
                  {diagram.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                  {diagram.description}
                </p>

                {/* Author */}
                <div className="flex items-center mb-2">
                  <User className="h-3 w-3 text-blue-400 mr-1" />
                  <span className="text-blue-300 text-xs font-medium">
                    {diagram.author}
                  </span>
                </div>

                {/* Date */}
                {diagram.createdAt && (
                  <div className="flex items-center text-gray-500 text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(diagram.createdAt)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="text-xs text-gray-500 text-center">
          Powered by{' '}
          <a 
            href="https://github.com/RaulBecerraB" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors underline"
          >
            Raul Becerra
          </a>
        </div>
      </div>
    </div>
  );
} 