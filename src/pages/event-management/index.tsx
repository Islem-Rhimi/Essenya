"use client";

import { MainLayout } from "~/layouts";
import { Card } from "~/components/ui/card";
import EventCalendar from "~/components/blocs/event-management/EventCalendar";

export default function EventManagementPage() {
  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        <div className="mx-auto">
          <Card className="mb-6 p-6">
            <h1 className="text-2xl font-bold">Events :</h1>
            <EventCalendar />
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
