import React from 'react';
import { Link } from 'react-router-dom';
import { categoriesData } from '../contexts/categoriesData';
import Header from '../components/Header';

export default function CategoriesPage() {
  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg px-4 py-2 mb-6">
          <h1 className="text-2xl font-bold text-white">
            Kategoriler
            <span className="text-sm font-normal text-red-100 ml-2">
              {categoriesData.length} kategori
            </span>
          </h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {categoriesData.map((category) => {
            const Icon = category.Icon;
            return (
              <Link
                to={`/category/${encodeURIComponent(category.slug)}`}
                key={category.slug}
                className="group bg-white rounded-xl shadow-lg border border-amber-300 hover:border-amber-500 
                           p-4 sm:p-6 flex flex-col items-center justify-center text-center 
                           transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105"
                style={{ minHeight: '160px' }}
              >
                <Icon className="w-10 h-10 sm:w-12 sm:h-12 mb-3 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-semibold text-sm sm:text-base text-gray-700 group-hover:text-amber-700">
                  {category.displayNameTR}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

