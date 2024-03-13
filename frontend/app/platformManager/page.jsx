import { useState, useEffect } from "react";
import PieChart from "./Microservice";
import LineChart from "./activeMembersInTeam";
import DashboardCard from "./Storage";
import ChartComponent from "./activeUsers";


const UserStats = () => {
    const [isMonthly, setIsMonthly] = useState(true);

    const [screenTimeData, setScreenTimeData] = useState(null);

    const [weeklyActiveUsers, setWeeklyActiveUsers] = useState(0);
    const [monthlyActiveUsers, setMonthlyActiveUsers] = useState(0);

    const toggleGraphType = () => {
        setIsMonthly(prevState => !prevState);
    };

    useEffect(() => {
        async function fetchScreenTimeData() {
            try {
                const response = await fetch(`/userinfo/:userId`); // Replace ':userId' with the actual user ID
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                setScreenTimeData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        fetchScreenTimeData();
    }, []);


    useEffect(() => {
        fetch('/active-users')
            .then(response => response.json())
            .then(data => {
                setWeeklyActiveUsers(data.weekly.activeUserCount);
                setMonthlyActiveUsers(data.monthly.activeUserCount);
            })
            .catch(error => console.error('Error fetching active users:', error));
    }, []);



    return(
        <div className="h-screen">
            <div className="ml-48">
                <p className='pt-12 pl-10 pb-8 font-medium text-3xl'>User Statistics</p>           
                <div className="flex ">
                <div className="w-2/3 h-96 border-gray-200 border-2 bg-kindagrey rounded-md drop-shadow-md  ml-10">
                    <p className='pb-4 pl-4 pt-4 font-medium text-xl'>Active Platform Users 
                    <button type="button" class="text-black hover:text-white border border-gray-800  focus:outline-none  font-medium rounded-lg text-sm text-center ml-56  dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 w-36 h-10" onClick={toggleGraphType}>
                        {isMonthly ? "Show Weekly" : "Show Monthly"}</button> </p>           
                    <div className="flex pl-4 ">
                    <div className="w-8/12 pt-5">
                        <ChartComponent isMonthly={isMonthly} />
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

                <div className="w-72 mb-7 h-44 pl-4 bg-white rounded-md border-2 border-gray-200 drop-shadow-md">
                <p className=' pb-4 pt-4 font-medium text-xl'>Screen time</p>
                <div className="grid grid-cols-3 bg-gray-100 rounded w-64 h-20 text-center ">
                    <div className="block p-4"><p className="font-bold">{screenTimeData ? screenTimeData.timeSpent : '-'}</p><p>min</p></div>
                    <div className="block p-4 border-x-2 border-gray-200"><p className="font-bold">{screenTimeData ? screenTimeData.timeSpent : '-'}</p><p>avg</p></div>
                    <div className="block p-4"><p className="font-bold" >{screenTimeData ? screenTimeData.timeSpent : '-'}</p><p>max</p></div>
                </div>
                </div>

                <div className="w-72 h-44 pl-4 bg-white rounded-md border-2 border-gray-200 drop-shadow-md">
                            <p className=' pb-4 pt-4 font-medium text-xl '>Last 30 days, </p>
                            <div className="grid grid-cols-1 bg-gray-100 h-20 rounded w-64 text-center">
                                <div className="block p-4 border-gray-200">
                                    <p className="font-bold">{screenTimeData ? screenTimeData.monthlyMessageCount : '-'}</p><p>Messages</p></div>

                            </div>
                </div>

                </div>

                </div>
                <div className="flex pl-10 pt-6">
                    <div className="block w-5/12 ">
                    <div className="h-96 bg-white mb-5 border-2 border-gray-200 rounded-md drop-shadow-xl ">
                        <p className='pl-4 pt-4 font-medium text-xl'>Active Members (in a team)</p>
                        <div className="w-full p-10"><LineChart /></div>
                        {/* teamId={teamId} */}
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



