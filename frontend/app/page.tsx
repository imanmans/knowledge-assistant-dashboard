'use client';

import { useState } from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900 tracking-tight">AI Knowledge Assistant Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <section className="p-6 bg-white border border-gray-200 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold mb-5 text-gray-800">Upload Documents</h2>
          <UploadForm />
        </section>

        {/* Documents List */}
        <section className="p-6 bg-white border border-gray-200 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold mb-5 text-gray-800">Processed Documents</h2>
          <DocumentsList />
        </section>

        {/* Ask Assistant */}
        <section className="p-6 bg-white border border-gray-200 rounded-3xl shadow-lg hover:shadow-xl transition-shadow md:col-span-2">
          <h2 className="text-2xl font-semibold mb-5 text-gray-800">Ask the Assistant</h2>
          <AskAssistant />
        </section>
      </div>
    </div>
  );
}

function UploadForm() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);

  // SSE listener for a single file
  function listenForCompletion(fileName: string) {
    const evtSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stream/${fileName}`
    );

    evtSource.addEventListener("done", (e: any) => {
      const fileData = JSON.parse(e.data);

      // Add file to documents list
      setDocuments((prev) => [...prev, fileData]);

      // Stop loader for this file
      setIsProcessing(false);
      evtSource.close();
    });
  }

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!files) return;

      setIsProcessing(true);

      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },

    onSuccess: () => {
      if (!files) return;

      // Start listening for SSE for each uploaded file
      Array.from(files).forEach((file) => listenForCompletion(file.name));

      setFiles(null);
    },

    onError: (err: any) => {
      setIsProcessing(false);
      alert(`Upload error: ${err.message}`);
    },
  });

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-xl">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          uploadMutation.mutate();
        }}
      >
        <input
          type="file"
          multiple
          className="border p-4 rounded-xl text-gray-900"
          onChange={(e) => setFiles(e.target.files)}
        />

        <button
          type="submit"
          className={`p-4 rounded-xl text-white font-bold transition-colors ${
            isProcessing ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Upload"}
        </button>
      </form>

      {/* Loader */}
      {isProcessing && (
        <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 text-yellow-900 rounded-lg">
          ⏳ Processing your documents...
        </div>
      )}

      {/* Live documents */}
      {documents.length > 0 && (
        <div className="mt-4 space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.file_name}
              className="p-4 border rounded-xl bg-gray-50 shadow-sm"
            >
              <p className="font-semibold">📄 {doc.file_name}</p>
              <p className="text-sm text-gray-700">Chunks: {doc.chunks}</p>
              <p className="text-sm text-gray-700">Embeddings: {doc.embeddings}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DocumentsList() {
  const { data, isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/docs/`);
      return res.json();
    },
  });

  if (isLoading) return <p>Loading documents...</p>;

  return (
    <div className="mt-6">
  <h2 className="text-xl font-semibold mb-3">Uploaded Documents</h2>

  <div className="space-y-3 max-h-96 overflow-y-auto">
    {data?.documents?.map((doc: any) => (
      <div
        key={doc.collection}
        className="p-4 border rounded-xl bg-gray-50 shadow-sm"
      >
        <p className="font-semibold">📄 {doc.collection}</p>
        <p className="text-sm text-gray-700">Chunks: {doc.chunks}</p>
        <p className="text-sm text-gray-700">
          Embeddings: {doc.embeddings}
        </p>
      </div>
    ))}
  </div>
</div>
  );
}

function AskAssistant() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Ask a question..."
          className="flex-1 border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
        />
        <button className="p-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors">Ask</button>
      </div>
      <div className="mt-4 bg-gray-100 rounded-2xl p-5 h-64 overflow-y-auto space-y-3">
        {/* Mock chat bubbles */}
        <div className="bg-white p-3 rounded-xl shadow-sm w-fit max-w-full">Hello! How can I assist you today?</div>
        <div className="bg-green-600 text-white p-3 rounded-xl shadow-sm w-fit max-w-full ml-auto">Can you summarize the document I uploaded?</div>
        <div className="bg-white p-3 rounded-xl shadow-sm w-fit max-w-full">Sure! Here’s a brief summary...</div>
      </div>
    </div>
  );
}
