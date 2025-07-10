import { Users, Package, TrendingUp, Calendar } from "lucide-react";

export default function FarmerDashboard() {
  const metrics = [
    {
      title: "Active Farmers",
      value: "2,847",
      change: "+12.5%",
      icon: Users,
      iconBg: "bg-blue-100 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Products Listed",
      value: "15,293",
      change: "+8.2%",
      icon: Package,
      iconBg: "bg-green-100 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Monthly Sales",
      value: "487K ,Dinar",
      change: "+23.1%",
      icon: TrendingUp,
      iconBg: "bg-purple-100 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Events This Month",
      value: "42",
      change: "+5.7%",
      icon: Calendar,
      iconBg: "bg-orange-100 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="mx-auto grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-card rounded-lg border p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-muted-foreground mb-1 text-sm font-medium">
                {metric.title}
              </p>
              <p className="text-foreground text-3xl font-bold">
                {metric.value}
              </p>
            </div>
            <div className={`rounded-lg p-3 ${metric.iconBg}`}>
              <metric.icon className={`h-6 w-6 ${metric.iconColor}`} />
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              {metric.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
