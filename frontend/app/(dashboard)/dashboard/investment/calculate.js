import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Overview } from "@/components/overview"
import { RecentSales } from "@/components/recent-sales"
import { Button } from "@/components/ui/button"
import LineChart from '@/components/line-chart'
import YourPortfolioCard from './calculate';

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

export default function page() {
  const handleDataLoad = (data) => {
    console.log('Portfolio data loaded:', data);
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Family Name
          </h2>
          <div className="hidden md:flex items-center space-x-2">
            date
          </div>
        </div>
        <section className="grid grid-cols-3 gap-6 mt-6">
          <Card className="col-span-1">
            <div className="p-4">
              <h2 className="text-lg font-semibold">Your Portfolio</h2>
              <div className="flex justify-between items-center mt-4">
                <div>
                  <h3 className="text-3xl font-bold">$18,026.00</h3>
                  <div className="text-sm text-gray-500">All time profit: $8,456.89</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-lg">$1,232.00</div>
                  <div className="text-sm text-gray-500">AAPL</div>
                </div>
                <div className="text-center">
                  <div className="text-lg">$965.00</div>
                  <div className="text-sm text-gray-500">PYPL</div>
                </div>
                <div className="text-center">
                  <div className="text-lg">$2,567.99</div>
                  <div className="text-sm text-gray-500">AMZN</div>
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <div className="flex justify-between items-center mt-4">
                <section>
                  <YourPortfolioCard onDataLoad={handleDataLoad} />
                </section>
              </div>
            </div>
          </Card>
        </section>
      </div>
      <input type="file" id="fileInput" />
    </ScrollArea>
  )
}
