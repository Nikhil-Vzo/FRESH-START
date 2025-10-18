import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TablesInsert } from "@/integrations/supabase/types";

const speakers = [
    {
    id: 1,
    name: "Dr. Sarah Johnson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
  {
    id: 5,
    name: "Dr. Aisha Patel",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
  },
  {
    id: 6,
    name: "Prof. David Kim",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
];

const Speakers = () => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    occupation: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleSpeakerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.gender || !formData.occupation || !formData.message) {
      toast.error("Please fill in all fields to register.");
      return;
    }
    setIsSubmitting(true);

    try {
      const registrationData: TablesInsert<"speaker_registrations"> = {
        name: formData.name,
        gender: formData.gender,
        occupation: formData.occupation,
        message: formData.message,
      };

      const { error } = await supabase.from('speaker_registrations').insert(registrationData);
      if (error) throw error;

      toast.success("Registration successful! We'll be in touch soon.");
      setFormData({ name: "", gender: "", occupation: "", message: "" });
      // Note: We could programmatically close the dialog here, but for now we'll let the user do it.
    } catch (error: any) {
      console.error("Error submitting speaker registration:", error);
      toast.error(`Registration failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Our Speakers
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet the brilliant minds who have graced our stage with their ideas worth spreading
          </p>
        </div>
      </section>

      {/* Speakers Carousel */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <button
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onClick={() => handleScroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-background transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-primary" />
            </button>
            
            <button
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onClick={() => handleScroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-background transition-all"
            >
              <ChevronRight className="w-6 h-6 text-primary" />
            </button>

            <div
              ref={scrollRef}
              className="overflow-x-hidden mx-12"
            >
              <div className={`flex gap-8 ${!isPaused ? 'animate-scroll' : ''}`}>
                {[...speakers, ...speakers, ...speakers].map((speaker, index) => (
                  <div
                    key={`${speaker.id}-${index}`}
                    className="flex-shrink-0 w-64 text-center"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                  >
                    <div className="relative overflow-hidden rounded-2xl mb-4 group">
                      <img
                        src={speaker.image}
                        alt={speaker.name}
                        className="w-64 h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{speaker.name}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Register as Speaker Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 gradient-text">
            Become a Speaker
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Have an idea worth spreading? Join our community of thought leaders and inspire others with your story.
          </p>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="px-8 py-6 text-lg">
                Register as a Speaker
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Speaker Registration</DialogTitle>
                <DialogDescription>
                  Fill in your details to register as a speaker for TEDxAUC
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSpeakerRegister} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    placeholder="Enter your occupation"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message / Talk Proposal</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your idea worth spreading..."
                    className="min-h-[120px]"
                    required
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                   <DialogClose asChild>
                       <Button type="button" variant="outline">Cancel</Button>
                   </DialogClose>
                   <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Registration"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </div>
  );
};

export default Speakers;