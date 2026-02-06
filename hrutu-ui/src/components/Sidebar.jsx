export default function Sidebar({ setPage }) {
  return (
    <div className="sidebar">
      <h2>Hrutu</h2>
      <button onClick={() => setPage("list")}>📋 List Books</button>
      <button onClick={() => setPage("add")}>➕ Add Book</button>
    </div>
  );
}
