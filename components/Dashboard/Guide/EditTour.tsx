"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { X, Plus, CheckCircle, XCircle, Calendar, Tag } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/sharedComponent/MultipleImagesUploading";
import { useParams, useRouter } from "next/navigation";

// PRISMA ENUM
const categories = [
  "FOOD", "ART", "ADVENTURE", "HISTORY", "NIGHTLIFE", 
  "NATURE", "WILDLIFE", "SHOPPING", "HERITAGE", "OTHER"
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ⭐ ZOD SCHEMA
export const tourSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  itinerary: z.string().min(10, "Itinerary must be at least 10 characters"),
  fee: z.string().min(1, "Fee is required"),
  duration: z.string().min(1, "Duration is required"),
  meetingPoint: z.string().min(2, "Meeting point is required"),
  maxGroupSize: z.string().min(1, "Max group size is required"),
  minGroupSize: z.string().min(1, "Min group size is required"),
  category: z.string().min(1, "Category is required"),
  language: z.string().min(1, "Language is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
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

// Day Selection Component
const DaySelection = ({
  days,
  selectedDays,
  onDayToggle,
}: {
  days: string[];
  selectedDays: string[];
  onDayToggle: (day: string) => void;
}) => {
  return (
    <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-lg text-blue-800">Available Days</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">Select days when this tour is available</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
        {days.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => onDayToggle(day)}
            className={`p-3 rounded-lg border transition-all ${
              selectedDays.includes(day)
                ? "bg-blue-600 text-white border-blue-700"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {day}
          </button>
        ))}
      </div>
      
      {selectedDays.length === 0 && (
        <p className="text-sm text-blue-500 text-center py-3">
          Select at least one day for availability
        </p>
      )}
    </div>
  );
};

export default function EditTour() {
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();
  const params = useParams();

  // State for array fields
  const [includes, setIncludes] = useState<string[]>([]);
  const [excludes, setExcludes] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [availableDays, setAvailableDays] = useState<string[]>([]);

  const form = useForm<z.infer<typeof tourSchema>>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      minGroupSize: "1",
      category: "",
      language: "",
    },
  });

  // Fetch existing tour data
  useEffect(() => {
    const fetchTour = async () => {
      if (!params.slug) return;

      try {
        setFetching(true);
        let token: string | null = null;
        if (typeof window !== 'undefined') {
          token = localStorage.getItem('accessToken');
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tour/${params.slug}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        if (!res.ok) {
          if (res.status === 401) {
            toast.error("Session expired. Please login again.");
            if (typeof window !== 'undefined') {
              localStorage.clear();
              window.location.href = '/login';
            }
            return;
          }
          throw new Error("Failed to fetch tour");
        }

        const result = await res.json();
        
        if (result.success && result.data) {
          const tour = result.data;
          
          // Set form values
          form.reset({
            title: tour.title || "",
            description: tour.description || "",
            itinerary: tour.itinerary || "",
            fee: tour.fee?.toString() || "",
            duration: tour.duration || "",
            meetingPoint: tour.meetingPoint || "",
            maxGroupSize: tour.maxGroupSize?.toString() || "",
            minGroupSize: tour.minGroupSize?.toString() || "1",
            category: tour.category || "",
            language: tour.tourLanguages?.map((l: any) => l.name).join(", ") || "",
            city: tour.city || "",
            country: tour.country || "",
          });

          // Set array states
          setIncludes(tour.includes || []);
          setExcludes(tour.excludes || []);
          setTags(tour.tags || []);
          setAvailableDays(tour.availableDays || []);
          setExistingImages(tour.images?.map((img: any) => img.url) || []);
        }
      } catch (err) {
        console.error('Fetch Tour Error:', err);
        toast.error("Failed to load tour data");
      } finally {
        setFetching(false);
      }
    };

    fetchTour();
  }, [params.slug, form]);

  const onSubmit = async (values: z.infer<typeof tourSchema>) => {
    try {
      setLoading(true);

      // Convert language string into array of objects
      const tourLanguages = values.language
        .split(",")
        .map((l) => ({ name: l.trim() }))
        .filter(l => l.name.length > 0);

      // Build payload
      const payload = {
        ...values,
        fee: Number(values.fee),
        maxGroupSize: Number(values.maxGroupSize),
        minGroupSize: Number(values.minGroupSize),
        tourLanguages,
        availableDays,
        includes,
        excludes,
        tags,
        // Keep existing images if no new ones uploaded
        keepExistingImages: images.length === 0,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      // Append new images
      images.forEach((img) => formData.append("images", img));

      // Get token
      let token: string | null = null;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('accessToken');
      }

      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour/${params.slug}`, {
        method: "PUT",
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
        
        const errorMessage = result.message || "Failed to update tour";
        toast.error(errorMessage);
        return;
      }

      if (result.success) {
        toast.success("Tour updated successfully!");
        router.push('/dashboard/guide/my-tours');
      }

    } catch (err: any) {
      console.error('Update Tour Error:', err);
      toast.error("Something went wrong while updating the tour.");
    } finally {
      setLoading(false);
    }
  };

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;

  const handleDayToggle = (day: string) => {
    setAvailableDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tour data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 border border-blue-200">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Update Tour
          </h1>
          <p className="text-gray-600 mt-2">Edit your tour details</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="border-gray-300"
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Basic Information */}
        <div className="p-6 rounded-xl bg-linear-to-br from-blue-50 to-purple-50 border border-blue-100">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Input
                  {...register("title")}
                  placeholder="Tour Title: Sundarbans Wildlife Adventure"
                  className="border-blue-300 focus:border-blue-500"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Input
                    type="number"
                    {...register("fee")}
                    placeholder="Fee: 2500"
                    className="border-blue-300 focus:border-blue-500"
                  />
                  {errors.fee && <p className="text-red-500 text-sm mt-1">{errors.fee.message}</p>}
                </div>
                <div>
                  <Input
                    {...register("duration")}
                    placeholder="Duration: 5 Hours"
                    className="border-blue-300 focus:border-blue-500"
                  />
                  {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Input
                    {...register("maxGroupSize")}
                    placeholder="Max Group: 20"
                    type="number"
                    className="border-blue-300 focus:border-blue-500"
                  />
                  {errors.maxGroupSize && <p className="text-red-500 text-sm mt-1">{errors.maxGroupSize.message}</p>}
                </div>
                <div>
                  <Input
                    {...register("minGroupSize")}
                    placeholder="Min Group: 1"
                    type="number"
                    className="border-blue-300 focus:border-blue-500"
                  />
                  {errors.minGroupSize && <p className="text-red-500 text-sm mt-1">{errors.minGroupSize.message}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  {...register("meetingPoint")}
                  placeholder="Meeting Point: Bandarban Bus Station"
                  className="border-blue-300 focus:border-blue-500"
                />
                {errors.meetingPoint && <p className="text-red-500 text-sm mt-1">{errors.meetingPoint.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Input
                    {...register("city")}
                    placeholder="City: Cox's Bazar"
                    className="border-blue-300 focus:border-blue-500"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <Input
                    {...register("country")}
                    placeholder="Country: Bangladesh"
                    className="border-blue-300 focus:border-blue-500"
                  />
                  {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
                </div>
              </div>

              <div>
                <Select
                  value={watch("category")}
                  onValueChange={(v) => setValue("category", v)}
                >
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
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-semibold text-blue-700">Description</label>
            <Textarea
              {...register("description")}
              rows={6}
              placeholder="Detailed description of your tour..."
              className="border-blue-300 focus:border-blue-500"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="font-semibold text-blue-700">Itinerary</label>
            <Textarea
              {...register("itinerary")}
              rows={6}
              placeholder="Detailed itinerary with timings..."
              className="border-blue-300 focus:border-blue-500"
            />
            {errors.itinerary && <p className="text-red-500 text-sm">{errors.itinerary.message}</p>}
          </div>
        </div>

        {/* Language Input */}
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
          <label className="font-semibold text-blue-700 block mb-2">Languages</label>
          <p className="text-sm text-gray-600 mb-3">Enter languages separated by commas (e.g., English, Bangla, Hindi)</p>
          <Input
            {...register("language")}
            placeholder="e.g., English, Bangla"
            className="border-blue-300 focus:border-blue-500"
          />
          {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language.message}</p>}
        </div>

        {/* Day Selection */}
        <DaySelection
          days={daysOfWeek}
          selectedDays={availableDays}
          onDayToggle={handleDayToggle}
        />

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
        </div>

        {/* Tags Input */}
        <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-lg text-purple-800">Tags</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Add relevant tags to help travelers find your tour</p>
          
          <ArrayInputField
            title=""
            description=""
            icon={Tag}
            items={tags}
            onItemsChange={setTags}
            placeholder="e.g., Wildlife, Adventure, Photography"
            color="border-purple-200 bg-transparent"
          />
        </div>

        {/* Images Upload */}
        <div className="p-6 rounded-xl bg-linear-to-br from-cyan-50 to-blue-50 border border-cyan-100">
          <h2 className="text-xl font-bold text-cyan-800 mb-4">Tour Images</h2>
          
          {existingImages.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">Existing Images:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {existingImages.map((url, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden border">
                    <img
                      src={url}
                      alt={`Tour image ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-600 mb-3">Upload new images to replace existing ones:</p>
          <ImageUpload onFilesChange={setImages} />
          <p className="text-sm text-gray-600 mt-2">
            Upload high-quality images of your tour (Leave empty to keep existing images)
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="px-6 py-6 text-lg"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="px-8 py-6 text-lg font-semibold bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {loading ? (
              <>
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Updating Tour...
              </>
            ) : (
              "Update Tour"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}