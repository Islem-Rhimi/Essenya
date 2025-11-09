"use client";

import DivContent from "~/components/blocs/demande-service/DivContent";
import Tabs from "~/components/blocs/demande-service/tabs";
import { MainLayout } from "~/layouts";

const DemandeService = () => {
  const tabs = [
    {
      title: "Product",
      value: "product",
      content: (
        <div className="bg-background relative h-full w-full overflow-hidden rounded-2xl p-2 font-bold shadow-2xl">
          <p>Product Tab</p>
          <DivContent />
        </div>
      ),
    },
    {
      title: "Services",
      value: "services",
      content: (
        <div className="bg-background relative h-full w-full overflow-hidden rounded-2xl p-2 text-xl font-bold shadow-2xl md:text-4xl">
          <p>Product Tab</p>
          <DivContent />
        </div>
      ),
    },
    {
      title: "Playground",
      value: "playground",
      content: (
        <div className="bg-background relative h-full w-full overflow-hidden rounded-2xl p-2 text-xl font-bold shadow-2xl md:text-4xl">
          <p>Product Tab</p>
          <DivContent />
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="b relative mx-auto flex h-[20rem] w-full max-w-5xl flex-col items-start justify-start gap-2 p-2 [perspective:1000px] md:h-[40rem]">
        <Tabs tabs={tabs} />
      </div>
    </MainLayout>
  );
};

export default DemandeService;
