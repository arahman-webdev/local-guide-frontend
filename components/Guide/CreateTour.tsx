"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "../sharedComponent/MultipleImagesUploading";

const categories = [
  "FOOD",
  "ART",
  "ADVENTURE",
  "HISTORY",
  "NIGHTLIFE",
  "NATURE",
  "WILDLIFE",
  "SHOPPING",
  "HERITAGE",
  "OTHER",
];



export const tourSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  description: z.string().min(10, "Description is too short"),
  itinerary: z.string().min(10),
  fee: z.string().min(1),
  duration: z.string().min(1),
  meetingPoint: z.string().min(2),
  maxGroupSize: z.string().min(1),
  minGroupSize: z.string().min(1),
  category: z.string().min(1),
  language: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  tags: z.string().optional(),
});


export default function CreateTour() {
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof tourSchema>>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      minGroupSize: "1",
    },
  });

  const onSubmit = async (values: z.infer<typeof tourSchema>) => {
    try {
      setLoading(true);

      // 👉 Must be FormData for multer  
      const formData = new FormData();
      formData.append("data", JSON.stringify(values));

      images.forEach((img) => {
        formData.append("images", img);
      });

      const res = await fetch("http://localhost:5000/api/tour", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await res.json();

      // Backend validation errors
      if (!res.ok) {
        toast.error(result.message || "Validation error");
        return;
      }

      toast.success("Tour created successfully!");
      form.reset();
      setImages([]);

    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="bg-white shadow-md rounded-xl p-8 border border-blue-200">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">
        Create New Tour
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Title */}
        <div>
          <Input
            {...register("title")}
            placeholder="Hidden Jazz Bars of New Orleans"
            className="border-purple-300 focus:border-purple-500"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <Textarea
            {...register("description")}
            rows={4}
            placeholder="Detailed description..."
            className="border-purple-300 focus:border-purple-500"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Itinerary */}
        <div>
          <Textarea
            {...register("itinerary")}
            rows={4}
            placeholder="Itinerary"
            className="border-purple-300 focus:border-purple-500"
          />
        </div>

        {/* Fee */}
        <div>
          <Input
            type="number"
            {...register("fee")}
            placeholder="99"
            className="border-purple-300 focus:border-purple-500"
          />
        </div>

        {/* Duration */}
        <div>
          <Input
            type="number"
            {...register("duration")}
            placeholder="Duration in hours"
            className="border-purple-300 focus:border-purple-500"
          />
        </div>

        {/* Meeting Point */}
        <div>
          <Input
            {...register("meetingPoint")}
            placeholder="Downtown Manhattan"
            className="border-purple-300 focus:border-purple-500"
          />
        </div>

        {/* Group size */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            {...register("maxGroupSize")}
            placeholder="Max group"
            type="number"
            className="border-purple-300 focus:border-purple-500"
          />

          <Input
            {...register("minGroupSize")}
            type="number"
            className="border-purple-300 focus:border-purple-500"
          />
        </div>

        {/* Category */}
        <div>
          <Select
            onValueChange={(v) => form.setValue("category", v)}
          >
            <SelectTrigger className="border-purple-300">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>

            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>

        {/* Language / city / country */}
        <div className="grid grid-cols-3 gap-4">
          <Input
            {...register("language")}
            placeholder="English"
            className="border-purple-300 focus:border-purple-500"
          />

          <Input
            {...register("city")}
            placeholder="Paris"
            className="border-purple-300 focus:border-purple-500"
          />

          <Input
            {...register("country")}
            placeholder="France"
            className="border-purple-300 focus:border-purple-500"
          />
        </div>

        {/* Tags */}
        <div>
          <Input
            {...register("tags")}
            placeholder="music, nightlife"
            className="border-purple-300 focus:border-purple-500"
          />
        </div>

        {/* Images */}
        <div>
          <label className="text-sm font-medium text-purple-700 mb-2 block">
            Upload Images
          </label>
          <ImageUpload onFilesChange={setImages} />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white w-full rounded-lg"
        >
          {loading ? "Creating..." : "Create Tour"}
        </Button>
      </form>
    </div>
  );
}
