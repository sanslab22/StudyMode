'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNotes } from '../context/NotesContext';
import './Notes.css';

function Notes() {
  const searchParams = useSearchParams();
  const folderIdRaw = searchParams.get('folderId');
  const fileIndexRaw = searchParams.get('fileIndex');
  const parsedFolderId = folderIdRaw != null && folderIdRaw !== '' ? Number(folderIdRaw) : NaN;
  const parsedFileIndex = fileIndexRaw != null && fileIndexRaw !== '' ? Number(fileIndexRaw) : NaN;

  const { folders, renameFile } = useNotes();

  const { folder, file, folderId, fileIndex } = useMemo(() => {
    if (Number.isNaN(parsedFolderId) || Number.isNaN(parsedFileIndex)) {
      return { folder: 'Folder', file: 'Untitled', folderId: null, fileIndex: null };
    }
    const f = folders.find((x) => x.id === parsedFolderId);
    if (!f || parsedFileIndex < 0 || parsedFileIndex >= f.files.length) {
      return { folder: 'Folder', file: 'Untitled', folderId: null, fileIndex: null };
    }
    return {
      folder: f.name,
      file: f.files[parsedFileIndex],
      folderId: parsedFolderId,
      fileIndex: parsedFileIndex,
    };
  }, [folders, parsedFolderId, parsedFileIndex]);

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

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
