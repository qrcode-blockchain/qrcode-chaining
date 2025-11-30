// import React, {useState} from 'react';
// import { Package, Calendar, User, Hash, Plus, Edit, CheckCircle, Clock, AlertCircle } from 'lucide-react';

// import BatchDialog from '../components/BatchDialog'

// const TaskManagementTable=({
// tasks,
// role,
// onUpdateTask
// }
// )=>{
//   const [selectedTaskId, setSelectedTaskId] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const onCreateAction = async (taskId) => {
//     try {
//       console.log('Creating action for task:', taskId);
//       // Navigate to create form or open modal
//       // router.push(`/create-batch?taskId=${taskId}`);
//       setSelectedTaskId(taskId);
//       setIsDialogOpen(true);
//     } catch (error) {
//       console.error('Error creating action:', error);
//     }
//   };

//   const closeDialog = () => {
//     setIsDialogOpen(false);
//     setSelectedTaskId(null);
//   };
//     const getStatusColor = (status) => {
//         switch (status.toLowerCase()) {
//           case 'pending':
//             return 'bg-yellow-100 text-yellow-800 border-yellow-300';
//           case 'completed':
//             return 'bg-green-100 text-green-800 border-green-300';
//           case 'in-progress':
//             return 'bg-blue-100 text-blue-800 border-blue-300';
//           case 'not started':
//             return 'bg-red-100 text-red-800 border-red-300';
//           default:
//             return 'bg-gray-100 text-gray-800 border-gray-300';
//         }
//       };

//       const getStatusIcon = (status) => {
//         switch (status.toLowerCase()) {
//           case 'pending':
//             return <Clock className="h-3 w-3" />;
//           case 'completed':
//             return <CheckCircle className="h-3 w-3" />;
//           case 'in-progress':
//             return <AlertCircle className="h-3 w-3" />;
//           default:
//             return <Clock className="h-3 w-3" />;
//         }
//       };

//     return(
//       <>
//     <div className="p-6 max-w-full mx-auto">
//     <div className="mb-8">
      

//       {/* <div className="flex gap-2 mb-6">
//         <TabButton value="all" isActive={activeTab === 'all'}>All</TabButton>
//         <TabButton value="pending" isActive={activeTab === 'pending'}>Pending</TabButton>
//         <TabButton value="in-progress" isActive={activeTab === 'in-progress'}>In Progress</TabButton>
//         <TabButton value="completed" isActive={activeTab === 'completed'}>Completed</TabButton>
//       </div> */}

