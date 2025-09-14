import React, { useContext, useState } from "react";
import { BudgetContext } from "../context/BudgetContext";

function QuickNotes({ customClass = "" }) {
  const { notes, addNote, deleteNote } = useContext(BudgetContext);
  const [noteText, setNoteText] = useState("");

  const handleAdd = () => {
    if (!noteText.trim()) return;

    // Make sure ID is consistent with backend if available
    const newNote = {
      _id: Date.now().toString(),
      text: noteText,
    };

    addNote(newNote); // Adds note to context
    setNoteText("");
  };

  return (
    <div className={`p-4 rounded-2xl shadow ${customClass || "bg-slate-900/50"}`}>
      <h2 className="text-xl font-bold mb-2 text-blue-300">📝 Quick Notes</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Write a quick note..."
          className="flex-1 px-2 py-1 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-400"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      <ul>
        {notes.map((n) => (
          <li
            key={n._id || n.id} // Use backend _id if available
            className="flex justify-between mb-2 p-2 bg-slate-800/60 rounded border border-slate-700"
          >
            <span>{n.text}</span>
            <button
              onClick={() => deleteNote(n._id || n.id)} // delete using the correct id
              className="text-red-500 font-bold hover:text-red-600"
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
