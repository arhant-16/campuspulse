import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Users, Ticket, QrCode, 
  Plus, BarChart3, Search, CheckCircle2, 
  User, LayoutDashboard, Sparkles, Activity,
  ScanLine, X, ChevronRight, Clock, ShieldCheck, 
  Filter, CreditCard, Smartphone, GraduationCap, 
  BookOpen, Hash, Phone, Mail, Loader2
} from 'lucide-react';

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, collection, query } from 'firebase/firestore';

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'campuspulse-demo-id';

const INITIAL_EVENTS = [
  {
    id: 1,
    title: 'B.Tech AI & Copilot Hackathon',
    date: 'Oct 25, 2026',
    time: '9:00 AM - 9:00 PM',
    venue: 'Main Auditorium',
    capacity: 250,
    registeredCount: 210,
    checkInCount: 180,
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    tags: ['AI', 'Competition'],
    status: 'Approved by Dept Head',
    description: 'A 12-hour intensive hackathon building real-world AI solutions using GitHub Copilot.',
    category: 'Coding',
    cost: 'Free',
    price: 0,
    gcalDates: '20261025T033000Z/20261025T153000Z'
  },
  {
    id: 2,
    title: '8K Video Creators & Hardware Meetup',
    date: 'Nov 02, 2026',
    time: '2:00 PM - 5:00 PM',
    venue: 'Tech Park Hall 3',
    capacity: 100,
    registeredCount: 85,
    checkInCount: 0,
    image: 'https://images.unsplash.com/photo-1574717024453-354056a3df3f?auto=format&fit=crop&w=800&q=80',
    tags: ['Media', 'Networking'],
    status: 'Venue Confirmed',
    description: 'Connect with fellow creators, test out RED cameras, and learn advanced color grading.',
    category: 'Creative',
    cost: 'Paid',
    price: 499,
    gcalDates: '20261102T083000Z/20261102T113000Z'
  },
  {
    id: 3,
    title: 'Inter-Department Basketball Finals',
    date: 'Nov 10, 2026',
    time: '4:00 PM - 7:00 PM',
    venue: 'Indoor Sports Arena',
    capacity: 500,
    registeredCount: 320,
    checkInCount: 0,
    image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=800&q=80',
    tags: ['Athletics', 'Finals'],
    status: 'Approved',
    description: 'Come support your department in the grand finale of the annual sports meet.',
    category: 'Sports',
    cost: 'Free',
    price: 0,
    gcalDates: '20261110T103000Z/20261110T133000Z'
  },
  {
    id: 4,
    title: 'Startup Case Study Marathon',
    date: 'Nov 15, 2026',
    time: '10:00 AM - 4:00 PM',
    venue: 'Management Block, Seminar Hall',
    capacity: 60,
    registeredCount: 60,
    checkInCount: 0,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    tags: ['Business', 'Strategy'],
    status: 'Pending Security Approval',
    description: 'Analyze real-world business failures and pitch turnaround strategies to industry experts.',
    category: 'Management',
    cost: 'Paid',
    price: 199,
    gcalDates: '20261115T043000Z/20261115T103000Z'
  },
  {
    id: 5,
    title: 'Campus Got Talent: Open Mic & Dance',
    date: 'Nov 20, 2026',
    time: '5:30 PM - 9:00 PM',
    venue: 'Open Air Theatre (OAT)',
    capacity: 800,
    registeredCount: 450,
    checkInCount: 0,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    tags: ['Singing', 'Dancing', 'Music'],
    status: 'Approved',
    description: 'Showcase your talents! An evening of singing, dancing, and stand-up comedy under the stars.',
    category: 'Extracurricular',
    cost: 'Free',
    price: 0,
    gcalDates: '20261120T120000Z/20261120T153000Z'
  }
];

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, className = '' }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${className}`}>
    {children}
  </span>
);

const OnboardingView = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '', regNo: '', email: '', course: '', classSec: '', phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden selection:bg-indigo-500/30">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl opacity-50 mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl opacity-50 mix-blend-screen pointer-events-none"></div>
      
      <div className="relative w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl p-8 sm:p-12 animate-in fade-in zoom-in-95 duration-700">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg shadow-indigo-500/50">
            <Activity className="text-white" size={32} />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Welcome to CampusPulse</h1>
          <p className="text-indigo-200 text-sm">Let's set up your student profile to quick-register for events.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-white/50" size={18} />
              <input required type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Hash className="absolute left-4 top-3.5 text-white/50" size={18} />
                <input required type="text" name="regNo" placeholder="Reg Number" value={formData.regNo} onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              </div>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-3.5 text-white/50" size={18} />
                <input required type="text" name="course" placeholder="Course (e.g. B.Tech)" value={formData.course} onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <BookOpen className="absolute left-4 top-3.5 text-white/50" size={18} />
                <input required type="text" name="classSec" placeholder="Class & Sec" value={formData.classSec} onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 text-white/50" size={18} />
                <input required type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              </div>
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-white/50" size={18} />
              <input required type="email" name="email" placeholder="College Email ID" value={formData.email} onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
            </div>
          </div>

          <button type="submit" className="w-full py-4 mt-6 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all flex justify-center items-center group">
            <span>Save Profile & Continue</span>
            <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};

const StudentView = ({ events, userProfile, userTickets, onRegisterClick, onOpenTicket }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterCost, setFilterCost] = useState('All');

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'All' || event.category === filterCategory;
    const matchesCost = filterCost === 'All' || event.cost === filterCost;
    
    return matchesSearch && matchesCategory && matchesCost;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero & Filter Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl p-8 sm:p-12">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl opacity-50 mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl opacity-50 mix-blend-screen pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-6">
            <Sparkles size={16} className="text-indigo-300" />
            <span className="text-sm font-medium text-indigo-100 tracking-wide">Welcome back, {userProfile?.name?.split(' ')[0] || 'Student'}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Discover What's Happening <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">On Campus</span>
          </h1>
          
          <div className="relative max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 flex items-center shadow-inner mt-8 mb-4">
            <Search className="text-white/70 ml-3" size={24} />
            <input 
              type="text" 
              placeholder="Search for 'Hackathon', 'Music', or 'Lab 4'..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-white placeholder-white/60 px-4 py-3 focus:outline-none focus:ring-0 text-lg"
            />
          </div>

          <div className="flex flex-wrap gap-3 max-w-2xl mt-4">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
              <Filter size={16} className="text-white/80" />
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-transparent border-none text-white focus:outline-none text-sm font-medium cursor-pointer [&>option]:text-slate-900"
              >
                <option value="All">All Categories</option>
                <option value="Coding">Coding</option>
                <option value="Creative">Creative</option>
                <option value="Management">Management</option>
                <option value="Sports">Sports</option>
                <option value="Extracurricular">Extracurricular (Dancing, Singing...)</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
              <select 
                value={filterCost} 
                onChange={(e) => setFilterCost(e.target.value)}
                className="bg-transparent border-none text-white focus:outline-none text-sm font-medium cursor-pointer [&>option]:text-slate-900"
              >
                <option value="All">All Costs</option>
                <option value="Free">Free</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-100">
            <Filter className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="text-lg font-medium text-slate-900">No events found</p>
            <p className="text-sm">Try adjusting your category or cost filters.</p>
          </div>
        ) : (
          filteredEvents.map(event => {
            const isRegistered = userTickets.includes(event.id.toString());
            const isFull = event.registeredCount >= event.capacity;

            return (
              <Card key={event.id} className="group hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white/70 backdrop-blur-md border-white/50">
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <Badge className="bg-white/90 backdrop-blur text-slate-900 shadow-sm border border-white/20">
                      {event.category}
                    </Badge>
                    <Badge className={event.cost === 'Free' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'}>
                      {event.cost === 'Free' ? 'Free' : `₹${event.price}`}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{event.title}</h3>
                  <p className="text-slate-500 text-sm mb-5 line-clamp-2 flex-grow">{event.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <Clock size={16} className="mr-2.5 text-indigo-500" />
                      <span className="font-medium">{event.date} • {event.time.split(' - ')[0]}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <MapPin size={16} className="mr-2.5 text-rose-500" />
                      <span className="font-medium truncate">{event.venue}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-4 px-1">
                    <span className="flex items-center">
                      <Users size={14} className="mr-1.5" />
                      {event.registeredCount} / {event.capacity} Spots
                    </span>
                    <span className={isFull ? 'text-rose-500' : 'text-emerald-500'}>
                      {isFull ? 'Sold Out' : `${event.capacity - event.registeredCount} Left`}
                    </span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100">
                    {isRegistered ? (
                      <button 
                        onClick={() => onOpenTicket(event)}
                        className="w-full py-3.5 rounded-xl text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/30 transition-all"
                      >
                        <Ticket size={18} />
                        <span>View Ticket</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => onRegisterClick(event)}
                        disabled={isFull}
                        className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all ${
                          isFull 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                            : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg hover:shadow-indigo-500/30'
                        }`}
                      >
                        {isFull ? 'Waitlist Only' : (event.cost === 'Free' ? 'Register for Free' : 'Register & Pay')}
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

