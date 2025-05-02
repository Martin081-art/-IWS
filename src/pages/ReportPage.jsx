import React, { useEffect, useState } from 'react';

const ReportPage = () => {
  const [queries, setQueries] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newReply, setNewReply] = useState("");

  // Fetch queries from the API when the component mounts
  useEffect(() => {
    fetch('http://localhost:5000/api/queries') // Ensure the correct endpoint
      .then(res => res.json())
      .then(data => setQueries(data))
      .catch(err => console.error('Error fetching queries:', err));
  }, []);

  // Update the reply for a query
  const handleReplyUpdate = async (queryId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/queries/reply/${queryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply_message: newReply })
      });

      if (res.ok) {
        // Update the queries state to reflect the new reply and status change
        const updatedQueries = queries.map(q =>
          q.query_id === queryId ? { ...q, reply_message: newReply, status: 'complete' } : q
        );
        setQueries(updatedQueries);
        setEditingId(null);
        setNewReply("");
      } else {
        console.error("Failed to update reply");
      }
    } catch (error) {
      console.error("Error updating reply:", error);
    }
  };

  // Filter queries based on the search input
  const filteredQueries = queries.filter(q =>
    q.name.toLowerCase().includes(search.toLowerCase()) ||
    q.email.toLowerCase().includes(search.toLowerCase()) ||
    q.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center text-green-800">Customer Queries Report</h1>

      <input
        type="text"
        placeholder="Search by name, email, or message..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full px-4 py-2 border border-gray-300 rounded shadow-sm"
      />

      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white shadow-lg rounded-lg">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Message</th>
              <th className="p-3">Reply</th>
              <th className="p-3">Actions</th>
              <th className="p-3">Status</th>
              <th className="p-3">Auto Replied</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueries.map((query) => (
              <tr key={query.query_id} className="border-b hover:bg-gray-100">
                <td className="p-3 text-center">{query.query_id}</td>
                <td className="p-3">{query.name}</td>
                <td className="p-3">{query.email}</td>
                <td className="p-3">{query.message}</td>

                <td className="p-3">
                  {editingId === query.query_id ? (
                    <input
                      type="text"
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      className="border p-1 w-full"
                    />
                  ) : (
                    query.reply_message || <span className="italic text-gray-400">No reply yet</span>
                  )}
                </td>

                <td className="p-3 text-center">
                  {editingId === query.query_id ? (
                    <button
                      onClick={() => handleReplyUpdate(query.query_id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(query.query_id);
                        setNewReply(query.reply_message || "");
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Reply
                    </button>
                  )}
                </td>

                <td className="p-3 text-center">{query.status}</td>
                <td className="p-3 text-center">{query.auto_replied ? "Yes" : "No"}</td>
                <td className="p-3 text-sm">{new Date(query.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportPage;
