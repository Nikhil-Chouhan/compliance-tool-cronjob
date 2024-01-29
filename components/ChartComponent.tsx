import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";

const ChartComponent = ({ apiData, loading }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && apiData) {
      const categories = [
        "Jan",
        "Feb",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const seriesData = apiData.chartData.series.map((series) => ({
        name: series.name,
        data: series.data,
        type: "column",
      }));

      const options = {
        chart: {
          type: "column",
        },
        title: {
          text: "Month Wise Statistics",
        },
        credits: {
          enabled: false,
        },
        plotOptions: {
          column: {
            borderRadius: "25%",
          },
        },
        xAxis: {
          title: {
            text: "Months",
          },
          categories: categories,
        },
        yAxis: {
          title: {
            text: "Record Count",
          },
        },
        series: seriesData,
      };

      const chart = Highcharts.chart(chartRef.current, options);

      return () => {
        chart.destroy();
      };
    }
  }, [apiData]);

  return (
    <div className="chart-component">
      {loading ? (
        <div className="loading-indicator">
          <p className="p-o mx-3 mb-0">Loading Graph</p>
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div ref={chartRef} style={{ width: "100%", height: "400px" }}></div>
      )}
    </div>
  );
};

export default ChartComponent;
