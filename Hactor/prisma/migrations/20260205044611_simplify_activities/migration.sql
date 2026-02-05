/*
  Warnings:

  - You are about to drop the column `period` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `activities` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "activities_period_idx";

-- DropIndex
DROP INDEX "activities_sort_order_idx";

-- AlterTable
ALTER TABLE "activities" DROP COLUMN "period",
DROP COLUMN "sort_order",
DROP COLUMN "status",
DROP COLUMN "summary";
