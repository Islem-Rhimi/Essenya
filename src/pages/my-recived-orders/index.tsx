import { PaginationContextProvider } from "~/common/components/pagination/context/pagination.context";
import SellerOrderTable from "~/components/blocs/my-recived-orders/SellerOrderTable";
import { Card } from "~/components/ui/card";
import { MainLayout } from "~/layouts";

const MyRecivedOrders = () => {
  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        <div className="mx-auto flex-col space-y-6">
          <Card className="p-6">
            <h1 className="text-3xl font-bold">Mes commandes </h1>
          </Card>
          <PaginationContextProvider ressourcesName="Type">
            <SellerOrderTable />
          </PaginationContextProvider>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyRecivedOrders;
