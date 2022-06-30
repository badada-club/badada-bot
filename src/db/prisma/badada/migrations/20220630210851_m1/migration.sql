-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cost" INTEGER,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telegram_event" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "creator_chat_id" INTEGER NOT NULL,

    CONSTRAINT "telegram_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "telegram_event_event_id_key" ON "telegram_event"("event_id");

-- CreateIndex
CREATE INDEX "telegram_event_creator_chat_id_idx" ON "telegram_event"("creator_chat_id");

-- AddForeignKey
ALTER TABLE "telegram_event" ADD CONSTRAINT "telegram_event_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
