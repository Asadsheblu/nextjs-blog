import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const UserProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [isUpdated, setIsUpdated] = useState(false);
  const [remainingDays, setRemainingDays] = useState(null);

  useEffect(() => {
    if (user && user.paymentStatus !== 'success' && !isUpdated) {
      updateUserProfile().then(() => setIsUpdated(true));
    }

    if (user && user.paymentStatus === 'success') {
      const updateRemainingDays = () => {
        const currentDate = new Date();
        const validUntilDate = new Date(user.subscriptionValidUntil);
        const diffTime = Math.abs(validUntilDate - currentDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setRemainingDays(diffDays);
      };

      updateRemainingDays();
      const intervalId = setInterval(updateRemainingDays, 86400000); // Update every 24 hours

      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, [user, updateUserProfile, isUpdated]);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text('Invoice', 14, 20);
    doc.setFontSize(12);
    doc.text(`Email: ${user.email}`, 14, 30);
    doc.text(`Payment Status: ${user.paymentStatus}`, 14, 40);

    if (user.paymentStatus === 'success') {
      doc.text('Subscription Details', 14, 50);
      doc.autoTable({
        startY: 55,
        head: [['Plan', 'Valid Until', 'Remaining Days', 'Amount Paid', 'Currency', 'Payment Method']],
        body: [[
          user.subscriptionPlan,
          user.subscriptionValidUntil ? new Date(user.subscriptionValidUntil).toLocaleDateString() : 'N/A',
          remainingDays !== null ? remainingDays : 'N/A',
          `$${user.paymentDetails?.amountPaid}`,
          user.paymentDetails?.currency,
          user.paymentDetails?.paymentMethod,
        ]],
      });
    } else {
      doc.text('No active subscription.', 14, 50);
    }

    doc.save('invoice.pdf');
  };

  if (!user) {
    return <p className="text-center text-red-500">Please log in to view your profile.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Payment Invoice</h1>
        <div className="border-b pb-4 mb-4">
          <p className="text-lg"><strong>Email:</strong> {user.email}</p>
          <p className="text-lg"><strong>Payment Status:</strong> <span className={`font-semibold ${user.paymentStatus === 'success' ? 'text-green-500' : 'text-red-500'}`}>{user.paymentStatus}</span></p>
        </div>
        {user.paymentStatus === 'success' ? (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Subscription Details</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-lg"><strong>Plan:</strong> {user.subscriptionPlan}</p>
              <p className="text-lg"><strong>Validity Period:</strong> {user.metadata?.validityPeriod} Days</p>
              <p className="text-lg"><strong>Remaining Days:</strong> {remainingDays !== null ? remainingDays : 'Calculating...'} Days</p>
              <p className="text-lg"><strong>Subscription Valid Until:</strong> {user.subscriptionValidUntil ? new Date(user.subscriptionValidUntil).toLocaleDateString() : 'N/A'}</p>
              <p className="text-lg"><strong>Amount Paid:</strong> ${user.paymentDetails?.amountPaid}</p>
              <p className="text-lg"><strong>Currency:</strong> {user.paymentDetails?.currency}</p>
              <p className="text-lg"><strong>Payment Method:</strong> {user.paymentDetails?.paymentMethod}</p>
              <p className="text-green-600 mt-4">Full access granted.</p>
            </div>
            <button
              onClick={generatePDF}
              className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Download Invoice
            </button>
          </div>
        ) : (
          <p className="text-center text-red-500 mt-4">No active subscription. Please subscribe to get full access.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
