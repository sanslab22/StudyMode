import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import './Sidebar.css';

function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { folders, addFile, renameFile, deleteFile, addFolder, renameFolder, deleteFolder } = useNotes();

  const [expanded, setExpanded] = useState({ 1: true });
  const [openMenu, setOpenMenu] = useState(null);

  const toggleFolder = (id) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const menuKey = (type, folderId, fileIndex) =>
    `${type}-${folderId}-${fileIndex ?? ''}`;

  const isMenuOpen = (type, folderId, fileIndex) =>
    openMenu === menuKey(type, folderId, fileIndex);

  const toggleMenu = (e, type, folderId, fileIndex) => {
    e.stopPropagation();
    const key = menuKey(type, folderId, fileIndex);
    setOpenMenu(prev => prev === key ? null : key);
  };

  const handleAddFile = (folderId) => {
    const name = prompt('File name:');
    if (name) addFile(folderId, name);
    setOpenMenu(null);
  };

  const handleRenameFolder = (folderId, currentName) => {
    const name = prompt('Rename folder:', currentName);
    if (name && name !== currentName) renameFolder(folderId, name);
    setOpenMenu(null);
  };

  const handleDeleteFolder = (folderId) => {
    if (window.confirm('Delete this folder and all its files?')) deleteFolder(folderId);
    setOpenMenu(null);
  };

  const handleRenameFile = (folderId, fileIndex, currentName) => {
    const name = prompt('Rename file:', currentName);
    if (name && name !== currentName) renameFile(folderId, fileIndex, name);
    setOpenMenu(null);
  };

  const handleDeleteFile = (folderId, fileIndex) => {
    deleteFile(folderId, fileIndex);
    setOpenMenu(null);
  };

  const handleAddFolder = () => {
    const name = prompt('Folder name:');
    if (name) addFolder(name);
  };

  useEffect(() => {
    if (!openMenu) return;
    const handleClick = () => setOpenMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [openMenu]);

  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : 'sidebar--closed'}`}>
      <div className="sidebar-header">
        <button className="sidebar-collapse" onClick={onClose}>«</button>
      </div>

      {pathname !== '/home' && (
        <div className="sidebar-nav">
          <button className="sidebar-nav-btn" onClick={() => navigate('/home')}>🏠 Home</button>
        </div>
      )}

      <div className="sidebar-section-label">
        <span className="sidebar-label">Notes</span>
      </div>

      <div className="sidebar-tree">
        {folders.map(folder => (
          <div key={folder.id} className="folder-group">
            <div className="folder-row">
              <span className="folder-arrow" onClick={() => toggleFolder(folder.id)}>
                {expanded[folder.id] ? '▾' : '▸'}
              </span>
              <span className="folder-name" onClick={() => toggleFolder(folder.id)}>
                {folder.name}
              </span>
              <div className="dots-wrap">
                <button className="dots-btn" onClick={(e) => toggleMenu(e, 'folder', folder.id)}>⋯</button>
                {isMenuOpen('folder', folder.id) && (
                  <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                    <button className="dropdown-item" onClick={() => handleAddFile(folder.id)}>+ Add file</button>
                    <button className="dropdown-item" onClick={() => handleRenameFolder(folder.id, folder.name)}>✏ Rename</button>
                    <button className="dropdown-item dropdown-item--danger" onClick={() => handleDeleteFolder(folder.id)}>✕ Delete folder</button>
                  </div>
                )}
              </div>
            </div>

            {expanded[folder.id] && (
              <div className="file-list">
                {folder.files.map((file, i) => (
                  <div key={i} className="file-item"
                    onClick={() => navigate('/notes', { state: { folder: folder.name, file, folderId: folder.id, fileIndex: i } })}>
                    <span className="file-name">{file}</span>
                    <div className="dots-wrap">
                      <button className="dots-btn" onClick={(e) => toggleMenu(e, 'file', folder.id, i)}>⋯</button>
                      {isMenuOpen('file', folder.id, i) && (
                        <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                          <button className="dropdown-item" onClick={() => handleRenameFile(folder.id, i, file)}>✏ Rename</button>
                          <button className="dropdown-item dropdown-item--danger" onClick={() => handleDeleteFile(folder.id, i)}>✕ Delete file</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="new-folder-btn" onClick={handleAddFolder}>Create new folder +</button>
        <button className="study-friend-btn">Study with Friend</button>
      </div>
    </aside>
  );
}

export default Sidebar;
