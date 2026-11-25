import { useEffect, useState } from 'react';
import api from '../services/api';
import { normalizePortfolio } from '../lib/portfolio';

export default function usePortfolio() {
  const [portfolio, setPortfolio] = useState(() => normalizePortfolio());
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    let active = true;

    api.get('/portfolio')
      .then((response) => { if (active) setPortfolio(normalizePortfolio(response.data?.data)); })
      .catch((error) => { if (active) setApiError(error.response?.data?.message || 'Portfolio content is temporarily unavailable.'); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, []);

  return { portfolio, loading, apiError };
}
