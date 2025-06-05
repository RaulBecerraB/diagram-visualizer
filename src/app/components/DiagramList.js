'use client';

import { useState } from 'react';
import { Search, FileText, Tag, Calendar, Filter } from 'lucide-react';

export default function DiagramList({ diagrams, selectedDiagram, onSelectDiagram, searchTerm, onSearchChange }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories
  const categories = ['all', ...new Set(diagrams.map(d => d.category))];

  // Filter diagrams based on search term and category
  const filteredDiagrams = diagrams.filter(diagram => {
    const matchesSearch = diagram.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         diagram.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         diagram.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || diagram.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Diagramas</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            title="Filtros"
          >
            <Filter className="h-5 w-5 text-gray-400" />
          </button>
        </div>

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

        {/* Category Filter */}
        {showFilters && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Todas las categorías' : category}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Results count */}
        <div className="text-sm text-gray-400">
          {filteredDiagrams.length} de {diagrams.length} diagramas
        </div>
      </div>

      {/* Diagram List */}
      <div className="flex-1 overflow-y-auto">
        {filteredDiagrams.length === 0 ? (
          <div className="p-4 text-center">
            <FileText className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No se encontraron diagramas</p>
            <p className="text-gray-500 text-sm mt-1">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {filteredDiagrams.map((diagram) => (
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

                {/* Category */}
                <div className="flex items-center mb-2">
                  <Tag className="h-3 w-3 text-blue-400 mr-1" />
                  <span className="text-blue-300 text-xs font-medium">
                    {diagram.category}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {diagram.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-700/50 text-gray-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {diagram.tags.length > 3 && (
                    <span className="px-2 py-1 bg-slate-700/50 text-gray-400 text-xs rounded-full">
                      +{diagram.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Date */}
                {diagram.createdAt && (
                  <div className="flex items-center text-gray-500 text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(diagram.createdAt)}</span>
                  </div>
                )}

                {/* Selection indicator */}
                {selectedDiagram?.id === diagram.id && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="text-xs text-gray-500 text-center">
          Haz clic en un diagrama para visualizarlo
        </div>
      </div>
    </div>
  );
} 