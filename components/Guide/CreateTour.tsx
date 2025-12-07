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

// PRISMA ENUM
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

// ⭐ ZOD SCHEMA EXACT WITH BACKEND
export const tourSchema = z.object({
  title: z.string().min(3, "Title required"),
  description: z.string().min(10, "Description is too short"),
  itinerary: z.string().min(10, "Itinerary is required"),
  fee: z.string().min(1),
  duration: z.string().min(1, "Duration required"), // STRING per backend
  meetingPoint: z.string().min(2),
  maxGroupSize: z.string().min(1),
  minGroupSize: z.string().min(1),
  category: z.string().min(1),
  language: z.string().min(1), // comma separated → array
  city: z.string().min(1),
  country: z.string().min(1),
  tags: z.string().optional(), // comma separated → array
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

      // Convert fields to backend format
      const payload = {
        ...values,
        fee: Number(values.fee),
        maxGroupSize: Number(values.maxGroupSize),
        minGroupSize: Number(values.minGroupSize),
        language: values.language.split(",").map((l) => l.trim()),
        tags: values.tags ? values.tags.split(",").map((t) => t.trim()) : [],
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      images.forEach((img) => {
        formData.append("images", img);
      });

      const res = await fetch("http://localhost:5000/api/tour", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Backend validation error");
        return;
      }

      toast.success("Tour created successfully!");
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
    <div className="bg-white shadow-md rounded-xl p-8 border border-purple-300">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">
        Create New Tour
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Title */}
        <Input
          {...register("title")}
          placeholder="Title: Sundarbans Wildlife Adventure"
          className="border-purple-400 focus:border-purple-600"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

        {/* Description */}
        <div className="flex gap-4">
          <Textarea
            {...register("description")}
            rows={4}
            cols={8}
            placeholder="Detailed description..."
            className="border-purple-400 focus:border-purple-600"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

          {/* Itinerary */}
          <Textarea
            {...register("itinerary")}
            rows={4}
            cols={8}
            placeholder="Itinerary"
            className="border-purple-400 focus:border-purple-600"
          />
        </div>

        <div className="flex gap-4">
          {/* Fee */}
          <Input
            type="number"
            {...register("fee")}
            placeholder="Fee: 2500"
            className="border-purple-400 focus:border-purple-600"
          />

          {/* Duration (STRING) */}
          <Input
            {...register("duration")}
            placeholder="Duration: 5 Hours or days"
            className="border-purple-400 focus:border-purple-600"
          />
        </div>



        {/* Group Size */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            {...register("maxGroupSize")}
            placeholder="Max Group size: 20"
            type="number"
            className="border-purple-400 focus:border-purple-600"
          />

          <Input
            {...register("minGroupSize")}
            placeholder="Min Group Size: 1"
            type="number"
            className="border-purple-400 focus:border-purple-600"
          />
        </div>

        <div className="flex gap-4">
          {/* Meeting Point */}
          <Input
            {...register("meetingPoint")}
            placeholder="Meeting Point: Bandarban Bus Station"
            className="border-purple-400 focus:border-purple-600"
          />

          {/* Category */}
          <Select onValueChange={(v) => form.setValue("category", v)}>
            <SelectTrigger className="border-purple-400 w-full">
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
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>



        {/* Language / City / Country */}
        <div className="grid grid-cols-3 gap-4">
          <Input
            {...register("language")}
            placeholder="Language: English, Bangla"
            className="border-purple-400 focus:border-purple-600"
          />

          <Input
            {...register("city")}
            placeholder="City: Cox's Bazar"
            className="border-purple-400 focus:border-purple-600"
          />

          <Input
            {...register("country")}
            placeholder="Country: Bangladesh"
            className="border-purple-400 focus:border-purple-600"
          />
        </div>

        {/* Tags */}
        <Input
          {...register("tags")}
          placeholder="Tags: adventure, sea, nature"
          className="border-purple-400 focus:border-purple-600"
        />

        {/* Images Upload */}
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
