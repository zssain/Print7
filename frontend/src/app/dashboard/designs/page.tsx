'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useDesignMarketStore } from '@/store/designMarketStore';
import {
  Grid,
  List,
  Plus,
  Upload,
  Folder,
  MoreVertical,
  Edit,
  Copy,
  FolderOpen,
  Bookmark,
} from 'lucide-react';

export default function DesignsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'name-az' | 'name-za' | 'category'>('recent');
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>(undefined);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#667eea');
  const [expandArchived, setExpandArchived] = useState(false);
  const [selectedDesigns, setSelectedDesigns] = useState<Set<string>>(new Set());
  const [bulkActionMode, setBulkActionMode] = useState(false);

  const {
    myDesigns,
    folders,
    createFolder,
    deleteDesign,
    archiveDesign,
    duplicateDesign,
  } = useDesignMarketStore();

  const folderColors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140'];

  // Get designs for current folder
  const displayDesigns = useMemo(() => {
    let filtered = myDesigns.filter(d => !d.isArchived && d.folderId === selectedFolder);

    // Sort
    switch (sortBy) {
      case 'name-az':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }

    return filtered;
  }, [myDesigns, selectedFolder, sortBy]);

  const archivedDesigns = myDesigns.filter(d => d.isArchived);
  const totalDesigns = myDesigns.filter(d => !d.isArchived).length;
  const publishedDesigns = myDesigns.filter(d => d.isPublished && !d.isArchived).length;
  const totalDownloads = myDesigns.reduce((sum, d) => sum + (d.downloads || 0), 0);
  const totalEarnings = myDesigns.reduce(
    (sum, d) => sum + ((d.marketplacePrice || 0) * (d.downloads || 0)),
    0
  );

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName, newFolderColor);
      setNewFolderName('');
      setShowNewFolder(false);
    }
  };

  const handleSelectDesign = (designId: string) => {
    const newSelected = new Set(selectedDesigns);
    if (newSelected.has(designId)) {
      newSelected.delete(designId);
    } else {
      newSelected.add(designId);
    }
    setSelectedDesigns(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedDesigns.size === displayDesigns.length) {
      setSelectedDesigns(new Set());
    } else {
      setSelectedDesigns(new Set(displayDesigns.map(d => d.id)));
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'business-cards':
        return 'linear-gradient(135deg, #667eea, #764ba2)';
      case 'flyers':
        return 'linear-gradient(135deg, #f093fb, #f5576c)';
      case 'posters':
        return 'linear-gradient(135deg, #fa709a, #fee140)';
      case 't-shirts':
      case 'apparel':
        return 'linear-gradient(135deg, #4facfe, #00f2fe)';
      case 'stickers':
        return 'linear-gradient(135deg, #43e97b, #38f9d7)';
      case 'mugs':
        return 'linear-gradient(135deg, #a18cd1, #fbc2eb)';
      case 'banners':
        return 'linear-gradient(135deg, #fee140, #fbc2eb)';
      default:
        return 'linear-gradient(135deg, #a18cd1, #fbc2eb)';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Designs</h1>
            <p className="text-gray-600 mt-1">{totalDesigns} designs in library</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/studio"
              className="flex items-center gap-2 px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Create New Design
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload size={20} />
              Upload Design
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm">Total Designs</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalDesigns}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm">Published</p>
            <p className="text-2xl font-bold text-[#0066CC] mt-1">{publishedDesigns}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm">Total Downloads</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalDownloads}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm">Total Earned</p>
            <p className="text-2xl font-bold text-green-600 mt-1">${totalEarnings.toFixed(2)}</p>
          </div>
        </div>

        {/* Folders and Controls */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setSelectedFolder(undefined)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedFolder === undefined
                  ? 'bg-[#0066CC] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Designs
            </button>

            {folders.map(folder => (
              <div key={folder.id} className="relative group">
                <button
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                    selectedFolder === folder.id
                      ? 'bg-[#0066CC] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Folder size={16} style={{ color: folder.color }} />
                  {folder.name}
                  <span className="text-xs ml-1">({folder.designCount})</span>
                </button>
                <div className="absolute right-0 mt-0 w-32 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                    Rename
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600">
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {showNewFolder ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Folder name..."
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === 'Enter') handleCreateFolder();
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0066CC]"
                  autoFocus
                />
                <select
                  value={newFolderColor}
                  onChange={e => setNewFolderColor(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {folderColors.map(color => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleCreateFolder}
                  className="px-3 py-2 bg-[#0066CC] text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowNewFolder(false);
                    setNewFolderName('');
                  }}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowNewFolder(true)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                New Folder
              </button>
            )}
          </div>

          {/* View and Sort Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#0066CC] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#0066CC] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <List size={20} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              {bulkActionMode && selectedDesigns.size > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{selectedDesigns.size} selected</span>
                  <button
                    onClick={() => {
                      selectedDesigns.forEach(id => archiveDesign(id));
                      setSelectedDesigns(new Set());
                    }}
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                  >
                    Archive
                  </button>
                  <button
                    onClick={() => {
                      selectedDesigns.forEach(id => deleteDesign(id));
                      setSelectedDesigns(new Set());
                    }}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              )}

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="recent">Recent</option>
                <option value="name-az">Name (A-Z)</option>
                <option value="name-za">Name (Z-A)</option>
                <option value="category">Category</option>
              </select>

              {!bulkActionMode && (
                <button
                  onClick={() => {
                    setBulkActionMode(!bulkActionMode);
                    setSelectedDesigns(new Set());
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  {bulkActionMode ? 'Cancel' : 'Select'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Designs Grid/List */}
        {displayDesigns.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayDesigns.map(design => (
                  <div
                    key={design.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group relative"
                  >
                    {bulkActionMode && (
                      <input
                        type="checkbox"
                        checked={selectedDesigns.has(design.id)}
                        onChange={() => handleSelectDesign(design.id)}
                        className="absolute top-3 left-3 w-5 h-5 z-10 cursor-pointer"
                      />
                    )}

                    {/* Thumbnail */}
                    <div
                      className="w-full h-40 relative overflow-hidden"
                      style={{ background: getCategoryGradient(design.category) }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
                        <div>
                          <p className="font-semibold text-sm">{design.name}</p>
                          <p className="text-xs opacity-75 mt-1">v{design.version}</p>
                        </div>
                      </div>

                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Link
                          href="/studio"
                          className="p-2 bg-[#0066CC] text-white rounded-lg hover:bg-blue-700"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => duplicateDesign(design.id)}
                          className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
                          title="Duplicate"
                        >
                          <Copy size={18} />
                        </button>
                        <button className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800" title="Move">
                          <FolderOpen size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 truncate">{design.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{design.category}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(design.updatedAt).toLocaleDateString()}
                      </p>

                      {/* Badge */}
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          v{design.version}
                        </span>
                        {design.isPublished && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            Published
                          </span>
                        )}
                      </div>

                      {/* Actions Dropdown */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => duplicateDesign(design.id)}
                          className="flex-1 text-xs text-gray-600 hover:text-gray-900 py-1"
                        >
                          Duplicate
                        </button>
                        <button className="flex-1 text-xs text-gray-600 hover:text-gray-900 py-1">
                          Publish
                        </button>
                        <button
                          onClick={() => archiveDesign(design.id)}
                          className="flex-1 text-xs text-gray-600 hover:text-gray-900 py-1"
                        >
                          Archive
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {bulkActionMode && (
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedDesigns.size === displayDesigns.length}
                            onChange={handleSelectAll}
                            className="w-4 h-4"
                          />
                        </th>
                      )}
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Version
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Modified
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayDesigns.map(design => (
                      <tr
                        key={design.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        {bulkActionMode && (
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedDesigns.has(design.id)}
                              onChange={() => handleSelectDesign(design.id)}
                              className="w-4 h-4"
                            />
                          </td>
                        )}
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {design.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                          {design.category}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">v{design.version}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(design.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {design.isPublished ? (
                            <span className="text-green-600 font-medium">Published</span>
                          ) : (
                            <span className="text-gray-500">Draft</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button className="text-[#0066CC] hover:text-blue-700">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Bookmark size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No designs yet</h3>
            <p className="text-gray-600 mt-2">Start creating your first design</p>
            <Link
              href="/studio"
              className="inline-block mt-4 px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-blue-700"
            >
              Create Design
            </Link>
          </div>
        )}

        {/* Archived Section */}
        {archivedDesigns.length > 0 && (
          <div className="border-t-2 border-gray-200 pt-6">
            <button
              onClick={() => setExpandArchived(!expandArchived)}
              className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4"
            >
              {expandArchived ? '▼' : '▶'} Archived Designs ({archivedDesigns.length})
            </button>

            {expandArchived && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {archivedDesigns.map(design => (
                  <div key={design.id} className="bg-gray-50 rounded-lg border border-gray-300 opacity-60">
                    <div
                      className="w-full h-40 relative overflow-hidden"
                      style={{ background: getCategoryGradient(design.category) }}
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-700 truncate">{design.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{design.category}</p>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-300">
                        <button
                          onClick={() => {
                            // Restore logic
                          }}
                          className="flex-1 text-xs text-gray-600 hover:text-gray-900 py-1"
                        >
                          Restore
                        </button>
                        <button
                          onClick={() => deleteDesign(design.id)}
                          className="flex-1 text-xs text-red-600 hover:text-red-900 py-1"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
