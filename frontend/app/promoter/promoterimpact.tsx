import { ArrowLeft, Home, Calendar, User, Users, Share2, CalendarDays, Award, MessageCircle } from 'lucide-react';

export default function UserProfileV2() {
  const impactItems = [
    { icon: Users, color: "#D9534F", number: "120", text: "Participants Registered" },
    { icon: Share2, color: "#009412", number: "250", text: "WhatsApp Shares" },
    { icon: CalendarDays, color: "#C70000", number: "10", text: "Events Promoted" },
  ];

  const events = [
    { title: "Health Screening – Community Hall", count: "50" },
    { title: "Women Wellness Workshop", count: "30" },
    { title: "Free Medical Checkup", count: "30" },
    { title: "Nutrition Talk", count: "10" },
  ];

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto flex flex-col">
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-gray-300 pt-6 pb-8 px-5 rounded-b-2xl">
          <button className="mb-4">
            <ArrowLeft size={28} className="text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-center">JOHN DOE</h1>
          <p className="text-sm text-center mt-2 text-gray-700">
            Your efforts are helping your community stay healthy.
          </p>
        </div>

        {/* Total Impact Card - Overlapping */}
        <div className="bg-white rounded-2xl mx-5 -mt-4 py-8 px-5 shadow-xl relative z-10">
          <h2 className="text-xl font-bold mb-6">YOUR TOTAL IMPACT</h2>

          {impactItems.map((item, index) => (
            <div key={index} className="flex items-center mb-7">
              <item.icon size={24} className="text-gray-600 mr-3" />
              <span className="text-base font-bold mr-2" style={{ color: item.color }}>
                {item.number}
              </span>
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Badges */}
        <h2 className="text-xl font-bold ml-5 mt-6">Badges</h2>

        <div className="flex gap-4 mx-5 mt-3 mb-4">
          <div 
            className="flex-1 flex flex-col items-center py-6 rounded-xl"
            style={{ backgroundColor: "#EF8B8B" }}
          >
            <Award size={32} className="text-white mb-2" />
            <p className="text-base font-bold text-white text-center">Community Connector</p>
          </div>

          <div 
            className="flex-1 flex flex-col items-center py-6 rounded-xl"
            style={{ backgroundColor: "#78C857" }}
          >
            <MessageCircle size={32} className="text-white mb-2" />
            <p className="text-base font-bold text-white text-center">Top Sharer</p>
          </div>
        </div>

        {/* Recent Events */}
        <p className="text-base ml-5 mb-2">Recent Events</p>

        {events.map((ev, i) => (
          <div
            key={i}
            className="flex items-center bg-gray-100 rounded-xl py-4 px-5 mx-5 mt-3"
          >
            <div className="flex-1">
              <p className="text-base font-bold">{ev.title}</p>
            </div>
            <Users size={24} className="text-gray-500" />
            <span className="text-base font-bold ml-2">{ev.count}</span>
          </div>
        ))}

        {/* Final Card */}
        <div 
          className="rounded-xl py-4 px-5 mx-5 my-8"
          style={{ backgroundColor: "#F8C6C6" }}
        >
          <p className="text-sm">
            Your outreach helped <span className="font-bold" style={{ color: "#D01F1F" }}>120 women</span> access free health screenings.
          </p>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex justify-between items-center bg-gray-50 border-t border-gray-200 py-5 px-12">
        <button className="p-2 hover:bg-gray-200 rounded-lg">
          <Home size={30} className="text-gray-500" />
        </button>
        <button className="p-2 hover:bg-gray-200 rounded-lg">
          <Calendar size={30} className="text-gray-500" />
        </button>
        <button className="p-2 hover:bg-gray-200 rounded-lg">
          <User size={30} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
}
