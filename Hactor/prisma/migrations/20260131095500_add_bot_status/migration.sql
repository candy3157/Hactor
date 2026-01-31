-- CreateTable
CREATE TABLE "bot_status" (
    "id" SERIAL NOT NULL,
    "last_userlist_sync_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bot_status_pkey" PRIMARY KEY ("id")
);
