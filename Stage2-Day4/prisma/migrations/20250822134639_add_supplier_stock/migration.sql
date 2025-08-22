/*
  Warnings:

  - You are about to drop the column `supplierId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Supplier` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_supplierId_fkey";

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "supplierId";

-- AlterTable
ALTER TABLE "public"."Supplier" DROP COLUMN "stock";

-- CreateTable
CREATE TABLE "public"."SupplierStock" (
    "id" SERIAL NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,

    CONSTRAINT "SupplierStock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SupplierStock_supplierId_productId_key" ON "public"."SupplierStock"("supplierId", "productId");

-- AddForeignKey
ALTER TABLE "public"."SupplierStock" ADD CONSTRAINT "SupplierStock_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupplierStock" ADD CONSTRAINT "SupplierStock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
