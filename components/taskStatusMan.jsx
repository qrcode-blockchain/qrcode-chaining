
import React, {useState, useEffect} from 'react';
import { Package, Calendar, User, Hash, Plus, Edit, CheckCircle, Clock, AlertCircle, Info, ChevronDown, ChevronUp, QrCode } from 'lucide-react';
// import axios from 'axios';
// import BatchDialog from './BatchDialog'
import axios from 'axios';
const TaskStatusMan=()=>{
    const [tasks,setTasks]=useState([]);
    const [loading,setLoading]=useState(false);

    useEffect(()=>{
        const fetchAllTasks=async()=>{
            try {
                 const response=await axios.get('/api/lineManagers/fetch-assigned-task');
                
            if(response.data.success){
                console.log("The task returned is",response.data.tasks);
                
                setTasks(response.data.tasks);
            }else{
                // toast({
                //   title:"Failed to fetch tasks",
                //   description: response.data.message || "An error occurred",
                // variant: 'destructive',
                // duration: 5000,
                // })
              }
            } catch (error) {
                console.error("Error:", error);
                // toast({
                //   title: "Failed to load tasks",
                //   description: error.response?.data?.message || "An error occurred while fetching line tasks",
                //   variant: 'destructive',
                //   duration: 5000,
                // });
            }finally{
                setLoading(false);
            }
        }
        fetchAllTasks();  
    },[])

    const getStatusIcon = (status) => {
        switch(status?.toLowerCase()) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'in progress':
            case 'ongoing':
                return <Clock className="w-4 h-4 text-blue-500" />;
            case 'pending':
                return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            default:
                return <Info className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusBadge = (status) => {
        const baseClasses = "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium";
        switch(status?.toLowerCase()) {
            case 'completed':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'in-progress':
            case 'ongoing':
                return `${baseClasses} bg-blue-100 text-blue-800`;
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
                case 'not started':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const getProgressPercentage = (completed, total) => {
        if (!total || total === 0) return 0;
        return Math.round((completed / total) * 100);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600">Loading tasks...</p>
                </div>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No tasks found</p>
                    <p className="text-gray-500 text-sm">Tasks will appear here once assigned</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
           
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Package className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Assigned Tasks</h1>
                </div>
                <p className="text-gray-600">Monitor and track your assigned production tasks</p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                        <Hash className="w-4 h-4" />
                        {tasks.length} Total Tasks
                    </span>
                </div>
            </div>

            {/* Tasks Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    <div className="flex items-center gap-2">
                                        <Hash className="w-4 h-4" />
                                        S No
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Date Assigned
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4" />
                                        Product
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Line Manager
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Total units
                                </th><th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Completed Units
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Progress
                                </th>
                                {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Serial Range
                                </th> */}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tasks.map((task, index) => {
                                const progressPercentage = getProgressPercentage(task.completedUnits, task.TotalNoOfUnits);
                                
                                return (
                                    <tr key={task._id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {new Date(task.assignedAt).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(task.assignedAt).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={getStatusBadge(task.status)}>
                                                {getStatusIcon(task.status)}
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {task.productName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <User className="w-4 h-4 text-purple-600" />
                                                </div>
                                                <span className="text-sm text-gray-900 font-medium">
                                                    {task.lineManagerName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {task.TotalNoOfUnits}
                                            </div>
                                        </td><td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {task.completedUnits}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-600">
                                                        {task.completedUnits} / {task.TotalNoOfUnits}
                                                    </span>
                                                    <span className="font-semibold text-blue-600">
                                                        {progressPercentage}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${progressPercentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <QrCode className="w-3 h-3 text-gray-400" />
                                                    <span className="text-gray-600">Start:</span>
                                                    <span className="font-mono font-medium text-gray-900">
                                                        {task.StartSerialNo || 1}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <QrCode className="w-3 h-3 text-gray-400" />
                                                    <span className="text-gray-600">End:</span>
                                                    <span className="font-mono font-medium text-gray-900">
                                                        {task.endSerialNo || ' '}
                                                    </span>
                                                </div>
                                            </div>
                                        </td> */}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TaskStatusMan;