'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useDesignMarketStore } from '@/store/designMarketStore';
import {
  ArrowLeft,
  Edit,
  Copy,
  Archive,
  Trash2,
  Share2,
  Star,
  AlertCircle,
  Tag,
  X,
} from 'lucide-react';

export default function DesignDetailPage() {
  const params = useParams();
  const designId = params.id as string;
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishPrice, setPublishPrice] = useState('0');
  const [publishDescription, setPublishDescription] = useState('');
  const [publishTags, setPublishTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const { myDesigns, updateDesign, deleteDesign, archiveDesign, publishToMarketplace } =
    useDesignMarketStore();

  const design = myDesigns.find(d => d.id === designId);

  if (!design) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Design not found</h2>
          <Link href="/dashboard/designs" className="text-[#0066CC] hover:underline mt-4">
            Back to designs
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleSaveName = () => {
    if (newName.trim() && newName !== design.name) {
      updateDesign({ ...design, name: newName });
    }
    setEditingName(false);
  };

  const handleSaveDescription = () => {
    if (newDescription !== design.description) {
      updateDesign({ ...design, description: newDescription });
    }
    setEditingDescription(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !publishTags.includes(tagInput.toLowerCase())) {
      setPublishTags([...publishTags, tagInput.toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setPublishTags(publishTags.filter(t => t !== tag));
  };

  const handlePublish = () => {
    publishToMarketplace(design.id, parseFloat(publishPrice) || 0, publishDescription, publishTags);
    setShowPublishModal(false);
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
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/designs" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex-1">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === 'Enter') handleSaveName();
                  }}
                  className="text-3xl font-bold border-b-2 border-[#0066CC] focus:outline-none p-1"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="px-3 py-1 bg-[#0066CC] text-white rounded text-sm"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-gray-900">{design.name}</h1>
                <button
                  onClick={() => {
                    setNewName(design.name);
                    setEditingName(true);
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Edit size={20} className="text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div
                className="w-full h-96 flex items-center justify-center p-8"
                style={{ background: getCategoryGradient(design.category) }}
              >
                <div className="text-white text-center">
                  <p className="text-4xl font-bold mb-2">{design.name}</p>
                  <p className="text-lg opacity-75">{design.width}x{design.height}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                {!editingDescription && (
                  <button
                    onClick={() => {
                      setNewDescription(design.description);
                      setEditingDescription(true);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Edit size={18} className="text-gray-600" />
                  </button>
                )}
              </div>

              {editingDescription ? (
                <div className="space-y-2">
                  <textarea
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#0066CC] focus:outline-none"
                    rows={4}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditingDescription(false)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveDescription}
                      className="px-3 py-1 bg-[#0066CC] text-white rounded text-sm"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">{design.description}</p>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Tag size={20} />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {design.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button className="hover:text-blue-900">×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Version History */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Version History</h3>
              <div className="space-y-3">
                {design.versions
                  .slice()
                  .reverse()
                  .map((version, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          Version {version.version}
                        </p>
                        <p className="text-sm text-gray-600">{version.note}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(version.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                          Restore
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Meta Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Category</p>
                <p className="font-semibold text-gray-900 capitalize">{design.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Created</p>
                <p className="font-semibold text-gray-900">
                  {new Date(design.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Modified</p>
                <p className="font-semibold text-gray-900">
                  {new Date(design.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Dimensions</p>
                <p className="font-semibold text-gray-900">
                  {design.width}x{design.height}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Version</p>
                <p className="font-semibold text-gray-900">v{design.version}</p>
              </div>
            </div>

            {/* Marketplace Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {design.isPublished ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    <span className="text-green-700 font-medium text-sm">Published</span>
                  </div>

                  {design.downloads !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Downloads</p>
                      <p className="text-2xl font-bold text-gray-900">{design.downloads}</p>
                    </div>
                  )}

                  {design.rating !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Rating</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < Math.floor(design.rating || 0) ? 'fill-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {design.rating} ({design.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  )}

                  {design.marketplacePrice !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Price</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${design.marketplacePrice === 0 ? 'FREE' : design.marketplacePrice.toFixed(2)}
                      </p>
                    </div>
                  )}

                  <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                    Edit Listing
                  </button>
                  <button className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium">
                    Unpublish
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    <span className="text-gray-700 font-medium text-sm">Not Published</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Publish your design to the marketplace to earn money and let others use it.
                  </p>
                  <button
                    onClick={() => setShowPublishModal(true)}
                    className="w-full px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    Publish to Marketplace
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
              <Link
                href="/studio"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-blue-700"
              >
                <Edit size={18} />
                Open in Studio
              </Link>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                <Copy size={18} />
                Duplicate
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                <Share2 size={18} />
                Share
              </button>
              <button
                onClick={() => archiveDesign(design.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50"
              >
                <Archive size={18} />
                Archive
              </button>
              <button
                onClick={() => deleteDesign(design.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Publish Modal */}
        {showPublishModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Publish to Marketplace</h3>
                <button onClick={() => setShowPublishModal(false)}>
                  <X size={24} className="text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Price</label>
                  <div className="flex items-center">
                    <span className="text-gray-600 font-semibold">$</span>
                    <input
                      type="number"
                      value={publishPrice}
                      onChange={e => setPublishPrice(e.target.value)}
                      className="flex-1 ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:border-[#0066CC] focus:outline-none"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Set to 0 for free template</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    value={publishDescription}
                    onChange={e => setPublishDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#0066CC] focus:outline-none"
                    rows={3}
                    placeholder="Describe your design..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          handleAddTag();
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-[#0066CC] focus:outline-none text-sm"
                      placeholder="Add tag..."
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-3 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {publishTags.map(tag => (
                      <span
                        key={tag}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center gap-1"
                      >
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)}>×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowPublishModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePublish}
                    className="flex-1 px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-blue-700"
                  >
                    Publish
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
