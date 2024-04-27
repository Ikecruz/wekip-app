export interface PaginatedResult<T>{
    cursor: string;
    limit: number;
    results: T[];
}