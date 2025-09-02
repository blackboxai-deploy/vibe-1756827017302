"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePOS } from '@/hooks/use-pos';

export function StaffManagement() {
  const { staff, addStaff, deleteStaff } = usePOS();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.role) {
      alert('Please fill in all fields');
      return;
    }

    addStaff({
      name: formData.name,
      role: formData.role,
    });

    setFormData({ name: '', role: '' });
    alert('Staff member added successfully!');
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      deleteStaff(id);
      alert('Staff member removed successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Staff Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Staff Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="staff-name">Full Name</Label>
                <Input
                  id="staff-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter staff member's name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="staff-role">Role</Label>
                <Input
                  id="staff-role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Enter role (e.g., Cashier, Cook, Manager)"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Add Staff Member
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Staff List */}
        <Card>
          <CardHeader>
            <CardTitle>Current Staff ({staff.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {staff.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No staff members added yet</p>
              ) : (
                <div className="space-y-3">
                  {staff.map((member) => (
                    <div key={member.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{member.name}</h3>
                          <p className="text-gray-600">{member.role}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(member.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Management Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Staff members added here are for organizational purposes only</p>
            <p>• All staff use the same login password (can be changed in Password Settings)</p>
            <p>• Consider assigning specific roles like: Cashier, Cook, Shift Manager, etc.</p>
            <p>• This helps with accountability and shift management</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}