"use client";

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { formatBytes, useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface ImageUploadProps {
  onFilesChange?: (files: File[]) => void;
}

export default function ImageUpload({ onFilesChange }: ImageUploadProps) {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;
  const maxFiles = 6;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp",
    maxSize,
    multiple: true,
    maxFiles,
  });

  // 🔥 FIXED — Correct useEffect
  useEffect(() => {
    if (!onFilesChange) return;

    const rawFiles = files
      .map((f) => f.file)
      .filter((file): file is File => file instanceof File);

    onFilesChange(rawFiles);
  }, [files, onFilesChange]);

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed border-input p-4 transition-colors not-data-[files]:justify-center"
      >
        <input {...getInputProps()} className="sr-only" aria-label="Upload image file" />

        {files.length > 0 ? (
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-medium">
                Uploaded Files ({files.length})
              </h3>

              <Button
              type="button"
                variant="outline"
                size="sm"
                onClick={openFileDialog}
                disabled={files.length >= maxFiles}
              >
                <UploadIcon className="size-3.5 opacity-60" />
                Add more
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {files.map((file) => (
                <div key={file.id} className="relative aspect-square rounded-md bg-accent">
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="size-full rounded-[inherit] object-cover"
                  />

                  <Button
                    onClick={() => removeFile(file.id)}
                    size="icon"
                    className="absolute -top-2 -right-2 size-6 rounded-full border-2 border-background shadow-none"
                  >
                    <XIcon className="size-3.5" />
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    File Size: {formatBytes(file.file.size)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div className="mb-2 flex size-11 items-center justify-center rounded-full border bg-background">
              <ImageIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">Drop your images here</p>
            <p className="text-xs text-muted-foreground">
              SVG, PNG, JPG, GIF, WEBP (max {maxSizeMB}MB)
            </p>

            <Button type="button" variant="outline" className="mt-4" onClick={openFileDialog}>
              <UploadIcon className="opacity-60" />
              Select images
            </Button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircleIcon className="size-3" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
