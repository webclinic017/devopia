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
        <iframe src="http://localhost:8501/" title="Your App" className="w-full h-full" />
    </ScrollArea>
  )
}
