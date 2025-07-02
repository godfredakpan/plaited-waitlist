import React, { useState } from 'react';

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email } = form;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email) return showToast('Please enter your name and email.', 'error');
    if (!emailPattern.test(email)) return showToast('Please enter a valid email.', 'error');

    setLoading(true);

    try {
      const res = await fetch('https://api.orderrave.ng/api/plated/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(form),
      });

     if (!res.ok) {
        const err = await res.json();
        if (
          err.message === "The given data was invalid." &&
          err.errors &&
          err.errors.email &&
          err.errors.email.includes("The email has already been taken.")
        ) {
          showToast("You're already on the waitlist! 🎉", "success");
          setShowModal(false);
          setForm({ name: '', email: '' });
        } else {
          showToast(err.message || "An error occurred.", "error");
        }
        setLoading(false);
        return;
      }

      showToast("You're on the waitlist! 🎉", 'success');
      setForm({ name: '', email: '' });
      setShowModal(false);
    } catch (error) {
      console.error(error);
      showToast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#fff9f3' }} className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-[#fff9f3]">
      {toast.visible && (
        <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white text-sm z-50 ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.message}
        </div>
      )}

      <img src="plated-logo.png" alt="Plaited Logo" className="w-1/2 sm:w-1/3 mb-4" />

      <p className="text-lg sm:text-xl max-w-xl mb-6">
        <span className="text-2xl text-[#321725]">event RSVP and catering</span><br />
        powered by <strong><a href="https://www.orderrave.ng" target="_blank" rel="noopener noreferrer">orderrave</a></strong>
      </p>

      <ul className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
        {['Seamless guest RSVPs', 'Automated food & drink planning', 'Dashboard for event organizers'].map((item) => (
          <li key={item} className="flex items-center gap-2 bg-white/80 border border-gray-200 rounded-xl px-4 py-2 shadow-sm text-gray-700 text-base">
            <span className="text-green-600 text-lg">✅</span>{item}
          </li>
        ))}
      </ul>

      <button
        onClick={toggleModal}
        style={{ backgroundColor: '#582641' }}
        className="bg-[#582641] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
      >
        Join the Waitlist
      </button>

      <p className="text-xs text-gray-500 mt-6">Launching Soon 🎉</p>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-left">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-light">Be the first to know...</h2>
              <button onClick={toggleModal} className="text-gray-500 hover:text-red-500 text-xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3 mb-4 border border-gray-300 rounded-xl"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-3 mb-4 border border-gray-300 rounded-xl"
                required
              />
             <button
              style={{ backgroundColor: '#582641' }}
              type="submit"
              className="w-full bg-[#582641] text-white py-3 rounded-xl hover:opacity-90 transition"
              disabled={loading}
            >
              {loading ? (
                <span>
                  <svg className="animate-spin h-5 w-5 inline-block mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                'Submit'
              )}
            </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
