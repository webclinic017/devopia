import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Component() {
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
          <div className="flex flex-col items-end space-y-1">
            <div className="flex items-center space-x-2 max-w-md rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
              <p className="text-sm">Hi there! How can I assist you today?</p>
              <div className="text-xs text-gray-500 ml-auto dark:text-gray-400">2 minutes ago</div>
            </div>
          </div>
          <div className="flex flex-col items-start space-y-1">
            <div className="flex items-center space-x-2 max-w-md rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
              <p className="text-sm">I'm having trouble with my internet connection.</p>
              <div className="text-xs text-gray-500 ml-auto dark:text-gray-400">Just now</div>
            </div>
          </div>
        </div>
      </main>
      <div className="border-t p-4">
        <form className="flex space-x-2">
          <Input className="flex-1 min-w-0" placeholder="Type a message..." type="text" />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  )
}

function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

