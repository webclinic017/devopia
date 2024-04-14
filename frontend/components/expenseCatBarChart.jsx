import { ResponsiveBar } from "@nivo/bar"

const ExpenseCatBarChart = ({ data }) => {  
    console.log(data)

    const groupedData = {};

    data.forEach(item => {
    const category = item.category;
    if (!groupedData[category]) {
        groupedData[category] = [];
    }
    groupedData[category].push(item);
    });

    const chartData = Object.entries(groupedData).map(([category, items]) => ({
    id: category,
    value: items.reduce((sum, item) => sum + parseFloat(item.amount), 0),
    }));

    console.log(chartData);

    return ( <div className="aspect-square mx-auto ">
   <ResponsiveBar
        data={chartData}
        keys={["value"]}
        indexBy="id"
        margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
        padding={0.3}
        colors={["#2563eb"]}
        
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
)}

export default ExpenseCatBarChart;