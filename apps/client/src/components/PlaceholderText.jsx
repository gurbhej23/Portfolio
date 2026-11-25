import { isPlaceholder } from '../lib/portfolio';

function PlaceholderText({ children, className = '' }) {
  const placeholder = isPlaceholder(children);
  return <span className={`${placeholder ? 'text-amber-200/80' : ''} ${className}`}>{children}</span>;
}

export default PlaceholderText;
