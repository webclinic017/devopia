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
import ExpensePie  from "@/components/expensePie"
import ExpenseCatBarChart  from "@/components/expenseCatBarChart"
import ExpensePieCont  from "@/components/expensePieCont"

import { collection, query, where,getFirestore,getDocs } from "firebase/firestore";
import firebase_app from '@/firebase/config';



export default  function  page() {
  const { user } = useAuthContext()
  const [date,setDate] = useState(null)
  const [members,setMembers] = useState({})
  const [expenses,setExpenses] = useState([])

  const db = getFirestore(firebase_app)


  useEffect(() => {
    if (user == null) router.push("/signin")

    console.log(user)
    const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

// This arrangement can be altered based on how we want the date's format to appear.
let currentDate = `${day}/${month}/${year}`;
setDate(currentDate)
getAllMembers()

}, [user])


const getAllMembers = async () => {
  const usersRef = collection(db, "users");
  const expenseRef = collection(db, "expense");

  const q = query(usersRef, where("familyId", "==", user.familyId));
  console.log(q);

  const querySnapshot = await getDocs(q);
querySnapshot.forEach(async (doc) => {
console.log(doc.id, " => ", doc.data());
setMembers((prev)=> ({...prev, [doc.id]:doc.data()}))
let qe = query(expenseRef, where("phone", "==", doc.data().phone ));


const querySnapshotE = await getDocs(qe);
  querySnapshotE.forEach((doc) => {
  console.log(doc.id, "=>", doc.data());
  setExpenses((prev)=> ([...prev, doc.data()]))
    })

})

}








  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {user.familyName} {console.log(expenses)}
          </h2>
          <div className="hidden md:flex items-center space-x-2">
            date
          </div>
        </div>
       

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Income Contribution
                  </CardTitle>
                 <IndianRupee  className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$5</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Expense Categories
                  </CardTitle>
                  <IndianRupee  className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                  {expenses && <ExpenseCatBarChart data={expenses}/>}
                </CardContent>
              </Card>
              <Card>  
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expense Contribution</CardTitle>
                  <IndianRupee  className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                  {/* <div className="text-2xl font-bold">$85</div>
                  <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p> */}
                   { expenses&&<ExpensePieCont data={expenses}/>}

                </CardContent>
              </Card>
              {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Now
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 since last hour
                  </p>
                </CardContent>
              </Card> */}
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
