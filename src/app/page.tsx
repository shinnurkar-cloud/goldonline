"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Gem, Clock, User, Lock, LogIn, LogOut, Save, KeyRound, AlertCircle } from "lucide-react";

export default function GoldenEyePage() {
  const { toast } = useToast();

  // Component mount state to avoid hydration errors
  const [isMounted, setIsMounted] = useState(false);

  // Core app state
  const [goldPrice, setGoldPrice] = useState(72500.00);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Admin state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState("password123");
  const masterPassword = "gold123";

  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setLastUpdated(new Date());
  }, []);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === adminPassword) {
      setIsLoggedIn(true);
      setPassword("");
      toast({
        title: "Login Successful",
        description: "Welcome, Admin!",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid username or password.",
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowPasswordChange(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handlePriceUpdate = (e: FormEvent) => {
    e.preventDefault();
    const priceValue = parseFloat(newPrice);
    if (!isNaN(priceValue) && priceValue > 0) {
      setGoldPrice(priceValue);
      setLastUpdated(new Date());
      setNewPrice("");
      toast({
        title: "Price Updated",
        description: `Gold price is now ₹${priceValue.toLocaleString('en-IN')}.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Price",
        description: "Please enter a valid positive number.",
      });
    }
  };

  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault();
    if (oldPassword !== adminPassword && oldPassword !== masterPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Old password is incorrect.",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New password must be at least 6 characters long.",
      });
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New passwords do not match.",
      });
      return;
    }

    setAdminPassword(newPassword);
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowPasswordChange(false);
    toast({
      title: "Success",
      description: "Your password has been changed.",
    });
  };

  if (!isMounted) {
    return null; // Or a loading skeleton
  }

  return (
      <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
        <header className="py-6">
          <div className="container mx-auto flex items-center justify-center gap-3">
            <Gem className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl font-bold font-headline tracking-tight">
              GoldenEye
            </h1>
          </div>
        </header>

        <main className="flex-grow container mx-auto p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="shadow-lg border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-2xl font-headline text-primary">Current Gold Price</CardTitle>
                <CardDescription>Price in Rupees per 10 grams</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-4 text-center">
                <p className="text-6xl font-bold text-gray-800" style={{color: 'hsl(var(--foreground))'}}>
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(goldPrice)}
                </p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Last updated: {lastUpdated?.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-yellow-500/20">
              {!isLoggedIn ? (
                <form onSubmit={handleLogin}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-headline text-primary">Admin Login</CardTitle>
                    <CardDescription>Access the administrative panel</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" required className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                       <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full">
                      <LogIn className="mr-2 h-4 w-4" /> Login
                    </Button>
                  </CardFooter>
                </form>
              ) : (
                <>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-2xl font-headline text-primary">Admin Panel</CardTitle>
                      <Button variant="ghost" size="sm" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </Button>
                    </div>
                    <CardDescription>Update price and manage settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form onSubmit={handlePriceUpdate} className="space-y-4 p-4 border rounded-lg bg-background/50">
                       <h3 className="font-semibold">Update Gold Price</h3>
                       <div className="space-y-2">
                        <Label htmlFor="newPrice">New Price (per 10g)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
                          <Input id="newPrice" type="number" step="0.01" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="e.g., 73000.00" required className="pl-8" />
                        </div>
                      </div>
                      <Button type="submit" className="w-full">
                        <Save className="mr-2 h-4 w-4" /> Update Price
                      </Button>
                    </form>

                    <Separator />

                    <div>
                      <Button variant="outline" className="w-full" onClick={() => setShowPasswordChange(!showPasswordChange)}>
                        <KeyRound className="mr-2 h-4 w-4" /> Change Password
                      </Button>
                    
                      {showPasswordChange && (
                        <form onSubmit={handleChangePassword} className="mt-4 space-y-4 p-4 border rounded-lg bg-background/50">
                           <h3 className="font-semibold">Change Admin Password</h3>
                          <div className="space-y-2">
                            <Label htmlFor="oldPassword">Old Password</Label>
                            <Input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5"><AlertCircle className="h-3 w-3"/>Forgot password? Use master password: <code className="font-mono bg-muted px-1 py-0.5 rounded">{masterPassword}</code></p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                            <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
                          </div>
                          <Button type="submit" className="w-full">
                            <Save className="mr-2 h-4 w-4" /> Save New Password
                          </Button>
                        </form>
                      )}
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        </main>

        <footer className="py-4 mt-8">
            <div className="container mx-auto text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} GoldenEye. All rights reserved.</p>
            </div>
        </footer>
      </div>
  );
}
