import React, { useEffect, useState } from 'react';
import Layout from './layout';
import ChartComponent from './ChartComponent';


const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [filter, setFilter] = useState('daily');
  const [siteViews, setSiteViews] = useState(0);

  useEffect(() => {
    fetchData(filter);
    fetchSiteViews(filter);
  }, [filter]);

  const fetchData = async (filter) => {
    try {
      const response = await fetch(`/api/user-visits?filter=${filter}`);
      const data = await response.json();
      console.log(`Number of visits (${filter}):`, data.length); // Log the number of visits

      setChartData(data.map(item => item.value));
      setLabels(data.map(item => item.date));
    } catch (error) {
      console.error('Error fetching user visit data:', error);
    }
  };

  const fetchSiteViews = async (filter) => {
    try {
      const response = await fetch(`/api/get-visit-count?filter=${filter}`);
      const data = await response.json();
      setSiteViews(data.visitCount);
    } catch (error) {
      console.error('Error fetching site visit count:', error);
    }
  };

  const handleFilterChange = (filter) => {
    setFilter(filter);
    fetchData(filter);
    fetchSiteViews(filter);
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Hi, User</h1>
      <div className="mt-4">
        <select
          onChange={(e) => handleFilterChange(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div className="mt-8">
        <ChartComponent data={chartData} labels={labels} />
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Total {filter.charAt(0).toUpperCase() + filter.slice(1)} Site Views: {siteViews}</h2>
      </div>
    
    </Layout>
  );
};

export default Dashboard;
