import React from 'react';
import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
  const { volumeInfo } = book;

  return (
    <Link to={`/book/${book.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative pb-[140%]">
          <img
            src={volumeInfo.imageLinks?.thumbnail || '/placeholder-book.png'}
            alt={volumeInfo.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {volumeInfo.title}
          </h3>
          {volumeInfo.authors && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-1">
              {volumeInfo.authors.join(', ')}
            </p>
          )}
          {volumeInfo.publishedDate && (
            <p className="text-sm text-gray-500">
              {new Date(volumeInfo.publishedDate).getFullYear()}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
