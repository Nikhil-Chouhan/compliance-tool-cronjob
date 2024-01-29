-- CreateTable
CREATE TABLE "user_function_mapping" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "business_unit_id" INTEGER NOT NULL,
    "function_department_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "user_function_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_function_mapping_id_key" ON "user_function_mapping"("id");

-- AddForeignKey
ALTER TABLE "user_function_mapping" ADD CONSTRAINT "user_function_mapping_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_function_mapping" ADD CONSTRAINT "user_function_mapping_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_function_mapping" ADD CONSTRAINT "user_function_mapping_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "business_unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_function_mapping" ADD CONSTRAINT "user_function_mapping_function_department_id_fkey" FOREIGN KEY ("function_department_id") REFERENCES "function_department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
