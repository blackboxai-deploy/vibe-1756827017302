"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePOS } from '@/hooks/use-pos';

export function PasswordManagement() {
  const { settings, updateSettings } = usePOS();
  const [formData, setFormData] = useState({
    userType: '' as 'staff' | 'admin' | '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!formData.userType || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long' });
      return;
    }

    // Verify current password
    const currentCorrectPassword = formData.userType === 'staff' ? settings.staffPassword : settings.adminPassword;
    if (formData.currentPassword !== currentCorrectPassword) {
      setMessage({ type: 'error', text: 'Current password is incorrect' });
      return;
    }

    // Update password
    const newSettings = {
      ...settings,
      [formData.userType === 'staff' ? 'staffPassword' : 'adminPassword']: formData.newPassword,
    };

    updateSettings(newSettings);
    setMessage({ type: 'success', text: `${formData.userType} password updated successfully!` });
    
    // Reset form
    setFormData({
      userType: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const resetMessage = () => {
    setMessage(null);
  };

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Change System Passwords</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="user-type">User Type</Label>
              <Select
                value={formData.userType}
                onValueChange={(value) => {
                  setFormData({ ...formData, userType: value as 'staff' | 'admin' });
                  resetMessage();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => {
                  setFormData({ ...formData, currentPassword: e.target.value });
                  resetMessage();
                }}
                placeholder="Enter current password"
                required
              />
            </div>

            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={formData.newPassword}
                onChange={(e) => {
                  setFormData({ ...formData, newPassword: e.target.value });
                  resetMessage();
                }}
                placeholder="Enter new password (min 6 characters)"
                required
                minLength={6}
              />
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  resetMessage();
                }}
                placeholder="Confirm new password"
                required
                minLength={6}
              />
            </div>

            {message && (
              <Alert className={message.type === 'error' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}>
                <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full">
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Current Password Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Staff Password</h3>
                <p className="text-sm text-gray-600">
                  Current: {settings.staffPassword.replace(/./g, '•')}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Admin Password</h3>
                <p className="text-sm text-gray-600">
                  Current: {settings.adminPassword.replace(/./g, '•')}
                </p>
              </div>
            </div>
            
            <Alert>
              <AlertDescription>
                <strong>Security Notes:</strong>
                <br />
                • Passwords are stored locally in your browser
                <br />
                • Choose strong passwords with a mix of letters, numbers, and symbols
                <br />
                • Remember to update passwords regularly for security
                <br />
                • If you forget a password, you may need to reset the application data
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}