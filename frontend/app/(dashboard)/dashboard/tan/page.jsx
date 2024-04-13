'use client'
import React, { useEffect, useRef, useState } from 'react';
import NewsComponent from './news';
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

const tips = `Create a monthly budget and stick to it.
Avoid unnecessary expenses by distinguishing between wants and needs.
Track your spending to identify areas where you can save money.
Consider cooking at home instead of eating out to save on food expenses.
Automate your savings by setting up automatic transfers to a savings account.
Shop smart by comparing prices and looking for deals before making purchases`;

export default function page() {

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
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Tips for Budgeting</CardTitle>
              <div className="space-y-2 text-muted-foreground">
                {tips.split('.').map((sentence, index) => (
                  <p key={index}>
                    <span>&#10148;</span> {sentence.trim()}
                  </p>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pl-2">
              {}
            </CardContent>
          </Card>
          <Card className="col-span-4 md:col-span-3">
            <CardHeader>
              <CardTitle>Recent News</CardTitle>
              <CardDescription>
              <div className="grid gap-4 grid-cols-1">
                <NewsComponent />
              </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {}
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  )
}
