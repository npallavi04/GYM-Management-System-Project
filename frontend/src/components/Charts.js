// import { Bar } from "react-chartjs-2";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";

// ChartJS.register(BarElement, CategoryScale, LinearScale);

// function Charts(){
//   const [chartData,setChartData]=useState({});

//   useEffect(()=>{
//     axios.get("http://127.0.0.1:8000/chart-data")
//       .then(res=>{
//         setChartData({
//           labels: res.data.labels,
//           datasets: [{
//             label: "Daily Revenue",
//             data: res.data.values
//           }]
//         });
//       });
//   },[]);

//   return(
//     <>
//       <h2>Payment Chart</h2>
//       {chartData.labels && <Bar data={chartData}/>}
//     </>
//   )
// }
// export default Charts;


import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";
import API from "../axiosConfig";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

function Charts() {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    API.get("/chart-data").then((res) => {
      setChartData({
        labels: res.data.labels,
        datasets: [
          {
            label: "Monthly Revenue",
            data: res.data.values,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      });
    });
  }, []);

  return (
    <div className="chart-section">
      <h4>Payment Chart</h4>
      {chartData.labels && <Bar data={chartData} />}
    </div>
  );
}

export default Charts;
