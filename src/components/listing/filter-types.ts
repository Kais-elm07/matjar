import type { ListingParams } from "@/lib/catalog/listing"

export type FilterChange = (changes: Partial<ListingParams>) => void
