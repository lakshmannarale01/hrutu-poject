import { useState } from "react";
import { addBook } from "../api";

export default function AddBook({ onAdded }) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [publisher, setPublisher] = useState("");

    const handleAdd = async () => {
        await addBook({ title, author, publisher });
        setTitle("");
        setAuthor("");
        setPublisher("");
        onAdded();
    };

    return (
        <div>
            <h3>Add Book</h3>

            <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <input placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} />
            <input placeholder="Publisher" value={publisher} onChange={e => setPublisher(e.target.value)} />

            <button onClick={handleAdd}>Add Book</button>
        </div>
    );
}
