import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  File,
  Coins,
  Vote,
  Handshake,
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  Zap,
  Lock,
  Settings
} from 'lucide-react';
import { OPENZEPPELIN_TEMPLATES, getTemplateByCategory } from '@/lib/openzeppelin-templates';

interface SmartContract {
  id: number;
  name: string;
  contractType: string;
  network: string;
  contractAddress: string;
  status: string;
}

export default function SmartContracts() {
  const [selectedContractType, setSelectedContractType] = useState<string>("");
  const [contractConfig, setContractConfig] = useState({
    name: "",
    symbol: "",
    network: "",
    totalSupply: "",
  });

  // Mock deployed contracts data
  const mockContracts: SmartContract[] = [
    {
      id: 1,
      name: "FastBiteToken",
      contractType: "ERC-20",
      network: "Base Mainnet",
      contractAddress: "0x742d...4e67",
      status: "Active",
    },
  ];

  const contractTypes = [
    {
      id: "token",
      name: "ERC-20 Token",
      description: "Deploy custom branded tokens",
      icon: Coins,
      color: "text-purple-600",
    },
    {
      id: "dao",
      name: "DAO Governance",
      description: "Create governance contracts",
      icon: Vote,
      color: "text-blue-600",
    },
    {
      id: "escrow",
      name: "Escrow Contract",
      description: "Secure payment handling",
      icon: Handshake,
      color: "text-green-600",
    },
    {
      id: "custom",
      name: "OpenZeppelin Templates",
      description: "Leverage advanced OpenZeppelin contracts",
      icon: Zap,
      color: "text-yellow-600",
    },
  ];

  const handleDeploy = () => {
    console.log("Deploying contract with config:", contractConfig);
    // In a real implementation, this would interact with Web3 to deploy the contract
  };

  const renderContractForm = () => {
    if (!selectedContractType) return null;

    const template = getTemplateByCategory(selectedContractType);

    if (selectedContractType === "custom") {
      return (
        <Card className="mb-6 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg">Select OpenZeppelin Template</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="erc20" className="w-full">
              <TabsList>
                {OPENZEPPELIN_TEMPLATES.map((t) => (
                  <TabsTrigger key={t.category} value={t.category}>
                    {t.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {OPENZEPPELIN_TEMPLATES.map((t) => (
                <TabsContent key={t.category} value={t.category} className="mt-4">
                  <p className="text-sm text-gray-600 mb-4">{t.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {t.fields.map((field) => (
                      <div key={field.name}>
                        <Label htmlFor={field.name}>{field.label}</Label>
                        <Input
                          id={field.name}
                          placeholder={field.placeholder}
                          value={contractConfig[field.name as keyof typeof contractConfig] || ""}
                          onChange={(e) => setContractConfig({...contractConfig, [field.name]: e.target.value})}
                          type={field.type || "text"}
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      );
    }

    // Render form for default contract types
    return (
      <Card className="mb-6 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">Contract Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contract-name">Contract Name</Label>
              <Input
                id="contract-name"
                placeholder="PizzaPalaceToken"
                value={contractConfig.name}
                onChange={(e) => setContractConfig({...contractConfig, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                placeholder="PPT"
                value={contractConfig.symbol}
                onChange={(e) => setContractConfig({...contractConfig, symbol: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="network">Network</Label>
              <Select value={contractConfig.network} onValueChange={(value) => setContractConfig({...contractConfig, network: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="base-mainnet">Base Mainnet</SelectItem>
                  <SelectItem value="base-sepolia">Base Sepolia (Testnet)</SelectItem>
                  <SelectItem value="ethereum">Ethereum Mainnet</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(selectedContractType === "token") && (
              <div>
                <Label htmlFor="total-supply">Total Supply</Label>
                <Input
                  id="total-supply"
                  type="number"
                  placeholder="1000000"
                  value={contractConfig.totalSupply}
                  onChange={(e) => setContractConfig({...contractConfig, totalSupply: e.target.value})}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="section-content p-6">
      {/* Contract Deployment Wizard */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <File className="w-6 h-6" />
            <span>Smart Contract Deployment System</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">Deploy and manage branded smart contracts for white-label instances</p>

          {/* Contract Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {contractTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-colors hover:border-blue-500 ${
                    selectedContractType === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedContractType(type.id)}
                >
                  <CardContent className="p-4 text-center">
                    <Icon className={`${type.color} mx-auto mb-3`} size={32} />
                    <h3 className="font-semibold text-gray-900">{type.name}</h3>
                    <p className="text-sm text-gray-600 mt-2">{type.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Deployment Configuration */}
          {renderContractForm()}

          {/* Deploy Button */}
          {selectedContractType && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Estimated Gas:</span>
                <span className="font-medium">0.0045 ETH</span>
              </div>
              <Button
                onClick={handleDeploy}
                className="fastbite-gradient text-white hover:shadow-lg transition-all touch-target w-full sm:w-auto"
              >
                Deploy Contract
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deployed Contracts Management */}
      <Card>
        <CardHeader>
          <CardTitle>Deployed Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="mobile-table w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Contract</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Network</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockContracts.map((contract) => (
                  <tr key={contract.id}>
                    <td className="px-4 py-3" data-label="Contract">
                      <div>
                        <p className="font-medium text-gray-900">{contract.name}</p>
                        <p className="text-xs text-gray-500">{contract.contractAddress}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3" data-label="Type">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                        {contract.contractType}
                      </span>
                    </td>
                    <td className="px-4 py-3" data-label="Network">{contract.network}</td>
                    <td className="px-4 py-3" data-label="Status">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-4 py-3" data-label="Actions">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 touch-target">
                          <ExternalLink size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700 touch-target">
                          <Settings size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}