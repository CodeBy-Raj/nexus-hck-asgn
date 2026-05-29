
"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Lock, Unlock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { StudyRoom } from "@/types/study";

interface RoomCardProps {
  room: StudyRoom;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Card className="overflow-hidden bg-card/40 border-border/40 hover:border-primary/40 transition-all duration-300 group flex flex-col h-full">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image 
          src={room.imageUrl || `https://picsum.photos/seed/${room.id}/600/400`}
          alt={room.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-md border-none">
            {room.category}
          </Badge>
        </div>
      </div>
      <CardHeader className="p-5 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>{room.members.length} members</span>
          </div>
          {room.isPrivate ? (
            <Lock className="w-3.5 h-3.5 text-accent" />
          ) : (
            <Unlock className="w-3.5 h-3.5 text-primary" />
          )}
        </div>
        <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
          {room.title}
        </h3>
      </CardHeader>
      <CardContent className="p-5 pt-0 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {room.description}
        </p>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button asChild className="w-full group/btn" variant="secondary">
          <Link href={`/rooms/${room.id}`} className="flex items-center justify-center gap-2">
            Join Room
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
