'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CountryCode, DEFAULT_COUNTRY, COUNTRIES } from './countries';

interface CountryContextType {
  country: CountryCode;
  setCountry: (code: CountryCode) => void;
  countryData: typeof COUNTRIES[CountryCode];
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<CountryCode>(DEFAULT_COUNTRY);

  // Load country from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedCountry');
    if (saved && (saved === 'AR' || saved === 'CL')) {
      setCountryState(saved as CountryCode);
    }
  }, []);

  const setCountry = (code: CountryCode) => {
    setCountryState(code);
    localStorage.setItem('selectedCountry', code);
  };

  return (
    <CountryContext.Provider 
      value={{ 
        country, 
        setCountry, 
        countryData: COUNTRIES[country] 
      }}
    >
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
}

