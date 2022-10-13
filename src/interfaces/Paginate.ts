export interface Paginate<T> {
  /**
   * docs {Array} - Array of documents
   */
  docs: T[];
  /**
   * totalDocs {Number} - Total number of documents in collection that match a query
   */
  totalDocs: number;
  /**
   * offset {Number} - Only if specified or default page/offset values were used
   */
  offset: number;
  /**
   * limit {Number} - Limit that was used
   */
  limit: number;
  /**
   * totalPages {Number} - Total number of pages
   */
  totalPages: number;
  /**
   * page {Number} - Current page number
   */
  page: number;
  /**
   * pageCounter {Number} - The starting index/serial/chronological number of first document in current page. (Eg: if page=2 and limit=10, then pagingCounter will be 11)
   */
  pagingCounter: number;
  /**
   * hasPrevPage {Boolean} - Availability of prev page.
   */
  hasPrevPage: boolean;
  /**
   * hasNextPage {Boolean} - Availability of next page.
   */
  hasNextPage: boolean;
  /**
   * prevPage: {Number} - Previous page number if available or NULL
   */
  prevPage: number | null;
  /**
   * nextPage: {Number} - Next page number if available or NULL
   */
  nextPage: number | null;
}
