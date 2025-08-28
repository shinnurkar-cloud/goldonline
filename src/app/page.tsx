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
import { Gem, Clock, User, Lock, LogIn, LogOut, Save, KeyRound, AlertCircle, ArrowUp, ArrowDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


interface PriceUpdate {
  price: number;
  date: Date;
}

type AuthView = 'login' | 'forgot_password';

export default function GoldenEyePage() {
  const { toast } = useToast();

  // Component mount state to avoid hydration errors
  const [isMounted, setIsMounted] = useState(false);

  // Core app state
  const [priceHistory, setPriceHistory] = useState<PriceUpdate[]>([]);
  
  // Admin state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState("password123");
  const masterPassword = "gold123";
  const [authView, setAuthView] = useState<AuthView>('login');

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
    // Initialize with a starting price if history is empty
    if (priceHistory.length === 0) {
        setPriceHistory([{ price: 72500.00, date: new Date() }]);
    }
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
    setAuthView('login');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handlePriceUpdate = (e: FormEvent) => {
    e.preventDefault();
    const priceValue = parseFloat(newPrice);
    if (!isNaN(priceValue) && priceValue > 0) {
      const newUpdate: PriceUpdate = { price: priceValue, date: new Date() };
      setPriceHistory(prevHistory => [newUpdate, ...prevHistory]);
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
        description: "Old or Master password is incorrect.",
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
    setAuthView('login'); // Go back to login view after successful password change
    toast({
      title: "Success",
      description: "Your password has been changed. Please log in.",
    });
  };
  
  const currentPrice = priceHistory[0]?.price ?? 0;
  const lastUpdated = priceHistory[0]?.date ?? null;
  const recentUpdates = priceHistory.slice(0, 6); // Get last 6 to show 5 changes

  if (!isMounted) {
    return null; // Or a loading skeleton
  }

  const renderAuthCard = () => {
    if (isLoggedIn) {
      return (
        <>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-headline text-primary">Admin Panel</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-accent">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
            <CardDescription>Update price and manage settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handlePriceUpdate} className="space-y-4 p-4 border rounded-lg bg-background/50">
               <h3 className="font-semibold text-secondary">Update Gold Price</h3>
               <div className="space-y-2">
                <Label htmlFor="newPrice">New Price (per 10g)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
                  <Input id="newPrice" type="number" step="0.01" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="e.g., 73000.00" required className="pl-8 bg-accent/50" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
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
                   <h3 className="font-semibold text-secondary">Change Admin Password</h3>
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">Old or Master Password</Label>
                    <Input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required  className="bg-accent/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="bg-accent/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required className="bg-accent/50" />
                  </div>
                  <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    <Save className="mr-2 h-4 w-4" /> Save New Password
                  </Button>
                </form>
              )}
            </div>
          </CardContent>
        </>
      )
    }

    if (authView === 'forgot_password') {
       return (
          <form onSubmit={handleChangePassword}>
            <CardHeader>
              <CardTitle className="text-2xl font-headline text-primary">Reset Password</CardTitle>
              <CardDescription>Reset your password using the master key.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Master Password</Label>
                <Input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required  className="bg-accent/50" />
                 <p className="text-xs text-muted-foreground flex items-center gap-1.5"><AlertCircle className="h-3 w-3"/>The default master password is: <code className="font-mono bg-muted text-muted-foreground px-1 py-0.5 rounded">{masterPassword}</code></p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Admin Password</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="bg-accent/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required className="bg-accent/50" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Save className="mr-2 h-4 w-4" /> Set New Password
              </Button>
              <Button variant="link" size="sm" onClick={() => { setAuthView('login'); setOldPassword(""); setNewPassword(""); setConfirmNewPassword(""); }}>
                Back to Login
              </Button>
            </CardFooter>
          </form>
       )
    }

    return (
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
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" required className="pl-10 bg-accent/50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
             <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10 bg-accent/50" />
            </div>
             <div className="flex justify-end pt-1">
                <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setAuthView('forgot_password')}>
                  Forgot Password?
                </Button>
             </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <LogIn className="mr-2 h-4 w-4" /> Login
          </Button>
        </CardFooter>
      </form>
    );
  }

  return (
      <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
        <header className="py-6 border-b border-border">
          <div className="container mx-auto flex items-center justify-center gap-3">
            <Gem className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold font-headline tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              GoldenEye
            </h1>
          </div>
        </header>

        <main className="flex-grow container mx-auto p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="space-y-8">
                <Card className="shadow-lg border-primary/20 bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline text-primary">Current Gold Price</CardTitle>
                        <CardDescription>Price in Rupees per 10 grams</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center gap-4 text-center">
                        <p className="text-6xl font-bold">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(currentPrice)}
                        </p>
                        <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Last updated: {lastUpdated?.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        </div>
                    </CardContent>
                </Card>
                {recentUpdates.length > 1 && (
                <Card className="shadow-lg border-primary/20 bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-headline text-primary">Recent Price History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border">
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-center">Change</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentUpdates.slice(0, 5).map((update, index) => {
                                    const prevUpdate = recentUpdates[index + 1];
                                    if (!prevUpdate) return null;
                                    const priceChange = update.price - prevUpdate.price;
                                    return (
                                        <TableRow key={update.date.toISOString()} className="border-border">
                                            <TableCell className="text-xs text-muted-foreground">{update.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                            <TableCell className="text-right font-medium">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(update.price)}</TableCell>
                                            <TableCell className="flex justify-center items-center">
                                                {priceChange > 0 ? (
                                                    <ArrowUp className="h-4 w-4 text-green-500" />
                                                ) : priceChange < 0 ? (
                                                    <ArrowDown className="h-4 w-4 text-red-500" />
                                                ) : (
                                                    <span className="h-4 w-4" />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                )}
            </div>

            <Card className="shadow-lg border-primary/20 bg-card/80 backdrop-blur-sm">
              {renderAuthCard()}
            </Card>
          </div>
        </main>

        <footer className="py-4 mt-8 border-t border-border">
            <div className="container mx-auto text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} GoldenEye. All rights reserved.</p>
            </div>
        </footer>
      </div>
  );
}
