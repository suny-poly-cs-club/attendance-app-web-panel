import {useSearch} from 'wouter';

export const useQueryParam = (param: string): string | null => {
  const search = useSearch();
  return new URLSearchParams(search).get(param);
};
