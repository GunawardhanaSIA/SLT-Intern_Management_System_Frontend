import React from 'react';
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import {
    lineElementClasses,
    markElementClasses,
    LineChart
  } from '@mui/x-charts/LineChart';

const NewInternRegistrationOverview = () => {
  const fullstackData = [10, 15, 12, 18, 20, 25];
  const cloudData = [5, 3, 6, 4, 5, 3];
  const baData = [3, 6, 4, 8, 7, 9];
  const uiuxData = [7, 5, 8, 4, 13, 7];
  const months = ['August', 'September', 'October', 'November', 'December', 'January'];

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <h1 className="text-lg font-semibold text-zinc-600 pt-2 pl-2">New Intern Registration Overview Chart</h1>
      </CardHeader>
      <CardBody className='flex justify-start w-full px-0'>
        <LineChart
          width={690}
          height={400}
          series={[
            { data: fullstackData, label: 'Fullstack', color: '#4DB848' },
            { data: cloudData, label: 'Cloud', color: '#0056A4' },
            { data: baData, label: 'BA', color: '#E83434' },
            { data: uiuxData, label: 'UI/UX', color: '#fed000' },
          ]}
          xAxis={[{ scaleType: 'point', data: months }]} 
          sx={{
            [`& .${lineElementClasses.root}`]: {
              strokeWidth: 2,
            },
            [`& .${markElementClasses.root}`]: {
              scale: '0.3',
              strokeWidth: 2,
            },
          }}
          markerVisibility="none" 
        />
      </CardBody>
    </Card>
  );
};

export default NewInternRegistrationOverview;
