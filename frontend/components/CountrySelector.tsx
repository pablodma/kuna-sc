'use client';

import { useState } from 'react';
import { useCountryFromUrl, CountryCode } from '@/hooks/useCountryFromUrl';
import { Globe } from 'lucide-react';

export default function CountrySelector() {
  const { country, changeCountry } = useCountryFromUrl();
  const [isOpen, setIsOpen] = useState(false);

  const countries = [
    { code: 'AR' as CountryCode, name: 'Argentina', flag: '🇦🇷' },
    { code: 'CL' as CountryCode, name: 'Chile', flag: '🇨🇱' }
  ];

  const currentCountry = countries.find(c => c.code === country) || countries[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-[#2E5BFF] transition-all shadow-sm hover:shadow-md"
      >
        <Globe className="w-5 h-5 text-[#2E5BFF]" />
        <span className="text-2xl">{currentCountry.flag}</span>
        <span className="font-semibold text-gray-700">{currentCountry.code}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden animate-fadeIn">
          {countries.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                changeCountry(c.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 transition-colors ${
                c.code === country ? 'bg-blue-100 border-l-4 border-[#2E5BFF]' : ''
              }`}
            >
              <span className="text-2xl">{c.flag}</span>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-500">{c.code}</p>
              </div>
              {c.code === country && (
                <svg className="w-5 h-5 text-[#2E5BFF]" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

