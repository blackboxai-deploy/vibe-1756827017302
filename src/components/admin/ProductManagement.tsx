"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { usePOS } from '@/hooks/use-pos';
import { Product, ProductCategory } from '@/lib/types';

const categoryOptions = [
  { value: 'pizzas', label: 'Pizzas' },
  { value: 'traditional', label: 'Traditional' },
  { value: 'chippy', label: 'Chippy Favourites' },
  { value: 'specials', label: 'Specials' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'kids', label: 'Kids Meals' },
  { value: 'sides', label: 'Sides' },
  { value: 'drinks', label: 'Drinks' },
];

export function ProductManagement() {
  const { products, addProduct, updateProduct, deleteProduct } = usePOS();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '' as ProductCategory,
    description: '',
    image: '',
  });

  const allProducts = Object.values(products).reduce((acc, categoryProducts) => [...acc, ...categoryProducts], [] as Product[]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category || !formData.description || !formData.image) {
      alert('Please fill in all fields');
      return;
    }

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      description: formData.description,
      image: formData.image,
    };

    if (isEditing && editingId) {
      updateProduct(editingId, productData);
      alert('Product updated successfully!');
    } else {
      addProduct(productData);
      alert('Product added successfully!');
    }

    resetForm();
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category as ProductCategory,
      description: product.description,
      image: product.image,
    });
    setIsEditing(true);
    setEditingId(product.id);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      alert('Product deleted successfully!');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '' as ProductCategory,
      description: '',
      image: '',
    });
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Form */}
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Price (£)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value as ProductCategory })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/1673bfa3-59a6-4382-95e9-331fd3e1b48f.png"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Use placehold.co URLs for best results (will be auto-processed)
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {isEditing ? 'Update Product' : 'Add Product'}
                </Button>
                {isEditing && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Product List */}
        <Card>
          <CardHeader>
            <CardTitle>Current Products ({allProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {allProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No products added yet</p>
              ) : (
                <div className="space-y-3">
                  {allProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/1c742f89-8484-46f9-9c26-d27419ff4a3b.png';
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{product.name}</h3>
                            <Badge variant="secondary">
                              {categoryOptions.find(cat => cat.value === product.category)?.label}
                            </Badge>
                          </div>
                          <p className="text-lg font-bold text-green-600 mb-1">
                            £{product.price.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}