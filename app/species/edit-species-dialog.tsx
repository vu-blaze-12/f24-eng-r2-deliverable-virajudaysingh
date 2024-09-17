"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Initialize Supabase client directly
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are missing");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define the validation schema with Zod
const formSchema = z.object({
  scientific_name: z.string().min(1, { message: "Scientific name is required" }),
  common_name: z.string().nullable(),
  total_population: z.number().nullable(),
  description: z.string().nullable(),
});

type FormData = z.infer<typeof formSchema>;
type Species = Database["public"]["Tables"]["species"]["Row"];

interface EditSpeciesDialogProps {
  species: Species;
}

export default function EditSpeciesDialog({ species }: EditSpeciesDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scientific_name: species.scientific_name,
      common_name: species.common_name ?? "",
      total_population: species.total_population ?? null,
      description: species.description ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.from("species").update(data).eq("id", species.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Species Updated",
        description: `${data.scientific_name} has been updated successfully.`,
      });
      setOpen(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit Species</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Species</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit(onSubmit)(e);
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="scientific_name" className="block text-sm font-medium text-gray-700">
                Scientific Name
              </label>
              <Input {...register("scientific_name")} id="scientific_name" />
              {errors.scientific_name && <p className="text-red-500">{errors.scientific_name.message}</p>}
            </div>

            <div>
              <label htmlFor="common_name" className="block text-sm font-medium text-gray-700">
                Common Name
              </label>
              <Input {...register("common_name")} id="common_name" />
              {errors.common_name && <p className="text-red-500">{errors.common_name.message}</p>}
            </div>

            <div>
              <label htmlFor="total_population" className="block text-sm font-medium text-gray-700">
                Total Population
              </label>
              <Input {...register("total_population")} id="total_population" type="number" />
              {errors.total_population && <p className="text-red-500">{errors.total_population.message}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea {...register("description")} id="description" />
              {errors.description && <p className="text-red-500">{errors.description.message}</p>}
            </div>

            <div className="flex justify-end">
              <Button type="button" variant="secondary" className="mr-2" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
