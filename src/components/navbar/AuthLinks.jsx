
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut, ShieldCheck, Shield, Briefcase } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AuthLinks = ({ isAuthenticated, logout }) => {
  const { state } = useAuth();
  const { user } = state;
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    // Logout is handled by the authAPI which redirects to homepage
  };
  
  if (isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="btn-transition hover:text-hotel-500">
            <User className="h-4 w-4 mr-2" />
            {user?.username || 'Account'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => navigate('/dashboard')}>
            <User className="h-4 w-4 mr-2" />
            User Dashboard
          </DropdownMenuItem>
          
          {user?.isAdmin && (
            <DropdownMenuItem onClick={() => navigate('/admin')}>
              <ShieldCheck className="h-4 w-4 mr-2" />
              Admin Dashboard
            </DropdownMenuItem>
          )}
          
          {user?.isModerator && (
            <DropdownMenuItem onClick={() => navigate('/moderator')}>
              <Shield className="h-4 w-4 mr-2" />
              Moderator Dashboard
            </DropdownMenuItem>
          )}
          
          {user?.isWorker && (
            <DropdownMenuItem onClick={() => navigate('/worker')}>
              <Briefcase className="h-4 w-4 mr-2" />
              Worker Dashboard
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  return (
    <>
      <Link to="/login">
        <Button variant="ghost" size="sm" className="btn-transition">
          Login
        </Button>
      </Link>
      <Link to="/register">
        <Button variant="default" size="sm" className="bg-hotel-500 hover:bg-hotel-600 btn-transition">
          Sign Up
        </Button>
      </Link>
    </>
  );
};

export default AuthLinks;
