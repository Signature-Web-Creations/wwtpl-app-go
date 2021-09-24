import {useLocation} from 'react-router-dom';

export function useSearchParams() {
  // Returns search Parameters from URL 
  
  return new URLSearchParams(useLocation().search);
}
