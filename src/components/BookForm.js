import React, { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function BookForm({ book, onSuccess }) {
  const [formData, setFormData] = useState({
    title: book?.title || '',
    description: book?.description || '',
    targetAudience: book?.targetAudience || '',
    author: book?.author || '',
    isbn: book?.isbn || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (book) {
        // Update existing book
        await updateDoc(doc(db, 'books', book.id), formData);
        toast.success('Kitap başarıyla güncellendi!');
      } else {
        // Add new book
        await addDoc(collection(db, 'books'), {
          ...formData,
          createdAt: new Date().toISOString()
        });
        toast.success('Kitap başarıyla eklendi!');
      }
      onSuccess?.();
    } catch (error) {
      toast.error('Bir hata oluştu: ' + error.message);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Kitap Adı
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">
          Yazar
        </label>
        <input
          type="text"
          name="author"
          id="author"
          required
          value={formData.author}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
          ISBN
        </label>
        <input
          type="text"
          name="isbn"
          id="isbn"
          required
          value={formData.isbn}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">
          Hedef Kitle
        </label>
        <select
          name="targetAudience"
          id="targetAudience"
          required
          value={formData.targetAudience}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Seçiniz</option>
          <option value="children">Çocuklar</option>
          <option value="young-adult">Genç Yetişkinler</option>
          <option value="adult">Yetişkinler</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Açıklama
        </label>
        <textarea
          name="description"
          id="description"
          rows={4}
          required
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? 'Kaydediliyor...' : (book ? 'Güncelle' : 'Ekle')}
        </button>
      </div>
    </form>
  );
} 