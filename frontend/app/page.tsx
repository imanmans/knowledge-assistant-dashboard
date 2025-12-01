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
  return (
    <form className="flex flex-col gap-5">
      <input type="file" multiple className="border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" />
      <button className="p-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors">Upload</button>
    </form>
  );
}

function DocumentsList() {
  return (
    <div className="text-gray-800 space-y-3">Docs will load here...</div>
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
