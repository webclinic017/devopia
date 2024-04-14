import { ResponsivePie } from '@nivo/pie';

import { useEffect,useState } from 'react';




const ExpensePieCont = ({data}) => {
  const groupedData = {};

  Object.keys(data).forEach(item => {
    item = data[item]
    const phone = item.phone;
    if (!groupedData[phone]) {
      groupedData[phone] = [];
    }
    groupedData[phone].push(item);
  });
  
  const chartData = Object.entries(groupedData).map(([phone, items]) => ({
    id: phone,
    value: items.reduce((sum, item) => sum + parseFloat(item.amount), 0),
  }));

    return (
        <div className="aspect-square mx-auto w-full my-auto">
  <ResponsivePie
    data={chartData}
    margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
    innerRadius={0.4}
    padAngleRadius={0.6}
    cornerRadius={3}
    activeOuterRadiusOffset={4}
    borderWidth={1}
    borderColor={{
      from: 'color',
      modifiers: [
        [
          'darker',
          0.2
        ]
      ]
    }}
    enableArcLabels={false}
    enableArcLinkLabels={false}
    // arcLinkLabelsSkipAngle={10}
    // arcLinkLabelsTextColor="#333333"
    // arcLinkLabelsThickness={2}
    // arcLinkLabelsColor={{ from: 'color' }}
    // arcLabelsSkipAngle={10}
    // arcLabelsTextColor={{
    //   from: 'color',
    //   modifiers: [
    //     [
    //       'darker',
    //       2
    //     ]
    //   ]
    // }}
    legends={[
      {
        anchor: 'bottom',
        direction: 'row',
        justify: false,
        translateX: 0,
        translateY: 20,
        itemsSpacing: 0,
        itemWidth: 100,
        itemHeight: 24,
        itemTextColor: '#999',
        itemDirection: 'left-to-right',
        itemOpacity: 1,
        symbolSize: 18,
        symbolShape: 'circle',
        effects: [
          {
            on: 'hover',
            style: {
              itemTextColor: '#000'
            }
          }
        ]
      }
    ]}
  /></div>
)}

export default ExpensePieCont;