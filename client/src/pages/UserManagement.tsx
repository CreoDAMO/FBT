import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function UserManagement() {
  return (
    <div className="section-content p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-purple-600" />
            <span>User Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-20">
            <Users size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">User Management</h2>
            <p className="text-gray-600">Authentication, profiles, and role-based access control</p>
            <p className="text-sm text-gray-500 mt-4">Features would include user profiles, role management, permissions, and authentication settings</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
