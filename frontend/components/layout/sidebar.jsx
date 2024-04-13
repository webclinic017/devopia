'use client'
import * as React from "react"
import { Minus, Plus } from "lucide-react"

import { DashboardNav } from "@/components/dashboard-nav"
import { navItems } from "@/constants/data"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LogIn } from 'lucide-react';

import { Button } from "../ui/button"
import Link from "next/link"



export default function Sidebar({wallet}) {


    const [goal, setGoal] = React.useState(wallet)
  
    function onClick(adjustment) {
      setGoal(Math.max(200, Math.min(10000, goal + adjustment)))
    }


  return (
    <nav
      className={cn(`relative hidden h-screen border-r pt-4 lg:block w-72`)}
    >
      <div className="space-y-4 py-4 h-full">
        <div className="px-3 py-2 flex flex-col justify-between h-full">
          <div className="space-y-1 flex h-full flex-col">
            <h2 className="pb-10 px-4 text-xl font-semibold tracking-tight">
              SOCHNA HAI
            </h2> 
            <DashboardNav items={navItems} />
            <div className="h-full flex flex-col justify-end">
            <Link
              href='/logout'
            >
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transparent"
                )}
              >
                <LogIn className="mr-2 h-4 w-4"  />
                <span>Logout</span>
              </span>
            </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
