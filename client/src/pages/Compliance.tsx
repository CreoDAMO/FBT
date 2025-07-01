import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function Compliance() {
  return (
    <div className="section-content p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-green-600" />
            <span>Compliance Dashboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-20">
            <Shield size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Compliance Dashboard</h2>
            <p className="text-gray-600">KYC/AML verification, audit logs, and regulatory compliance</p>
            <p className="text-sm text-gray-500 mt-4">Features would include KYC verification, AML monitoring, audit trail, and regulatory reporting</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
