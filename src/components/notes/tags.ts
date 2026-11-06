import { queryKeys } from '@/constants/query-keys';
import { tagsActions } from '@/database/actions';
import { useQuery } from '@tanstack/react-query';

export function useTags() {
  return useQuery({ queryKey: queryKeys.tags.all, queryFn: tagsActions.listTags }).data ?? [];
}
