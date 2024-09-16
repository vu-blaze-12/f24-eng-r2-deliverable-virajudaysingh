import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Species {
  scientific_name: string;
  common_name: string | null;
  total_population: number | null;
  kingdom: string;
  description: string | null;
}

interface SpeciesDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  species: Species | null;
}

export default function SpeciesDetailsDialog({ open, onClose, species }: SpeciesDetailsDialogProps) {
  if (!species) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Species Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Scientific Name</h3>
          <p>{species.scientific_name}</p>
          <h3 className="text-lg font-bold">Common Name</h3>
          <p>{species.common_name ?? "N/A"}</p>
          <h3 className="text-lg font-bold">Total Population</h3>
          <p>{species.total_population?.toLocaleString() ?? "N/A"}</p>
          <h3 className="text-lg font-bold">Kingdom</h3>
          <p>{species.kingdom}</p>
          <h3 className="text-lg font-bold">Description</h3>
          <p>{species.description ?? "N/A"}</p>
        </div>
        <div className="mt-4 flex">
          <DialogClose asChild>
            <Button type="button" className="flex-auto" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
