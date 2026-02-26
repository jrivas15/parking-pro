import { Card } from "@/components/ui/card";
import InfoCard from "./components/InfoCard";
import PageLayout from "@/layouts/PageLayout";

const HomePage = () => {
  return (
    <PageLayout>
      <div className="flex gap-2 justify-between">
        <InfoCard
          title="Ocupacion actual"
          value="75"
          additionalInfo="300 de 400 espacios"
          trendValue={"5%"}
        />
        <InfoCard
          title="Ocupacion actual"
          value="75"
          additionalInfo="300 de 400 espacios"
          trendValue={"5%"}
        />
        <InfoCard
          title="Ocupacion actual"
          value="75"
          additionalInfo="300 de 400 espacios"
          trendValue={"5%"}
        />
        <InfoCard
          title="Ocupacion actual"
          value="75"
          additionalInfo="300 de 400 espacios"
          trendValue={"5%"}
        />
      </div>
      <div className="grid grid-cols-[2fr_1fr] gap-2">
        <div className="bg-amber-300 h-full"></div>
        <Card>sdasd</Card>
      </div>
      <div className="h-full w-full bg-amber-800">ingresos recientes</div>
    </PageLayout>
  );
};

export default HomePage;
