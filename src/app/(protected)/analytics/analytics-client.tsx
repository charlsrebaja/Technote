"use client";

import { useState, useMemo } from "react";
import {
  format,
  parseISO,
  isWithinInterval,
  startOfDay,
  endOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay,
} from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar as CalendarIcon,
  Download,
  FileText,
  TrendingUp,
  Users,
  WalletCards,
  Activity,
  Table as TableIcon,
  PieChart as PieChartIcon,
  BarChart3,
  LineChart as LineChartIcon,
  Wrench,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SalesData = {
  id: string;
  date: string;
  type: "SALE";
  amount: number;
  customerName: string;
  description: string;
};
type RepairData = {
  id: string;
  date: string;
  type: "REPAIR";
  amount: number;
  customerName: string;
  description: string;
  status: string;
};
type UtangData = {
  id: string;
  date: string;
  type: "UTANG";
  amount: number;
  paid: number;
  customerName: string;
  description: string;
  status: string;
};

type AnalyticsClientProps = {
  sales: SalesData[];
  repairs: RepairData[];
  utangs: UtangData[];
};

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function AnalyticsClient({
  sales,
  repairs,
  utangs,
}: AnalyticsClientProps) {
  const [dateRange, setDateRange] = useState({
    from: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    to: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });

  const [activeChart, setActiveChart] = useState<"bar" | "line" | "pie">("bar");

  // Combine and sort all data
  const allData = useMemo(() => {
    return [...sales, ...repairs, ...utangs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [sales, repairs, utangs]);

  // Filter data by date range
  const filteredData = useMemo(() => {
    const start = startOfDay(parseISO(dateRange.from || "2000-01-01"));
    const end = endOfDay(parseISO(dateRange.to || "2100-01-01"));

    return allData.filter((item) => {
      const itemDate = new Date(item.date);
      try {
        return isWithinInterval(itemDate, { start, end });
      } catch (e) {
        return false;
      }
    });
  }, [allData, dateRange]);

  // Generate Summary Metrics
  const summary = useMemo(() => {
    const totalRevenue = filteredData.reduce(
      (sum, item) =>
        sum + (item.type === "UTANG" ? (item as UtangData).paid : item.amount),
      0,
    );
    const totalTransactions = filteredData.length;
    const uniqueCustomers = new Set(filteredData.map((d) => d.customerName))
      .size;

    const saleRevenue = filteredData
      .filter((d) => d.type === "SALE")
      .reduce((sum, item) => sum + item.amount, 0);
    const repairRevenue = filteredData
      .filter(
        (d) =>
          d.type === "REPAIR" &&
          ["DONE", "CLAIMED"].includes((d as RepairData).status),
      )
      .reduce((sum, item) => sum + item.amount, 0);
    const utangCollection = filteredData
      .filter((d) => d.type === "UTANG")
      .reduce((sum, item) => sum + (item as UtangData).paid, 0);

    return {
      totalRevenue,
      totalTransactions,
      uniqueCustomers,
      saleRevenue,
      repairRevenue,
      utangCollection,
    };
  }, [filteredData]);

  // Prepare chart data grouping by date
  const chartData = useMemo(() => {
    const grouped = filteredData.reduce(
      (acc, item) => {
        const day = format(new Date(item.date), "MMM dd");
        if (!acc[day])
          acc[day] = { name: day, Sales: 0, Repairs: 0, Utang: 0, Total: 0 };

        const val =
          item.type === "UTANG" ? (item as UtangData).paid : item.amount;

        if (item.type === "SALE") acc[day].Sales += val;
        if (item.type === "REPAIR") acc[day].Repairs += val;
        if (item.type === "UTANG") acc[day].Utang += val;
        acc[day].Total += val;

        return acc;
      },
      {} as Record<string, any>,
    );

    return Object.values(grouped).reverse();
  }, [filteredData]);

  const pieData = useMemo(
    () =>
      [
        { name: "Sales", value: summary.saleRevenue },
        { name: "Repairs", value: summary.repairRevenue },
        { name: "Utang Collection", value: summary.utangCollection },
      ].filter((i) => i.value > 0),
    [summary],
  );

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(val);

  // Quick preset filters
  const setPreset = (preset: "today" | "week" | "month") => {
    const now = new Date();
    if (preset === "today") {
      setDateRange({
        from: format(now, "yyyy-MM-dd"),
        to: format(now, "yyyy-MM-dd"),
      });
    } else if (preset === "week") {
      setDateRange({
        from: format(startOfWeek(now), "yyyy-MM-dd"),
        to: format(endOfWeek(now), "yyyy-MM-dd"),
      });
    } else if (preset === "month") {
      setDateRange({
        from: format(startOfMonth(now), "yyyy-MM-dd"),
        to: format(endOfMonth(now), "yyyy-MM-dd"),
      });
    }
  };

  // Export handlers
  const handleExportCSV = () => {
    const headers = "Date,Type,Customer,Description,Amount,Status\n";
    const rows = filteredData
      .map((item) => {
        const status =
          item.type === "REPAIR"
            ? (item as RepairData).status
            : item.type === "UTANG"
              ? (item as UtangData).status
              : "-";
        const val = item.amount;
        return `"${format(new Date(item.date), "yyyy-MM-dd")}","${item.type}","${item.customerName}","${item.description}",${val},"${status}"`;
      })
      .join("\n");

    const blob = new Blob([headers + rows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `technote_analytics_${dateRange.from}_to_${dateRange.to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    // Apply pdf-export classes to simulate print view for html2canvas
    document.body.classList.add("pdf-export");

    // Select the container holding our content
    const element = document.getElementById("analytics-container");

    if (!element) {
      document.body.classList.remove("pdf-export");
      window.print();
      return;
    }

    try {
      // Dynamically import html2pdf to avoid Next.js SSR issues
      const html2pdf = (await import("html2pdf.js")).default;

      const opt: any = {
        margin: 0.5,
        filename: `technote_report_${format(new Date(), "yyyy-MM-dd")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, windowWidth: 1024 }, // Set fixed width to avoid mobile squishing
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      await html2pdf().from(element).set(opt).save();
    } catch (err) {
      console.error("PDF Export failed:", err);
      // Fallback
      window.print();
    } finally {
      document.body.classList.remove("pdf-export");
    }
  };

  return (
    <div id="analytics-container" className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 hide-on-print">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Analytics & Reports
          </h1>
          <p className="text-sm text-slate-500">
            Track key metrics and export financial records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Filters */}
          <div className="flex bg-slate-100 p-1 rounded-md border text-sm">
            <button
              onClick={() => setPreset("today")}
              className="px-3 py-1.5 rounded-sm hover:bg-white hover:shadow-sm"
            >
              Today
            </button>
            <button
              onClick={() => setPreset("week")}
              className="px-3 py-1.5 rounded-sm hover:bg-white hover:shadow-sm"
            >
              Week
            </button>
            <button
              onClick={() => setPreset("month")}
              className="px-3 py-1.5 rounded-sm hover:bg-white hover:shadow-sm text-blue-600 font-medium bg-white shadow-sm"
            >
              Month
            </button>
          </div>

          {/* Date Picker Range */}
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, from: e.target.value }))
              }
              className="w-[140px]"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, to: e.target.value }))
              }
              className="w-[140px]"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="gap-2"
            >
              <Download className="h-4 w-4" /> CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              className="gap-2"
            >
              <FileText className="h-4 w-4" /> PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 hide-on-print">
        <div className="animate-gemini-border rounded-xl">
          <Card className="m-[1px] border-none shadow-sm rounded-xl bg-white/95 backdrop-blur z-10 relative">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Revenue
              </CardTitle>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {formatCurrency(summary.totalRevenue)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Based on selected period
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="shadow-sm border-emerald-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Transactions
            </CardTitle>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {summary.totalTransactions}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Sales, repairs & utang logs
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Unique Customers
            </CardTitle>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {summary.uniqueCustomers}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Engaged in this period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Card className="shadow-sm border-slate-200 hide-on-print">
        <CardHeader className="border-b bg-slate-50/50 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Revenue Overview</CardTitle>
              <CardDescription>
                Visual breakdown of income streams
              </CardDescription>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-md border text-sm hide-on-print">
              <button
                onClick={() => setActiveChart("bar")}
                className={`p-1.5 rounded-sm ${activeChart === "bar" ? "bg-white shadow-sm text-blue-600" : "text-slate-500"}`}
              >
                <BarChart3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActiveChart("line")}
                className={`p-1.5 rounded-sm ${activeChart === "line" ? "bg-white shadow-sm text-emerald-600" : "text-slate-500"}`}
              >
                <LineChartIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActiveChart("pie")}
                className={`p-1.5 rounded-sm ${activeChart === "pie" ? "bg-white shadow-sm text-purple-600" : "text-slate-500"}`}
              >
                <PieChartIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[350px] w-full">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground flex-col">
                <CalendarIcon className="h-10 w-10 mb-2 opacity-20" />
                <p>No data available for this range</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {activeChart === "bar" ? (
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="name"
                      fontSize={12}
                      tickMargin={10}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      fontSize={12}
                      tickFormatter={(val) => `₱${val}`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(val: any) => formatCurrency(Number(val))}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ fontSize: "12px" }}
                    />
                    <Bar
                      dataKey="Sales"
                      stackId="a"
                      fill="#3b82f6"
                      radius={[0, 0, 4, 4]}
                    />
                    <Bar dataKey="Repairs" stackId="a" fill="#10b981" />
                    <Bar
                      dataKey="Utang"
                      stackId="a"
                      fill="#f59e0b"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : activeChart === "line" ? (
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="name"
                      fontSize={12}
                      tickMargin={10}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      fontSize={12}
                      tickFormatter={(val) => `₱${val}`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(val: any) => formatCurrency(Number(val))}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ fontSize: "12px" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Total"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => formatCurrency(Number(val))}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Legend iconType="circle" />
                  </PieChart>
                )}
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed DataTable */}
      <Card className="shadow-sm border-slate-200 printable-table print:border-none print:shadow-none">
        <div className="hidden print-only flex-col gap-4 mb-8 pt-4 items-center justify-center border-b pb-8">
          <div className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="Technote Logo"
              className="w-12 h-12 object-contain"
            />
            <div>
              <p className="text-xl font-bold tracking-tight text-slate-900">
                Technote Logbook
              </p>
              <p className="text-sm text-muted-foreground">
                Detailed Financial Report
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Reporting Period:</p>
            <p className="text-xs text-slate-500">
              {format(parseISO(dateRange.from), "MMMM dd, yyyy")} —{" "}
              {format(parseISO(dateRange.to), "MMMM dd, yyyy")}
            </p>
          </div>
        </div>

        <CardHeader className="border-b bg-slate-50/50 print:hidden">
          <div className="flex items-center gap-2">
            <TableIcon className="h-5 w-5 text-slate-500" />
            <CardTitle>Detailed Breakdown</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto print:border-0 print:m-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="pl-6">Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right pr-6">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground text-sm"
                  >
                    No transactions found for this period.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="pl-6 text-sm text-slate-500">
                      {format(new Date(item.date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider ${
                          item.type === "SALE"
                            ? "bg-blue-100 text-blue-700"
                            : item.type === "REPAIR"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.type}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {item.customerName}
                    </TableCell>
                    <TableCell className="text-slate-600 line-clamp-1 max-w-[200px]">
                      {item.description}
                    </TableCell>
                    <TableCell className="text-right pr-6 font-medium">
                      {formatCurrency(
                        item.type === "UTANG"
                          ? (item as UtangData).paid
                          : item.amount,
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
