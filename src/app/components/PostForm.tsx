import { useState, useEffect } from "react";

interface PostFormProps {
  onSubmit: (data: { title: string; body: string; id?: number }) => void;
  initialData?: { title: string; body: string; id?: number } | null;
  onCancel?: () => void;
}

export default function PostForm({ onSubmit, initialData, onCancel }: PostFormProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setBody(initialData.body);
    } else {
      setTitle("");
      setBody("");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;
    onSubmit({ title, body, id: initialData?.id });
    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-2">
        {initialData ? "Edit Post" : "Add New Post"}
      </h2>
      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 border rounded mb-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Body"
        className="w-full p-2 border rounded mb-2"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {initialData ? "Update" : "Create"}
        </button>
        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
