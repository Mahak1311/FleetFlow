import { useState, useRef, useEffect } from 'react';
import { useLanguageStore, languages, type Language } from '@/store/languageStore';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  const currentLang = languages.find((l) => l.code === currentLanguage);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-dark-card hover:bg-dark-border border border-dark-border rounded-xl transition-all duration-200 hover:scale-105 group"
        title="Change Language"
      >
        <Globe size={20} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
        <span className="text-white font-medium hidden sm:inline">
          {currentLang?.nativeName}
        </span>
        <span className="text-2xl">{currentLang?.flag}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-dark-card border border-dark-border rounded-xl shadow-2xl overflow-hidden z-50 animate-slide-down">
          <div className="p-2">
            <div className="px-3 py-2 text-xs text-gray-400 font-semibold uppercase tracking-wider">
              Select Language
            </div>
            {languages.map((lang) => {
              const isActive = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-dark-border hover:text-white'
                  )}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="flex-1 text-left">
                    <div className={cn('font-medium', isActive && 'text-white')}>
                      {lang.nativeName}
                    </div>
                    <div className={cn('text-xs', isActive ? 'text-blue-100' : 'text-gray-500')}>
                      {lang.name}
                    </div>
                  </div>
                  {isActive && (
                    <Check size={18} className="text-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
