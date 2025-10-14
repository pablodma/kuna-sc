export const COUNTRIES = {
  AR: {
    code: 'AR',
    name: 'Argentina',
    currency: 'ARS',
    currencySymbol: '$',
    locale: 'es-AR',
    phonePrefix: '+54',
    flag: '🇦🇷'
  },
  CL: {
    code: 'CL',
    name: 'Chile',
    currency: 'CLP',
    currencySymbol: '$',
    locale: 'es-CL',
    phonePrefix: '+56',
    flag: '🇨🇱'
  }
} as const;

export type CountryCode = keyof typeof COUNTRIES;
export const DEFAULT_COUNTRY: CountryCode = 'AR';

export function getCountryByCode(code: string): typeof COUNTRIES[CountryCode] | null {
  const upperCode = code.toUpperCase();
  if (upperCode in COUNTRIES) {
    return COUNTRIES[upperCode as CountryCode];
  }
  return null;
}

export function formatCurrency(amount: number, countryCode: CountryCode): string {
  const country = COUNTRIES[countryCode];
  return new Intl.NumberFormat(country.locale, {
    style: 'currency',
    currency: country.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

