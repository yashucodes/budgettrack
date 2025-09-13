import React, { useContext, useState } from "react";
import { BudgetContext } from "../context/BudgetContext";

function QuickNotes() {
  const { notes, addNote, deleteNote } = useContext(BudgetContext);
  const [noteText, setNoteText] = useState("");

  const handleAdd = () => {
    if (!noteText.trim()) return;
    addNote({
      id: Date.now(),
      text: noteText
    });
    setNoteText("");
  };

  return (
    <div className="bg-yellow-50 p-4 rounded shadow mt-6 max-w-md">
      <h2 className="text-xl font-bold mb-2">Quick Notes</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Write a quick note..."
          className="flex-1 px-2 py-1 border rounded"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-yellow-400 px-4 py-1 rounded hover:bg-yellow-500"
        >
          Add
        </button>
      </div>
      <ul>
        {notes.map((n) => (
          <li key={n.id} className="flex justify-between mb-2 p-2 bg-yellow-100 rounded">
            <span>{n.text}</span>
            <button
              onClick={() => deleteNote(n.id)}
              className="text-red-500 font-bold"
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuickNotes;
