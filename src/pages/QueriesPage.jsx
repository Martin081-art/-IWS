import React, { useEffect, useState } from "react";

const QueriesPage = () => {
  const [queries, setQueries] = useState([]);
  const [replies, setReplies] = useState({});

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/queries");
        const data = await response.json();
        if (response.ok) {
          setQueries(data);
        } else {
          console.error("Failed to fetch queries:", data.message);
          alert("Error fetching queries: " + data.message);
        }
      } catch (error) {
        console.error("Error fetching queries:", error);
        alert("Something went wrong while fetching queries.");
      }
    };

    fetchQueries();
  }, []);

  const handleReply = async (query_id) => {
    const reply_message = replies[query_id];
    if (!reply_message) {
      alert("Please enter a reply before submitting.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/queries/reply/${query_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply_message }),
      });

      const data = await res.json();

      if (res.ok) {
        setQueries((prevQueries) =>
          prevQueries.map((query) =>
            query.query_id === query_id
              ? { ...query, status: "complete", reply_message }
              : query
          )
        );
        alert("Reply sent successfully.");
      } else {
        console.error("Failed to send reply:", data.message);
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Something went wrong while sending the reply.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Query Management
      </h2>
      <div className="overflow-x-auto bg-white rounded shadow p-4">
        <table className="min-w-full text-sm table-auto border border-gray-200">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 border">Query ID</th>
              <th className="px-4 py-2 border">Sender</th>
              <th className="px-4 py-2 border">Message</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Reply</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((q) => (
              <tr key={q.query_id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border text-center">{q.query_id}</td>
                <td className="px-4 py-2 border text-center">{q.sender}</td>
                <td className="px-4 py-2 border">{q.message}</td>
                <td className="px-4 py-2 border text-center capitalize">
                  {q.status === "complete" ? (
                    <span className="text-green-600 font-semibold">Completed</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">Pending</span>
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {q.reply_message ? (
                    <span>{q.reply_message}</span>
                  ) : (
                    <em className="text-gray-500">No reply</em>
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {q.status !== "complete" ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Type reply..."
                        value={replies[q.query_id] || ""}
                        onChange={(e) =>
                          setReplies({ ...replies, [q.query_id]: e.target.value })
                        }
                        className="border px-2 py-1 text-sm w-full rounded"
                      />
                      <button
                        onClick={() => handleReply(q.query_id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                      >
                        Reply
                      </button>
                    </div>
                  ) : (
                    <span className="text-green-500 font-semibold">✓ Replied</span>
                  )}
                </td>
              </tr>
            ))}
            {queries.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No queries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QueriesPage;
