import React, { useState } from 'react';
import { FiEdit2, FiSave } from 'react-icons/fi';

export default function DoctorNotes({ notes = '' }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(notes);

  const handleSave = () => {
    // Save to backend here
    setIsEditing(false);
  };

  return (
    <div className="relative">
      {isEditing ? (
        <textarea
          value={editedNotes}
          onChange={(e) => setEditedNotes(e.target.value)}
          className="w-full bg-gray-700 text-white rounded-lg p-4 border border-gray-600 focus:border-blue-500 focus:outline-none min-h-[150px]"
          placeholder="Enter doctor notes..."
        />
      ) : (
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 min-h-[150px]">
          <p className="text-gray-300 whitespace-pre-wrap">
            {editedNotes || 'No notes available'}
          </p>
        </div>
      )}
      <button
        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        className="absolute top-2 right-2 p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
      >
        {isEditing ? (
          <FiSave className="w-4 h-4 text-white" />
        ) : (
          <FiEdit2 className="w-4 h-4 text-white" />
        )}
      </button>
    </div>
  );
}












