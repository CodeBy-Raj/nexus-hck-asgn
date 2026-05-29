
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Camera, Mail, Target, Shield, Settings as SettingsIcon, BrainCircuit } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';
  
  const userRef = user ? doc(db, 'users', user.uid) : null;
  const { data: profile, loading: profileLoading } = useDoc(userRef as any);

  const [formData, setFormData] = useState({
    displayName: '',
    photoURL: '',
    bio: '',
    weeklyGoal: 15
  });
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        photoURL: profile.photoURL || '',
        bio: profile.bio || '',
        weeklyGoal: profile.weeklyGoal || 15
      });
    }
  }, [profile]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && (tab === 'profile' || tab === 'settings' || tab === 'security')) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleSave = async () => {
    if (!userRef) return;
    setIsSaving(true);
    try {
      await updateDoc(userRef, {
        displayName: formData.displayName,
        photoURL: formData.photoURL,
        bio: formData.bio,
        weeklyGoal: formData.weeklyGoal,
        updatedAt: new Date().toISOString()
      });
      toast({ title: 'Nexus Profile Updated', description: 'Your identity and preferences have been synchronized.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sync Failed', description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">
            Scholar Identity
          </h1>
          <p className="text-muted-foreground">Manage your credentials and workspace parameters.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/30 border border-white/5 p-1">
          <TabsTrigger value="profile" className="gap-2 rounded-lg text-xs h-9">
            <User className="w-3.5 h-3.5" /> Public Profile
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 rounded-lg text-xs h-9">
            <SettingsIcon className="w-3.5 h-3.5" /> Workspace
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 rounded-lg text-xs h-9">
            <Shield className="w-3.5 h-3.5" /> Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="glass-morphism border-white/5 overflow-hidden">
            <CardHeader className="text-center pb-8 border-b border-white/5 bg-white/[0.02]">
              <div className="flex justify-center mb-4">
                <div className="relative group">
                  <Avatar className="w-28 h-28 border-2 border-primary/20 shadow-2xl">
                    <AvatarImage src={formData.photoURL} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {formData.displayName?.[0] || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <button 
                    className="absolute bottom-0 right-0 p-2.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform"
                    onClick={() => setFormData(prev => ({ ...prev, photoURL: `https://picsum.photos/seed/${Math.random()}/200/200` }))}
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <CardTitle className="text-2xl">{formData.displayName || 'Unnamed Scholar'}</CardTitle>
              <CardDescription className="font-mono text-[10px] uppercase tracking-widest">{user?.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Display Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="displayName" 
                      value={formData.displayName} 
                      onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))} 
                      className="pl-10 bg-background/40 border-white/10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photoURL" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Avatar Source</Label>
                  <Input 
                    id="photoURL" 
                    value={formData.photoURL} 
                    onChange={(e) => setFormData(prev => ({ ...prev, photoURL: e.target.value }))} 
                    className="bg-background/40 border-white/10 font-mono text-[10px]"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Scholar Bio</Label>
                <Textarea 
                  id="bio" 
                  value={formData.bio} 
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))} 
                  placeholder="Focusing on quantum algorithms and deep neural networks..."
                  className="min-h-[120px] bg-background/40 border-white/10"
                />
              </div>
            </CardContent>
            <CardFooter className="bg-white/5 border-t border-white/5 p-6 flex justify-end">
              <Button 
                onClick={handleSave} 
                disabled={isSaving || !formData.displayName.trim()}
                className="gap-2 h-11 px-8 rounded-xl"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
                Sync Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="glass-morphism border-white/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-primary">
                <Target className="w-5 h-5" /> Focus Projections
              </CardTitle>
              <CardDescription>Configure your weekly study milestones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <Label className="text-sm font-bold">Weekly Study Target</Label>
                    <p className="text-xs text-muted-foreground">How many hours do you intend to focus this week?</p>
                  </div>
                  <span className="text-2xl font-bold text-primary tabular-nums">{formData.weeklyGoal}h</span>
                </div>
                <Slider 
                  value={[formData.weeklyGoal]} 
                  min={1} 
                  max={100} 
                  step={1} 
                  onValueChange={(val) => setFormData(prev => ({ ...prev, weeklyGoal: val[0] }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
                  <span className="text-xs font-medium">Automatic Focus Mode</span>
                  <div className="w-8 h-4 bg-primary/20 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-primary rounded-full" /></div>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
                  <span className="text-xs font-medium">Desktop Notifications</span>
                  <div className="w-8 h-4 bg-muted rounded-full relative"><div className="absolute left-0.5 top-0.5 w-3 h-3 bg-background rounded-full" /></div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-white/5 border-t border-white/5 p-6 flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} className="rounded-xl h-11 px-8">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-destructive/20 bg-destructive/5 overflow-hidden">
            <CardHeader className="bg-destructive/10">
              <CardTitle className="text-lg text-destructive flex items-center gap-2">
                <Shield className="w-5 h-5" /> Dangerous Area
              </CardTitle>
              <CardDescription className="text-destructive/70">Sensitive operations related to account security.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/20">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">Password Reset</p>
                  <p className="text-xs text-muted-foreground">Receive an email to securely change your password.</p>
                </div>
                <Button variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10 rounded-lg">
                  Reset
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/20">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">Data Purge</p>
                  <p className="text-xs text-muted-foreground">Permanently delete your profile and study records.</p>
                </div>
                <Button variant="destructive" className="rounded-lg">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
