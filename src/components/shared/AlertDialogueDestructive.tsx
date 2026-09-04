import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2Icon } from "lucide-react"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom";

export function AlertDialogDestructive() {
  const navigate = useNavigate();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Discard Changes</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>
            Yo 😅 you didn’t save this.
            Leave and your changes disappear.
            </AlertDialogTitle>
          {/*
          <AlertDialogDescription>
           You're about to delete this post. View{" "}
            <a href="#">Details</a> Are you sure you want to delete this post?.
          </AlertDialogDescription>
          */}
          <AlertDialogDescription>
            Discard changes?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Stay</AlertDialogCancel>
          <AlertDialogAction 
            variant="destructive"     
            className="submittt-btn"
            onClick={() => navigate(-1)}
            >
            Discard
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
