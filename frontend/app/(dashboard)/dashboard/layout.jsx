"use client"
import {useEffect,useState} from "react"
import Header from "@/components/layout/header"
import Sidebar from "@/components/layout/sidebar"

import { useRouter } from "next/navigation";




export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user,setUser] = useState(null)

  return (
      <>
        <Header />
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="w-full pt-4">{children}</main>
        </div>
      </>
  )
}
