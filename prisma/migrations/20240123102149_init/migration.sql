-- CreateEnum
CREATE TYPE "legal_status" AS ENUM ('Complied', 'Escalated', 'Non Complied', 'Delayed', 'Delayed Reported', 'Re Assigned', 'Approval Pending');

-- CreateEnum
CREATE TYPE "frequency" AS ENUM ('Onetime', 'Ongoing', 'event based', '10 yearly', '8 yearly', '5 yearly', '4 yearly', '3 yearly', '2 yearly', 'yearly', '10 monthly', '4 monthly', 'Half yearly', 'Quarterly', 'Bi-monthly', 'Monthly', 'Fortnightly', 'Weekly', 'event');

-- CreateEnum
CREATE TYPE "impact" AS ENUM ('Super Critical', 'Critical', 'High', 'Moderate', 'Low');

-- CreateEnum
CREATE TYPE "applies" AS ENUM ('Company', 'Product', 'Individual');

-- CreateEnum
CREATE TYPE "imprisonment_for" AS ENUM ('Managing Director', 'Managerial Person', 'General Manager', 'Occupier', 'Manager', 'Principal Employer', 'Employer', 'Contractor', 'Owner', 'Officer in default');

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" INTEGER DEFAULT 1,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" INTEGER DEFAULT 1,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER,
    "permission_id" INTEGER,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_profile" (
    "id" SERIAL NOT NULL,
    "logo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "business_type" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "country_id" INTEGER NOT NULL,
    "state_id" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "pincode" INTEGER NOT NULL,
    "area_code_1" INTEGER NOT NULL,
    "mobile_no_1" INTEGER NOT NULL,
    "area_code_2" INTEGER NOT NULL,
    "mobile_no_2" INTEGER NOT NULL,
    "email_1" TEXT NOT NULL,
    "email_2" TEXT NOT NULL,
    "primary_color" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "organization_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" INTEGER DEFAULT 1,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,
    "cin" TEXT,
    "gst_number" TEXT,
    "industry_id" INTEGER,
    "logo" TEXT,
    "theme_id" INTEGER,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" INTEGER DEFAULT 1,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,
    "updated_at" TIMESTAMP(3),
    "organization_id" INTEGER NOT NULL,
    "cin" TEXT,
    "industry_id" INTEGER,
    "logo" TEXT,
    "gst" TEXT,
    "pan" TEXT,
    "short_name" TEXT,
    "tan" TEXT,

    CONSTRAINT "entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_vertical" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" INTEGER DEFAULT 1,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,
    "entity_id" INTEGER,
    "organization_id" INTEGER,

    CONSTRAINT "business_vertical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zone" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" INTEGER DEFAULT 1,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,
    "business_vertical_id" INTEGER,
    "entity_id" INTEGER,
    "organization_id" INTEGER,

    CONSTRAINT "zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_unit" (
    "id" SERIAL NOT NULL,
    "organization_id" INTEGER,
    "entity_id" INTEGER,
    "business_vertical_id" INTEGER,
    "zone_id" INTEGER,
    "name" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "zipcode" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,
    "unit_code" TEXT,
    "unit_type_id" INTEGER NOT NULL,

    CONSTRAINT "business_unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "function_department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "function_department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" INTEGER DEFAULT 1,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "unit_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_function_mapping" (
    "id" SERIAL NOT NULL,
    "business_unit_id" INTEGER NOT NULL,
    "function_department_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,
    "zoneId" INTEGER,

    CONSTRAINT "unit_function_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "employee_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile_no" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role_id" INTEGER,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,
    "password_changed_at" TIMESTAMP(3),
    "designation_id" INTEGER,
    "function_department_id" INTEGER,
    "business_unit_id" INTEGER,
    "profile_picture" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crs_activity" (
    "id" SERIAL NOT NULL,
    "activity_code" TEXT NOT NULL,
    "title" TEXT,
    "legislation" TEXT NOT NULL,
    "rule" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "who" TEXT NOT NULL,
    "when" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "procedure" TEXT NOT NULL,
    "description" TEXT,
    "frequency" "frequency",
    "form_no" TEXT,
    "compliance_type" TEXT,
    "authority" TEXT,
    "exemption_criteria" TEXT,
    "event" TEXT,
    "event_sub" TEXT,
    "event_question" TEXT,
    "implications" TEXT,
    "imprison_duration" TEXT,
    "imprison_applies_to" "imprisonment_for",
    "currency" TEXT,
    "fine" TEXT,
    "fine_per_day" TEXT,
    "impact" "impact" NOT NULL,
    "impact_on_unit" "impact",
    "impact_on_organization" "impact",
    "linked_activity_ids" TEXT,
    "reference_link" TEXT,
    "sources" TEXT,
    "documents" TEXT,
    "status" INTEGER,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,
    "country" TEXT NOT NULL,
    "law_category" TEXT NOT NULL,
    "legal_due_date" TEXT,
    "state" TEXT,
    "updated_date" TEXT,

    CONSTRAINT "crs_activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_mapping" (
    "id" SERIAL NOT NULL,
    "unit_activity_id" TEXT NOT NULL,
    "function_id" INTEGER NOT NULL,
    "executor_id" INTEGER NOT NULL,
    "evaluator_id" INTEGER NOT NULL,
    "function_head_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,
    "business_unit_id" INTEGER NOT NULL,
    "crs_activity_id" INTEGER NOT NULL,

    CONSTRAINT "activity_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_configuration" (
    "id" SERIAL NOT NULL,
    "due_date_buffer" INTEGER,
    "legal_due_date" TIMESTAMP(3) NOT NULL,
    "unit_head_due_date" TIMESTAMP(3) NOT NULL,
    "function_head_due_date" TIMESTAMP(3) NOT NULL,
    "evaluator_due_date" TIMESTAMP(3) NOT NULL,
    "executor_due_date" TIMESTAMP(3) NOT NULL,
    "back_dates" INTEGER,
    "first_alert" TIMESTAMP(3),
    "second_alert" TIMESTAMP(3),
    "third_alert" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,
    "alert_prior_days" INTEGER,
    "historical" INTEGER,
    "status" INTEGER,
    "impact_on_entity" TEXT,
    "impact_on_unit" TEXT,
    "impact" TEXT,
    "frequency" TEXT,
    "activity_maker_checker" INTEGER NOT NULL,
    "proof_required" INTEGER,
    "activity_mapping_id" INTEGER NOT NULL,

    CONSTRAINT "activity_configuration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_history" (
    "id" SERIAL NOT NULL,
    "executor_id" INTEGER NOT NULL,
    "evaluator_id" INTEGER NOT NULL,
    "function_head_id" INTEGER NOT NULL,
    "legal_due_date" TIMESTAMP(3) NOT NULL,
    "unit_head_due_date" TIMESTAMP(3) NOT NULL,
    "function_head_due_date" TIMESTAMP(3) NOT NULL,
    "evaluator_due_date" TIMESTAMP(3) NOT NULL,
    "executor_due_date" TIMESTAMP(3) NOT NULL,
    "completed_by" INTEGER,
    "completion_date" TIMESTAMP(3),
    "comments" TEXT,
    "non_compliance_reason" TEXT,
    "reason_for_reopen" TEXT,
    "document" TEXT,
    "activity_history_status" "legal_status",
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "status" INTEGER NOT NULL DEFAULT 1,
    "updated_at" TIMESTAMP(3),
    "activity_configuration_id" INTEGER NOT NULL,
    "activity_mapping_id" INTEGER NOT NULL,

    CONSTRAINT "activity_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industry" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "designation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "designation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theme" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "primary_color" TEXT NOT NULL,
    "secondary_color" TEXT,
    "mode" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_otp" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "otp" TEXT NOT NULL,

    CONSTRAINT "user_otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "country" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "country_code" TEXT,
    "timezone" TEXT,
    "uts_offset" TEXT,
    "status" INTEGER DEFAULT 1,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "state" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "country_id" INTEGER,
    "status" INTEGER DEFAULT 1,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "action_log" (
    "id" SERIAL NOT NULL,
    "action_name" TEXT NOT NULL,
    "model_name" TEXT NOT NULL,
    "request_data" JSONB,
    "status" INTEGER DEFAULT 1,
    "ip_address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,
    "updated_at" TIMESTAMP(3),
    "user_id" INTEGER,
    "record_id" INTEGER,

    CONSTRAINT "action_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_id_key" ON "role"("id");

-- CreateIndex
CREATE INDEX "role_name_status_idx" ON "role"("name", "status");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_deleted_deleted_at_key" ON "role"("name", "deleted", "deleted_at");

-- CreateIndex
CREATE INDEX "permission_name_status_idx" ON "permission"("name", "status");

-- CreateIndex
CREATE UNIQUE INDEX "permission_name_deleted_deleted_at_key" ON "permission"("name", "deleted", "deleted_at");

-- CreateIndex
CREATE INDEX "role_permission_role_id_permission_id_idx" ON "role_permission"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "organization_profile_id_key" ON "organization_profile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "organization_id_key" ON "organization"("id");

-- CreateIndex
CREATE UNIQUE INDEX "organization_name_deleted_deleted_at_key" ON "organization"("name", "deleted", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "entity_id_key" ON "entity"("id");

-- CreateIndex
CREATE UNIQUE INDEX "entity_name_deleted_deleted_at_key" ON "entity"("name", "deleted", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "business_vertical_id_key" ON "business_vertical"("id");

-- CreateIndex
CREATE UNIQUE INDEX "business_vertical_name_deleted_deleted_at_key" ON "business_vertical"("name", "deleted", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "zone_id_key" ON "zone"("id");

-- CreateIndex
CREATE UNIQUE INDEX "zone_name_deleted_deleted_at_key" ON "zone"("name", "deleted", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "business_unit_id_key" ON "business_unit"("id");

-- CreateIndex
CREATE UNIQUE INDEX "business_unit_name_deleted_deleted_at_key" ON "business_unit"("name", "deleted", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "function_department_id_key" ON "function_department"("id");

-- CreateIndex
CREATE UNIQUE INDEX "function_department_name_deleted_deleted_at_key" ON "function_department"("name", "deleted", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "unit_type_id_key" ON "unit_type"("id");

-- CreateIndex
CREATE UNIQUE INDEX "unit_type_name_deleted_deleted_at_key" ON "unit_type"("name", "deleted", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "unit_function_mapping_id_key" ON "unit_function_mapping"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_mobile_no_key" ON "user"("mobile_no");

-- CreateIndex
CREATE INDEX "user_email_mobile_no_idx" ON "user"("email", "mobile_no");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_mobile_no_deleted_deleted_at_key" ON "user"("email", "mobile_no", "deleted", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "crs_activity_id_key" ON "crs_activity"("id");

-- CreateIndex
CREATE UNIQUE INDEX "crs_activity_title_key" ON "crs_activity"("title");

-- CreateIndex
CREATE UNIQUE INDEX "activity_mapping_id_key" ON "activity_mapping"("id");

-- CreateIndex
CREATE UNIQUE INDEX "activity_mapping_id_unit_activity_id_key" ON "activity_mapping"("id", "unit_activity_id");

-- CreateIndex
CREATE UNIQUE INDEX "activity_configuration_id_key" ON "activity_configuration"("id");

-- CreateIndex
CREATE UNIQUE INDEX "activity_history_id_key" ON "activity_history"("id");

-- CreateIndex
CREATE UNIQUE INDEX "industry_id_key" ON "industry"("id");

-- CreateIndex
CREATE UNIQUE INDEX "country_short_name_key" ON "country"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "country_name_deleted_deleted_at_key" ON "country"("name", "deleted", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "state_code_key" ON "state"("code");

-- CreateIndex
CREATE UNIQUE INDEX "state_name_deleted_deleted_at_key" ON "state"("name", "deleted", "deleted_at");

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_profile" ADD CONSTRAINT "organization_profile_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_profile" ADD CONSTRAINT "organization_profile_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "state"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "organization_industry_id_fkey" FOREIGN KEY ("industry_id") REFERENCES "industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "organization_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "theme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity" ADD CONSTRAINT "entity_industry_id_fkey" FOREIGN KEY ("industry_id") REFERENCES "industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity" ADD CONSTRAINT "entity_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_vertical" ADD CONSTRAINT "business_vertical_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_vertical" ADD CONSTRAINT "business_vertical_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zone" ADD CONSTRAINT "zone_business_vertical_id_fkey" FOREIGN KEY ("business_vertical_id") REFERENCES "business_vertical"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zone" ADD CONSTRAINT "zone_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zone" ADD CONSTRAINT "zone_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_unit" ADD CONSTRAINT "business_unit_business_vertical_id_fkey" FOREIGN KEY ("business_vertical_id") REFERENCES "business_vertical"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_unit" ADD CONSTRAINT "business_unit_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_unit" ADD CONSTRAINT "business_unit_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_unit" ADD CONSTRAINT "business_unit_unit_type_id_fkey" FOREIGN KEY ("unit_type_id") REFERENCES "unit_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_unit" ADD CONSTRAINT "business_unit_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_function_mapping" ADD CONSTRAINT "unit_function_mapping_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "business_unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_function_mapping" ADD CONSTRAINT "unit_function_mapping_function_department_id_fkey" FOREIGN KEY ("function_department_id") REFERENCES "function_department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_function_mapping" ADD CONSTRAINT "unit_function_mapping_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "business_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_designation_id_fkey" FOREIGN KEY ("designation_id") REFERENCES "designation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_function_department_id_fkey" FOREIGN KEY ("function_department_id") REFERENCES "function_department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_mapping" ADD CONSTRAINT "activity_mapping_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "business_unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_mapping" ADD CONSTRAINT "activity_mapping_crs_activity_id_fkey" FOREIGN KEY ("crs_activity_id") REFERENCES "crs_activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_mapping" ADD CONSTRAINT "activity_mapping_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_mapping" ADD CONSTRAINT "activity_mapping_executor_id_fkey" FOREIGN KEY ("executor_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_mapping" ADD CONSTRAINT "activity_mapping_function_head_id_fkey" FOREIGN KEY ("function_head_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_mapping" ADD CONSTRAINT "activity_mapping_function_id_fkey" FOREIGN KEY ("function_id") REFERENCES "function_department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_configuration" ADD CONSTRAINT "activity_configuration_activity_mapping_id_fkey" FOREIGN KEY ("activity_mapping_id") REFERENCES "activity_mapping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_history" ADD CONSTRAINT "activity_history_activity_configuration_id_fkey" FOREIGN KEY ("activity_configuration_id") REFERENCES "activity_configuration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_history" ADD CONSTRAINT "activity_history_activity_mapping_id_fkey" FOREIGN KEY ("activity_mapping_id") REFERENCES "activity_mapping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_history" ADD CONSTRAINT "activity_history_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_otp" ADD CONSTRAINT "user_otp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "state" ADD CONSTRAINT "state_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_log" ADD CONSTRAINT "role_action_log" FOREIGN KEY ("record_id") REFERENCES "role"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "action_log" ADD CONSTRAINT "user_action_log" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE SET NULL;

