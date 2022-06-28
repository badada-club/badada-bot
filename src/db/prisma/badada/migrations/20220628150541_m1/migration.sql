-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "creator_chat_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cost" INTEGER,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);
