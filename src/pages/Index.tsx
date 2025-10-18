import { Link } from "react-router-dom";
import { ArrowRightIcon, PlayIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        
        <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-8 animate-fade-in">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-6xl font-bold tracking-tight sm:text-8xl mb-6">
              <span className="gradient-text">Ideas Worth</span>
              <br />
              <span className="text-foreground">Spreading</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Join us at TEDxAUC for inspiring talks, innovative ideas, and transformative experiences. 
              Where great minds meet to shape the future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/events">
                <Button className="hero-button group">
                  Explore Events
                  <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button variant="outline" className="px-8 py-4 text-lg border-primary/30 hover:border-primary hover:bg-primary/10 group">
                <PlayIcon className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Watch Previous Talks
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
      </section>

      {/* Quick Stats */}
      <section className="section-padding bg-card/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { number: "50+", label: "Speakers" },
              { number: "10+", label: "Events" },
              { number: "1000+", label: "Attendees" },
              { number: "5+", label: "Years" },
            ].map((stat, index) => (
              <div key={stat.label} className="text-center animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="section-padding">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold mb-8">
            Our <span className="gradient-text">Mission</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            TEDxAUC is committed to fostering a culture of innovation, creativity, and intellectual growth 
            within our university community. We believe in the power of ideas to transform lives and shape the future.
          </p>
          <Link to="/about">
            <Button variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/10">
              Learn More About Us
            </Button>
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-primary/10 to-primary/5 border-y border-primary/20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to be Inspired?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join our community and be part of something extraordinary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events">
              <Button className="hero-button">
                View Upcoming Events
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/10">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;