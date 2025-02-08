'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Delete, LucideDelete } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
 
 
export default function DeletePlanDialog(){
    const [isOpen, setisOpen] = useState(false)
    return <Dialog open={isOpen} >
        <DialogTrigger asChild>
            <LucideDelete color="red" size={15} onClick={()=>setisOpen(true)}/>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Title</DialogTitle>
                <DialogDescription>Description</DialogDescription>
            </DialogHeader>
           <div>Are you sure you want to delete</div>
           <DialogFooter>
            <Button variant='destructive' onClick={()=> {setisOpen(!isOpen) 
                toast.success('Day plan deleted successfully')
            }}>Delete</Button>
           </DialogFooter>
        </DialogContent>
    </Dialog>
}
