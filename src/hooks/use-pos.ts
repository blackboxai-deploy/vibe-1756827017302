"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  Product, 
  Order, 
  OrderItem, 
  ProductCategory, 
  Staff, 
  SalesData, 
  SystemSettings,
  Transaction,
  AuthState 
} from '@/lib/types';
import {
  getProducts,
  setProducts,
  getHeldOrders,
  setHeldOrders,
  getStaff,
  setStaff,
  getSalesData,
  setSalesData,
  getSettings,
  setSettings,
  getCurrentOrder,
  setCurrentOrder,
  initializeStorage,
} from '@/lib/storage';

export const usePOS = () => {
  const [products, setProductsState] = useState<Record<ProductCategory, Product[]>>({} as Record<ProductCategory, Product[]>);
  const [currentOrder, setCurrentOrderState] = useState<Order>({
    id: '',
    items: [],
    total: 0,
    timestamp: new Date(),
    status: 'current',
  });
  const [heldOrders, setHeldOrdersState] = useState<Order[]>([]);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('pizzas');
  const [staff, setStaffState] = useState<Staff[]>([]);
  const [salesData, setSalesDataState] = useState<SalesData>({
    dailySales: 0,
    cumulativeSales: 0,
    transactions: [],
  });
  const [settings, setSettingsState] = useState<SystemSettings>({
    staffPassword: 'staff123',
    adminPassword: 'admin123',
  });
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userType: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize data from localStorage
  useEffect(() => {
    initializeStorage();
    setProductsState(getProducts());
    setHeldOrdersState(getHeldOrders());
    setStaffState(getStaff());
    setSalesDataState(getSalesData());
    setSettingsState(getSettings());
    
    const savedOrder = getCurrentOrder();
    if (savedOrder) {
      setCurrentOrderState(savedOrder);
    } else {
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        items: [],
        total: 0,
        timestamp: new Date(),
        status: 'current',
      };
      setCurrentOrderState(newOrder);
    }
    
    setIsLoaded(true);
  }, []);

  // Save current order whenever it changes
  useEffect(() => {
    if (isLoaded) {
      setCurrentOrder(currentOrder);
    }
  }, [currentOrder, isLoaded]);

  // Product management
  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now(),
    };
    
    const updatedProducts = {
      ...products,
      [product.category as ProductCategory]: [
        ...products[product.category as ProductCategory],
        newProduct,
      ],
    };
    
    setProductsState(updatedProducts);
    setProducts(updatedProducts);
  }, [products]);

  const updateProduct = useCallback((id: number, updatedProduct: Omit<Product, 'id'>) => {
    const updatedProducts = { ...products };
    
    // Remove from all categories first
    Object.keys(updatedProducts).forEach((category) => {
      updatedProducts[category as ProductCategory] = updatedProducts[category as ProductCategory].filter(p => p.id !== id);
    });
    
    // Add to correct category
    const product: Product = { ...updatedProduct, id };
    updatedProducts[updatedProduct.category as ProductCategory] = [
      ...updatedProducts[updatedProduct.category as ProductCategory],
      product,
    ];
    
    setProductsState(updatedProducts);
    setProducts(updatedProducts);
  }, [products]);

  const deleteProduct = useCallback((id: number) => {
    const updatedProducts = { ...products };
    
    Object.keys(updatedProducts).forEach((category) => {
      updatedProducts[category as ProductCategory] = updatedProducts[category as ProductCategory].filter(p => p.id !== id);
    });
    
    setProductsState(updatedProducts);
    setProducts(updatedProducts);
  }, [products]);

  // Order management
  const addToOrder = useCallback((product: Product) => {
    const existingItemIndex = currentOrder.items.findIndex(
      item => item.product.id === product.id
    );
    
    let updatedItems: OrderItem[];
    
    if (existingItemIndex >= 0) {
      updatedItems = [...currentOrder.items];
      updatedItems[existingItemIndex].quantity += 1;
    } else {
      const newItem: OrderItem = {
        product,
        quantity: 1,
        id: `item-${Date.now()}`,
      };
      updatedItems = [...currentOrder.items, newItem];
    }
    
    const total = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    setCurrentOrderState({
      ...currentOrder,
      items: updatedItems,
      total,
    });
  }, [currentOrder]);

  const removeFromOrder = useCallback((itemId: string) => {
    const updatedItems = currentOrder.items.filter(item => item.id !== itemId);
    const total = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    setCurrentOrderState({
      ...currentOrder,
      items: updatedItems,
      total,
    });
  }, [currentOrder]);

  const updateOrderItemQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(itemId);
      return;
    }
    
    const updatedItems = currentOrder.items.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    );
    const total = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    setCurrentOrderState({
      ...currentOrder,
      items: updatedItems,
      total,
    });
  }, [currentOrder, removeFromOrder]);

  const clearOrder = useCallback(() => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      items: [],
      total: 0,
      timestamp: new Date(),
      status: 'current',
    };
    setCurrentOrderState(newOrder);
  }, []);

  const holdOrder = useCallback(() => {
    if (currentOrder.items.length === 0) return false;
    
    const heldOrder: Order = {
      ...currentOrder,
      status: 'held',
    };
    
    const updatedHeldOrders = [...heldOrders, heldOrder];
    setHeldOrdersState(updatedHeldOrders);
    setHeldOrders(updatedHeldOrders);
    clearOrder();
    return true;
  }, [currentOrder, heldOrders, clearOrder]);

  const recallOrder = useCallback((orderId: string) => {
    const orderToRecall = heldOrders.find(order => order.id === orderId);
    if (!orderToRecall) return false;
    
    const updatedHeldOrders = heldOrders.filter(order => order.id !== orderId);
    setHeldOrdersState(updatedHeldOrders);
    setHeldOrders(updatedHeldOrders);
    
    setCurrentOrderState({
      ...orderToRecall,
      status: 'current',
    });
    return true;
  }, [heldOrders]);

  // Payment processing
  const processPayment = useCallback((paymentMethod: 'cash' | 'card') => {
    if (currentOrder.items.length === 0 || currentOrder.total <= 0) return false;
    
    const transaction: Transaction = {
      id: `trans-${Date.now()}`,
      amount: currentOrder.total,
      paymentMethod,
      timestamp: new Date(),
      items: currentOrder.items,
    };
    
    const updatedSalesData: SalesData = {
      dailySales: salesData.dailySales + currentOrder.total,
      cumulativeSales: salesData.cumulativeSales + currentOrder.total,
      transactions: [...salesData.transactions, transaction],
    };
    
    setSalesDataState(updatedSalesData);
    setSalesData(updatedSalesData);
    clearOrder();
    return true;
  }, [currentOrder, salesData, clearOrder]);

  // Staff management
  const addStaff = useCallback((staffMember: Omit<Staff, 'id'>) => {
    const newStaff: Staff = {
      ...staffMember,
      id: Date.now(),
    };
    
    const updatedStaff = [...staff, newStaff];
    setStaffState(updatedStaff);
    setStaff(updatedStaff);
  }, [staff]);

  const deleteStaff = useCallback((id: number) => {
    const updatedStaff = staff.filter(s => s.id !== id);
    setStaffState(updatedStaff);
    setStaff(updatedStaff);
  }, [staff]);

  // Settings management
  const updateSettings = useCallback((newSettings: Partial<SystemSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettingsState(updatedSettings);
    setSettings(updatedSettings);
  }, [settings]);

  // Authentication
  const login = useCallback((password: string, userType: 'staff' | 'admin') => {
    const correctPassword = userType === 'staff' ? settings.staffPassword : settings.adminPassword;
    if (password === correctPassword) {
      setAuthState({ isAuthenticated: true, userType });
      return true;
    }
    return false;
  }, [settings]);

  const logout = useCallback(() => {
    setAuthState({ isAuthenticated: false, userType: null });
    clearOrder();
  }, [clearOrder]);

  // Reports
  const generateXReport = useCallback(() => {
    return {
      dailySales: salesData.dailySales,
      transactionCount: salesData.transactions.length,
      timestamp: new Date(),
    };
  }, [salesData]);

  const generateZReport = useCallback(() => {
    const report = {
      cumulativeSales: salesData.cumulativeSales,
      transactionCount: salesData.transactions.length,
      timestamp: new Date(),
    };
    
    // Reset cumulative data after Z report
    const resetSalesData: SalesData = {
      dailySales: 0,
      cumulativeSales: 0,
      transactions: [],
    };
    
    setSalesDataState(resetSalesData);
    setSalesData(resetSalesData);
    
    return report;
  }, [salesData]);

  return {
    // State
    products,
    currentOrder,
    heldOrders,
    activeCategory,
    staff,
    salesData,
    settings,
    authState,
    isLoaded,
    
    // Category management
    setActiveCategory,
    
    // Product management
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Order management
    addToOrder,
    removeFromOrder,
    updateOrderItemQuantity,
    clearOrder,
    holdOrder,
    recallOrder,
    
    // Payment
    processPayment,
    
    // Staff management
    addStaff,
    deleteStaff,
    
    // Settings
    updateSettings,
    
    // Authentication
    login,
    logout,
    
    // Reports
    generateXReport,
    generateZReport,
  };
};