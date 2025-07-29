import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Notifications() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [isSending, setIsSending] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Use the new endpoint to fetch users with valid emails
        const res = await axios.get('/api/admin/notifications/users');
        setUsers(res.data);
      } catch (err) {
        toast.error('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  const sendNotification = async () => {
    if (!subject || !message || !location) {
      toast.error('Please fill all fields');
      return;
    }

    setIsSending(true);
    try {
      const res = await axios.post('/api/admin/notifications', {
        subject,
        message,
        location,
        scheduleDate,
      }, {
        headers: {
          'Content-Type': 'application/json', // Ensure content-type is set
        },
      });

      toast.success(`Notification scheduled for ${res.data.count} users!`);
      setSubject('');
      setMessage('');
      setLocation('');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to send notification';
      toast.error(errorMsg);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Schedule Cleaning Notification</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Users to Notify</label>
          <p className="text-gray-600">{users.length} users with valid emails</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            placeholder="Cleaning Schedule Update"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border border-gray-300 px-4 py-2 w-full rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            placeholder="Building A, Floor 3"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border border-gray-300 px-4 py-2 w-full rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date & Time</label>
          <DatePicker
            selected={scheduleDate}
            onChange={(date) => setScheduleDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="border border-gray-300 px-4 py-2 w-full rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            placeholder="Dear Resident, We would like to inform you about..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="border border-gray-300 px-4 py-2 w-full rounded-md"
          />
        </div>

        <button
          onClick={sendNotification}
          disabled={isSending}
          className={`px-6 py-2 rounded-md text-white font-medium ${isSending ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSending ? 'Sending...' : 'Send Notification'}
        </button>
      </div>
    </div>
  );
}
