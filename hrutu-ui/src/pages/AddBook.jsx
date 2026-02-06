import { useState } from "react";

export default function AddBook({ setOutput }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const addBook = async () => {
    const res = await window.cli.run(`add_book "${title}" "${author}"`);
    setOutput(res);
  };

  return (
    <>
      <h1>Add Book</h1>

      <input
        placeholder="Book title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      <button onClick={addBook}>Add</button>
    </>
  );
}
