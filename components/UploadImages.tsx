// components/ImageUploader.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ImagesIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { Label } from "./ui/label";

export default function UploadImages({ images }: any) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  let imgs = images?.map((img: any) => JSON.parse(img))
  const [urls, setUrls] = useState<string[]>(imgs || []);

  const [loadingRemoving, setLoadingRemoving] = useState(false)
  const handleUpload = async () => {
    try {
      setError("");
      setLoading(true);
      setProgress(10);

      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      if (urls.length >= 5 || files.length + urls.length > 5) {
        toast.error("No more then 5 images can be uploaded", {
          style: {
            "color": "red"
          }
        })
        return
      }
      const res = await fetch("/api/admin/upload-images", {
        method: "POST",
        body: formData,
         
      });

      
      
      setProgress(60);
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setProgress(100);
      setLoading(false);
      let uploaded: Array<any> = []
      data.map((url: any) => {
        uploaded.push({
          url: url.url,
          public_id: url.public_id
        })
      })

      setUrls(prev => ([
        ...prev,
        ...uploaded,
      ]));

      setFiles([])


    } catch (e: any) {

      setError(e.message);
    } finally {
    }
  };

  const removeImage = async (index: number, public_id: any) => {

    try {
      setLoadingRemoving(true)
      let res = await fetch("/api/admin/upload-images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: public_id }),
      });
      if (res.ok) {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
        const newUrls = [...urls]
        newUrls.splice(index, 1);
        setUrls(newUrls);

        toast.error("Image removed success")
      } else {
        toast.error("Error occured")
      }
    } catch (e: any) {
      setError("Failed to delete image");
    } finally {
      setLoadingRemoving(false)
    }
  };

  return (
    <Card className="space-y-4  border rounded-lg">
      <CardHeader>
        <CardTitle>Images</CardTitle>
        <CardDescription>You can upload and manage your images. These images will be shown to public</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {files.length > 0 && <h3 className="text-base font-semibold">Selected files</h3>}
          <div className="grid md:grid-cols-5 grid-cols-2 gap-5">
            {files && files.map((item: any, index: any) => (
              <div key={index} className="relative group ">
                <img src={URL.createObjectURL(item)} key={index} className="rounded-md" />
                <button
                  onClick={() => {
                    const newFiles = [...files];
                    newFiles.splice(index, 1);
                    setFiles(newFiles);
                  }}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1 rounded-full shadow hidden group-hover:block"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>
          <Label htmlFor="files">
            <Input
              type="file"
              accept="image/*"
              multiple
              id="files"
              name="files"
              className="hidden"
              onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 5))}
            />
            <div className="w-full p-3 space-x-4 cursor-pointer hover:border-2 hover:bg-accent/20 transition-all ease-in rounded-md border text-muted-foreground flex items-center justify-center border-accent bg-accent/10 min-h-[100px]">
              <ImagesIcon size={40} />
              <div className="">
                <h2 className="text-lg font-bold">Select images!</h2>
                <p className="">Click here or Drap and drop to upload images.</p>
              </div>
            </div>
          </Label>
          <Button onClick={handleUpload} disabled={loading || !files.length}>
            {loading ? "Uploading..." : "Upload Images"}
          </Button>
        </div>

        {loading && <Progress value={progress} />}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {urls.length > 0 && (
          <>
            <h2 className="font-bold my-2 mt-8">Uploads</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {urls?.map((url: any, i) => (
                <div key={i} className="relative group">
                  <img
                    src={url.url}
                    className="rounded border w-full h-32 object-cover"
                  />
                  {loadingRemoving ?
                    <button
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1 rounded-full shadow hidden group-hover:block "
                    >
                      <Spinner className="w-4 h-4 text-red-600" />
                    </button>
                    :
                    <button
                      onClick={() => removeImage(i, url.public_id)}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1 rounded-full shadow hidden group-hover:block"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
