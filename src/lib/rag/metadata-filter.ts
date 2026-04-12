import { z } from "zod";

/** Flat metadata filter for Pinecone (matches values stored at ingest). */
export const ragMetadataFilterSchema = z
  .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
  .optional();
