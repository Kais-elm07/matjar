/**
 * The admin panel's category form, as text fields. Shared by the form in the browser and the Server
 * Action, which checks it with the same rules as src/data/categories.ts (categorySchema).
 */
export interface CategoryFormValues {
  slug: string
  name: string
  description: string
  /** The cover photo's path, or empty for the photo of the category's most popular product */
  imageSrc: string
  /** The parent category's slug, or empty for a top-level category */
  parent: string
}

export const emptyCategoryForm: CategoryFormValues = {
  slug: "",
  name: "",
  description: "",
  imageSrc: "",
  parent: "",
}
