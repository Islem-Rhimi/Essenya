import React from "react";
import PublicEventsCalendar from "~/components/blocs/event-management/PublicEventsCalendar";
import { MainLayout } from "~/layouts";

const event = () => {
  return (
    <MainLayout>
      <PublicEventsCalendar />
    </MainLayout>
  );
};

export default event;
