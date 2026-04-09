'use client';

import { createContext, useContext, useState } from 'react';

const NotesContext = createContext(null);

const initialFolders = [
  { id: 1, name: 'Math', files: ['Calculus Notes', 'Algebra Review'] },
];

export function NotesProvider({ children }) {
  const [folders, setFolders] = useState(initialFolders);

  const addFile = (folderId, name) => {
    setFolders(prev => prev.map(f =>
      f.id === folderId ? { ...f, files: [...f.files, name] } : f
    ));
  };

  const renameFile = (folderId, fileIndex, newName) => {
    setFolders(prev => prev.map(f => {
      if (f.id !== folderId) return f;
      const files = [...f.files];
      files[fileIndex] = newName;
      return { ...f, files };
    }));
  };

  const deleteFile = (folderId, fileIndex) => {
    setFolders(prev => prev.map(f =>
      f.id === folderId
        ? { ...f, files: f.files.filter((_, i) => i !== fileIndex) }
        : f
    ));
  };

  const addFolder = (name) => {
    setFolders(prev => [...prev, { id: Date.now(), name, files: [] }]);
  };

  const renameFolder = (folderId, newName) => {
    setFolders(prev => prev.map(f =>
      f.id === folderId ? { ...f, name: newName } : f
    ));
  };

  const deleteFolder = (folderId) => {
    setFolders(prev => prev.filter(f => f.id !== folderId));
  };

  return (
    <NotesContext.Provider value={{
      folders,
      addFile, renameFile, deleteFile,
      addFolder, renameFolder, deleteFolder,
    }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  return useContext(NotesContext);
}
