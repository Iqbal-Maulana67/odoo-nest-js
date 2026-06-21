'use client';

import { useState, useEffect, useRef } from 'react';

interface DropdownProps {
  label: string;
  items: string[];
}

export default function Dropdown({ label, items }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        {label}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <ul className="py-1">
            {items.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}