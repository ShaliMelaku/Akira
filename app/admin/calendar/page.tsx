'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Clock, User, MapPin, Loader2, Plus 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

type Booking = {
  id: number;
  client_name: string;
  service_requested: string;
  date: string;
  status: string;
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  useEffect(() => {
    fetchMonthBookings();
  }, [currentDate]);

  const fetchMonthBookings = async () => {
    setLoading(true);
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();

    const { data, error } = await supabase
      .from('bookings')
      .select('id, client_name, service_requested, date, status')
      .gte('date', startOfMonth.split('T')[0])
      .lte('date', endOfMonth.split('T')[0]);

    if (error) {
      toast.error('Failed to load calendar data');
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const getBookingsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return bookings.filter(b => b.date === dateStr);
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="fade-in">
      <div className="page-header mb-40">
        <div>
          <h1 className="display-md">Booking <span className="serif-italic text-gradient">Calendar</span></h1>
          <p className="text-muted mt-8">Manage your schedule and upcoming sessions</p>
        </div>
        <div className="flex align-center gap-16">
          <div className="calendar-nav glass-card p-4 flex align-center gap-12">
            <button className="nav-btn" onClick={prevMonth} aria-label="Previous Month"><ChevronLeft size={18} /></button>
            <span className="current-month font-bold min-w-[120px] text-center">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button className="nav-btn" onClick={nextMonth} aria-label="Next Month"><ChevronRight size={18} /></button>
          </div>
          <button className="btn btn-primary btn-sm flex align-center gap-8">
            <Plus size={16} /> New Event
          </button>
        </div>
      </div>

      <div className="calendar-container glass-card">
        <div className="calendar-grid-header">
          {dayNames.map(day => (
            <div key={day} className="day-name">{day}</div>
          ))}
        </div>
        
        <div className="calendar-grid">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty"></div>
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayBookings = getBookingsForDay(day);
            const isToday = day === new Date().getDate() && 
                            currentDate.getMonth() === new Date().getMonth() && 
                            currentDate.getFullYear() === new Date().getFullYear();
            
            return (
              <div 
                key={day} 
                className={`calendar-day ${isToday ? 'today' : ''} ${selectedDay === day ? 'selected' : ''}`}
                onClick={() => setSelectedDay(day)}
              >
                <span className="day-number">{day}</span>
                <div className="day-events">
                  {dayBookings.slice(0, 2).map(b => (
                    <div key={b.id} className={`event-pill ${b.status.toLowerCase()}`}>
                      {b.client_name.split(' ')[0]}
                    </div>
                  ))}
                  {dayBookings.length > 2 && (
                    <div className="more-events">+{dayBookings.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedDay && (
          <motion.div 
            className="day-detail-panel glass-card mt-32"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="panel-header">
              <h3>Events for {currentDate.toLocaleString('default', { month: 'long' })} {selectedDay}, {currentDate.getFullYear()}</h3>
              <button className="text-muted" onClick={() => setSelectedDay(null)}>Close</button>
            </div>
            
            <div className="events-list mt-24">
              {getBookingsForDay(selectedDay).length === 0 ? (
                <p className="text-muted italic">No sessions scheduled for this day.</p>
              ) : (
                getBookingsForDay(selectedDay).map(b => (
                  <div key={b.id} className="detail-event-item glass p-16 rounded-16 flex justify-between align-center">
                    <div className="flex align-center gap-16">
                      <div className={`status-dot ${b.status.toLowerCase()}`}></div>
                      <div>
                        <div className="font-bold">{b.client_name}</div>
                        <div className="text-xs text-muted">{b.service_requested}</div>
                      </div>
                    </div>
                    <button className="text-accent text-xs font-bold">Details →</button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .calendar-nav { border: 1px solid var(--glass-border); border-radius: 12px; }
        .nav-btn { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .nav-btn:hover { background: var(--glass-border); }

        .calendar-container { padding: 0; overflow: hidden; border: 1px solid var(--glass-border); border-radius: 24px; }
        .calendar-grid-header { display: grid; grid-template-columns: repeat(7, 1fr); background: rgba(255,255,255,0.02); border-bottom: 1px solid var(--glass-border); }
        .day-name { padding: 16px; text-align: center; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); }
        
        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); grid-auto-rows: minmax(120px, auto); }
        .calendar-day { padding: 12px; border-right: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border); cursor: pointer; transition: all 0.2s; position: relative; }
        .calendar-day:nth-child(7n) { border-right: none; }
        .calendar-day:hover { background: rgba(255,255,255,0.02); }
        .calendar-day.empty { background: rgba(0,0,0,0.05); cursor: default; }
        .calendar-day.today { background: rgba(255, 77, 0, 0.05); }
        .calendar-day.today .day-number { color: var(--accent); font-weight: 900; }
        .calendar-day.selected { background: rgba(255, 255, 255, 0.05); outline: 2px inset var(--accent); }
        
        .day-number { font-size: 0.9rem; font-weight: 600; color: var(--muted); }
        .day-events { margin-top: 12px; display: flex; flex-direction: column; gap: 4px; }
        .event-pill { font-size: 0.65rem; padding: 4px 8px; border-radius: 6px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .event-pill.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .event-pill.confirmed { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .more-events { font-size: 0.6rem; color: var(--muted); font-weight: 700; margin-top: 2px; }

        .day-detail-panel { padding: 32px; border: 1px solid var(--glass-border); border-radius: 24px; }
        .panel-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--glass-border); padding-bottom: 16px; }
        .events-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; }
        .status-dot.pending { background: #f59e0b; }
        .status-dot.confirmed { background: #10b981; }

        @media (max-width: 768px) {
          .calendar-grid-header { font-size: 0.6rem; }
          .calendar-grid { grid-auto-rows: 80px; }
          .day-number { font-size: 0.75rem; }
          .day-events { display: none; }
        }
      `}</style>
    </div>
  );
}
