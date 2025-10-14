'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export type CountryCode = 'AR' | 'CL';

export function useCountryFromUrl() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [country, setCountry] = useState<CountryCode>('AR');

  useEffect(() => {
    const countryParam = searchParams?.get('country') as CountryCode;
    if (countryParam === 'AR' || countryParam === 'CL') {
      setCountry(countryParam);
    } else {
      // Default to AR if no valid country in URL
      setCountry('AR');
    }
  }, [searchParams]);

  const changeCountry = (newCountry: CountryCode) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set('country', newCountry);
    router.push(`${pathname}?${params.toString()}`);
  };

  return { country, changeCountry };
}

