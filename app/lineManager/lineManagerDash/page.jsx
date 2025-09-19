'use client'
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { useToast } from '../../../hooks/useToast';
import { useRouter } from 'next/navigation';
import TaskManagementTable from '../../../components/TaskTable'
import axios from 'axios';
import { Home,ChevronDown ,UserCircle,Settings,LogOut} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";


import { Button } from "../../../components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
 import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
// import {Badge} from '../../../components/ui/badge'

const LineManagerDashboard = () => {
  const {data:session,status}=useSession();
  const lineManager=session?.user;
 // console.log("The line manager is",lineManager);
  const {toast}=useToast();
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [tasks,setTasks]=useState([]);
  const [selectedTasks,setSelectedTasks]=useState(null);
  const router=useRouter();
  //to handle complete task
//   const handleCompleteTask = (taskId) => {
//     router.push(`/AssignProductsFormLm?taskId=${taskId}`);
// };
  //to check if logged in otherwise load

  const fetchTasks=async()=>{
    try {
      const response=await axios.get('/api/lineManagers/fetch-assigned-task');
      
      if(response.data.success){
        console.log("The task returned is",response.data.tasks);
        
        setTasks(response.data.tasks);
      }else{
        toast({
          title:"Failed to fetch tasks",
          description: response.data.message || "An error occurred",
        variant: 'destructive',
        duration: 5000,
        })
      }

      
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Failed to load tasks",
        description: error.response?.data?.message || "An error occurred while fetching line tasks",
        variant: 'destructive',
        duration: 5000,
      });
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    if(status==="authenticated"){
      
      fetchTasks();
   }
    } ,[status]);

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    };
   
    
    if(status==="loading"){
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <span className="ml-2">Loading...</span>
      </div>
      )
    }
    if (!session) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
          <h1 className="text-2xl font-bold">Please log in to access the dashboard.</h1>
        </div>
      );
    }
  const handleLogout = async () => {
    try {
      // await axios.post('/api/lineManagers/logout');
      window.location.href = '/line-manager/auth';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  const handleCreateAction = async (taskId) => {
    try {
      console.log('Creating action for task:', taskId);
      // Navigate to create form or open modal
      // router.push(`/create-batch?taskId=${taskId}`);

    } catch (error) {
      console.error('Error creating action:', error);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      // API call to update task
      console.log('Updating task:', taskId, 'with:', updates);
      
  
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold">Loading dashboard...</div>
      </div>
    );
  }
  const handleRefreshTasks=()=>{
    fetchTasks();
  }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <header className="bg-blue-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Home className="h-6 w-6" />
            <h1 className="text-xl font-bold">Line Manager Portal</h1>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={user?.name} />
                  <AvatarFallback className="bg-blue-700">{user?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span>{user?.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">

      <TaskManagementTable 
        tasks={tasks}
        onUpdateTask={handleUpdateTask}
        role={session?.user.role}
        onRefreshTasks={handleRefreshTasks}
        //onCreateAction={handleCreateAction}

      />
       
      
         
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; 2025 Company Name. Line Manager Portal v1.0.0
        </div>
      </footer>
    </div>
  );
};

export default LineManagerDashboard;