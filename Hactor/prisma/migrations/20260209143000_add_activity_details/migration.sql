-- Add optional long-form content and cover image URL for activity detail pages.
ALTER TABLE "activities"
ADD COLUMN "content" TEXT,
ADD COLUMN "cover_image_url" TEXT;

-- Store additional gallery images for each activity.
CREATE TABLE "activity_images" (
    "id" SERIAL NOT NULL,
    "activity_id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "caption" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_images_pkey" PRIMARY KEY ("id")
);

-- Keep gallery listing stable and fast inside an activity detail page.
CREATE INDEX "activity_images_activity_id_sort_order_idx"
ON "activity_images"("activity_id", "sort_order");

ALTER TABLE "activity_images"
ADD CONSTRAINT "activity_images_activity_id_fkey"
FOREIGN KEY ("activity_id")
REFERENCES "activities"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
