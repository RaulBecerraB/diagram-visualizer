import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const diagramsDir = path.join(process.cwd(), 'public', 'diagrams');
    
    // Check if directory exists
    if (!fs.existsSync(diagramsDir)) {
      return NextResponse.json({ diagrams: [] });
    }

    const files = fs.readdirSync(diagramsDir);
    const svgFiles = files.filter(file => file.endsWith('.svg'));

    const diagrams = svgFiles.map((file, index) => {
      const filePath = path.join(diagramsDir, file);
      const stats = fs.statSync(filePath);
      const fileName = path.parse(file).name;
      
      // Try to extract metadata from filename or create default
      const title = fileName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Generate metadata based on filename patterns
      let category = 'General';
      let tags = [];
      let description = `Diagrama de ${title}`;

      // Categorize based on filename patterns
      if (fileName.toLowerCase().includes('jwt') || fileName.toLowerCase().includes('auth')) {
        category = 'Autenticación';
        tags = ['JWT', 'Autenticación', 'Seguridad', 'API'];
        description = 'Diagrama que ilustra el flujo de autenticación JWT, incluyendo el proceso de login, generación de tokens y validación en el servidor.';
      } else if (fileName.toLowerCase().includes('api')) {
        category = 'APIs';
        tags = ['API', 'REST', 'Backend'];
      } else if (fileName.toLowerCase().includes('db') || fileName.toLowerCase().includes('database')) {
        category = 'Base de Datos';
        tags = ['Database', 'SQL', 'Backend'];
      } else if (fileName.toLowerCase().includes('flow') || fileName.toLowerCase().includes('workflow')) {
        category = 'Flujos de Trabajo';
        tags = ['Workflow', 'Process', 'Flow'];
      } else if (fileName.toLowerCase().includes('architecture') || fileName.toLowerCase().includes('arch')) {
        category = 'Arquitectura';
        tags = ['Architecture', 'System Design', 'Infrastructure'];
      }

      return {
        id: `diagram-${index + 1}`,
        title,
        description,
        path: `/diagrams/${file}`,
        category,
        tags,
        createdAt: stats.mtime.toISOString(),
        size: stats.size,
        filename: file
      };
    });

    // Sort by creation date (newest first)
    diagrams.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ 
      diagrams,
      total: diagrams.length,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error loading diagrams:', error);
    return NextResponse.json(
      { error: 'Error al cargar los diagramas' },
      { status: 500 }
    );
  }
} 