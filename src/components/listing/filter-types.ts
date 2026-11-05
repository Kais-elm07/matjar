import type { ListingParams } from "@/lib/listing/params"

export type FilterChange = (changes: Partial<ListingParams>) => void
