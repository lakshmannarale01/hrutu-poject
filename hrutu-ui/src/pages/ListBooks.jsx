export default function ListBooks({ setOutput }) {
  const listBooks = async () => {
    const res = await window.cli.run("list_books");
    setOutput(res);
  };

  return (
    <>
      <h1>List Books</h1>
      <button onClick={listBooks}>Fetch Books</button>
    </>
  );
}
