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
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
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
import { useAuthContext } from "@/context/AuthContext";
import { Scanner } from '@yudiel/react-qr-scanner';
import QrReader from "react-web-qr-reader";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import addUser from "@/firebase/firestore/addUser";

import { Timestamp } from 'firebase/firestore';


export default function page() {
  const [result, setResult] = useState("No result");
  const [upiUrl, setUpiUrl] = useState(null);
  const [category, setCategory] = useState("shopping");
  const { user } = useAuthContext()
  const router = useRouter();

  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`;
  const [payee, setPayee] = useState({
    upi: false,
    name: false,
    amount: false,
    date: Timestamp.fromDate(new Date()),
  });
  const [amount, setAmount] = useState(false);


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
      setResult(JSON.stringify(result));
    }
  };

  
  const delay = 500;
  const previewStyle = {
    height: 240,
    width: 320,
  };


  const handleError = (error) => {
    console.log(error);
  };


  const handleSubmit = () => {
    let temp = payee.upiUrl;
    temp.searchParams.append("am", amount);
    window.open(temp.href, '_blank');
    // Router.push(temp.href);
    save();
  };

  function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+S4());
}
  const save = async () => {
    console.log(payee)
    let data = {
      upi: payee.upi,
      to: payee.name,
      amount: payee.amount,
      phone:user.phone,
      category:payee.category,
      timestamp:payee.date
    }
    const { addresult, adderror } = await addUser(
      "expense",
      guidGenerator(),
      data
    );

      alert('Transaction Succesfull')
      return router.push("/dashboard");

    

  }
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="grid gap-4">
              <Card className="">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <h1 className="text-lg font-semibold p-2">Make Payment</h1>
              
                  </CardTitle>
                 <IndianRupee  className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent className="h-96">
                {payee.upi ? (
            <>
              <div className="grow flex flex-col gap-10 w-full items-center justify-center">
                <img
                  className="w-20 h-20 border rounded-full"
                  src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${payee.name}`}
                />
                <div className="inline-flex flex-col space-y-1 items-center text-center justify-end w-40 h-12">
                  <p className="text-lg font-semibold tracking-wide leading-relaxed text-gray-800">
                    {payee.name}
                  </p>
                  <p className="text-sm font-medium tracking-wide leading-snug text-gray-400">
                    {payee.upi}
                  </p>
                </div>
              </div>

              <Select value={category}
          onValueChange={(value) => {
            setCategory(value);
            
            setPayee({ ...payee, category: value });
          }} >
      <SelectTrigger className="">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Type</SelectLabel>
          <SelectItem value="food">Food</SelectItem>
          <SelectItem value="grocery">Grocery</SelectItem>
          <SelectItem value="travel">Travel</SelectItem>
          <SelectItem value="friend">Friend</SelectItem>
          <SelectItem value="shopping">Shopping</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
              <Input
              type="number"
                className="my-8"
                // defaultValue={null}
                placeholder="100"

                onChange={(e) => {
                  let value = e.target.value
                  setAmount(value);
                  upiUrl.searchParams.append("am", value);
                  setPayee({
                    ...payee,
                    amount: value,
                    upiUrl: upiUrl,
                    category: category,
                  });
                }}
                value={amount}
              />


<Button className="w-full" type="submit" disabled={!payee.amount}
          onClick={handleSubmit}>
              Pay {payee.amount && `₹${payee.amount}`}
            </Button>
            </>
          ) : (
            <>
              <h1 className="text-lg font-semibold p-2">Scan the QR code</h1>
              <QrReader
                delay={delay}
                style={previewStyle}
                onError={handleError}
                onScan={handleScan}
                className="h-64 mx-auto"
              />
            </>
          )}
                </CardContent>
              </Card>
              
            </div>
      </div>
    </ScrollArea>
  )
}
