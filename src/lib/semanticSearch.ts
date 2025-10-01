export interface SearchSuggestion {
  text: string;
  type: 'entity' | 'keyword' | 'semantic';
  category?: string;
}

export const searchSuggestions: SearchSuggestion[] = [
  // Equipamentos
  { text: 'bomba centrífuga', type: 'entity', category: 'equipamento' },
  { text: 'motor elétrico', type: 'entity', category: 'equipamento' },
  { text: 'válvula de segurança', type: 'entity', category: 'equipamento' },
  { text: 'compressor', type: 'entity', category: 'equipamento' },
  { text: 'turbina', type: 'entity', category: 'equipamento' },
  
  // Problemas/Riscos
  { text: 'vazamento', type: 'keyword', category: 'risco' },
  { text: 'superaquecimento', type: 'keyword', category: 'risco' },
  { text: 'vibração excessiva', type: 'keyword', category: 'risco' },
  { text: 'falha mecânica', type: 'keyword', category: 'risco' },
  { text: 'corrosão', type: 'keyword', category: 'risco' },
  
  // Condições
  { text: 'temperatura alta', type: 'semantic', category: 'condição' },
  { text: 'pressão anormal', type: 'semantic', category: 'condição' },
  { text: 'ruído estranho', type: 'semantic', category: 'condição' },
  { text: 'parada não programada', type: 'semantic', category: 'condição' },
  
  // Ações
  { text: 'manutenção preventiva', type: 'semantic', category: 'ação' },
  { text: 'inspeção urgente', type: 'semantic', category: 'ação' },
  { text: 'substituição de peça', type: 'semantic', category: 'ação' },
];

export function getSearchSuggestions(query: string): SearchSuggestion[] {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return searchSuggestions
    .filter(suggestion => 
      suggestion.text.toLowerCase().includes(normalizedQuery)
    )
    .slice(0, 8);
}

export function performSemanticSearch(query: string, documents: any[]): any[] {
  if (!query.trim()) return documents;
  
  const normalizedQuery = query.toLowerCase();
  const queryTerms = normalizedQuery.split(' ').filter(term => term.length > 2);
  
  // Semantic mappings for better search
  const semanticMappings: Record<string, string[]> = {
    'temperatura': ['temp', 'aquecimento', 'calor', 'térmico', 'quente'],
    'pressão': ['press', 'psi', 'bar', 'pascal'],
    'vazamento': ['leak', 'escape', 'derrame', 'gotejamento'],
    'vibração': ['oscilação', 'tremor', 'balanço'],
    'falha': ['erro', 'defeito', 'problema', 'avaria'],
    'manutenção': ['reparo', 'conserto', 'correção'],
  };
  
  return documents
    .map(doc => {
      let score = 0;
      const searchableText = `${doc.title} ${doc.summary} ${Object.values(doc.entities).join(' ')}`.toLowerCase();
      
      // Direct term matching
      queryTerms.forEach(term => {
        const termCount = (searchableText.match(new RegExp(term, 'g')) || []).length;
        score += termCount * 10;
        
        // Semantic matching
        Object.entries(semanticMappings).forEach(([key, synonyms]) => {
          if (term.includes(key) || synonyms.some(syn => term.includes(syn))) {
            const semanticMatches = synonyms.filter(syn => searchableText.includes(syn)).length;
            score += semanticMatches * 5;
          }
        });
      });
      
      // Boost score for entity matches
      Object.values(doc.entities).forEach((entity: any) => {
        if (entity.toLowerCase().includes(normalizedQuery)) {
          score += 20;
        }
      });
      
      // Boost for high-risk documents
      if (doc.score > 0.7 && queryTerms.some(term => ['urgente', 'crítico', 'risco'].includes(term))) {
        score += 15;
      }
      
      return { ...doc, searchScore: score };
    })
    .filter(doc => doc.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore);
}