export interface IPaginationResponse<T = unknown> {
  docs: T[];
  meta: {
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    nextPage: number;
    prevPage: number;
  }
}

export interface IResponData<T = unknown> {
  data: T;
  statusCode: number
}
