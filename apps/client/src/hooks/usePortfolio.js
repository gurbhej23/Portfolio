import { useEffect, useState } from 'react';
import api from '../services/api';
import { normalizePortfolio } from '../lib/portfolio';

const PORTFOLIO_CACHE_KEY = 'gurbhej-portfolio-cache-v1';

function readCachedPortfolio() {
  if (typeof window === 'undefined') return null;

  try {
    const cached = window.localStorage.getItem(PORTFOLIO_CACHE_KEY);
    return cached ? normalizePortfolio(JSON.parse(cached)) : null;
  } catch {
    return null;
  }
}

export default function usePortfolio() {
  const [cachedPortfolio] = useState(readCachedPortfolio);
  const [portfolio, setPortfolio] = useState(
    () => cachedPortfolio || normalizePortfolio(),
  );
  const [loading, setLoading] = useState(() => !cachedPortfolio);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    let active = true;

    api.get('/portfolio')
      .then((response) => {
        if (!active) return;

        const payload = response.data?.data || {};
        setPortfolio(normalizePortfolio(payload));
        setApiError('');

        try {
          window.localStorage.setItem(PORTFOLIO_CACHE_KEY, JSON.stringify(payload));
        } catch {
          // Storage can be unavailable in private browsing or restricted contexts.
        }
      })
      .catch((error) => {
        if (!active) return;
        if (!cachedPortfolio) {
          setApiError(error.response?.data?.message || 'Portfolio content is temporarily unavailable.');
        }
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, []);

  return { portfolio, loading, apiError };
}
