import type { ListingParams } from "@/modules/listing/params"

export type FilterChange = (changes: Partial<ListingParams>) => void
