import { Document, WithId } from "mongodb";
import { db } from "../db";
import { Paginate } from "../interfaces/Paginate";

interface PaginateCollectionParams {
  collection: string;
  currentPage: number;
  limit: number;
  aggregations: any[];
}

export default async function paginateCollection<CollectionI extends Document>({
  collection,
  currentPage,
  limit,
  aggregations = [],
}: PaginateCollectionParams): Promise<Paginate<WithId<CollectionI>>> {
  const offset = currentPage * limit;
  const agg = [
    {
      $skip: offset,
    },
    {
      $limit: limit,
    },
    ...aggregations,
  ];
  const cursor = db.collection(collection).aggregate<WithId<CollectionI>>(agg);

  const [totalDocs, docs] = await Promise.all([
    db.collection(collection).countDocuments(),
    cursor.toArray(),
  ]);
  const totalPages = Math.floor(totalDocs / limit);

  return {
    docs,
    totalDocs,
    offset, // this act as skip property
    limit,
    totalPages,
    page: currentPage,
    pagingCounter: currentPage > 0 ? currentPage * limit : 0,
    hasPrevPage: currentPage > 0,
    hasNextPage: currentPage < totalPages,
    prevPage: currentPage > 0 ? currentPage - 1 : null,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
  };
}
