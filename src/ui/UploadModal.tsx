import React, { useState, useRef, useCallback } from "react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface UploadResult {
  created: number;
  updated: number;
  failed: number;
  errors?: string[];
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [result, setResult] = useState<UploadResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

  const validTypes = [
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];
  const validExtensions = [".csv", ".xlsx", ".xls"];

  const isValidFile = (file: File) => {
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    return validTypes.includes(file.type) || validExtensions.includes(ext);
  };

  const handleFile = (file: File) => {
    if (!isValidFile(file)) {
      setErrorMessage("Please upload a CSV or Excel file (.csv, .xlsx, .xls)");
      return;
    }
    setSelectedFile(file);
    setErrorMessage("");
    setStatus("idle");
    setResult(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setStatus("uploading");
    const formData = new FormData();
    formData.append("csv_file", selectedFile);

    try {
      const response = await fetch(`${BASE_URL}/api/upload/`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setResult({
          created: data.created || 0,
          updated: data.updated || 0,
          failed: data.failed || 0,
          errors: data.errors || [],
        });
        onSuccess?.();
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Upload failed. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("Network error. Is the server running?");
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setStatus("idle");
    setResult(null);
    setErrorMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
    if (ext === ".csv") return "📄";
    if (ext === ".xlsx" || ext === ".xls") return "📊";
    return "📁";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Upload Field Data
                </h2>
                <p className="text-emerald-100 text-xs mt-0.5">
                  CSV or Excel files supported
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Success State */}
          {status === "success" && result && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-emerald-900">
                    Upload Successful!
                  </p>
                  <p className="text-sm text-emerald-700 mt-0.5">
                    Your data has been processed
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-2xl font-bold text-emerald-700">
                    {result.created}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">New Records</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-2xl font-bold text-blue-700">
                    {result.updated}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Updated</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-2xl font-bold text-red-700">
                    {result.failed}
                  </p>
                  <p className="text-xs text-red-600 mt-1">Failed</p>
                </div>
              </div>

              {result.errors && result.errors.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-h-32 overflow-y-auto">
                  <p className="text-xs font-semibold text-amber-800 mb-2">
                    Errors ({result.errors.length}):
                  </p>
                  {result.errors.map((err, i) => (
                    <p key={i} className="text-xs text-amber-700">
                      {err}
                    </p>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={reset}
                  className="flex-1 px-4 py-2.5 bg-white border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Upload Another
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Upload State */}
          {status !== "success" && (
            <>
              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? "border-emerald-500 bg-emerald-50 scale-[1.01]"
                    : selectedFile
                      ? "border-emerald-400 bg-emerald-50/50"
                      : "border-neutral-300 hover:border-emerald-400 hover:bg-neutral-50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileInput}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {getFileIcon(selectedFile.name)}
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900 text-sm truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {formatFileSize(selectedFile.size)}
                      </p>
                      <p className="text-xs text-emerald-600 mt-1 font-medium">
                        ✓ Ready to upload
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        reset();
                      }}
                      className="w-7 h-7 bg-neutral-100 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      <svg
                        className="w-3.5 h-3.5 text-neutral-500 hover:text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-7 h-7 text-neutral-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-neutral-700">
                      Drop your file here
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      or{" "}
                      <span className="text-emerald-600 font-medium">
                        click to browse
                      </span>
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      {[".csv", ".xlsx", ".xls"].map((ext) => (
                        <span
                          key={ext}
                          className="px-2 py-1 bg-neutral-100 rounded text-xs text-neutral-500 font-mono"
                        >
                          {ext}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Error Message */}
              {(errorMessage || status === "error") && (
                <div className="flex items-start gap-3 p-3.5 bg-red-50 rounded-xl border border-red-200">
                  <svg
                    className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              )}

              {/* Format Guide */}
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-4">
                <p className="text-xs font-semibold text-neutral-600 mb-2.5 uppercase tracking-wide">
                  Expected Columns
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "field_1",
                    "NAME OF FARMER",
                    "GENDER",
                    "FIELD_TYPE",
                    "SOIL PH",
                    "CALCIUM MEQ%",
                    "BREEDS KEPT",
                  ].map((col) => (
                    <span
                      key={col}
                      className="px-2 py-1 bg-white border border-neutral-200 rounded text-xs text-neutral-600 font-mono"
                    >
                      {col}
                    </span>
                  ))}
                  <span className="px-2 py-1 text-xs text-neutral-400">
                    + more...
                  </span>
                </div>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!selectedFile || status === "uploading"}
                className="w-full px-4 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {status === "uploading" ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Upload & Process
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
