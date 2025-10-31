import React, { useEffect, useState } from 'react';
import { User2, MessageSquare, TrendingUp } from 'lucide-react';
import { MdGraphicEq } from 'react-icons/md';
import NavSider from './NavSider';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [analyticData, setAnalyticData] = useState({});
  const [accu, setAccu] = useState(0);

  useEffect(() => {
    const Analytics = async () => {
      const response = await fetch('http://127.0.0.1:8080/analytics', { method: 'GET' });
      const data = await response.json();
      console.log('Analytics:', data);
      setAnalyticData(data);

      if (data.accuracy && data.predictions) {
        const avgAccuracy = ((data.accuracy / data.predictions) * 100).toFixed(2);
        setAccu(avgAccuracy);
      } else {
        setAccu(0);
      }
    };

    Analytics();
  }, []);

  // Chart Data (simple accuracy vs predictions)
  const chartData = {
    labels: ['Predictions', 'Accuracy'],
    datasets: [
      {
        label: 'Model Performance',
        data: [analyticData.predictions || 0, accu || 0],
        borderColor: 'black',
        backgroundColor: 'white',
        pointBackgroundColor: 'black',
        pointBorderColor: 'white',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'black',
          font: { size: 14 },
        },
      },
      title: {
        display: true,
        text: 'Accuracy vs Predictions',
        color: 'black',
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        ticks: { color: 'black' },
        grid: { color: 'rgba(0,0,0,0.1)' },
      },
      y: {
        ticks: { color: 'black' },
        grid: { color: 'rgba(0,0,0,0.1)' },
      },
    },
  };

  return (
    <div className="w-full h-screen flex items-center">
      <NavSider />
      <div className="w-[77vw] h-[100vh] bg-slate-100 flex flex-col mx-auto p-5">
        {/* Cards */}
        <div className="w-full justify-evenly flex mt-10">
          <div className="w-[220px]  bg-white p-8 h-[200px] hover:scale-110 transition-all duration-300 flex-col justify-evenly rounded-3xl shadow-xl flex">
            <div className="w-full flex justify-between text-xl font-semibold">
              <User2 size={30} />
              <p>Active Users</p>
            </div>
            <p className="font-bold text-3xl text-black">{analyticData.total_users || 0}+</p>
          </div>

          <div className="w-[220px] bg-white p-8 h-[200px] hover:scale-110 transition-all duration-300 flex-col justify-evenly rounded-3xl shadow-xl flex">
            <div className="w-full flex justify-between text-xl font-semibold">
              <MessageSquare size={30} />
              <p>Messages</p>
            </div>
            <p className="font-bold text-3xl text-black">{analyticData.total_messages || 0}+</p>
          </div>

          <div className="w-[220px] bg-white p-8 h-[200px] hover:scale-110 transition-all duration-300 flex-col justify-evenly rounded-3xl shadow-xl flex">
            <div className="w-full flex justify-between text-xl font-semibold">
              <MdGraphicEq size={30} />
              <p>Predictions</p>
            </div>
            <p className="font-bold text-3xl text-black">{analyticData.predictions || 0}+</p>
          </div>

          <div className="w-[220px] bg-white p-8 h-[200px] hover:scale-110 transition-all duration-300 flex-col justify-evenly rounded-3xl shadow-xl flex">
            <div className="w-full flex justify-between text-xl font-semibold">
              <TrendingUp size={30} />
              <p>Accuracy</p>
            </div>
            <p className="font-bold text-3xl text-black">{accu}%</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mt-12 w-full h-[50vh] bg-white rounded-2xl flex justify-center shadow-md p-6">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
