"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ArtistChart({ artistData }: { artistData: any }) {

    // loop through artistData and create a new array with the data we need like date, mothly listeners, etc.

    console.log(artistData)


    
    const options = {
        responsive: true,
        scales: {
            yAxis: {
              min: 0,
              max: Math.max(artistData.monthly_listeners),
            },
        },
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: artistData.artist ,
          },
        },
      };
      
      const labels = artistData.date;
      
      const data = {
        labels,
        datasets: [
          {
            label: 'Monthly listeners',
            data: artistData.monthly_listeners,
            borderColor: 'rgb(29,185,84)',
            backgroundColor: 'rgba(29,185,84, 0.5)',
          },
        ],
      };
    return (
        <><div >
            <h2 id="song" className="text-xl font-bold py-8" >All Data we have from {artistData?.artist} </h2>
            <Line height={300} width={300}  options={options} data={data} />
        </div>
        </>
    )
}