'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2 } from 'lucide-react';

const roomSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  maxMembers: z.coerce.number().min(2).max(50),
});

type RoomFormValues = z.infer<typeof roomSchema>;

const CATEGORIES = ['Coding', 'Design', 'Marketing', 'Business', 'Languages', 'Science'];

export function CreateRoomDialog({ children }: { children?: React.ReactNode }) {
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      maxMembers: 10,
    }
  });

  const onSubmit = async (data: RoomFormValues) => {
    if (!db || !user) return;
    setIsSubmitting(true);
    
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
      const roomRef = await addDoc(collection(db, 'rooms'), {
        ...data,
        ownerId: user.uid,
        inviteCode,
        members: [user.uid],
        createdAt: serverTimestamp(),
        isActive: true,
        imageUrl: `https://picsum.photos/seed/${inviteCode}/600/400`,
      });

      // Log initial system activity to chat
      addDoc(collection(db, 'rooms', roomRef.id, 'messages'), {
        senderId: 'system',
        senderName: 'Nexus AI',
        content: `Nexus Study Hub "${data.title}" was established by ${user.displayName || 'a scholar'}.`,
        timestamp: serverTimestamp(),
        type: 'system'
      });

      // Log structural telemetry
      addDoc(collection(db, 'rooms', roomRef.id, 'logs'), {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        action: 'Room created',
        timestamp: serverTimestamp(),
      });

      toast({ title: 'Room Created!', description: `Your invite code is ${inviteCode}` });
      setOpen(false);
      reset();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Create Room
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="glass-morphism border-white/10 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Study Hub</DialogTitle>
          <DialogDescription>Create a collaborative space for your team.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Room Title</Label>
            <Input id="title" placeholder="Advanced Quantum Mechanics" {...register('title')} disabled={isSubmitting} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select onValueChange={(val) => setValue('category', val)} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxMembers">Max Members</Label>
              <Input id="maxMembers" type="number" {...register('maxMembers')} disabled={isSubmitting} />
              {errors.maxMembers && <p className="text-xs text-destructive">{errors.maxMembers.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Summary</Label>
            <Textarea 
              id="description" 
              placeholder="Deep dive into wave functions and particle physics..." 
              className="min-h-[100px]"
              {...register('description')} 
              disabled={isSubmitting}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Launch Hub'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}