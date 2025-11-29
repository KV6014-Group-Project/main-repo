export default function ParticipantDashboard() {
  const events = [
    { id: 1, title: "Health Screening - Community Hall", date: "Saturday, Oct 21st", time: "2:00 PM" },
    { id: 2, title: "Charity Walk - Riverside Park", date: "Sunday, Nov 5th", time: "10:00 AM" },
  ];

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto">
      {/* Name Bar */}
      <div className="bg-gray-300 rounded-lg mx-2 mt-2 py-6 text-center">
        <h1 className="text-4xl text-black">JOHN DOE</h1>
      </div>

      {/* Impact Card */}
      <div className="mx-2 mt-3 mb-3">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xs font-bold text-black mb-3">Your Impact This Month</h2>
          
          <div className="flex justify-between items-start px-2">
            <div className="text-center">
              <p className="text-4xl font-bold text-black">48</p>
              <p className="text-xs text-black mt-1">Participants<br/>Registered</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-black">3</p>
              <p className="text-xs text-black mt-1">Active Events</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-black">120</p>
              <p className="text-xs text-black mt-1">WhatsApp<br/>Shares</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Events Section */}
      <h3 className="text-sm font-bold text-black mb-4 ml-8">Active Events</h3>

      {/* Event Cards */}
      {events.map((event) => (
        <button
          key={event.id}
          className="w-full bg-gray-300 rounded-lg py-3 mb-4 mx-2 text-left hover:bg-gray-400 transition-colors"
          style={{ width: "calc(100% - 16px)" }}
        >
          <p className="text-sm font-bold text-black mb-2 ml-7">{event.title}</p>
          <p className="text-sm text-black mb-2 ml-7">{event.date}</p>
          <p className="text-sm text-black mb-2 ml-7">{event.time}</p>
          <p className="text-sm font-bold ml-7" style={{ color: "#28B900" }}>VIEW DETAILS</p>
        </button>
      ))}

      {/* Create Button */}
      <div className="flex justify-center mt-4 mb-8">
        <button
          className="text-white text-lg font-bold py-3 px-16 rounded-lg hover:opacity-90"
          style={{ backgroundColor: "#28B900" }}
        >
          CREATE
        </button>
      </div>
    </div>
  );
}
