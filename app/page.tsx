"use client";
import { useState } from "react";

type Record = {
  name: string;
  football_team: string;
  phone: string;
};

export default function Home() {
  const [rows, setRows] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);

  async function uploadFile(e: any) {
    setLoading(true);

    const file = e.target.files[0];
    const fd = new FormData();
    fd.append("file", file);

    const upload = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    });
    const { content } = await upload.json();

    const ai = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await ai.json();
    setRows(data.records || []);
    setLoading(false);
  }

  return (
    <main style={{ padding: 30 }}>
      <h2>TXT Football Data Validator</h2>

      <input type="file" accept=".txt" onChange={uploadFile} />

      {loading && <p>Analyzing with AI...</p>}

      {rows.length > 0 && (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Football Team</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.name}</td>
                <td>{r.football_team}</td>
                <td>{r.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

