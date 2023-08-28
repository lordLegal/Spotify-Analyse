"use client";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export default function Chart({ large_toptracks_features }: { large_toptracks_features: any }) {
    "use client";


    const keys = ((o) => Object.keys(o))(large_toptracks_features);
    const values = ((o) => Object.values(o))(large_toptracks_features);
    const data = {
        labels: keys,
        datasets: [
            {
                label: 'Audio Analysis',
                data: values,
                backgroundColor: 'rgba(42, 166, 35, 0.8)',
                borderColor: 'rgba(57, 141, 28, 0.94)',
                borderWidth: 1,
            },
        ],
    };
    return (
        <><div className=' '>
            <h2 id="song" className="text-4xl font-bold py-8" >Audio Analysis</h2>
            <Radar className='w-2/3 h-2/3' data={data} />
        </div>
        </>
    )
}