const OrganizerView = ({ events }) => {
  const totalRegistrations = events.reduce((acc, curr) => acc + curr.registeredCount, 0);
  const totalCheckIns = events.reduce((acc, curr) => acc + curr.checkInCount, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none shadow-indigo-500/20 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-indigo-100 text-sm font-medium mb-1">Total Registrations</p>
              <h3 className="text-4xl font-bold">{totalRegistrations}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Users size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none shadow-emerald-500/20 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-1">Total Checked-In</p>
              <h3 className="text-4xl font-bold">{totalCheckIns}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <CheckCircle2 size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 flex flex-col justify-center items-center text-center border-dashed border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-colors cursor-pointer group">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors shadow-sm">
            <Plus size={32} />
          </div>
          <h3 className="font-bold text-slate-900">Host New Event</h3>
          <p className="text-sm text-slate-500 mt-1">Upload a flyer or create manually</p>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
          <LayoutDashboard className="mr-3 text-indigo-500" />
          Event Management
        </h2>
        <div className="space-y-4">
          {events.map(event => (
            <Card key={event.id} className="p-5 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow">
              <div className="relative w-full md:w-32 h-24 shrink-0">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover rounded-xl shadow-sm" />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-white/90 backdrop-blur-sm text-xs shadow-sm">{event.category}</Badge>
                </div>
              </div>
              
              <div className="flex-grow w-full">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 text-lg">{event.title}</h4>
                  <Badge className="bg-slate-100 text-slate-600 border border-slate-200 flex items-center">
                    <ShieldCheck size={12} className="mr-1" /> {event.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4 bg-slate-50 p-2 rounded-lg inline-flex w-fit">
                  <span className="flex items-center"><Calendar size={14} className="mr-1.5 text-indigo-500"/> {event.date}</span>
                  <div className="w-px h-4 bg-slate-200"></div>
                  <span className="flex items-center"><MapPin size={14} className="mr-1.5 text-rose-500"/> {event.venue}</span>
                </div>
                
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex justify-between text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <span>Capacity: {event.registeredCount}/{event.capacity}</span>
                    <span className="text-emerald-600">Checked-in: {event.checkInCount}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex shadow-inner">
                    <div className="bg-indigo-500 h-2.5 rounded-l-full transition-all" style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}></div>
                    <div className="bg-emerald-500 h-2.5 transition-all duration-1000" style={{ width: `${(event.checkInCount / event.capacity) * 100}%`, marginLeft: `-${(event.checkInCount / event.capacity) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-col gap-2 shrink-0">
                <button className="w-full md:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-md hover:bg-indigo-600 transition-colors flex items-center justify-center">
                  <ScanLine size={16} className="mr-2" />
                  Scanner Mode
                </button>
                <button className="w-full md:w-auto px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center">
                  <BarChart3 size={16} className="mr-2" />
                  Analytics
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function CampusPulseApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [userProfile, setUserProfile] = useState(null);
  const [viewMode, setViewMode] = useState('student');
  const [events, setEvents] = useState([]);
  const [userTickets, setUserTickets] = useState([]);
  
  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [pendingPaymentEvent, setPendingPaymentEvent] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // 1. Initialize Firebase Auth
  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Data with strict paths once authenticated
  useEffect(() => {
    if (!user) return;

    // Listen to User Profile
    const profileRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
    const unsubProfile = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      } else {
        setUserProfile(null);
      }
    }, (error) => console.error("Profile Error:", error));

    // Listen to Public Events
    const eventsRef = collection(db, 'artifacts', appId, 'public', 'data', 'events');
    const unsubEvents = onSnapshot(query(eventsRef), (snapshot) => {
      if (snapshot.empty) {
        // Seed database if empty
        INITIAL_EVENTS.forEach(ev => {
          setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'events', ev.id.toString()), ev);
        });
      } else {
        const loadedEvents = [];
        snapshot.forEach(doc => loadedEvents.push(doc.data()));
        loadedEvents.sort((a, b) => a.id - b.id);
        setEvents(loadedEvents);
      }
    }, (error) => console.error("Events Error:", error));

    // Listen to Private Tickets
    const ticketsRef = collection(db, 'artifacts', appId, 'users', user.uid, 'tickets');
    const unsubTickets = onSnapshot(query(ticketsRef), (snapshot) => {
      const tickets = [];
      snapshot.forEach(doc => tickets.push(doc.id));
      setUserTickets(tickets);
      setLoading(false); // Finished loading everything
    }, (error) => console.error("Tickets Error:", error));

    return () => {
      unsubProfile();
      unsubEvents();
      unsubTickets();
    };
  }, [user]);

  const handleOnboardingComplete = async (profileData) => {
    if (!user) return;
    const profileRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
    await setDoc(profileRef, profileData);
  };

  const completeRegistration = async (eventToRegister) => {
    if (!user) return;
    const eventIdStr = eventToRegister.id.toString();

    // Check if ticket already exists to prevent duplicate updates
    if (!userTickets.includes(eventIdStr)) {
      // 1. Add ticket to private user collection
      const ticketRef = doc(db, 'artifacts', appId, 'users', user.uid, 'tickets', eventIdStr);
      await setDoc(ticketRef, { 
        eventId: eventIdStr, 
        registeredAt: new Date().toISOString() 
      });

      // 2. Increment global event registration count in public collection
      const eventRef = doc(db, 'artifacts', appId, 'public', 'data', 'events', eventIdStr);
      const currentEvent = events.find(e => e.id.toString() === eventIdStr);
      
      if (currentEvent) {
        await setDoc(eventRef, {
          ...currentEvent,
          registeredCount: currentEvent.registeredCount + 1
        });
      }
    }
    setShowTicketModal(eventToRegister);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!registeringEvent) return;
    
    if (registeringEvent.cost === 'Paid') {
      setPendingPaymentEvent(registeringEvent);
      setRegisteringEvent(null);
    } else {
      completeRegistration(registeringEvent);
      setRegisteringEvent(null);
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!pendingPaymentEvent) return;
    completeRegistration(pendingPaymentEvent);
    setPendingPaymentEvent(null);
  };

  const generateGCalLink = (event) => {
    if (!event) return '#';
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent(event.venue);
    const dates = event.gcalDates || '';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
        <p className="text-white font-medium">Connecting to Cloud...</p>
      </div>
    );
  }

  if (!userProfile) {
    return <OnboardingView onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-indigo-200 selection:text-indigo-900 relative">
      
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-500/30">
                <Activity className="text-white" size={22} />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">Campus<span className="text-indigo-600">Pulse</span></span>
              </div>
            </div>

            <div className="flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200 backdrop-blur-sm">
              <button
                onClick={() => setViewMode('student')}
                className={`flex items-center px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  viewMode === 'student'
                    ? 'bg-white text-indigo-600 shadow-md border border-slate-100/50'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <User size={16} className="mr-2" />
                Student
              </button>
              <button
                onClick={() => setViewMode('organizer')}
                className={`flex items-center px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  viewMode === 'organizer'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <LayoutDashboard size={16} className="mr-2" />
                Organizer
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {viewMode === 'student' ? (
          <StudentView 
            events={events} 
            userProfile={userProfile}
            userTickets={userTickets} 
            onRegisterClick={setRegisteringEvent} 
            onOpenTicket={setShowTicketModal}
          />
        ) : (
          <OrganizerView events={events} />
        )}
      </main>

      {}
      {registeringEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setRegisteringEvent(null)}></div>
          
          <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900">Event Registration</h3>
              <button onClick={() => setRegisteringEvent(null)} className="text-slate-400 hover:text-slate-700 bg-white rounded-full p-2 shadow-sm transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-indigo-900 mb-1">{registeringEvent.title}</p>
                    <p className="text-xs text-indigo-700 flex items-center font-medium">
                      <Clock size={14} className="mr-1.5" /> {registeringEvent.date} • {registeringEvent.time.split(' - ')[0]}
                    </p>
                  </div>
                  <Badge className={registeringEvent.cost === 'Free' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                    {registeringEvent.cost === 'Free' ? 'Free' : `₹${registeringEvent.price}`}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input type="text" readOnly value={userProfile.name} className="w-full px-4 py-3 bg-slate-100/50 border border-slate-200 rounded-xl text-slate-600 font-medium outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reg Number</label>
                  <input type="text" readOnly value={userProfile.regNo} className="w-full px-4 py-3 bg-slate-100/50 border border-slate-200 rounded-xl text-slate-600 font-medium outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Course / Dept</label>
                  <input type="text" readOnly value={userProfile.course} className="w-full px-4 py-3 bg-slate-100/50 border border-slate-200 rounded-xl text-slate-600 font-medium outline-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input type="email" readOnly value={userProfile.email} className="w-full px-4 py-3 bg-slate-100/50 border border-slate-200 rounded-xl text-slate-600 font-medium outline-none" />
              </div>

              <div className="pt-4 mt-2">
                <button type="submit" className="w-full py-3.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/50 transition-all flex justify-center items-center">
                  <span>{registeringEvent.cost === 'Free' ? 'Confirm & Get Ticket' : 'Proceed to Payment'}</span>
                  <ChevronRight size={18} className="ml-1" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {pendingPaymentEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setPendingPaymentEvent(null)}></div>
          
          <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900">Payment Required</h3>
              <button onClick={() => setPendingPaymentEvent(null)} className="text-slate-400 hover:text-slate-700 bg-white rounded-full p-2 shadow-sm transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-slate-500 text-sm">Total Amount to Pay</p>
                <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight">₹{pendingPaymentEvent.price}</h2>
                <p className="text-indigo-600 text-sm font-medium pt-1">{pendingPaymentEvent.title}</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Payment Method</label>
                
                <div 
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center transition-all ${paymentMethod === 'upi' ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${paymentMethod === 'upi' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Smartphone size={20} />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-slate-900">UPI / QR Code</p>
                    <p className="text-xs text-slate-500">GPay, PhonePe, Paytm</p>
                  </div>
                  {paymentMethod === 'upi' && <CheckCircle2 className="text-indigo-500" size={20} />}
                </div>

                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center transition-all ${paymentMethod === 'card' ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${paymentMethod === 'card' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <CreditCard size={20} />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-slate-900">Debit / Credit Card</p>
                    <p className="text-xs text-slate-500">Visa, Mastercard, RuPay</p>
                  </div>
                  {paymentMethod === 'card' && <CheckCircle2 className="text-indigo-500" size={20} />}
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-600 transition-all flex justify-center items-center">
                <span>Pay ₹{pendingPaymentEvent.price} Securely</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowTicketModal(null)}></div>
          
          <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-indigo-600 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-white/20 text-white backdrop-blur-md border border-white/10">Admit One</Badge>
                  <button onClick={() => setShowTicketModal(null)} className="text-indigo-200 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <h3 className="text-2xl font-bold leading-tight mb-2">{showTicketModal.title}</h3>
                <p className="text-indigo-200 text-sm flex items-center"><Calendar size={14} className="mr-1.5"/> {showTicketModal.date}</p>
              </div>
            </div>

            <div className="p-8 pt-4 flex flex-col items-center">
              <div className="p-4 border-4 border-slate-900 rounded-3xl mb-4 bg-white shadow-sm">
                <QrCode size={160} className="text-slate-900" />
              </div>
              <p className="font-mono font-bold text-slate-500 tracking-widest text-lg">#CP-{showTicketModal.id}8924</p>
              
              <div className="w-full mt-6 space-y-3 bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-500">Admit</span>
                  <span className="text-slate-900 font-bold">{userProfile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Venue</span>
                  <span className="text-slate-900 font-bold truncate max-w-[150px] text-right">{showTicketModal.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time</span>
                  <span className="text-slate-900 font-bold">{showTicketModal.time.split(' - ')[0]}</span>
                </div>
              </div>

              <a 
                href={generateGCalLink(showTicketModal)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-6 flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 border border-blue-200 px-4 py-3 rounded-xl font-bold w-full hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm group"
              >
                <Calendar size={18} className="group-hover:scale-110 transition-transform" />
                <span>Add to Google Calendar</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}