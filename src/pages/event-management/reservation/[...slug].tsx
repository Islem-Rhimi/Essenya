import { useRouter } from "next/router";
import React from "react";
import { PaginationContextProvider } from "~/common/components/pagination/context/pagination.context";
import { RecivedReservationTable } from "~/components/blocs/event-management/RecivedReservationTable";
import { Card } from "~/components/ui/card";
import { MainLayout } from "~/layouts";

const RecivedReservation = () => {
  const router = useRouter();
  const { slug } = router.query;
  const eventId = Array.isArray(slug) ? slug[0] : slug;
  if (!eventId) {
    return null;
  }
  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        <div className="mx-auto flex-col space-y-6">
          <Card className="p-6">
            <h1 className="text-3xl font-bold">Mes réservations</h1>
          </Card>
          <PaginationContextProvider ressourcesName="Type">
            <RecivedReservationTable eventId={eventId} />
          </PaginationContextProvider>
        </div>
      </div>
    </MainLayout>
  );
};

export default RecivedReservation;
