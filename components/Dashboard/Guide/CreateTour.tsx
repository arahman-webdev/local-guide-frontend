"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { X, Plus, CheckCircle, XCircle } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/sharedComponent/MultipleImagesUploading";

// PRISMA ENUM
const categories = [
  "FOOD", "ART", "ADVENTURE", "HISTORY", "NIGHTLIFE", 
  "NATURE", "WILDLIFE", "SHOPPING", "HERITAGE", "OTHER"
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ⭐ ZOD SCHEMA
export const tourSchema = z.object({
  title: z.string().min(3, "Title required"),
  description: z.string().min(10, "Description is too short"),
  itinerary: z.string().min(10, "Itinerary is required"),
  fee: z.string().min(1),
  duration: z.string().min(1, "Duration required"),
  meetingPoint: z.string().min(2),
  maxGroupSize: z.string().min(1),
  minGroupSize: z.string().min(1),
  category: z.string().min(1),
  language: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  tags: z.string().optional(),
  // New fields
  includes: z.string().optional(),
  excludes: z.string().optional(),
  whatToBring: z.string().optional(),
  requirements: z.string().optional(),
});

// Component for array input fields
const ArrayInputField = ({
  title,
  description,
  icon: Icon,
  items,
  onItemsChange,
  placeholder,
  color,
}: {
  title: string;
  description: string;
  icon: any;
  items: string[];
  onItemsChange: (items: string[]) => void;
  placeholder: string;
  color: string;
}) => {
  const [input, setInput] = useState("");

  const addItem = () => {
    if (input.trim() && !items.includes(input.trim())) {
      onItemsChange([...items, input.trim()]);
      setInput("");
    }
  };

  const removeItem = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className={`p-4 rounded-xl border ${color} space-y-3`}>
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5" />
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
      
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={addItem}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white/80 p-2 rounded-lg border"
          >
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              {item}
            </span>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        {items.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-2">
            No items added yet. Click the + button to add.
          </p>
        )}
      </div>
    </div>
  );
};

