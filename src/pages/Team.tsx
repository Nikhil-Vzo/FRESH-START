import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const teamMembers = [
  {
    id: 1,
    name: "Arjun Sharma",
    position: "Event Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    bio: "Leading the vision and strategy for TEDxAUC events.",
    social: {
      instagram: "https://instagram.com/arjun.sharma",
      facebook: "https://facebook.com/arjun.sharma",
      linkedin: "https://linkedin.com/in/arjun-sharma"
    }
  },
  {
    id: 2,
    name: "Priya Patel",
    position: "Creative Head",
    image: "https://images.unsplash.com/photo-1494790108755-2616b332e234?w=400&h=400&fit=crop&crop=face",
    bio: "Bringing creative excellence to every aspect of our events.",
    social: {
      instagram: "https://instagram.com/priya.patel",
      facebook: "https://facebook.com/priya.patel",
      linkedin: "https://linkedin.com/in/priya-patel"
    }
  },
  {
    id: 3,
    name: "Rahul Gupta",
    position: "Technical Lead",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    bio: "Ensuring flawless technical execution of our events.",
    social: {
      instagram: "https://instagram.com/rahul.gupta",
      facebook: "https://facebook.com/rahul.gupta",
      linkedin: "https://linkedin.com/in/rahul-gupta"
    }
  },
  {
    id: 4,
    name: "Sneha Singh",
    position: "Marketing Head",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    bio: "Spreading the word and building our community.",
    social: {
      instagram: "https://instagram.com/sneha.singh",
      facebook: "https://facebook.com/sneha.singh",
      linkedin: "https://linkedin.com/in/sneha-singh"
    }
  },
  {
    id: 5,
    name: "Vikram Kumar",
    position: "Operations Manager",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    bio: "Managing all operational aspects and logistics.",
    social: {
      instagram: "https://instagram.com/vikram.kumar",
      facebook: "https://facebook.com/vikram.kumar",
      linkedin: "https://linkedin.com/in/vikram-kumar"
    }
  },
  {
    id: 6,
    name: "Ananya Joshi",
    position: "Content Curator",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    bio: "Curating compelling stories and content for our platform.",
    social: {
      instagram: "https://instagram.com/ananya.joshi",
      facebook: "https://facebook.com/ananya.joshi",
      linkedin: "https://linkedin.com/in/ananya-joshi"
    }
  }
];


const Team = () => {
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-background to-primary/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center animate-fade-in">
            <h1 className="text-5xl font-bold mb-8">
              Meet Our <span className="gradient-text">Team</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              The passionate individuals behind TEDxAUC who work tirelessly to bring 
              inspiring ideas and transformative experiences to our community.
            </p>
          </div>
        </div>
      </section>

      {/* Team Cards Grid */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card border border-border hover:border-primary/50">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/50 transition-all duration-300">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2 gradient-text">
                    {member.name}
                  </h3>
                  
                  <p className="text-primary font-semibold mb-4">
                    {member.position}
                  </p>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {member.bio}
                  </p>
                  
                  {/* Social Media Buttons */}
                  <div className="flex justify-center gap-3">
                    <a
                      href={member.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/10 transition-all duration-300"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                    <a
                      href={member.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/10 transition-all duration-300"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/10 transition-all duration-300"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Join Our Team CTA */}
      <section className="section-padding bg-gradient-to-r from-primary/10 to-primary/5 border-y border-primary/20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Want to Join Our Team?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            We're always looking for passionate individuals who share our vision 
            of spreading ideas worth sharing.
          </p>
          <a
            href="mailto:team@tedxauc.org"
            className="hero-button inline-flex items-center"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
};

export default Team;