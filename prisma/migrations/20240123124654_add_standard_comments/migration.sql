-- CreateTable
CREATE TABLE "standard_comments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" INTEGER DEFAULT 1,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "standard_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "standard_comments_name_deleted_deleted_at_key" ON "standard_comments"("name", "deleted", "deleted_at");
