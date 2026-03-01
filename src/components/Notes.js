import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import './Notes.css';

function Notes() {
  const { state } = useLocation();
  const folder    = state?.folder    || 'Folder';
  const file      = state?.file      || 'Untitled';
  const folderId  = state?.folderId  ?? null;
  const fileIndex = state?.fileIndex ?? null;
  const today     = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const { renameFile } = useNotes();
  const editorRef = useRef(null);
  const [currentName, setCurrentName] = useState(file);

  useEffect(() => {
    setCurrentName(file);
  }, [file]);

  const exec = (cmd) => {
    editorRef.current.focus();
    document.execCommand(cmd, false, null);
  };

  const handleTitleBlur = (e) => {
    const newName = e.currentTarget.textContent.trim();
    if (newName && newName !== currentName) {
      setCurrentName(newName);
      if (folderId !== null && fileIndex !== null) {
        renameFile(folderId, fileIndex, newName);
      }
    }
  };

  return (
    <div className="notes">
      {/* Breadcrumb */}
      <div className="notes-breadcrumb">
        <span className="bc-item">Notes</span>
        <span className="bc-sep">&gt;&gt;</span>
        <span className="bc-item">{folder}</span>
        <span className="bc-sep">&gt;&gt;</span>
        <span className="bc-item bc-item--active">{currentName}</span>
      </div>

      {/* Header image placeholder */}
      <div className="notes-header-img" />

      {/* Title */}
      <h1
        className="notes-title"
        contentEditable
        suppressContentEditableWarning
        onBlur={handleTitleBlur}
      >
        {file}
      </h1>

      {/* Date */}
      <p className="notes-date">Date Created: {today}</p>

      {/* Toolbar */}
      <div className="notes-toolbar">
        <button className="toolbar-btn" onMouseDown={e => { e.preventDefault(); exec('bold'); }} title="Bold">
          <b>B</b>
        </button>
        <button className="toolbar-btn" onMouseDown={e => { e.preventDefault(); exec('italic'); }} title="Italic">
          <i>I</i>
        </button>
        <button className="toolbar-btn" onMouseDown={e => { e.preventDefault(); exec('insertUnorderedList'); }} title="Bullet list">
          •≡
        </button>
        <div className="toolbar-divider" />
        <button className="toolbar-btn" onMouseDown={e => { e.preventDefault(); exec('undo'); }} title="Undo">
          ↩
        </button>
        <button className="toolbar-btn" onMouseDown={e => { e.preventDefault(); exec('redo'); }} title="Redo">
          ↪
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        className="notes-editor"
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Start writing..."
      />
    </div>
  );
}

export default Notes;
