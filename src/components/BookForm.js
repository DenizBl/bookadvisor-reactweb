import React, { useState, useRef } from 'react';
import { db, storage } from '../firebase/config';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';

// İkonlar
const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

const ImageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export default function BookForm({ book, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: book?.title || '',
    description: book?.description || '',
    targetAudience: book?.targetAudience || '',
    author: book?.author || '',
    isbn: book?.isbn || '',
    imageUrl: book?.imageUrl || book?.thumbnail || '',
    pageCount: book?.pageCount || '',
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    book?.imageUrl || book?.thumbnail || '',
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (file) => {
    if (!file) return null;

    try {
      setUploadingImage(true);

      // Dosya tipini kontrol et
      if (!file.type.startsWith('image/')) {
        toast.error('Lütfen bir resim dosyası seçin');
        return null;
      }

      // Dosya boyutunu kontrol et (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Resim boyutu 5MB'dan küçük olmalıdır");
        return null;
      }

      // Firebase Storage'a yükle
      const fileName = `book-covers/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, fileName);

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Resim yüklenirken hata oluştu');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Önizleme için dosyayı oku
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.imageUrl;

      // Eğer yeni bir resim seçildiyse, önce onu yükle
      if (selectedFile) {
        const uploadedImageUrl = await handleImageUpload(selectedFile);
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        }
      }

      const bookData = {
        ...formData,
        imageUrl,
        thumbnail: imageUrl, // API uyumluluğu için
      };

      if (book) {
        // Update existing book
        await updateDoc(doc(db, 'books', book.id), bookData);
        toast.success('Kitap başarıyla güncellendi!');
      } else {
        // Add new book
        await addDoc(collection(db, 'books'), {
          ...bookData,
          createdAt: new Date().toISOString(),
        });
        toast.success('Kitap başarıyla eklendi!');
      }
      onSuccess?.();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Bir hata oluştu: ' + error.message);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUrlChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      imageUrl: value,
    }));
    setImagePreview(value);
    setSelectedFile(null); // URL girildiyse dosya seçimini temizle
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Kitap Kapağı */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kitap Kapağı
        </label>

        {/* Resim Önizleme */}
        <div className="mb-4">
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Kitap kapağı önizleme"
                className="w-32 h-48 object-cover rounded-lg border-2 border-gray-300"
                onError={() => {
                  setImagePreview('');
                  toast.error('Resim yüklenemedi');
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview('');
                  setSelectedFile(null);
                  setFormData((prev) => ({ ...prev, imageUrl: '' }));
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="w-32 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ImageIcon />
                <p className="text-xs text-gray-500 mt-1">Resim yok</p>
              </div>
            </div>
          )}
        </div>

        {/* Dosya Yükleme */}
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            type="button"
            onClick={triggerFileInput}
            disabled={uploadingImage}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <UploadIcon />
            <span className="ml-2">
              {uploadingImage ? 'Yükleniyor...' : 'Resim Yükle'}
            </span>
          </button>

          <div className="flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">veya</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* URL ile resim ekleme */}
          <div>
            <input
              type="url"
              placeholder="Resim URL'si girin"
              value={formData.imageUrl}
              onChange={handleImageUrlChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              Bir resim dosyası yükleyebilir veya resim URL'si girebilirsiniz
            </p>
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Kitap Adı
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="author"
          className="block text-sm font-medium text-gray-700"
        >
          Yazar
        </label>
        <input
          type="text"
          name="author"
          id="author"
          required
          value={formData.author}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="isbn"
          className="block text-sm font-medium text-gray-700"
        >
          ISBN
        </label>
        <input
          type="text"
          name="isbn"
          id="isbn"
          required
          value={formData.isbn}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="pageCount"
          className="block text-sm font-medium text-gray-700"
        >
          Sayfa Sayısı
        </label>
        <input
          type="number"
          name="pageCount"
          id="pageCount"
          min="1"
          required
          value={formData.pageCount}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="targetAudience"
          className="block text-sm font-medium text-gray-700"
        >
          Hedef Kitle
        </label>
        <select
          name="targetAudience"
          id="targetAudience"
          required
          value={formData.targetAudience}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Seçiniz</option>
          <option value="children">Çocuklar</option>
          <option value="young-adult">Genç Yetişkinler</option>
          <option value="adult">Yetişkinler</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Açıklama
        </label>
        <textarea
          name="description"
          id="description"
          rows={4}
          required
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="flex space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading || uploadingImage}
            className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            İptal
          </button>
        )}
        <button
          type="submit"
          disabled={loading || uploadingImage}
          className={`${
            onCancel ? 'flex-1' : 'w-full'
          } flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading
            ? 'Kaydediliyor...'
            : uploadingImage
            ? 'Resim yükleniyor...'
            : book
            ? 'Güncelle'
            : 'Ekle'}
        </button>
      </div>
    </form>
  );
}