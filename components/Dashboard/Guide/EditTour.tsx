"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { X, Plus, CheckCircle, XCircle, ArrowLeft, Loader2, Save } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/sharedComponent/MultipleImagesUploading";
import { useRouter, useParams } from "next/navigation";

// PRISMA ENUM
const categories = [
  "FOOD", "ART", "ADVENTURE", "HISTORY", "NIGHTLIFE", 
  "NATURE", "WILDLIFE", "SHOPPING", "HERITAGE", "OTHER"
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const languages = ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Bangla", "Hindi", "Arabic", "Russian"];

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
  city: z.string().min(1),
  country: z.string().min(1),
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

export default function EditTour() {
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();
  const params = useParams();
  const tourId = params.id as string;
  
  // State for array fields
  const [includes, setIncludes] = useState<string[]>([]);
  const [excludes, setExcludes] = useState<string[]>([]);
  const [whatToBring, setWhatToBring] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [tourLanguages, setTourLanguages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof tourSchema>>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      minGroupSize: "1",
    },
  });

  // Fetch tour data for editing
  useEffect(() => {
    if (!tourId) return;

    const fetchTour = async () => {
      try {
        setFetching(true);
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          toast.error("Please login first");
          router.push('/login');
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour/edit/${tourId}`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401) {
            toast.error("Session expired. Please login again.");
            localStorage.clear();
            router.push('/login');
            return;
          }
          throw new Error("Failed to fetch tour");
        }

        const result = await res.json();
        
        if (!result.success) {
          throw new Error(result.message);
        }

        const tour = result.data;
        console.log("Tour data loaded:", tour);

        // Set form values
        form.reset({
          title: tour.title || "",
          description: tour.description || "",
          itinerary: tour.itinerary || "",
          fee: tour.fee?.toString() || "",
          duration: tour.duration?.toString() || "",
          meetingPoint: tour.meetingPoint || "",
          maxGroupSize: tour.maxGroupSize?.toString() || "",
          minGroupSize: tour.minGroupSize?.toString() || "1",
          category: tour.category || "",
          city: tour.city || "",
          country: tour.country || "",
        });

        // Set array fields
        setIncludes(tour.includes || []);
        setExcludes(tour.excludes || []);
        setWhatToBring(tour.whatToBring || []);
        setRequirements(tour.requirements || []);
        setTags(tour.tags || []);
        setAvailableDays(tour.availableDays || []);
        
        // Set languages
        const languages = tour.tourLanguages?.map((lang: any) => lang.language) || [];
        setTourLanguages(languages);
        
        // Set existing images
        const imageUrls = tour.tourImages?.map((img: any) => img.imageUrl) || [];
        setExistingImages(imageUrls);

      } catch (err: any) {
        console.error('Fetch tour error:', err);
        toast.error(err.message || "Failed to load tour");
        router.push('/dashboard/guide/my-tours');
      } finally {
        setFetching(false);
      }
    };

    fetchTour();
  }, [tourId, router, form]);

  const onSubmit = async (values: z.infer<typeof tourSchema>) => {
    try {
      setLoading(true);

      // Build payload to match backend
      const payload = {
        ...values,
        fee: Number(values.fee),
        maxGroupSize: Number(values.maxGroupSize),
        minGroupSize: Number(values.minGroupSize),
        tourLanguages: tourLanguages.map(lang => ({ language: lang })),
        availableDays,
        includes,
        excludes,
        whatToBring,
        requirements,
        tags,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      // Append new images
      images.forEach((img) => formData.append("images", img));

      // Append existing images
      formData.append("existingImages", JSON.stringify(existingImages));

      // Get token
      let token: string | null = null;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('accessToken');
      }

      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour/${tourId}`, {
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
        router.refresh();
      }

    } catch (err: any) {
      console.error('Update Tour Error:', err);
      toast.error("Something went wrong while updating the tour.");
    } finally {
      setLoading(false);
    }
  };

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;

  // Language Input Component
  const LanguageInput = () => {
    const [languageInput, setLanguageInput] = useState("");

    const addLanguage = () => {
      if (languageInput.trim() && !tourLanguages.includes(languageInput.trim())) {
        setTourLanguages([...tourLanguages, languageInput.trim()]);
        setLanguageInput("");
      }
    };

    const removeLanguage = (index: number) => {
      setTourLanguages(tourLanguages.filter((_, i) => i !== index));
    };

    return (
      <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-lg text-blue-700">Tour Languages</h3>
        </div>
        <p className="text-sm text-gray-600">Languages you can conduct the tour in</p>
        
        <div className="flex gap-2">
          <Input
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
            placeholder="e.g., English, Bangla"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={addLanguage}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Language List */}
        <div className="space-y-2">
          {tourLanguages.map((lang, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white/80 p-2 rounded-lg border"
            >
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {lang}
              </span>
              <button
                type="button"
                onClick={() => removeLanguage(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {tourLanguages.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-2">
              No languages added yet. Click the + button to add.
            </p>
          )}
        </div>

        {/* Quick select buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          <p className="text-sm text-gray-600 w-full">Quick select:</p>
          {languages.slice(0, 5).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => {
                if (!tourLanguages.includes(lang)) {
                  setTourLanguages([...tourLanguages, lang]);
                }
              }}
              className="px-3 py-1 text-sm bg-white border border-blue-300 rounded-lg hover:bg-blue-50"
            >
              + {lang}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading tour data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard/guide/my-tours')}
              className="p-2 hover:bg-blue-100 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                Edit Tour
              </h1>
              <p className="text-gray-600">
                Update your tour information to keep it current and attractive
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8 border border-blue-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Basic Information */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
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
                    <Select onValueChange={(v) => setValue("category", v)} defaultValue={watch("category")}>
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
              <div className="space-y-4">
                <label className="font-semibold text-blue-700">Description</label>
                <Textarea
                  {...register("description")}
                  rows={6}
                  placeholder="Detailed description of your tour..."
                  className="border-blue-300 focus:border-blue-500"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>
              
              <div className="space-y-4">
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
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
              <LanguageInput />
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
              
              <div className="space-y-6">
                {/* Tags */}
                <div>
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
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          availableDays.includes(day)
                            ? "bg-purple-600 text-white shadow-md"
                            : "bg-white text-purple-600 border border-purple-300 hover:bg-purple-50"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Images Upload */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100">
              <h2 className="text-xl font-bold text-cyan-800 mb-4">Tour Images</h2>
              
              {/* Show existing images */}
              {existingImages.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Existing Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Tour image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setExistingImages(existingImages.filter((_, i) => i !== index))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Add New Images</h3>
              <ImageUpload onFilesChange={setImages} />
              <p className="text-sm text-gray-600 mt-2">
                Upload additional images for your tour
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/guide/my-tours')}
                disabled={loading}
                className="px-8 py-6 text-lg rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Updating Tour...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Update Tour
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}