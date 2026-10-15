import { tagsActions } from '@/database/actions';
import { useQuery } from '@tanstack/react-query';

export const TAGS_QUERY_KEY = ['tags'] as const;

export function useTags() {
  return useQuery({ queryKey: TAGS_QUERY_KEY, queryFn: tagsActions.listTags }).data ?? [];
}
