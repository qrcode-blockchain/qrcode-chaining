'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Users 
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

const LineManagerDashboard = () => {
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="team">
          <TabsList className="mb-6">
            <TabsTrigger value="team" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center">
              <FilePlus className="mr-2 h-4 w-4" />
              Requests
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="team" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">My Team</h3>
              <Button variant="outline">
                Add Team Member
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span>{employee.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            employee.status === 'Active' ? 'bg-green-100 text-green-800' : 
                            employee.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {employee.status}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="requests" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Pending Requests</h3>
              <Button variant="outline">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Employee</TableHead>
                      <TableHead>Request Type</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.employeeName}</TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>{new Date(request.submitted).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800">
                            {request.status}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm">Approve</Button>
                            <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">Deny</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Team Schedule</h3>
              <Button variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-semibold">Calendar View Coming Soon</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This feature is currently in development. Check back soon!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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