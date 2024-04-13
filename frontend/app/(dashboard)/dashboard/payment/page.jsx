'use client'
import React, { useEffect, useRef,useState } from 'react';
import Chart from 'chart.js/auto';
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Overview } from "@/components/overview"
import { RecentSales } from "@/components/recent-sales"
import { Button } from "@/components/ui/button"
import LineChart from '@/components/line-chart'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { IndianRupee } from 'lucide-react';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { Scanner } from '@yudiel/react-qr-scanner';

export default function page() {
  const [result, setResult] = useState("No result");
  const [upiUrl, setUpiUrl] = useState(null);
  const [note, setNote] = useState("");
  const { user } = useAuthContext()
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`;
  const [payee, setPayee] = useState({
    upi: false,
    name: false,
    amount: false,
    date: currentDate,
  });

  const handleScan = (result) => {
    if (result) {
      const url = new URL(result.data);
      setPayee({
        ...payee,
        upi: url.searchParams.get("pa"),
        name: url.searchParams.get("pn"),
        amount: false,
      });
      setUpiUrl(url);
      console.log(url.searchParams.get("pa"));
      setResult(JSON.stringify(result));
    }
  };


  const handleError = (error) => {
    console.log(error);
  };

  const handleSubmit = () => {
    let temp = payee.upiUrl;
    temp.searchParams.append("am", amount);
    if (note) {
      temp.searchParams.append("tn", note);
    }

    Router.push(temp.href);
    save();
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="grid gap-4 ">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <h1 className="text-lg font-semibold p-2">Scan the QR code</h1>
              
                  </CardTitle>
                 <IndianRupee  className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                <Scanner
            onResult={(text, result) => console.log(text, result)}
            onError={(error) => console.log(error?.message)}
        />
                </CardContent>
              </Card>
              
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Family Expense History</CardTitle>
                  <p className="text-xs text-muted-foreground">
                   dasd
                  </p>
                </CardHeader>
                <CardContent className="pl-2">
                 {/* <LineChart data={stocks[0].data} /> */}
                </CardContent>
              </Card>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Transaction</CardTitle>
                  <CardDescription>
                  Composition of Stocks in each Portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                {/* {activeTab == "overview" ? <canvas ref={pieChartRef}  id="myChart" /> : null} */}
                </CardContent>
              </Card>
            </div>

      </div>
    </ScrollArea>
  )
}
