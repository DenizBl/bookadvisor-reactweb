import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminCommentManagement = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const commentsCollection = collection(db, 'bookComments');
        const commentsSnapshot = await getDocs(commentsCollection);
        const commentsList = [];

        commentsSnapshot.forEach((doc) => {
          const bookId = doc.id;
          const comments = doc.data().comments || [];
          comments.forEach((comment) => {
            commentsList.push({ ...comment, bookId });
          });
        });

        setComments(commentsList);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Yorumlar yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteDoc(doc(db, 'bookComments', commentId));
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Yorum silinirken bir hata oluştu.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Comment Management</h1>
      {comments.length === 0 ? (
        <div className="text-center text-gray-500">Henüz yorum bulunmuyor.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded shadow">
              <p className="text-gray-800">{comment.text}</p>
              <p className="text-sm text-gray-500 mt-2">
                Kitap ID: {comment.bookId}
              </p>
              <p className="text-sm text-gray-500">Yazar: {comment.name}</p>
              <p className="text-sm text-gray-500">
                Tarih: {comment.date} {comment.time}
              </p>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCommentManagement;