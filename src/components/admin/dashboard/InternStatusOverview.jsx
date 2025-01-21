import React from 'react'
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { PieChart } from '@mui/x-charts/PieChart';

const InternStatusOverview = () => {
  return (
    <Card className='h-[400px]'>
        <CardHeader>
            <h1 className='text-lg font-semibold text-zinc-600 pt-2 pl-2'>Intern Status Overview Chart</h1>
        </CardHeader>
        <CardBody>
            <PieChart
            series={[
                {
                data: [
                    { id: 0, value: 58, label: 'Active', color: '#4DB848' },
                    { id: 1, value: 55, label: 'Completed', color: '#0056A4' },
                    { id: 2, value: 5, label: 'Terminated', color: '#E83434' },
                    { id: 3, value: 18, label: 'Dropout', color: '#fed000' },
                ],
                },
            ]}
            width={420}
            height={210} 
            />
        </CardBody>
    </Card>
  )
}

export default InternStatusOverview