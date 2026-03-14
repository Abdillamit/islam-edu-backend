export function normalizePagination(
  page = 1,
  limit = 20,
): {
  page: number;
  limit: number;
  skip: number;
} {
  const normalizedPage = Math.max(1, page);
  const normalizedLimit = Math.min(Math.max(1, limit), 50);

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    skip: (normalizedPage - 1) * normalizedLimit,
  };
}

export function getTotalPages(total: number, limit: number): number {
  if (total === 0) {
    return 0;
  }

  return Math.ceil(total / limit);
}
