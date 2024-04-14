'use client'
import { Avatar } from "@/components/ui/avatar"
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
import { useEffect, useRef,useState } from 'react';

export default function Component() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');


  return (
    <div className="flex flex-col h-screen pb-4">
      <header className="flex items-center p-4 border-b">
        <div className="flex items-center space-x-4">
          <Avatar className="w-10 h-10">
            <img
              alt="Avatar"
              className="rounded-full"
              height="40"
              src="https://img.freepik.com/premium-vector/flat-bot-banner-financial-investment-trade-artificial-intelligence-mobile-stock-trading-concept_123447-1632.jpg"
              style={{
                aspectRatio: "40/40",
                objectFit: "cover",
              }}
              width="40"
            />
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-lg font-bold">DhanSakhi</h1>
            <p className="text-sm leading-none text-gray-500 dark:text-gray-400">Online</p>
          </div>
        </div>
        <Button className="ml-auto" size="icon">
          <SettingsIcon className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </header>
      <main className="flex-1 flex flex-col justify-end p-4">
  <div className="grid gap-4">
    {messages.map((message, index) => (
      <div key={index} className="flex flex-col items-start space-y-1">
        <div
          className={`flex items-center space-x-2 max-w-md rounded-lg ${
            message.sender === 'user' ? 'bg-gray-100 dark:bg-gray-800' : 'bg-blue-100 dark:bg-blue-800'
          } p-4`}
        >
          <p className="text-sm">{message.text}</p>
          <div className="text-xs text-gray-500 ml-auto dark:text-gray-400">Just now</div>
        </div>
      </div>
    ))}
  </div>
</main>
      <div className="border-t p-4">
        <form
  onSubmit={async (e) => {
    e.preventDefault();
    if (userInput.trim()) {
      setMessages([...messages, { sender: 'user', text: userInput.trim() }]);
      setUserInput('');

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userInput.trim() }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessages([...messages, { sender: 'bot', text: data.response }]);
        } else {
          setMessages([...messages, { sender: 'bot', text: 'An error occurred while fetching the response.' }]);
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages([...messages, { sender: 'bot', text: 'An error occurred while fetching the response.' }]);
      }
    }
  }}
  className="flex space-x-2"
>
  <Input
    className="flex-1 min-w-0"
    placeholder="Type a message..."
    type="text"
    value={userInput}
    onChange={(e) => setUserInput(e.target.value)}
  />
  <Button type="submit">Send</Button>
</form>
      </div>
    </div>
  )
}

function SettingsIcon(props) {
  return (
    <ScrollArea className="h-full">
        <iframe src="http://localhost:8501/" title="Your App" className="w-full h-screen" />
    </ScrollArea>
  )
}