export default function CreateTour() {
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State for array fields
  const [includes, setIncludes] = useState<string[]>([]);
  const [excludes, setExcludes] = useState<string[]>([]);
  const [whatToBring, setWhatToBring] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [availableDays, setAvailableDays] = useState<string[]>([]);

  const form = useForm<z.infer<typeof tourSchema>>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      minGroupSize: "1",
    },
  });

  const onSubmit = async (values: z.infer<typeof tourSchema>) => {
    try {
      setLoading(true);

      // Convert language string into array of objects
      const tourLanguages = values.language
        .split(",")
        .map((l) => ({ name: l.trim() }));

      // Build payload to match backend
      const payload = {
        ...values,
        fee: Number(values.fee),
        maxGroupSize: Number(values.maxGroupSize),
        minGroupSize: Number(values.minGroupSize),
        tourLanguages,
        availableDays,
        includes,
        excludes,
        whatToBring,
        requirements,
        tags,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      // Append images
      images.forEach((img) => formData.append("images", img));

      // Get token
      let token: string | null = null;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('accessToken');
      }

      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour`, {
        method: "POST",
        headers,
        credentials: "include",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Session expired. Please login again.");
          if (typeof window !== 'undefined') {
            localStorage.clear();
            window.location.href = '/login';
          }
          return;
        }
        
        const errorMessage = result.message || "Failed to create tour";
        toast.error(errorMessage);
        return;
      }

      if (result.success) {
        toast.success("Tour created successfully!");
        // Reset all states
        setImages([]);
        setIncludes([]);
        setExcludes([]);
        setWhatToBring([]);
        setRequirements([]);
        setTags([]);
        setAvailableDays([]);
        form.reset();
      }

    } catch (err: any) {
      console.error('Create Tour Error:', err);
      toast.error("Something went wrong while creating the tour.");
    } finally {
      setLoading(false);
    }
  };

  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 border border-blue-200">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Create New Tour
        </h1>
        <p className="text-gray-600 mt-2">Share your unique experience with travelers</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Basic Information */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Input
                {...register("title")}
                placeholder="Tour Title: Sundarbans Wildlife Adventure"
                className="border-blue-300 focus:border-blue-500"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  {...register("fee")}
                  placeholder="Fee: 2500"
                  className="border-blue-300 focus:border-blue-500"
                />
                <Input
                  {...register("duration")}
                  placeholder="Duration: 5 Hours"
                  className="border-blue-300 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  {...register("maxGroupSize")}
                  placeholder="Max Group: 20"
                  type="number"
                  className="border-blue-300 focus:border-blue-500"
                />
                <Input
                  {...register("minGroupSize")}
                  placeholder="Min Group: 1"
                  type="number"
                  className="border-blue-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Input
                {...register("meetingPoint")}
                placeholder="Meeting Point: Bandarban Bus Station"
                className="border-blue-300 focus:border-blue-500"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  {...register("city")}
                  placeholder="City: Cox's Bazar"
                  className="border-blue-300 focus:border-blue-500"
                />
                <Input
                  {...register("country")}
                  placeholder="Country: Bangladesh"
                  className="border-blue-300 focus:border-blue-500"
                />
              </div>

              <Select onValueChange={(v) => form.setValue("category", v)}>
                <SelectTrigger className="border-blue-300">
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
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="font-semibold text-blue-700">Description</label>
            <Textarea
              {...register("description")}
              rows={6}
              placeholder="Detailed description of your tour..."
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-4">
            <label className="font-semibold text-blue-700">Itinerary</label>
            <Textarea
              {...register("itinerary")}
              rows={6}
              placeholder="Detailed itinerary with timings..."
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Array Input Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ArrayInputField
            title="What's Included"
            description="Services and items included in the price"
            icon={CheckCircle}
            items={includes}
            onItemsChange={setIncludes}
            placeholder="e.g., Local guide services, Entrance fees"
            color="border-green-200 bg-green-50/50"
          />

          <ArrayInputField
            title="What's Excluded"
            description="Items and services not included in the price"
            icon={XCircle}
            items={excludes}
            onItemsChange={setExcludes}
            placeholder="e.g., Hotel pickup, Personal expenses"
            color="border-red-200 bg-red-50/50"
          />

          <ArrayInputField
            title="What to Bring"
            description="Items travelers should bring"
            icon={CheckCircle}
            items={whatToBring}
            onItemsChange={setWhatToBring}
            placeholder="e.g., Comfortable shoes, Water bottle"
            color="border-blue-200 bg-blue-50/50"
          />

          <ArrayInputField
            title="Requirements"
            description="Physical requirements and restrictions"
            icon={CheckCircle}
            items={requirements}
            onItemsChange={setRequirements}
            placeholder="e.g., Moderate fitness level, Minimum age"
            color="border-amber-200 bg-amber-50/50"
          />
        </div>

        {/* Additional Information */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
          <h2 className="text-xl font-bold text-purple-800 mb-4">Additional Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              {...register("language")}
              placeholder="Languages: English, Bangla"
              className="border-purple-300 focus:border-purple-500"
            />

            {/* Available Days */}
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">
                Available Days
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      if (availableDays.includes(day)) {
                        setAvailableDays(availableDays.filter(d => d !== day));
                      } else {
                        setAvailableDays([...availableDays, day]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      availableDays.includes(day)
                        ? "bg-purple-600 text-white shadow-md"
                        : "bg-white text-purple-600 border border-purple-300 hover:bg-purple-50"
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <ArrayInputField
              title="Tags"
              description="Keywords for search"
              icon={CheckCircle}
              items={tags}
              onItemsChange={setTags}
              placeholder="e.g., adventure, sea, nature"
              color="border-purple-200 bg-purple-50/50"
            />
          </div>
        </div>

        {/* Images Upload */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100">
          <h2 className="text-xl font-bold text-cyan-800 mb-4">Tour Images</h2>
          <ImageUpload onFilesChange={setImages} />
          <p className="text-sm text-gray-600 mt-2">
            Upload high-quality images of your tour (Recommended: 5-10 images)
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={loading}
            className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {loading ? (
              <>
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating Tour...
              </>
            ) : (
              "Create Tour"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}