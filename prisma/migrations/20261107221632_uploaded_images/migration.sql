-- CreateTable
CREATE TABLE "uploaded_images" (
    "id" SERIAL NOT NULL,
    "src" TEXT NOT NULL,
    "tone" TEXT,
    "cutout" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploaded_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uploaded_images_src_key" ON "uploaded_images"("src");
