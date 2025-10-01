import { useState, useRef, useEffect } from 'react';
import { Input } from './input';
import { Badge } from './badge';
import { Search, Zap, Hash, Brain } from 'lucide-react';
import { getSearchSuggestions, SearchSuggestion } from '../../lib/semanticSearch';

interface SmartSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SmartSearch({ value, onChange, placeholder }: SmartSearchProps) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      const newSuggestions = getSearchSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
    setSelectedIndex(-1);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'entity': return Hash;
      case 'semantic': return Brain;
      default: return Zap;
    }
  };

  const getSuggestionColor = (category?: string) => {
    switch (category) {
      case 'equipamento': return 'var(--primary)';
      case 'risco': return 'var(--danger)';
      case 'condição': return 'var(--warning)';
      case 'ação': return 'var(--success)';
      default: return 'var(--muted)';
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
        <input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder || "Busca inteligente: equipamento, risco, temperatura..."}
          className="flex h-9 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--muted)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50 pl-10 pr-4"
        />
        {value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Brain className="w-4 h-4 text-[var(--primary)]" />
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg max-h-64 overflow-y-auto"
        >
          <div className="p-2">
            <div className="text-xs font-medium text-[var(--muted)] mb-2 flex items-center gap-1">
              <Brain className="w-3 h-3" />
              Sugestões Inteligentes
            </div>
            {suggestions.map((suggestion, index) => {
              const Icon = getSuggestionIcon(suggestion.type);
              const color = getSuggestionColor(suggestion.category);
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                    index === selectedIndex 
                      ? 'bg-[var(--primary)]/10' 
                      : 'hover:bg-[var(--bg)]'
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <Icon className="w-3 h-3 flex-shrink-0" style={{ color }} />
                  <span className="flex-1 text-sm">{suggestion.text}</span>
                  {suggestion.category && (
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ 
                        borderColor: color,
                        color: color 
                      }}
                    >
                      {suggestion.category}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}