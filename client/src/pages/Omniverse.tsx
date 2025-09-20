
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, VrHeadset, Globe, Users, Gamepad2, Building, ShoppingBag } from 'lucide-react';

export default function Omniverse() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Omniverse</h1>
        <p className="text-gray-600">Immersive virtual experiences and metaverse integration</p>
      </div>

      <Tabs defaultValue="virtual-restaurants" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="virtual-restaurants" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Virtual Restaurants
          </TabsTrigger>
          <TabsTrigger value="ar-ordering" className="flex items-center gap-2">
            <VrHeadset className="w-4 h-4" />
            AR Ordering
          </TabsTrigger>
          <TabsTrigger value="social-dining" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Social Dining
          </TabsTrigger>
          <TabsTrigger value="gamification" className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4" />
            Gamification
          </TabsTrigger>
          <TabsTrigger value="nft-marketplace" className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            NFT Marketplace
          </TabsTrigger>
        </TabsList>

        <TabsContent value="virtual-restaurants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Virtual Restaurant Experiences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Building className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">3D Restaurant Environments</h3>
                <p className="text-gray-600 mb-6">
                  Immersive virtual restaurant experiences where customers can explore before ordering
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Virtual Kitchen Tours</h4>
                    <p className="text-sm text-gray-600">See how your food is prepared in 3D</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Interactive Menus</h4>
                    <p className="text-sm text-gray-600">3D food visualization and customization</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Virtual Dining Rooms</h4>
                    <p className="text-sm text-gray-600">Experience restaurant ambiance from home</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Chef Interactions</h4>
                    <p className="text-sm text-gray-600">Meet and interact with virtual chefs</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ar-ordering" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <VrHeadset className="w-5 h-5" />
                Augmented Reality Ordering
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <VrHeadset className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">AR Food Visualization</h3>
                <p className="text-gray-600 mb-6">
                  See food items in augmented reality before ordering
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">3D Food Models</h4>
                    <p className="text-sm text-gray-600">Realistic 3D representations of menu items</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Size Comparison</h4>
                    <p className="text-sm text-gray-600">See actual food sizes in your space</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Nutritional AR</h4>
                    <p className="text-sm text-gray-600">View nutritional info in AR overlay</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Table Placement</h4>
                    <p className="text-sm text-gray-600">Visualize food on your actual table</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Ingredient Scanner</h4>
                    <p className="text-sm text-gray-600">Scan ingredients with AR recognition</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Voice Commands</h4>
                    <p className="text-sm text-gray-600">Order using voice in AR interface</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social-dining" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Social Dining Experiences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Virtual Dining Together</h3>
                <p className="text-gray-600 mb-6">
                  Share meals with friends and family in virtual spaces
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Virtual Dinner Parties</h4>
                    <p className="text-sm text-gray-600">Host dinner parties in virtual spaces</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Synchronized Ordering</h4>
                    <p className="text-sm text-gray-600">Order together from different locations</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Virtual Dating</h4>
                    <p className="text-sm text-gray-600">Romantic virtual dining experiences</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Cultural Exchanges</h4>
                    <p className="text-sm text-gray-600">Experience global cuisines virtually</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gamification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                Gamified Food Experiences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Food Gaming Universe</h3>
                <p className="text-gray-600 mb-6">
                  Gamify food ordering and delivery experiences
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Cooking Challenges</h4>
                    <p className="text-sm text-gray-600">Virtual cooking competitions</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Delivery Racing</h4>
                    <p className="text-sm text-gray-600">Gamified delivery tracking</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Food Quest</h4>
                    <p className="text-sm text-gray-600">Discover new cuisines through quests</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Recipe Collection</h4>
                    <p className="text-sm text-gray-600">Collect and trade virtual recipes</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Loyalty Adventures</h4>
                    <p className="text-sm text-gray-600">Gamified loyalty programs</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Virtual Restaurants</h4>
                    <p className="text-sm text-gray-600">Build and manage virtual restaurants</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nft-marketplace" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                NFT Food Marketplace
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Digital Food Assets</h3>
                <p className="text-gray-600 mb-6">
                  Trade and collect food-related NFTs and digital experiences
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Recipe NFTs</h4>
                    <p className="text-sm text-gray-600">Collectible digital recipes from famous chefs</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Virtual Restaurant Deeds</h4>
                    <p className="text-sm text-gray-600">Own virtual restaurant properties</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Chef Collaborations</h4>
                    <p className="text-sm text-gray-600">Limited edition chef experience NFTs</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Food Art Gallery</h4>
                    <p className="text-sm text-gray-600">Curated food photography and art NFTs</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
