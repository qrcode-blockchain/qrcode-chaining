'use client'
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { useToast } from '../../../hooks/useToast';

import { 
  ArrowUpDown, 
  Calendar, 
  ChevronDown, 
  Clock, 
  FilePlus, 
  Home, 
  LogOut, 
  Settings, 
  UserCircle, 
  Users ,
  Package,
   DollarSign, Truck,
} from 'lucide-react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../../components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import { Button } from "../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import {Badge} from '../../../components/ui/badge'

const LineManagerDashboard = () => {
  const {data:session,status}=useSession();
  const lineManager=session?.user;
  console.log("The line manager is",lineManager);
  const {toast}=useToast();
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasks,setTasks]=useState([]);
  const [selectedTasks,setSelectedTasks]=useState(null);
  //to check if logged in otherwise load

  // Simulated data - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real application, replace with actual API calls
        // const userResponse = await axios.get('/api/lineManagers/me');
        // const employeesResponse = await axios.get('/api/lineManagers/employees');
        // const requestsResponse = await axios.get('/api/lineManagers/pending-requests');
        
        // Simulated data
        setUser({
          id: 1,
          name: 'Sarah Johnson',
          email: 'sarah.johnson@company.com',
          department: 'Engineering',
          role: 'Senior Manager'
        });
        
        setEmployees([
          { id: 1, name: 'John Doe', position: 'Software Engineer', department: 'Engineering', status: 'Active' },
          { id: 2, name: 'Jane Smith', position: 'UX Designer', department: 'Design', status: 'Active' },
          { id: 3, name: 'Mike Brown', position: 'Frontend Developer', department: 'Engineering', status: 'On Leave' },
          { id: 4, name: 'Lisa Jones', position: 'Backend Developer', department: 'Engineering', status: 'Active' },
          { id: 5, name: 'David Wilson', position: 'Product Manager', department: 'Product', status: 'Active' },
        ]);
        
        setPendingRequests([
          { id: 101, employeeName: 'John Doe', type: 'Time Off', submitted: '2025-03-10', status: 'Pending' },
          { id: 102, employeeName: 'Jane Smith', type: 'Equipment', submitted: '2025-03-11', status: 'Pending' },
          { id: 103, employeeName: 'Mike Brown', type: 'Remote Work', submitted: '2025-03-12', status: 'Pending' },
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(()=>{
    if(status==="authenticated"){
      const fetchTasks=async()=>{
        try {
          const response=await axios.get('/api/lineManagers/fetch-assigned-task');
          if(response.data.success){
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
    const getStatusColor = (status) => {
      switch (status.toLowerCase()) {
        case 'pending':
          return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
        case 'completed':
          return 'bg-green-100 text-green-800 hover:bg-green-200';
        
        case 'inprogress':
          return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
        
        default:
          return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold">Loading dashboard...</div>
      </div>
    );
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
        {/* User Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h2>
          <p className="text-gray-600">{user?.role} • {user?.department}</p>
        </div>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Your direct reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{employees.length}</div>
              <div className="text-sm text-muted-foreground">Active employees</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>Awaiting your approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingRequests.length}</div>
              <div className="text-sm text-muted-foreground">Across all categories</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2</div>
              <div className="text-sm text-muted-foreground">Team meetings & reviews</div>
            </CardContent>
          </Card>
        </div>

       {/* assign task */}
       <div className="mb-8">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Assigned Tasks</h2>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              {tasks.length===0 ? (
                <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                  No tasks assigned yet.
                </CardContent>
              </Card>
              ):(
                <div className="grid gap-4">
                  {tasks.map((task) => (
                    <Card 
                      key={task._id} 
                      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedTasks(task)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              <Package className="mr-2 h-5 w-5 text-blue-600" />
                              {task.productName}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Location: {task.location}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-8">
                          <div className="flex items-center">
                            <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
                            <span>Price: ₹{task.productPrice}</span>
                          </div>
                          <div className="flex items-center">
                            <Truck className="mr-2 h-4 w-4 text-gray-500" />
                            <span>Units: {task.NoOfUnits?.toLocaleString() || 0}</span>
                          </div>
                          <div className='space-y-96'>
                          <Button>Complete Task</Button>
                        </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50 py-2 px-6 text-sm text-gray-600 flex items-center">
                        
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Assigned: {formatDate(task.assignedAt)}</span>
                        
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending">
              {tasks.filter(task => task.status?.toLowerCase() === 'pending').length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-gray-500">
                    No pending tasks.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {tasks.filter(task => task.status?.toLowerCase() === 'pending').map((task) => (
                    <Card 
                      key={task._id} 
                      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedTasks(task)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              <Package className="mr-2 h-5 w-5 text-blue-600" />
                              {task.productName}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Location: {task.location}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
                            <span>Price: ₹{task.productPrice}</span>
                          </div>
                          <div className="flex items-center">
                            <Truck className="mr-2 h-4 w-4 text-gray-500" />
                            <span>Units: {task.NoOfUnits?.toLocaleString() || 0}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50 py-2 px-6 text-sm text-gray-600 flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Assigned: {formatDate(task.assignedAt)}</span>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {tasks.filter(task => task.status?.toLowerCase() === 'completed').length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-gray-500">
                    No completed tasks.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {tasks.filter(task => task.status?.toLowerCase() === 'completed').map((task) => (
                    <Card 
                      key={task._id} 
                      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedTasks(task)}
                    >
                      {/* Same card structure as above */}
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              <Package className="mr-2 h-5 w-5 text-blue-600" />
                              {task.productName}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Location: {task.location}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
                            <span>Price: ₹{task.productPrice}</span>
                          </div>
                          <div className="flex items-center">
                            <Truck className="mr-2 h-4 w-4 text-gray-500" />
                            <span>Units: {task.NoOfUnits?.toLocaleString() || 0}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50 py-2 px-6 text-sm text-gray-600 flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Assigned: {formatDate(task.assignedAt)}</span>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>


            <TabsContent value="in-progress">
              {tasks.filter(task => 
                task.status?.toLowerCase() === 'in progress' || 
                task.status?.toLowerCase() === 'inprogress'
              ).length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-gray-500">
                    No tasks in progress.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {tasks.filter(task => 
                    task.status?.toLowerCase() === 'in progress' || 
                    task.status?.toLowerCase() === 'inprogress'
                  ).map((task) => (
                    <Card 
                      key={task._id} 
                      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedTasks(task)}
                    >
                      {/* Same card structure as above */}
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              <Package className="mr-2 h-5 w-5 text-blue-600" />
                              {task.productName}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Location: {task.location}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
                            <span>Price: ₹{task.productPrice}</span>
                          </div>
                          <div className="flex items-center">
                            <Truck className="mr-2 h-4 w-4 text-gray-500" />
                            <span>Units: {task.NoOfUnits?.toLocaleString() || 0}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50 py-2 px-6 text-sm text-gray-600 flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Assigned: {formatDate(task.assignedAt)}</span>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
             
            </Tabs>
            </div>
         
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