/**
 * v0 by Vercel.
 * @see https://v0.dev/t/vfHX0ZedN9q
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { ResponsiveLine } from "@nivo/line"
import { ResponsiveBar } from "@nivo/bar"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"

export default function Component() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white p-5">
        <div className="mb-10">
          <FlagIcon className="h-8 w-8 text-blue-500" />
          <h1 className="text-lg font-semibold">Stockwise</h1>
        </div>
        <div className="space-y-4">
          <div className="font-bold text-sm">MAIN MENU</div>
          <ul className="space-y-2">
            <li className="text-blue-500">Dashboard</li>
            <li>Market</li>
            <li>Exchange</li>
            <li>Wallet</li>
            <li>Blog & News</li>
          </ul>
          <div className="font-bold text-sm mt-6">OTHERS</div>
          <ul className="space-y-2">
            <li>Account Setting</li>
            <li>Support</li>
            <li>Help Center</li>
            <li>Community</li>
          </ul>
        </div>
      </aside>
      <main className="flex-1">
        <div className="p-10">
          <header className="flex justify-between items-center">
            <div className="flex space-x-4 items-center">
              <MenuIcon className="text-gray-600" />
              <input
                className="border p-2 rounded-md w-96"
                placeholder="Search for news, symbols, or companies"
                type="text"
              />
            </div>
            <div className="flex items-center space-x-4">
              <SignalIcon className="text-gray-600" />
              <Avatar>
                <AvatarImage alt="Rayford Chenail" src="https://github.com/shadcn.png" />
                <AvatarFallback>RC</AvatarFallback>
              </Avatar>
              <span>Rayford Chenail</span>
            </div>
          </header>
          <section className="grid grid-cols-3 gap-6 mt-6">
            <Card className="col-span-1">
              <div className="p-4">
                <h2 className="text-lg font-semibold">Your Portfolio</h2>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <h3 className="text-3xl font-bold">$18,026.00</h3>
                    <div className="text-sm text-gray-500">All time profit: $8,456.89</div>
                  </div>
                  <SettingsIcon className="text-gray-600" />
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
            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">Portfolio Performance</h2>
                    <CurvedlineChart className="w-full h-[300px]" />
                  </div>
                </Card>
                <Card>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">Dividend</h2>
                    <BarChart className="w-full h-[300px]" />
                  </div>
                </Card>
              </div>
            </div>
          </section>
          <section className="mt-6">
            <h2 className="text-lg font-semibold">Last Transactions</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Bought AMZN</TableCell>
                  <TableCell>Nov 23, 01:00 PM</TableCell>
                  <TableCell>Success</TableCell>
                  <TableCell>$2,567.88</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Deposit</TableCell>
                  <TableCell>Nov 22, 10:34 AM</TableCell>
                  <TableCell>Success</TableCell>
                  <TableCell>$5,874.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>
        </div>
      </main>
    </div>
  )
}

function BarChart(props) {
  return (
    <div {...props}>
      <ResponsiveBar
        data={[
          { name: "Jan", count: 111 },
          { name: "Feb", count: 157 },
          { name: "Mar", count: 129 },
          { name: "Apr", count: 150 },
          { name: "May", count: 119 },
          { name: "Jun", count: 72 },
        ]}
        keys={["count"]}
        indexBy="name"
        margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
        padding={0.3}
        colors={["#2563eb"]}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 4,
          tickPadding: 16,
        }}
        gridYValues={4}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        tooltipLabel={({ id }) => `${id}`}
        enableLabel={false}
        role="application"
        ariaLabel="A bar chart showing data"
      />
    </div>
  )
}


function CurvedlineChart(props) {
  return (
    <div {...props}>
      <ResponsiveLine
        data={[
          {
            id: "Desktop",
            data: [
              { x: "Jan", y: 43 },
              { x: "Feb", y: 137 },
              { x: "Mar", y: 61 },
              { x: "Apr", y: 145 },
              { x: "May", y: 26 },
              { x: "Jun", y: 154 },
            ],
          },
          {
            id: "Mobile",
            data: [
              { x: "Jan", y: 60 },
              { x: "Feb", y: 48 },
              { x: "Mar", y: 177 },
              { x: "Apr", y: 78 },
              { x: "May", y: 96 },
              { x: "Jun", y: 204 },
            ],
          },
        ]}
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        xScale={{
          type: "point",
        }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
        }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16,
        }}
        colors={["#2563eb", "#e11d48"]}
        pointSize={6}
        useMesh={true}
        gridYValues={6}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
      />
    </div>
  )
}


function FlagIcon(props) {
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
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  )
}


function MenuIcon(props) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
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


function SignalIcon(props) {
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
      <path d="M2 20h.01" />
      <path d="M7 20v-4" />
      <path d="M12 20v-8" />
      <path d="M17 20V8" />
      <path d="M22 4v16" />
    </svg>
  )
}