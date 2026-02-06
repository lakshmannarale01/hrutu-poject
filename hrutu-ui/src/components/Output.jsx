export default function Output({ data }) {
  return (
    <pre className="output">
      {data || "Output will appear here..."}
    </pre>
  );
}
