import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import msape from "../../../public/assetss/images/mpesa.jpg"
import btc from "../../../public/assetss/images/bitcoin.jpg"

export function Subscription() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="btn-grad">Activate Plan</Button>
      </DialogTrigger>
      <DialogContent className="psycho">
        <DialogHeader>
          <DialogTitle>Go premium</DialogTitle>
          <DialogDescription>
            Choose your preferd Payment Service
          </DialogDescription>
        </DialogHeader>
          <div className="ww">
            <div className="pay-options">
              <Button className="firm">
                <img 
                  src={msape}
                  alt="Mpesa"
                  className="someday"
                />
              </Button>

              <Button className="firm">
                <img 
                  src={btc}
                  alt="Btc"
                  className="someday"
                />
              </Button>
            </div>
            <div className="pay-options">
              w
            </div>
          </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="btn-grad">Choose Another plan</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
