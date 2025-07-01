import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function AdminPanel() {
  return (
    <div className="section-content p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-6 h-6 text-gray-600" />
            <span>Admin Panel</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-20">
            <Settings size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h2>
            <p className="text-gray-600">Platform administration and white-label management</p>
            <p className="text-sm text-gray-500 mt-4">Features would include user management, platform configuration, and white-label customization tools</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
