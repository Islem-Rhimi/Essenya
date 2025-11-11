import { PaginationContextProvider } from "~/common/components/pagination/context/pagination.context";
import ReservationTable from "~/components/blocs/my-reservations/ReservationTable";
import { Card } from "~/components/ui/card";
import { MainLayout } from "~/layouts";

const MyReservations = () => {
  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        <div className="mx-auto flex-col space-y-6">
          <Card className="p-6">
            <h1 className="text-3xl font-bold">Mes réservations</h1>
          </Card>
          <PaginationContextProvider ressourcesName="Type">
            <ReservationTable />
          </PaginationContextProvider>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyReservations;
