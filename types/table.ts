export interface Header {
  title: string;
  key?: string;
  sortable?: boolean;
}

export type Data = { [key: string | number]: unknown };

export interface Pagination {
  total: number;
  currentPage: number;
  perPage: number;
  from: number;
  to: number;
  totalPages: number;
}

export interface Sorting {
  column: string | null;
  order: "asc" | "desc" | null;
}
