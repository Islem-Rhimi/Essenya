import { PaginationContextProvider } from "~/common/components/pagination/context/pagination.context";
import MyOrderTable from "~/components/blocs/my-orders/MyOrderTable";
import { Card } from "~/components/ui/card";
import { MainLayout } from "~/layouts";

const MyOrders = () => {
  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        <div className="mx-auto flex-col space-y-6">
          <Card className="p-6">
            <h1 className="text-3xl font-bold">Mes commandes </h1>
          </Card>
          <PaginationContextProvider ressourcesName="Type">
            <MyOrderTable />
          </PaginationContextProvider>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyOrders;
