"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductManagement } from './ProductManagement';
import { StaffManagement } from './StaffManagement';
import { PasswordManagement } from './PasswordManagement';
import { Reports } from './Reports';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="min-h-screen p-6 bg-white/5">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent">
              Admin Dashboard
            </CardTitle>
            <p className="text-gray-600">Fusion Eats Management System</p>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="products">Menu Management</TabsTrigger>
                <TabsTrigger value="staff">Staff Management</TabsTrigger>
                <TabsTrigger value="passwords">Password Settings</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="mt-6">
                <ProductManagement />
              </TabsContent>

              <TabsContent value="staff" className="mt-6">
                <StaffManagement />
              </TabsContent>

              <TabsContent value="passwords" className="mt-6">
                <PasswordManagement />
              </TabsContent>

              <TabsContent value="reports" className="mt-6">
                <Reports />
              </TabsContent>
            </Tabs>

            <div className="mt-8 text-center">
              <Button
                variant="destructive"
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700"
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}