import type {Query} from '../types/request';

export const parseIsActiveFilter = (filter: string[]): boolean | null => {
  if (filter.length === 0 || filter.length >= 2) return null; // if [] or ['true', 'false']
  const val = filter[0];

  return val === 'true';
};

export const mapGetUsers = ({
  limit,
  skip,
  sortedBy,
  order,
}: {
  limit: number
  skip: number
  sortedBy: string
  order: 'asc' | 'desc'
}): Query => ({
  limit,
  skip,
  ...(sortedBy !== '' ? {sortBy: sortedBy, order} : {}),
});
