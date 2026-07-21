/*
  Warnings:

  - A unique constraint covering the columns `[storageName]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileSize` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "fileSize" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_storageName_key" ON "File"("storageName");
