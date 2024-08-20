import { useState } from 'react';
import { FaUser, FaEnvelope, FaRegFileAlt, FaPaperPlane } from 'react-icons/fa';
import contact from "../public/contact.png";
import Image from 'next/image';
import Head from 'next/head';
export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/send-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setResponseMessage('Thank you for contacting us!');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        setResponseMessage('Failed to send your message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      setResponseMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
       <Head>
            <title>Contact Us</title>
            <meta
              name="description"
              content="Pricing Page"
            />
            <meta
              property="og:url"
              content="https://ytubetools.com/contact"
            />
         
            <meta
              property="og:description"
              content={
                "Enhance your YouTube experience with our comprehensive suite of tools designed for creators and viewers alike. Extract video summaries, titles, descriptions, and more. Boost your channel's performance with advanced features and insights"
              }
            />
          
          
            </Head>
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg flex">
        <div className="w-1/2 pr-6 hidden md:block">
          <Image src={contact} alt="Contact Us" className="w-full h-full object-cover rounded-lg" />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-semibold mb-6 text-red-600">Contact Us</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center border-b border-red-500 py-2">
              <FaUser className="text-red-500 mr-3" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                placeholder="Name"
                required
              />
            </div>
            <div className="flex items-center border-b border-red-500 py-2">
              <FaEnvelope className="text-red-500 mr-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                placeholder="Email"
                required
              />
            </div>
            <div className="flex items-center border-b border-red-500 py-2">
              <FaRegFileAlt className="text-red-500 mr-3" />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                placeholder="Subject"
                required
              />
            </div>
            <div className="flex items-center border-b border-red-500 py-2">
              <FaPaperPlane className="text-red-500 mr-3" />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                placeholder="Message"
                rows="4"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
          {responseMessage && <p className="mt-4 text-green-500">{responseMessage}</p>}
        </div>
      </div>
    </div>
  );
}