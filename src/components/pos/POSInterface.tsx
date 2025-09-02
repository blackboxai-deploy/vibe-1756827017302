"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ProductCategory, Product } from '@/lib/types';
import { usePOS } from '@/hooks/use-pos';

interface POSInterfaceProps {
  onLogout: () => void;
}

const categoryLabels: Record<ProductCategory, string> = {
  pizzas: 'Pizzas',
  traditional: 'Traditional',
  chippy: 'Chippy Favourites',
  specials: 'Specials',
  'gluten-free': 'Gluten-Free',
  kids: 'Kids Meals',
  sides: 'Sides',
  drinks: 'Drinks',
};

export function POSInterface({ onLogout }: POSInterfaceProps) {
  const {
    products,
    currentOrder,
    heldOrders,
    activeCategory,
    setActiveCategory,
    addToOrder,
    removeFromOrder,
    processPayment,
    holdOrder,
    recallOrder,
    updateOrderItemQuantity,
  } = usePOS();

  const handlePayment = (method: 'cash' | 'card') => {
    const success = processPayment(method);
    if (success) {
      alert(`Payment processed successfully via ${method.toUpperCase()}!\nTotal: £${currentOrder.total.toFixed(2)}`);
    } else {
      alert('No items in order!');
    }
  };

  const handleHoldOrder = () => {
    const success = holdOrder();
    if (success) {
      alert('Order held successfully!');
    } else {
      alert('No items to hold!');
    }
  };

  const handleRecallOrder = () => {
    if (heldOrders.length === 0) {
      alert('No held orders available!');
      return;
    }
    
    // For simplicity, recall the most recent held order
    const mostRecent = heldOrders[heldOrders.length - 1];
    const success = recallOrder(mostRecent.id);
    if (success) {
      alert('Order recalled successfully!');
    }
  };

  const handlePrintReceipt = () => {
    if (currentOrder.items.length === 0) {
      alert('No order to print!');
      return;
    }
    
    let receipt = 'FUSION EATS\\n';
    receipt += '================\\n\\n';
    currentOrder.items.forEach(item => {
      receipt += `${item.product.name} x${item.quantity}\\n`;
      receipt += `£${(item.product.price * item.quantity).toFixed(2)}\\n`;
    });
    receipt += '\\n================\\n';
    receipt += `TOTAL: £${currentOrder.total.toFixed(2)}\\n`;
    receipt += `Time: ${new Date().toLocaleString()}\\n`;
    
    alert(receipt);
  };

  return (
    <div className="flex h-screen bg-white/5">
      {/* Left Panel - Products */}
      <div className="flex-1 p-6 bg-white/95 backdrop-blur-sm">
        {/* Category Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {(Object.keys(categoryLabels) as ProductCategory[]).map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className={`h-12 ${
                activeCategory === category 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'hover:bg-blue-50'
              }`}
            >
              {categoryLabels[category]}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products[activeCategory]?.map((product: Product) => (
              <Card 
                key={product.id} 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                onClick={() => addToOrder(product)}
              >
                <CardContent className="p-4">
                  <img
                    src={product.image}
                    alt={product.description}
                    className="w-full h-32 object-cover rounded-md mb-3"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/93f95fc5-e283-464b-9f31-ef6416e440e8.png';
                    }}
                  />
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-green-600 mb-2">
                    £{product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Order */}
      <div className="w-96 p-6 bg-white/90 backdrop-blur-sm flex flex-col">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Current Order</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <ScrollArea className="flex-1 mb-4">
              {currentOrder.items.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No items in order</p>
              ) : (
                <div className="space-y-2">
                  {currentOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">
                          £{item.product.price.toFixed(2)} each
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateOrderItemQuantity(item.id, item.quantity - 1)}
                            className="h-6 w-6 p-0"
                          >
                            -
                          </Button>
                          <Badge variant="secondary">
                            {item.quantity}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateOrderItemQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 p-0"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          £{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromOrder(item.id)}
                          className="mt-1"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <Separator className="mb-4" />
            
            <div className="mb-6">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-green-600">£{currentOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handlePayment('cash')}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={currentOrder.items.length === 0}
                >
                  Cash
                </Button>
                <Button
                  onClick={() => handlePayment('card')}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={currentOrder.items.length === 0}
                >
                  Card
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  onClick={handleHoldOrder}
                  disabled={currentOrder.items.length === 0}
                >
                  Hold
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRecallOrder}
                  disabled={heldOrders.length === 0}
                >
                  Recall
                </Button>
                <Button
                  variant="outline"
                  onClick={handlePrintReceipt}
                  disabled={currentOrder.items.length === 0}
                >
                  Receipt
                </Button>
              </div>

              <Button
                variant="destructive"
                onClick={onLogout}
                className="w-full"
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