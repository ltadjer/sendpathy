import React, { useEffect, useState } from 'react';

const ReservationCalendar: React.FC<any> = (props) => {
  const [FullCalendar, setFullCalendar] = useState<any>(null);
  const [dayGridPlugin, setDayGridPlugin] = useState<any>(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadCalendar() {
      const fc = await import('@fullcalendar/react');
      const dgp = await import('@fullcalendar/daygrid');
      setFullCalendar(fc.default);
      setDayGridPlugin(dgp.default);
    }
    loadCalendar();
  }, []);

  useEffect(() => {
    if (props.records) {
      const reservations = props.records.map((record: any) => ({
        title: `Reservation ${record.params.id}`,
        start: record.params.createdAt,
        end: record.params.createdAt,
      }));
      setEvents(reservations);
    }
  }, [props.records]);

  if (!FullCalendar || !dayGridPlugin) {
    return <div>Loading...</div>;
  }

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
    />
  );
};

export default ReservationCalendar;