//       {tasks.length === 0 ? (
//         <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
//           <div className="text-gray-500">
//             No tasks assigned yet.
//           </div>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Task ID
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date of Task
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Product Name
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Line Manager Assigned
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Total Quantity
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Remaining Quantity
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Start Serial
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     End Serial
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {tasks.map((task, index) => (
//                   <tr key={task._id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {task._id}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                       <div className="flex items-center">
//                         <Calendar className="mr-2 h-4 w-4 text-gray-400" />
//                         {new Date(task.assignedAt).toLocaleDateString()}
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
//                         {getStatusIcon(task.status)}
//                         {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
//                       <div className="flex items-center">
//                         <Package className="mr-2 h-4 w-4 text-blue-600" />
//                         <div className="font-medium">{task.productName}</div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
//                       <div className="flex items-center">
//                         <User className="mr-2 h-4 w-4 text-gray-400" />
//                         {task.lineManagerId}
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
//                       <div className="flex items-center">
//                         <Hash className="mr-2 h-4 w-4 text-gray-400" />
//                         <span className="font-medium">{task.TotalNoOfUnits?.toLocaleString()}</span>
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm">
//                       <div className="flex items-center">
//                         <Hash className="mr-2 h-4 w-4 text-gray-400" />
//                         <span className={`font-medium ${(task.TotalNoOfUnits-task.completedUnits) > 0 ? 'text-blue-600' : 'text-gray-500'}`}>
//                           {(task.TotalNoOfUnits-task.completedUnits)?.toLocaleString()}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
//                       {task.startSerialNo}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
//                       {task.endSerialNo || ' '}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex items-center gap-2">
                        
//                         {/* {(task.TotalNoOfUnits-task.completedUnits) > 0 && (
//                           <button
//                             onClick={() => onCreateAction(task._id)}
//                             className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-xs font-medium"
//                           >
//                             CREATE
//                           </button>
//                         )}
//                         <button
//                           onClick={() => onUpdateTask(task.id, { 
//                             status: task.status === 'pending' ? 'in-progress' : 
//                                     task.status === 'in-progress' ? 'completed' : 'pending'
//                           })}
//                           className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-xs font-medium flex items-center gap-1"
//                         >
//                           <Edit className="h-3 w-3" />
//                           Update
//                         </button> */}


//                         {(task.TotalNoOfUnits-task.completedUnits) > 0 ? (
//                           <button
//                             onClick={() => onCreateAction(task._id)}
//                             className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-xs font-medium"
//                           >
//                             CREATE
//                           </button>
//                         ):( <button
//                           onClick={() => onUpdateTask(task.id, { 
//                             status: task.status === 'pending' ? 'in-progress' : 
//                                     task.status === 'in-progress' ? 'completed' : 'pending'
//                           })}
//                           className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-xs font-medium flex items-center gap-1"
//                         >
//                           <Edit className="h-3 w-3" />
//                           Update
//                         </button>)}
                       
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
//   <BatchDialog 
//   isOpen={isDialogOpen}
//   onClose={closeDialog}
//    taskId={selectedTaskId}
//    role={role}
//   />
//   </>
// );
// }

// export default TaskManagementTable;





// import React, {useState} from 'react';
// import { Package, Calendar, User, Hash, Plus, Edit, CheckCircle, Clock, AlertCircle, Info, ChevronDown, ChevronUp, QrCode } from 'lucide-react';

// import BatchDialog from '../components/BatchDialog'

// const TaskManagementTable=({
// tasks,
// role,
// onUpdateTask
// }
// )=>{
//   const [selectedTaskId, setSelectedTaskId] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [expandedTasks, setExpandedTasks] = useState(new Set());
//   const [batchData,setBatchData]=useState([]);
 
//   const onCreateAction = async (taskId) => {
//     try {
//       console.log('Creating action for task:', taskId);
//       // Navigate to create form or open modal
//       // router.push(`/create-batch?taskId=${taskId}`);
//       setSelectedTaskId(taskId);
//       setIsDialogOpen(true);
//     } catch (error) {
//       console.error('Error creating action:', error);
//     }
//   };

//   const closeDialog = () => {
//     setIsDialogOpen(false);
//     setSelectedTaskId(null);
//   };

//   const toggleTaskExpansion = (taskId) => {
//     const newExpanded = new Set(expandedTasks);
//     if (newExpanded.has(taskId)) {
//       newExpanded.delete(taskId);
//     } else {
//       newExpanded.add(taskId);
//     }
//     setExpandedTasks(newExpanded);
//   };

//   const onCreateQRCode = (batchData) => {
//     console.log('Creating QR code for batch:', batchData);
//     // Add your QR code creation logic here
//   };

//     const getStatusColor = (status) => {
//         switch (status.toLowerCase()) {
//           case 'pending':
//             return 'bg-yellow-100 text-yellow-800 border-yellow-300';
//           case 'completed':
//             return 'bg-green-100 text-green-800 border-green-300';
//           case 'in-progress':
//             return 'bg-blue-100 text-blue-800 border-blue-300';
//           case 'not started':
//             return 'bg-red-100 text-red-800 border-red-300';
//           default:
//             return 'bg-gray-100 text-gray-800 border-gray-300';
//         }
//       };

//       const getStatusIcon = (status) => {
//         switch (status.toLowerCase()) {
//           case 'pending':
//             return <Clock className="h-3 w-3" />;
//           case 'completed':
//             return <CheckCircle className="h-3 w-3" />;
//           case 'in-progress':
//             return <AlertCircle className="h-3 w-3" />;
//           default:
//             return <Clock className="h-3 w-3" />;
//         }
//       };

     
//       const  getBatchData =async (productId) => {
//         try {
//           const response=await axios.get(`/api/products/batchCreation?taskId=${productId}`,
//             {
//               headers:{
//                 'Content-Type':'application/json'
//               }
//             }
//           );
         
  
//           if(response.data.success){
//             console.log('The response in frontend is',response);
            
//                return response.data.data;
//           }else{
//             toast({
//               success:false,
//               message:'Error while fetching batch details'
//             },
//           {status:400});
//           return [];
//           }
//         } catch (error) {
//           console.error("Error fetching batch data:", error);
//           toast({
//             title: "Error",
//             description: "Server error while fetching batch details",
//             variant: "destructive",
//           });
//           return [];
//         }  
//       };

//     return(
//       <>
//     <div className="p-6 max-w-full mx-auto">
//     <div className="mb-8">
      

//       {/* <div className="flex gap-2 mb-6">
//         <TabButton value="all" isActive={activeTab === 'all'}>All</TabButton>
//         <TabButton value="pending" isActive={activeTab === 'pending'}>Pending</TabButton>
//         <TabButton value="in-progress" isActive={activeTab === 'in-progress'}>In Progress</TabButton>
//         <TabButton value="completed" isActive={activeTab === 'completed'}>Completed</TabButton>
//       </div> */}

//       {tasks.length === 0 ? (
//         <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
//           <div className="text-gray-500">
//             No tasks assigned yet.
//           </div>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     S.No
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date of Task
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Product Name
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Line Manager Assigned
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Total Quantity
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Remaining Quantity
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Start Serial
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     End Serial
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Info
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {tasks.map((task, index) => (
//                   <React.Fragment key={task._id}>
//                     <tr className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {index + 1}
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                         <div className="flex items-center">
//                           <Calendar className="mr-2 h-4 w-4 text-gray-400" />
//                           {new Date(task.assignedAt).toLocaleDateString()}
//                         </div>
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap">
//                         <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
//                           {getStatusIcon(task.status)}
//                           {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
//                         <div className="flex items-center">
//                           <Package className="mr-2 h-4 w-4 text-blue-600" />
//                           <div className="font-medium">{task.productName}</div>
//                         </div>
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
//                         <div className="flex items-center">
//                           <User className="mr-2 h-4 w-4 text-gray-400" />
//                           {task.lineManagerId}
//                         </div>
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
//                         <div className="flex items-center">
//                           <Hash className="mr-2 h-4 w-4 text-gray-400" />
//                           <span className="font-medium">{task.TotalNoOfUnits?.toLocaleString()}</span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm">
//                         <div className="flex items-center">
//                           <Hash className="mr-2 h-4 w-4 text-gray-400" />
//                           <span className={`font-medium ${(task.TotalNoOfUnits-task.completedUnits) > 0 ? 'text-blue-600' : 'text-gray-500'}`}>
//                             {(task.TotalNoOfUnits-task.completedUnits)?.toLocaleString()}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
//                         {task.startSerialNo}
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
//                         {task.endSerialNo || ' '}
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex items-center gap-2">
//                           {(task.TotalNoOfUnits-task.completedUnits) > 0 ? (
//                             <button
//                               onClick={() => onCreateAction(task._id)}
//                               className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-xs font-medium"
//                             >
//                               CREATE
//                             </button>
//                           ):( <button
//                             onClick={() => onUpdateTask(task.id, { 
//                               status: task.status === 'pending' ? 'in-progress' : 
//                                       task.status === 'in-progress' ? 'completed' : 'pending'
//                             })}
//                             className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-xs font-medium flex items-center gap-1"
//                           >
//                             <Edit className="h-3 w-3" />
//                             Update
//                           </button>)}
//                         </div>
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
//                         <button
//                           onClick={() => toggleTaskExpansion(task._id)}
//                           className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
//                         >
//                           <Info className="h-4 w-4" />
//                           {expandedTasks.has(task._id) ? (
//                             <ChevronUp className="h-3 w-3" />
//                           ) : (
//                             <ChevronDown className="h-3 w-3" />
//                           )}
//                         </button>
//                       </td>
//                     </tr>
                    
//                     {/* Expandable Details Section */}
//                     {expandedTasks.has(task._id) && (
//                       <tr>
//                         <td colSpan="11" className="px-4 py-4 bg-gray-50">
//                           <div className="rounded-lg border border-gray-200 bg-white p-4">
//                             <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                               <Package className="h-4 w-4 text-blue-600" />
//                               Task Details - {task.productName}
//                             </h4>
                            
//                             <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                              
//                               <div>
//                                 <span className="font-medium text-gray-600">Completed Units:</span>
//                                 <span className="ml-2 text-gray-800">{task.completedUnits?.toLocaleString() || 0}</span>
//                               </div>
//                             </div>

//                             {task.completedUnits > 0 && (
//                               <div>
//                                 <h5 className="text-sm font-medium text-gray-700 mb-2">Completed Batches</h5>
//                                 <div className="overflow-x-auto">
//                                   <table className="min-w-full border border-gray-200 rounded-md">
//                                     <thead className="bg-gray-100">
//                                       <tr>
//                                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 border-b">
//                                           Batch No
//                                         </th>
//                                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 border-b">
//                                           Start Serial
//                                         </th>
//                                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 border-b">
//                                           End Serial
//                                         </th>
//                                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 border-b">
//                                           Action
//                                         </th>
//                                       </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-gray-200">
//                                       {getBatchData(task.productId).map((batch, batchIndex) => (
//                                         <tr key={batchIndex} className="hover:bg-gray-50">
//                                           <td className="px-3 py-2 text-sm text-gray-800 font-medium">
//                                             {batch.batchNo}
//                                           </td>
//                                           <td className="px-3 py-2 text-sm text-gray-800 font-mono">
//                                             {batch.startSerial}
//                                           </td>
//                                           <td className="px-3 py-2 text-sm text-gray-800 font-mono">
//                                             {batch.endSerial}
//                                           </td>
//                                           <td className="px-3 py-2">
//                                             <button
//                                               onClick={() => onCreateQRCode(batch)}
//                                               className="bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700 transition-colors flex items-center gap-1"
//                                             >
//                                               <QrCode className="h-3 w-3" />
//                                               QR Code
//                                             </button>
//                                           </td>
//                                         </tr>
//                                       ))}
//                                     </tbody>
//                                   </table>
//                                 </div>
//                               </div>
//                             )}
                            
//                             {task.completedUnits === 0 && (
//                               <div className="text-center py-4 text-gray-500 text-sm">
//                                 No completed batches yet
//                               </div>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
//   <BatchDialog 
//   isOpen={isDialogOpen}
//   onClose={closeDialog}
//    taskId={selectedTaskId}
//    role={role}
//   />
//   </>
// );
// }

// export default TaskManagementTable;


import React, {useState, useEffect} from 'react';
import { Package, Calendar, User, Hash, Plus, Edit, CheckCircle, Clock, AlertCircle, Info, ChevronDown, ChevronUp, QrCode } from 'lucide-react';
import axios from 'axios';
import { useToast } from "../hooks/useToast";
import {  Loader2, CheckCircle2 } from "lucide-react";
import BatchDialog from '../components/BatchDialog'
import { create } from 'domain';
// import { log } from 'console';

const TaskManagementTable=({
tasks,
role,
onUpdateTask,
onRefreshTasks
}
)=>{
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [batchData, setBatchData] = useState({});
  const [isLoading,setIsLoading]=useState(false);
  const [loadingBatches, setLoadingBatches] = useState({});
 
const [buttonStatuses,setButtonStatuses]=useState({});
 const { toast } = useToast();
 useEffect(()=>{
   if(!isDialogOpen && selectedTaskId){
    if(onRefreshTasks){
      onRefreshTasks();
    }
    const task=tasks.find(t=>t._id===selectedTaskId);
    if(task && expandedTasks.has(selectedTaskId)){
     fetchBatchData(task.productId);
    }
   }
  
 },[tasks,selectedTaskId,expandedTasks,isDialogOpen,onRefreshTasks])
 useEffect(() => {

  expandedTasks.forEach(taskId => {
    const task = tasks.find(t => t._id === taskId);
    if (task) {
      fetchBatchData(task.productId);
    }
  });
}, [tasks]);
  const onCreateAction = async (taskId) => {
    try {
      console.log('Creating action for task:', taskId);
      // Navigate to create form or open modal
      // router.push(`/create-batch?taskId=${taskId}`);
      setSelectedTaskId(taskId);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error creating action:', error);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);

  //set the selectedTaskId as null only after 100 ms so tat teh state and ui can update
  setTimeout(()=>setSelectedTaskId(null),100)
  };

  const toggleTaskExpansion = (taskId, productId) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
      // Fetch batch data when expanding if not already loaded
      if (!batchData[productId]) {
        fetchBatchData(productId);
      }
    }
    setExpandedTasks(newExpanded);
  };

  const fetchBatchData = async (productId) => {
    setLoadingBatches(prev => ({ ...prev, [productId]: true }));
    console.log('Hit the fetch batch data fucntion');
    
    try {
      const response = await axios.get(`/api/products/batchCreation?taskId=${productId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
     console.log("The response in function is",response);
     
      if (response.data.success) {
        console.log('The response in frontend is', response);
        setBatchData(prev => ({ 
          ...prev, 
          [productId]: response.data.data 
        }));
      } else {
        console.error('Error while fetching batch details');
        setBatchData(prev => ({ 
          ...prev, 
          [productId]: [] 
        }));
      }
    } catch (error) {
      console.error("Error fetching batch data:", error);
      setBatchData(prev => ({ 
        ...prev, 
        [productId]: [] 
      }));
    } finally {
      setLoadingBatches(prev => ({ ...prev, [productId]: false }));
    }
  };

  
  const onCreateQRCode = async (batchData) => {
    const key = `${batchData.taskId}_${batchData.batchNo}`; //make a unique key
    setButtonStatuses((prev) => ({ ...prev, [key]: "loading" }));
    setIsLoading(true); 
    try {
      const { taskId, batchNo, startSerial, endSerial, unitsCreated, createdAt,productId } = batchData;
     // console.log("The info is", taskId, batchNo, startSerial, endSerial, unitsCreated, createdAt);
     //http://localhost:3000
      const response = await axios.post('/api/products/create_qrcodes1', batchData);
      //console.log("The response for creation is", response);
  
      if (response.data.success) {
        setButtonStatuses((prev)=>({
          ...prev,
          [key]:"success"
        }));
        await fetchBatchData(batchData.productId);
        
        
        toast({
          title: "PDF sent successfully",
          description: "QR codes have been generated and the PDF is sent to your email.",
          variant: 'success',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error creating QR codes:", error);
      toast({
        title: "Something went wrong",
        description: "QR code generation failed.",
        variant: 'destructive',
        duration: 5000,
      });
      setButtonStatuses((prev) => ({ ...prev, [key]: "idle" }));
    } finally {
      setIsLoading(false); // Hide loader
    }
  };
  
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'not started':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'in-progress':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const handleDownload = async (taskId,batchNo,productName) => {
    const downloadKey = `${taskId}_${batchNo}_download`;
    try{
      
    console.log("The task id is and the batch no of download button is",taskId,batchNo);
    setButtonStatuses(prev => ({ ...prev, [downloadKey]: "loading" }));
    const response = await fetch(`/api/pdf/${taskId}/${batchNo}`);
    if (response.status !== 200) {
      toast({
        title: "PDF Not Found",
        description: "Couldn't find PDF in Database",
        variant: 'destructive',
        duration: 5000,
      });
      return
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcodes-${productName}-${batchNo}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
   
  }catch (err) {
    console.error("Error downloading PDF:", err);
    toast({
      title: "Error",
      description: "Something went wrong while downloading the PDF.",
      variant: 'destructive',
      duration: 5000,
    });
  } finally {
    setButtonStatuses(prev => ({ ...prev, [downloadKey]: "idle" }));
  };
};

  const renderBatchTable = (task) => {
    //console.log("The render fucntion is being hit");
    
    const batches = batchData[task.productId] || [];
    //console.log("The batches in render are",batches);
//     0
// : 
// batchNo
// : 
// "1"
// lineManagers
// : 
// Array(1)
// 0
// : 
// {batchStartSerialNo: 1, batchEndSerialNo: 100, unitsCreated: 100, utcTimestamp: '2025-05-31T16:09:44.102Z', generatedHash: true}
// length

    const isLoading = loadingBatches[task.productId];

    if (isLoading) {
      return (
        <div className="text-center py-4 text-gray-500 text-sm">
          Loading batch data...
        </div>
      );
    }

    if (batches.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500 text-sm">
          No completed batches yet
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 border-b">
                Batch No
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 border-b">
                Created At
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 border-b">
                Start Serial
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 border-b">
                End Serial
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 border-b">
                Units Created
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 border-b">
                Action
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 border-b">
                Download PDF
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {batches.map((batch, batchIndex) => 
              batch.lineManagers.map((lm, lmIndex) => (
                <tr key={`${batchIndex}-${lmIndex}`} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm text-gray-800 font-medium">
                    {batch.batchNo}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 font-medium">
                    {new Date(lm.utcTimestamp).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 font-mono">
                    {lm.batchStartSerialNo}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 font-mono">
                    {lm.batchEndSerialNo}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {lm.unitsCreated}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() =>
                        onCreateQRCode({
                          taskId: task._id,
                          batchNo: batch.batchNo,
                          startSerial: lm.batchStartSerialNo,
                          endSerial: lm.batchEndSerialNo,
                          unitsCreated: lm.unitsCreated,
                          createdAt: lm.utcTimestamp,
                          generatedHash: lm.generatedHash,
                          productId: task.productId // Add this for updating batch data
                        })
                      }
                      className="bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                      disabled={
                        lm.generatedHash || // Disable if already generated
                        buttonStatuses[`${task._id}_${batch.batchNo}`] === "loading"
                      }
                    >
                      {buttonStatuses[`${task._id}_${batch.batchNo}`] === "loading" ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Generating...
                        </>
                      ) : lm.generatedHash ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 text-green-300" />
                          Generated
                        </>
                      ) : (
                        <>
                          <QrCode className="h-3 w-3" />
                          Create QR Code
                        </>
                      )}
                    </button>
                  </td>
                  <td>
                
                    <button
                      className='bg-slate-600 text-white px-2 py-1 rounded text-xs hover:bg-slate-700 transition-colors flex items-center gap-1 disabled:opacity-50'
                      onClick={() => handleDownload(task._id,batch.batchNo,task.productName)}
                      disabled={
                        !lm.generatedHash
                      }
                    >
                      {buttonStatuses[`${task._id}_${batch.batchNo}_download`] === "loading" ? (
      <>
        <Loader2 className="animate-spin w-4 h-4" />
        Downloading...
      </>
    ) : (
      "Download PDF"
    )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return(
    <>
    <div className="p-6 max-w-full mx-auto">
      <div className="mb-8">
        {tasks.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="text-gray-500">
              No tasks assigned yet.
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date of Task
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remaining Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Serial
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Serial
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Info
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task, index) => (
                    <React.Fragment key={task._id}>
                      <tr className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                            {new Date(task.assignedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                            {getStatusIcon(task.status)}
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Package className="mr-2 h-4 w-4 text-blue-600" />
                            <div className="font-medium">{task.productName}</div>
                          </div>
                        </td>
                        {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <User className="mr-2 h-4 w-4 text-gray-400" />
                            {task.lineManagerId}
                          </div>
                        </td> */}
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Hash className="mr-2 h-4 w-4 text-gray-400" />
                            <span className="font-medium">{task.TotalNoOfUnits?.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <Hash className="mr-2 h-4 w-4 text-gray-400" />
                            <span className={`font-medium ${(task.TotalNoOfUnits-task.completedUnits) > 0 ? 'text-blue-600' : 'text-gray-500'}`}>
                              {(task.TotalNoOfUnits-task.completedUnits)?.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          {task.startSerialNo}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          {task.endSerialNo || ' '}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            {(task.TotalNoOfUnits-task.completedUnits) > 0 ? (
                              <button
                                onClick={() => onCreateAction(task._id)}
                                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-xs font-medium"
                              >
                                CREATE
                              </button>
                            ) : (
                              <button
                                onClick={() => onUpdateTask(task.id, { 
                                  status: task.status === 'pending' ? 'in-progress' : 
                                          task.status === 'in-progress' ? 'completed' : 'pending'
                                })}
                                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-xs font-medium flex items-center gap-1"
                              >
                                <Edit className="h-3 w-3" />
                                Update
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => toggleTaskExpansion(task._id, task.productId)}
                            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                          >
                            <Info className="h-4 w-4" />
                            {expandedTasks.has(task._id) ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </button>
                        </td>
                      </tr>
                      
                      {/* Expandable Details Section */}
                      {expandedTasks.has(task._id) && (
                        <tr>
                          <td colSpan="11" className="px-4 py-4 bg-gray-50">
                            <div className="rounded-lg border border-gray-200 bg-white p-4">
                              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <Package className="h-4 w-4 text-blue-600" />
                                Task Details - {task.productName}
                              </h4>
                              
                              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-600">Completed Units:</span>
                                  <span className="ml-2 text-gray-800">{task.completedUnits?.toLocaleString() || 0}</span>
                                </div>
                              </div>

                              <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-2">Completed Batches</h5>
                                {renderBatchTable(task)}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
    <BatchDialog 
      isOpen={isDialogOpen}
      onClose={closeDialog}
      taskId={selectedTaskId}
      role={role}
    />
    </>
  );
}

export default TaskManagementTable;