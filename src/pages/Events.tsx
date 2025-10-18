import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { EventGallery } from "@/components/EventGallery";

const eventsData = {
  ongoing: [
    {
      id: 1,
      title: "Innovation Summit 2024",
      date: "October 15, 2024",
      time: "10:00 AM - 6:00 PM",
      location: "Main Auditorium, Amity University",
      description: "A day-long event featuring groundbreaking innovations and startup pitches.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      status: "ongoing" as const,
      ticketsAvailable: true,
      galleryImages: []
    }
  ],
  upcoming: [
    {
      id: 2,
      title: "Future of AI & Technology",
      date: "November 20, 2024",
      time: "2:00 PM - 8:00 PM",
      location: "Tech Center, Amity University",
      description: "Exploring the frontiers of artificial intelligence and emerging technologies.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
      status: "upcoming" as const,
      ticketsAvailable: true,
      galleryImages: []
    },
    {
      id: 3,
      title: "Sustainable Future Conference",
      date: "December 10, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Green Campus, Amity University",
      description: "Discussing sustainable practices and environmental innovations.",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
      status: "upcoming" as const,
      ticketsAvailable: true,
      galleryImages: []
    }
  ],
  completed: [
    {
      id: 4,
      title: "Creative Minds Symposium",
      date: "September 5, 2024",
      time: "3:00 PM - 9:00 PM",
      location: "Arts Center, Amity University",
      description: "Celebrating creativity across various artistic and scientific domains.",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop",
      status: "completed" as const,
      ticketsAvailable: false,
      galleryImages: [
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 5,
      title: "Leadership Excellence Workshop",
      date: "August 15, 2024",
      time: "1:00 PM - 7:00 PM",
      location: "Conference Hall, Amity University",
      description: "Interactive sessions on modern leadership principles and practices.",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&h=300&fit=crop",
      status: "completed" as const,
      ticketsAvailable: false,
      galleryImages: [
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 6,
      title: "Digital Transformation Summit",
      date: "July 22, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Digital Lab, Amity University",
      description: "Understanding the digital revolution and its impact on society.",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop",
      status: "completed" as const,
      ticketsAvailable: false,
      galleryImages: [
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop"
      ]
    }
  ]
};

type EventStatus = "ongoing" | "upcoming" | "completed";

const Events = () => {
  const [activeFilter, setActiveFilter] = useState<EventStatus>("upcoming");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<typeof eventsData.completed[0] | null>(null);

  const openGallery = (event: typeof eventsData.completed[0]) => {
    setSelectedEvent(event);
    setGalleryOpen(true);
  };

  const closeGallery = () => {
    setGalleryOpen(false);
    setSelectedEvent(null);
  };

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case "ongoing":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "upcoming":
        return "bg-primary/20 text-primary border-primary/30";
      case "completed":
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  const getStatusLabel = (status: EventStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-background to-primary/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center animate-fade-in">
            <h1 className="text-5xl font-bold mb-8">
              Our <span className="gradient-text">Events</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Discover inspiring talks, workshops, and experiences that shape minds and transform perspectives.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {(["ongoing", "upcoming", "completed"] as const).map((status) => (
              <Button
                key={status}
                onClick={() => setActiveFilter(status)}
                variant={activeFilter === status ? "default" : "outline"}
                className={`px-8 py-3 text-lg font-semibold transition-all duration-300 ${
                  activeFilter === status 
                    ? "hero-button" 
                    : "border-primary/30 hover:border-primary hover:bg-primary/10"
                }`}
              >
                {getStatusLabel(status)}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventsData[activeFilter].map((event, index) => (
              <div 
                key={event.id} 
                className="event-card animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
                    {getStatusLabel(event.status)}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3 gradient-text">
                  {event.title}
                </h3>
                
                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {event.description}
                </p>
                
                {event.ticketsAvailable && (
                  <Link to={`/book-event/${event.id}`}>
                    <Button className="w-full hero-button">
                      Buy Tickets
                    </Button>
                  </Link>
                )}
                
                {!event.ticketsAvailable && event.status === "completed" && (
                  <Button 
                    onClick={() => openGallery(event as typeof eventsData.completed[0])}
                    className="w-full mb-2 bg-muted hover:bg-muted/80 text-foreground"
                  >
                    Event Pictures
                  </Button>
                )}
                
                {!event.ticketsAvailable && event.status === "completed" && (
                  <Button disabled className="w-full">
                    Event Completed
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          {eventsData[activeFilter].length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold mb-4 text-muted-foreground">
                No {activeFilter} events found
              </h3>
              <p className="text-muted-foreground">
                Stay tuned for more exciting events coming soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-primary/10 to-primary/5 border-y border-primary/20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Don't miss out on our upcoming events. Subscribe to our newsletter for the latest updates.
          </p>
          <Link to="/contact">
            <Button className="hero-button">
              Subscribe Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Event Gallery Modal */}
      {selectedEvent && (
        <EventGallery
          isOpen={galleryOpen}
          onClose={closeGallery}
          eventTitle={selectedEvent.title}
          images={selectedEvent.galleryImages}
        />
      )}
    </div>
  );
};

export default Events;