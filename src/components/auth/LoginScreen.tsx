"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface LoginScreenProps {
  onLogin: (password: string, userType: 'staff' | 'admin') => boolean;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [staffPassword, setStaffPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [error, setError] = useState('');

  const handleStaffLogin = () => {
    if (onLogin(staffPassword, 'staff')) {
      setStaffDialogOpen(false);
      setStaffPassword('');
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleAdminLogin = () => {
    if (onLogin(adminPassword, 'admin')) {
      setAdminDialogOpen(false);
      setAdminPassword('');
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, loginFn: () => void) => {
    if (e.key === 'Enter') {
      loginFn();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent">
            Fusion Eats
          </CardTitle>
          <p className="text-gray-600">Professional EPOS System</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dialog open={staffDialogOpen} onOpenChange={setStaffDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg">
                Staff Login
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Staff Login</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="staff-password">Password</Label>
                  <Input
                    id="staff-password"
                    type="password"
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleStaffLogin)}
                    placeholder="Enter staff password"
                    className="mt-1"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex gap-2">
                  <Button onClick={handleStaffLogin} className="flex-1">
                    Login
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setStaffDialogOpen(false);
                      setStaffPassword('');
                      setError('');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg">
                Admin Login
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Admin Login</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleAdminLogin)}
                    placeholder="Enter admin password"
                    className="mt-1"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex gap-2">
                  <Button onClick={handleAdminLogin} className="flex-1">
                    Login
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setAdminDialogOpen(false);
                      setAdminPassword('');
                      setError('');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Demo Passwords:</p>
            <p>Staff: staff123 | Admin: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}