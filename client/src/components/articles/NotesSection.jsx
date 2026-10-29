import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addNote, deleteNote, getNotes } from "../../api/articles.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { timeAgo } from "../../utils/format.js";

// Private notes: only the logged-in author can see them.
export default function NotesSection({ articleId }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return setNotes([]);
    getNotes(articleId)
      .then((data) => setNotes(data.notes))
      .catch((err) => setError(err.message));
  }, [articleId, user]);

  async function handleAdd(event) {
    event.preventDefault();
    if (!text.trim()) return;
    try {
      const { note } = await addNote(articleId, text);
      setNotes([note, ...notes]);
      setText("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(noteId) {
    try {
      await deleteNote(articleId, noteId);
      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="panel">
      <div className="panel__header">
        <h2>My notes</h2>
      </div>

      {!user ? (
        <p className="muted">
          <Link to="/login" state={{ from: `/article/${articleId}` }}>Log in</Link> to keep private
          notes on this article.
        </p>
      ) : (
        <>
          <form className="note-form" onSubmit={handleAdd}>
            <textarea
              rows={3}
              placeholder="Write a note..."
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={2000}
            />
            <button className="button button--small" disabled={!text.trim()}>Add note</button>
          </form>

          {error && <p className="form__error">{error}</p>}

          <ul className="note-list">
            {notes.map((note) => (
              <li key={note.id}>
                <p>{note.text}</p>
                <div className="note-list__footer">
                  <span>{timeAgo(note.createdAt)}</span>
                  <button className="icon-button" onClick={() => handleDelete(note.id)} aria-label="Delete note">
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
