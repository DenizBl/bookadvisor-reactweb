import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function CommentSection({ bookId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('bookId', '==', bookId),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addDoc(collection(db, 'comments'), {
        bookId,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        content: newComment,
        createdAt: new Date().toISOString()
      });
      setNewComment('');
      toast.success('Yorum başarıyla eklendi!');
    } catch (error) {
      toast.error('Yorum eklenirken bir hata oluştu: ' + error.message);
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900">Yorumlar</h3>
      
      <form onSubmit={handleSubmit} className="mt-4">
        <div>
          <label htmlFor="comment" className="sr-only">
            Yorumunuz
          </label>
          <textarea
            id="comment"
            name="comment"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Yorumunuzu yazın..."
          />
        </div>
        <div className="mt-3">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Yorum Yap
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {comment.userEmail}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-700">
              {comment.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 