"use client";
import { useState, useEffect } from "react";
import PieChart from "./Microservice";
import LineChart from "./activeMembersInTeam";
import DashboardCard from "./Storage";
import ChartComponent from "./activeUsers";
import axios from "axios";


const UserStats = () => {


    const [screenTimeData, setScreenTimeData] = useState(null);

    const [weeklyActiveUsers, setWeeklyActiveUsers] = useState(0);
    const [monthlyActiveUsers, setMonthlyActiveUsers] = useState(0);


 
    const [averageTimeSpentHrs, setAverageTimeSpentHrs] = useState(0); // State for average time spent in hours
    const [maxTimeSpentHrs, setMaxTimeSpentHrs] = useState(0); // State for max time spent in hours
    const [minTimeSpentHrs, setMinTimeSpentHrs] = useState(0); // State for min time spent in hours
 
    useEffect(() => {
        const fetchScreenTimeData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/stats/userinfo');
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                setScreenTimeData(data);
                console.log(data);
 
                // Calculate average, max, and min time spent from the fetched data
                const totalUsers = data.length;
                const totalTimeSpent = data.reduce((acc, user) => acc + user.timeSpent, 0);
                const averageInSeconds = totalUsers > 0 ? totalTimeSpent / totalUsers : 0;
                setAverageTimeSpentHrs(averageInSeconds / 3600); // Convert average from seconds to hours
 
                const sortedTimes = data.map(user => user.timeSpent).sort((a, b) => a - b);
                const minTimeInSeconds = sortedTimes[0];
                const maxTimeInSeconds = sortedTimes[sortedTimes.length - 1];
                setMinTimeSpentHrs(minTimeInSeconds / 3600); // Convert min time spent from seconds to hours
                setMaxTimeSpentHrs(maxTimeInSeconds / 3600); // Convert max time spent from seconds to hours
            } catch (error) {
                console.error('Error fetching user data:', error);
                setScreenTimeData(null);
                setAverageTimeSpentHrs(0);
                setMinTimeSpentHrs(0);
                setMaxTimeSpentHrs(0);
            }
        };
 
        fetchScreenTimeData();
    }, []);



    useEffect(() => {
        fetch('http://localhost:8080/api/stats/active-users')
            .then(response => response.json())
            .then(data => {
                setWeeklyActiveUsers(data.weekly.activeUserCount);
                setMonthlyActiveUsers(data.monthly.activeUserCount);
                console.log(data)
            })
            .catch(error => console.error('Error fetching active users:', error));
    }, []);



    return(
        <div className="h-screen">
            <div className="ml-48">
                <p className='pt-12 pl-10 pb-8 font-medium text-3xl'>User Statistics</p>           
                <div className="flex ">
                <div className="w-2/3 h-96 border-gray-200 border-2 bg-white rounded-md drop-shadow-md  ml-10">
                    <p className='pb-4 pl-4 pt-4 font-medium text-xl'>Active Platform Users </p>           
                    <div className="flex pl-4 ">
                    <div className="w-8/12 pt-5">
                        <ChartComponent />
                        </div>
                        <div className="block pl-3 pt-2">
                            <div className="w-64 h-32 mb-4 bg-white rounded-md border-2 border-gray-200">
                                <div className="block pl-8 pt-5">
                                    <div className="flex">
                                        <p className="font-bold text-5xl">{weeklyActiveUsers}</p>
                                        <p className="font-medium text-xl pt-5 pl-1.5">Users</p>
                                    </div>
                                    <p className="text-start pl-1.5 pt-1.5">per week</p>
                                </div>
                            </div>
                            <div className="w-64 h-32 bg-white rounded-md border-2 border-gray-200">
                                <div className="block pl-8 pt-5">
                                    <div className="flex">
                                        <p className="font-bold text-5xl">{monthlyActiveUsers}</p>
                                        <p className="font-medium text-xl pt-5 pl-1.5">Users</p>
                                    </div>
                                    <p className="text-start pl-1.5 pt-1.5">per month</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="block pl-8  ">

                <div className="w-80 mb-7 h-44 pl-4 bg-white rounded-md border-2 border-gray-200 drop-shadow-md">
                <p className=' pb-4 pt-4 font-medium text-xl'>Screen Time</p>
                <div className="grid grid-cols-3 bg-gray-100 rounded w-72 h-24 text-center ">
                    <div className="block py-6"><p className="font-bold">{Math.floor(minTimeSpentHrs) + "hrs"}</p><p>min</p></div>
                    <div className="block py-6  border-x-2 border-gray-200"><p className="font-bold">{Math.floor(averageTimeSpentHrs) + "hrs" }</p><p>avg</p></div>
                    <div className="block py-6"><p className="font-bold" >{Math.floor(maxTimeSpentHrs) + "hrs"}</p><p>max</p></div>
                </div>
                </div>

                <div className="w-80 h-44 pl-4 bg-white rounded-md border-2 border-gray-200 drop-shadow-md">
                            <p className=' pb-4 pt-4 font-medium text-xl '>Last 30 days, </p>
                            <div className="grid grid-cols-1 bg-gray-100 h-24 rounded w-72 text-center">
                                <div className="block p-4 border-gray-200">
                                    <p className="font-bold">{screenTimeData ? screenTimeData.reduce((acc, user) => acc + (user.monthlyMessageCount || 0), 0) : '-' }</p><p>Messages</p></div>

                            </div>
                </div>

                </div>

                </div>
                <div className="flex pl-10 pt-6">
                    <div className="block w-5/12 ">
                    <div className="h-96 bg-white mb-5 border-2 border-gray-200 rounded-md drop-shadow-xl ">
                        <p className='pl-4 pt-4 font-medium text-xl'>Active Members (in a team)</p>
                        <div className="w-full pt-2"><LineChart /></div>

                    </div>

                    <div className="h-96 bg-white mb-5 border-2 border-gray-200 rounded-md drop-shadow-xl ">
                        <p className='pl-4 pt-4 font-medium text-xl'>Storage</p>
                        <div className="w-full pt-5 px-10 pb-5"><DashboardCard/></div>
                    </div>                 
                    </div>
                    <div className="w-1/2 h-96 bg-white border-2 border-gray-200 rounded-md drop-shadow-xl ml-6">
                        <p className='pl-4 pt-4 font-medium text-xl'>Microservice Usage</p>
                        
                        <div className="w-full p-3"><PieChart/></div>
                    </div>
                </div>

              
            </div>
        </div>
    );
};

export default UserStats;



