import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { TicketCard } from "@/components/TicketCard"; // Import the new TicketCard component
import { UserCircleIcon, TicketIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

interface Profile {
  full_name: string;
  phone: string;
  address: string;
  profession: string;
}

interface Booking {
  event_title: string;
  event_date: string;
  event_time: string;
  selected_seats: string[];
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProfileAndBookings = async () => {
      setLoading(true);

      // Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, phone, address, profession")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        toast.error(`Failed to fetch profile: ${profileError.message}`);
      } else {
        setProfile(profileData);
      }
      
      // Fetch Bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select("event_title, event_date, event_time, selected_seats")
        .eq("customer_email", user.email)
        .order("created_at", { ascending: false });

      if (bookingsError) {
        toast.error(`Failed to fetch bookings: ${bookingsError.message}`);
      } else {
        setBookings(bookingsData);
      }

      setLoading(false);
    };

    fetchProfileAndBookings();
  }, [user, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    setIsUpdating(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        address: profile.address,
        profession: profile.profession,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      toast.error(`Update failed: ${error.message}`);
    } else {
      toast.success("Profile updated successfully!");
    }
    setIsUpdating(false);
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast.success("You have been signed out.");
  }
  
  if (loading) {
    return (
       <div className="pt-24 min-h-screen">
          <section className="section-padding">
             <div className="mx-auto max-w-6xl px-6 lg:px-8">
                <Skeleton className="h-12 w-1/3 mx-auto mb-12" />
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                   <div className="lg:col-span-2 space-y-4">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-12 w-full" />
                   </div>
                   <div className="lg:col-span-3 space-y-6">
                      <Skeleton className="h-10 w-1/4" />
                      <Skeleton className="h-40 w-full" />
                      <Skeleton className="h-40 w-full" />
                   </div>
                </div>
             </div>
          </section>
       </div>
    )
  }

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-background to-primary/5">
      <section className="section-padding">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-12 text-center">
            Welcome, <span className="gradient-text">{profile?.full_name || user?.email}</span>
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            
            {/* Left Column for Profile */}
            <div className="lg:col-span-2">
              <div className="card-glow p-8 sticky top-32">
                <div className="flex items-center space-x-4 mb-6">
                  <UserCircleIcon className="h-12 w-12 text-primary" />
                  <div>
                    <h2 className="text-2xl font-bold">Your Profile</h2>
                    <p className="text-muted-foreground text-sm">Manage your personal information</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={user?.email || ""} disabled className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" type="text" value={profile?.full_name || ""} onChange={(e) => setProfile({ ...profile!, full_name: e.target.value })} className="mt-1" />
                  </div>
                   <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" value={profile?.phone || ""} onChange={(e) => setProfile({ ...profile!, phone: e.target.value })} className="mt-1" />
                  </div>
                   <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" type="text" value={profile?.address || ""} onChange={(e) => setProfile({ ...profile!, address: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="profession">Profession</Label>
                    <Input id="profession" type="text" value={profile?.profession || ""} onChange={(e) => setProfile({ ...profile!, profession: e.target.value })} className="mt-1" />
                  </div>
                  <Button type="submit" className="w-full hero-button" disabled={isUpdating}>
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button onClick={handleSignOut} variant="outline" className="w-full mt-2 flex items-center gap-2">
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    Sign Out
                  </Button>
                </form>
              </div>
            </div>

            {/* Right Column for Tickets */}
            <div className="lg:col-span-3">
               <div className="flex items-center space-x-4 mb-8">
                  <TicketIcon className="h-10 w-10 text-primary" />
                  <div>
                    <h2 className="text-3xl font-bold">Your Tickets</h2>
                    <p className="text-muted-foreground">All your event bookings in one place.</p>
                  </div>
                </div>
              <div className="space-y-8">
                {bookings.length > 0 ? (
                  bookings.map((booking, index) => (
                    <TicketCard
                      key={index}
                      eventName={booking.event_title}
                      eventDate={booking.event_date}
                      eventTime={booking.event_time}
                      seats={booking.selected_seats}
                      userName={profile?.full_name || user?.email || "Attendee"}
                    />
                  ))
                ) : (
                  <div className="text-center py-16 border-2 border-dashed border-border/50 rounded-lg">
                    <TicketIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-muted-foreground">No Tickets Found</h3>
                    <p className="text-muted-foreground mt-2">
                      Book a ticket for an upcoming event to see it here.
                    </p>
                     <Button variant="outline" className="mt-6" asChild>
                        <a href="/events">Explore Events</a>
                    </Button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;