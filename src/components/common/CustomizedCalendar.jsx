


import React, { useState } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

// CSS auto-loads in v6, no manual CSS imports needed
// Tailwind styling wrapp
const CustomCalendar = () => {
  const [events, setEvents] = useState([
    { id: "1", title: "Project Meeting", start: new Date() },
    {
      id: "2",
      title: "Code Review",
      start: new Date(new Date().setDate(new Date().getDate() + 2)),
    },
  ]);

  const handleDateClick = (info) => {
    const title = prompt("Event Title:");
    if (title) {
      setEvents([...events, { title, start: info.dateStr }]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 w-full">

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={(info) => alert(`Event: ${info.event.title}`)}
        editable={true}
        selectable={true}
        height="75vh"
      />
    </div>
  );
};

export default CustomCalendar;