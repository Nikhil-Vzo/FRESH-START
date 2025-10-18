import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

type SeatStatus = "available" | "selected" | "booked";

interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  price: number;
}

interface EventData extends Tables<"events"> {} // Define EventData from DB types

const EventBooking = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookingStep, setBookingStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({ name: "", email: "", phone: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [isLoadingSeats, setIsLoadingSeats] = useState(true);

  // --- START: New Dynamic State and Logic ---
  const [event, setEvent] = useState<EventData | null>(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);

  // Helper function for generating seats (now accepts price)
  const generateSeats = (price: number): Seat[] => {
    const seatsLayout: Seat[] = [];
    const regularRows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    regularRows.forEach((row) => {
      for (let i = 1; i <= 28; i++) {
        seatsLayout.push({ id: `${row}${i}`, row, number: i, status: "available", price: price });
      }
    });
    const backRows = ["J", "K", "L", "M"];
    backRows.forEach((row) => {
      for (let i = 1; i <= 22; i++) {
        seatsLayout.push({ id: `${row}${i}`, row, number: i, status: "available", price: price });
      }
    });
    for (let i = 1; i <= 9; i++) {
      seatsLayout.push({ id: `LAST${i}`, row: "LAST", number: i, status: "available", price: price });
    }
    return seatsLayout;
  };

  const fetchEventAndSeats = useCallback(async (id: number) => {
    setIsLoadingEvent(true);
    setIsLoadingSeats(true);
    
    let fetchedEvent: EventData | null = null;
    let eventTitle: string | undefined;

    // 1. Fetch Event Details
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;

      fetchedEvent = data as EventData;
      eventTitle = fetchedEvent.title.trim();
      setEvent(fetchedEvent);

    } catch (error) {
      console.error("Error fetching event details:", error);
      setIsLoadingEvent(false);
      toast.error("Could not load event details. Please check the URL.");
      return;
    }

    // 2. Generate initial seats and fetch booked seats
    if (fetchedEvent) {
        try {
            const { data: bookings, error: bookingsError } = await supabase
            .from('bookings')
            .select('selected_seats')
            .eq('event_title', eventTitle);

            if (bookingsError) throw bookingsError;

            const allBookedSeats = bookings.flatMap(booking => booking.selected_seats);
            // Use price from fetched event, falling back to 500 if undefined or null
            const eventPrice = fetchedEvent.price || 500; 

            const initialSeats = generateSeats(eventPrice); 
            const updatedSeats = initialSeats.map(seat => ({
                ...seat,
                status: allBookedSeats.includes(seat.id) ? 'booked' : 'available' as SeatStatus
            }));
            
            setSeats(updatedSeats);

        } catch (error) {
            console.error("Error fetching booked seats:", error);
            toast.error("Could not load seat availability. Please refresh.");
            // Generate seats even on error, using a safe price
            setSeats(generateSeats(fetchedEvent.price || 500));
        } finally {
            setIsLoadingSeats(false);
            setIsLoadingEvent(false);
        }
    }
  }, []); 

  useEffect(() => {
    const id = Number(eventId);
    if (!isNaN(id) && id > 0) {
      fetchEventAndSeats(id);
    } else {
        setIsLoadingEvent(false);
        setEvent(null);
    }
  }, [eventId, fetchEventAndSeats]);

  // --- END: New Dynamic State and Logic ---

  if (isLoadingEvent) {
     return (
        <div className="pt-24 min-h-screen flex items-center justify-center">
            <div className="text-center p-8 max-w-md w-full">
                <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
                <Skeleton className="h-4 w-1/2 mx-auto mb-10" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full mt-4" />
            </div>
        </div>
     );
  }

  // If loading is complete but no event was found
  if (!event) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <Button onClick={() => navigate("/events")}>Back to Events</Button>
        </div>
      </div>
    );
  }

  const handleSeatClick = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat || seat.status === "booked") return;
    setSelectedSeats(currentSeats => 
      currentSeats.includes(seatId) 
        ? currentSeats.filter(id => id !== seatId) 
        : [...currentSeats, seatId]
    );
  };
  
  const getSeatColor = (seat: Seat) => {
    if (seat.status === "booked") return "bg-destructive text-destructive-foreground cursor-not-allowed";
    if (selectedSeats.includes(seat.id)) return "bg-primary text-primary-foreground";
    return "bg-card border border-border hover:border-primary hover:bg-primary/10 cursor-pointer";
  };

  // Ensure event.price is a number before calculating
  const eventPrice = event.price || 0;
  const totalAmount = selectedSeats.length * eventPrice; 

  const handleBookingSubmit = async () => {
    if (bookingStep === 1) {
      if (selectedSeats.length === 0) {
        toast.error("Please select at least one seat");
        return;
      }
      setBookingStep(2);
    } else if (bookingStep === 2) {
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        toast.error("Please fill in all customer details");
        return;
      }
      
      setIsProcessing(true);
      const toastId = toast.loading("Connecting to payment gateway...");

      try {
        const response = await axios.post('http://localhost:3001/api/payment/initiate', {
          amount: totalAmount,
        });
        
        if (!response.data.success) {
          throw new Error(response.data.message || "Payment initiation failed.");
        }
        
        toast.success("Redirecting to payment page...", { id: toastId });

        const { merchantTransactionId } = response.data.data;
        const redirectUrl = response.data.data.instrumentResponse.redirectInfo.url;
        
        const bookingDetails: TablesInsert<"bookings"> = {
          event_title: event.title,
          event_date: event.date,
          event_time: event.time,
          selected_seats: selectedSeats,
          seat_count: selectedSeats.length,
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          total_amount: totalAmount
        };

        localStorage.setItem(`pending_booking_${merchantTransactionId}`, JSON.stringify(bookingDetails));
        
        // Redirect after a short delay to allow the user to see the success toast
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1000);

      } catch (error: any) {
        toast.error(error.message || "Could not start payment. Please try again.", { id: toastId });
        console.error("Error initiating booking payment:", error);
        setIsProcessing(false);
      }
    }
  };

  const renderStepContent = () => {
    switch (bookingStep) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-8">Select Your Seats</h2>
            <div className="mb-8 text-center">
              <div className="inline-block bg-gradient-to-r from-primary/20 to-primary/10 px-8 py-2 rounded-t-3xl">
                <span className="text-lg font-semibold gradient-text">SCREEN</span>
              </div>
            </div>
            
            {/* --- START: Seating Area (Mobile Scroll Fix) --- */}
            {isLoadingSeats ? (
              <div className="max-w-6xl mx-auto space-y-2">
                {[...Array(13)].map((_, i) => (
                  <div key={i} className="flex justify-center items-center gap-4">
                    <Skeleton className="h-6 w-8" />
                    <Skeleton className="h-6 w-96" />
                    <Skeleton className="h-6 w-8" />
                    <Skeleton className="h-6 w-96" />
                     <Skeleton className="h-6 w-8" />
                  </div>
                ))}
              </div>
            ) : (
                <>
                <p className="text-center text-sm text-muted-foreground mb-4 md:hidden">
                    ← Swipe/Scroll horizontally to see all seats →
                </p>
                <div className="max-w-full overflow-x-auto pb-4 hide-scrollbar"> {/* Added overflow-x-auto */}
                    <div className="min-w-[800px] mx-auto space-y-2 mb-8"> {/* Increased min-width for larger display */}
                        {["A", "B", "C", "D", "E", "F", "G", "H", "I"].map((row) => (
                            <div key={row} className="flex items-center justify-center gap-4">
                                <span className="w-8 text-center font-bold text-muted-foreground">{row}</span>
                                <div className="flex gap-1">
                                    {seats.filter(s => s.row === row && s.number <= 14).map(seat => (
                                        <button key={seat.id} onClick={() => handleSeatClick(seat.id)} className={`w-6 h-6 rounded text-xs font-bold transition-all duration-200 ${getSeatColor(seat)}`} disabled={seat.status === 'booked'}>{seat.number}</button>
                                    ))}
                                </div>
                                <div className="w-8"></div> {/* Aisle */}
                                <div className="flex gap-1">
                                    {seats.filter(s => s.row === row && s.number > 14).map(seat => (
                                        <button key={seat.id} onClick={() => handleSeatClick(seat.id)} className={`w-6 h-6 rounded text-xs font-bold transition-all duration-200 ${getSeatColor(seat)}`} disabled={seat.status === 'booked'}>{seat.number}</button>
                                    ))}
                                </div>
                                <span className="w-8 text-center font-bold text-muted-foreground">{row}</span>
                            </div>
                        ))}
                        <div className="h-8"></div>
                        {["J", "K", "L", "M"].map((row) => (
                            <div key={row} className="flex items-center justify-center gap-4">
                                <span className="w-8 text-center font-bold text-muted-foreground">{row}</span>
                                <div className="flex gap-1">
                                    {seats.filter(s => s.row === row && s.number <= 4).map(seat => (
                                        <button key={seat.id} onClick={() => handleSeatClick(seat.id)} className={`w-6 h-6 rounded text-xs font-bold transition-all duration-200 ${getSeatColor(seat)}`} disabled={seat.status === 'booked'}>{seat.number}</button>
                                    ))}
                                </div>
                                <div className="w-8"></div> {/* Aisle */}
                                <div className="flex gap-1">
                                    {seats.filter(s => s.row === row && s.number > 4 && s.number <= 18).map(seat => (
                                        <button key={seat.id} onClick={() => handleSeatClick(seat.id)} className={`w-6 h-6 rounded text-xs font-bold transition-all duration-200 ${getSeatColor(seat)}`} disabled={seat.status === 'booked'}>{seat.number}</button>
                                    ))}
                                </div>
                                <div className="w-8"></div> {/* Aisle */}
                                <div className="flex gap-1">
                                    {seats.filter(s => s.row === row && s.number > 18).map(seat => (
                                        <button key={seat.id} onClick={() => handleSeatClick(seat.id)} className={`w-6 h-6 rounded text-xs font-bold transition-all duration-200 ${getSeatColor(seat)}`} disabled={seat.status === 'booked'}>{seat.number}</button>
                                    ))}
                                </div>
                                <span className="w-8 text-center font-bold text-muted-foreground">{row}</span>
                            </div>
                        ))}
                        <div className="flex items-center justify-center gap-4 pt-4 border-t border-dashed border-border">
                            <div className="flex gap-1">
                                {seats.filter(s => s.row === "LAST").map(seat => (
                                    <button key={seat.id} onClick={() => handleSeatClick(seat.id)} className={`w-6 h-6 rounded text-xs font-bold transition-all duration-200 ${getSeatColor(seat)}`} disabled={seat.status === 'booked'}>{seat.number}</button>
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">Last Row</span>
                        </div>
                    </div>
                </div>
                </>
            )}
            {/* --- END: Seating Area (Mobile Scroll Fix) --- */}

            {selectedSeats.length > 0 && (
              <div className="card-glow p-6 max-w-md mx-auto mt-8">
                <h3 className="text-lg font-bold mb-4">Booking Summary</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Selected Seats:</span>
                    <span className="font-semibold">{selectedSeats.join(", ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span className="font-semibold">{selectedSeats.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per seat:</span>
                    <span className="font-semibold">₹{eventPrice}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="gradient-text">₹{totalAmount}</span>
                  </div>
                </div>
                <Button onClick={handleBookingSubmit} className="w-full hero-button">
                  Continue to Customer Details
                </Button>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="max-w-md mx-auto animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-8">Customer Details</h2>
            <div className="card-glow p-8">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} placeholder="Enter your full name" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={customerInfo.email} onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} placeholder="Enter your email" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} placeholder="Enter your phone number" />
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Seats: {selectedSeats.join(", ")}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="gradient-text">₹{totalAmount}</span>
                  </div>
                </div>
                <Button onClick={handleBookingSubmit} className="w-full hero-button" disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Proceed to Payment"}
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  }


  return (
    <div className="pt-24 min-h-screen">
      <div className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => bookingStep > 1 ? setBookingStep(bookingStep - 1) : navigate("/events")}
              className="flex items-center space-x-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div className="text-right">
              {/* Use dynamic event details */}
              <h1 className="text-2xl font-bold gradient-text">{event.title}</h1>
              <p className="text-muted-foreground">{event.date} • {event.time}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex items-center justify-center mb-8">
          {[1, 2].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${bookingStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {bookingStep > step ? <CheckCircleIcon className="h-6 w-6" /> : step}
              </div>
              {step < 2 && ( <div className={`w-16 h-1 ${bookingStep > step ? "bg-primary" : "bg-muted"}`} /> )}
            </div>
          ))}
        </div>
        {renderStepContent()}
      </div>
    </div>
  );
};

export default EventBooking;