import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Layout from './layout';
import { FaTrash } from 'react-icons/fa';
import Image from 'next/image';

Modal.setAppElement('#__next');

export default function ImageGallery() {
  const [images, setImages] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch('/api/media');
      const data = await response.json();
      console.log(data);
      setImages(data.images);
    };

    fetchImages();
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFile(null);
    setTitle('');
    setMessage('');
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setMessage(data.message);
        setImages([...images, data.data]);
        closeModal();
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (imageId) => {
    console.log(`Deleting image with id: ${imageId}`);
    try {
      const response = await fetch(`/api/media?id=${imageId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setImages(images.filter((image) => image._id !== imageId));
        setMessage(data.message);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.log('Error deleting image:', error);
      setMessage(`Error: ${error.message}`);
    }
  };

  const formatUrlForDisplay = (url) => {
    const urlParts = url.split('/');
    const fileName = urlParts.pop();
    const cleanFileName = fileName
      .replace(/[^a-zA-Z-]/g, '') // Remove everything except alphabets and hyphens
      .replace(/--+/g, '-')       // Replace multiple hyphens with a single hyphen
      .replace(/^-+|-+$/g, '')    // Remove leading and trailing hyphens
      .toLowerCase();
    return `${urlParts.join('/')}/${cleanFileName}`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Media List</h1>
        <button onClick={openModal} className="mb-4 bg-blue-500 text-white py-2 px-4 rounded">
          Create
        </button>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-1/12 py-2 px-4">SL</th>
                <th className="w-2/12 py-2 px-4">File</th>
                <th className="w-4/12 py-2 px-4">URL</th>
                <th className="w-4/12 py-2 px-4">Title</th>
                <th className="w-1/12 py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {images.map((image, index) => (
                <tr key={image._id} className="text-gray-700">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">
                    <Image src={image.url} alt={image.title} width={64} height={64} />
                  </td>
                  <td className="border px-4 py-2">
                    <a href={image.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      {formatUrlForDisplay(image.url)}
                    </a>
                  </td>
                  <td className="border px-4 py-2">{image.title}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDelete(image._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Upload Image"
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
            },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              padding: '20px',
              maxWidth: '500px',
              width: '100%',
            },
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Upload Image</h2>
          <form onSubmit={handleUpload}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="file" className="block text-gray-700 font-bold mb-2">Upload Image File</label>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Upload Image</button>
          </form>
          {message && <p className="mt-4 text-red-500">{message}</p>}
          <button onClick={closeModal} className="mt-4 bg-gray-500 text-white py-2 px-4 rounded">Close</button>
        </Modal>
      </div>
    </Layout>
  );
}
