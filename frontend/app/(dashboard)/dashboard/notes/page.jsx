'use client'
import React, { useEffect, useRef, useState } from 'react';
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

export default function page() {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  const handleChange = (event) => {
    setNote(event.target.value);
  };

  const handleAddNote = () => {
    if (note.trim() !== '') {
      const timestamp = new Date().toLocaleString();
      const updatedNotes = [...notes, { text: note, timestamp: timestamp }];
      setNotes(updatedNotes);
      setNote('');
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Family Name
          </h2>
          <div className="hidden md:flex items-center space-x-2">
            Date
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <div>
                <textarea
                  className="w-full h-24 p-2 border rounded-md"
                  placeholder="Add your note..."
                  value={note}
                  onChange={handleChange}
                />
                <Button onClick={handleAddNote} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">Add Note</Button>
              </div>
            </CardHeader>
            <CardContent className="pl-2">
              {notes.map((note, index) => (
                <Card key={index} className="mb-4">
                  <CardContent>
                    <p className="text-sm text-gray-600">{note.text}</p>
                    <p className="text-xs text-gray-400">{note.timestamp}</p>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
