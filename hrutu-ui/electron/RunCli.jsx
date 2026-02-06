import { useState } from "react";

export default function RunCli() {
  const [output, setOutput] = useState("");

  const runCommand = async () => {
    try {
      const result = await window.electronAPI.runCli(["add_book"]);
      setOutput(result);
    } catch (err) {
      setOutput(err.toString());
    }
  };

  return (
    <div>
      <button onClick={runCommand}>Run CLI Command</button>
      <pre>{output}</pre>
    </div>
  );
}
