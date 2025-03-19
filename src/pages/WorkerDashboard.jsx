
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { workerAPI } from '@/services/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BedDouble, 
  User, 
  RefreshCw, 
  Check, 
  Clock, 
  CheckCircle2, 
  Building
} from 'lucide-react';

const WorkerDashboard = () => {
  const { state } = useAuth();
  const { user } = state;
  
  const [loading, setLoading] = useState(true);
  const [workerProfile, setWorkerProfile] = useState(null);
  const [pendingRooms, setPendingRooms] = useState([]);
  const [completedRooms, setCompletedRooms] = useState([]);
  
  // Load worker data
  useEffect(() => {
    const fetchWorkerData = async () => {
      if (!user || !user._id) return;
      
      try {
        setLoading(true);
        
        // Find worker profile
        const workers = await workerAPI.getAllWorkers();
        const userWorker = workers.find(worker => worker.userId === user._id);
        
        if (userWorker) {
          setWorkerProfile(userWorker);
          
          // Get pending rooms
          const pending = userWorker.assignedRooms || [];
          setPendingRooms(pending);
          
          // Get completed rooms
          const completed = userWorker.cleanedRooms || [];
          setCompletedRooms(completed);
        }
      } catch (error) {
        console.error('Error fetching worker data:', error);
        toast.error('Failed to load worker data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkerData();
  }, [user]);

  const handleMarkAsCompleted = async (roomId) => {
    if (!workerProfile) return;
    
    try {
      await workerAPI.markRoomAsCleaned(workerProfile._id, roomId);
      
      // Update local data
      const updatedPendingRooms = pendingRooms.filter(room => room.roomId._id !== roomId);
      setPendingRooms(updatedPendingRooms);
      
      // Add to completed rooms
      const nowDate = new Date();
      const newCompletedRoom = { 
        roomId: pendingRooms.find(room => room.roomId._id === roomId).roomId,
        cleanedAt: nowDate
      };
      setCompletedRooms([newCompletedRoom, ...completedRooms]);
      
      toast.success('Room marked as cleaned');
    } catch (error) {
      console.error('Error marking room as cleaned:', error);
      toast.error('Failed to mark room as cleaned');
    }
  };

  return (
    <AuthGuard requireWorker={true}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow py-12 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Worker Dashboard</h1>
                <p className="text-gray-600">Manage your assigned tasks and cleaning responsibilities</p>
              </div>
              
              {workerProfile && (
                <div className="mt-4 md:mt-0">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-lg">
                    <Building className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-800">{workerProfile.hotelId.name}</span>
                  </div>
                </div>
              )}
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-hotel-500" />
                <span className="ml-2 text-gray-600">Loading dashboard...</span>
              </div>
            ) : workerProfile ? (
              <div className="space-y-8">
                {/* Worker profile card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Worker Profile</CardTitle>
                    <CardDescription>Your role and information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Name</h3>
                        <p className="text-lg font-semibold">{workerProfile.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Role</h3>
                        <p className="text-lg font-semibold capitalize">{workerProfile.role}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="text-lg">{workerProfile.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                        <p className="text-lg">{workerProfile.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Tasks tabs */}
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="pending" className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Pending Tasks ({pendingRooms.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Completed Tasks ({completedRooms.length})
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Pending tasks */}
                  <TabsContent value="pending">
                    {pendingRooms.length === 0 ? (
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                          <Clock className="h-12 w-12 text-gray-300 mb-4" />
                          <h3 className="text-lg font-medium mb-2">No pending tasks</h3>
                          <p className="text-gray-500 mb-4 text-center">
                            You don't have any rooms assigned for cleaning right now
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pendingRooms.map((assignment) => (
                          <Card key={assignment.roomId._id} className="overflow-hidden">
                            <div className="bg-amber-50 px-4 py-2 border-b border-amber-200">
                              <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-amber-800">
                                  Room {assignment.roomId.roomNumbers[0]?.number || 'N/A'}
                                </h3>
                                <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                                  Pending
                                </span>
                              </div>
                            </div>
                            <CardContent className="pt-4">
                              <p className="font-medium mb-1">{assignment.roomId.title}</p>
                              <p className="text-sm text-gray-600 mb-3">
                                {assignment.roomId.desc}
                              </p>
                              <div className="text-xs text-gray-500 mb-4">
                                <p>Assigned on: {new Date(assignment.assignedAt).toLocaleDateString()}</p>
                              </div>
                              <Button 
                                onClick={() => handleMarkAsCompleted(assignment.roomId._id)}
                                className="w-full bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Mark as Cleaned
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  {/* Completed tasks */}
                  <TabsContent value="completed">
                    {completedRooms.length === 0 ? (
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                          <CheckCircle2 className="h-12 w-12 text-gray-300 mb-4" />
                          <h3 className="text-lg font-medium mb-2">No completed tasks</h3>
                          <p className="text-gray-500 mb-4 text-center">
                            You haven't completed any cleaning tasks yet
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {completedRooms.map((completed, index) => (
                          <Card key={index} className="overflow-hidden">
                            <div className="bg-green-50 px-4 py-2 border-b border-green-200">
                              <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-green-800">
                                  Room {completed.roomId.roomNumbers?.[0]?.number || 'N/A'}
                                </h3>
                                <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                                  Completed
                                </span>
                              </div>
                            </div>
                            <CardContent className="pt-4">
                              <p className="font-medium mb-1">{completed.roomId.title || 'Room'}</p>
                              <p className="text-sm text-gray-600 mb-3">
                                {completed.roomId.desc || 'Standard room'}
                              </p>
                              <div className="text-xs text-gray-500">
                                <p>Cleaned on: {new Date(completed.cleanedAt).toLocaleDateString()}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
                
                {/* Stats summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Pending Tasks</p>
                          <p className="text-3xl font-bold">{pendingRooms.length}</p>
                        </div>
                        <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                          <Clock className="h-6 w-6 text-amber-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Completed Tasks</p>
                          <p className="text-3xl font-bold">{completedRooms.length}</p>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                          <p className="text-3xl font-bold">
                            {pendingRooms.length + completedRooms.length === 0 
                              ? '0%' 
                              : `${Math.round(completedRooms.length / (pendingRooms.length + completedRooms.length) * 100)}%`}
                          </p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <BedDouble className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <User className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Not a Worker</h3>
                  <p className="text-gray-500 mb-4 text-center">
                    Your account is not registered as a worker in our system.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </AuthGuard>
  );
};

export default WorkerDashboard;
