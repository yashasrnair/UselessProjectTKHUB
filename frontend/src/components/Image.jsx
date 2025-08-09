import { useCallback, useMemo, useRef, useState } from "react";

export default function ImageUploader() {
  const [images, setImages] = useState([]);
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = useCallback((e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImages(files);
  }, []);

  const formData = useMemo(() => {
    const fd = new FormData();
    images.forEach((img) => fd.append("images", img));
    return fd;
  }, [images]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (images.length === 0) return;

      try {
        await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });

        if (formRef.current) {
          formRef.current.reset();
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setImages([]);
      } catch {
        // no-op: handle errors upstream or via toast
      }
    },
    [formData, images.length]
  );

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Upload Images</h2>
      
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="file-input"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Select Images
          </label>
          <input
            id="file-input"
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {images.length > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              {images.length} file{images.length > 1 ? 's' : ''} selected
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={images.length === 0}
          className="w-full px-4 py-2 text-white font-medium bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Upload Images
        </button>
      </form>
    </div>
  );
}

