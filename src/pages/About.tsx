import { CheckCircleIcon } from "@heroicons/react/24/outline";

const About = () => {
  const values = [
    "Spreading innovative ideas that matter",
    "Building a community of thought leaders",
    "Fostering creativity and intellectual growth",
    "Connecting diverse perspectives",
    "Inspiring positive change",
    "Supporting emerging voices"
  ];

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-background to-primary/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center animate-fade-in">
            <h1 className="text-5xl font-bold mb-8">
              About <span className="gradient-text">TEDxAUC</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              TEDxAUC is an independently organized TED event at Amity University Chhattisgarh, 
              dedicated to spreading ideas worth sharing and creating a platform for intellectual discourse.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl font-bold mb-6">
                Our <span className="gradient-text">Story</span>
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Founded with the vision of bringing the TED experience to our university community, 
                  TEDxAUC has been a catalyst for innovation and inspiration since its inception.
                </p>
                <p>
                  We believe that every individual has a unique perspective and story worth sharing. 
                  Our events provide a platform for students, faculty, and industry leaders to present 
                  their ideas and engage in meaningful conversations.
                </p>
                <p>
                  Through carefully curated talks, workshops, and interactive sessions, we strive to 
                  create an environment where ideas can flourish and communities can connect.
                </p>
              </div>
            </div>
            <div className="card-glow p-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <h3 className="text-2xl font-bold mb-6 gradient-text">What We Believe</h3>
              <ul className="space-y-4">
                {values.map((value, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-card/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="card-glow p-8 text-center animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">V</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 gradient-text">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To create a vibrant ecosystem of ideas, innovation, and inspiration that empowers 
                individuals to think differently and act purposefully, making a positive impact 
                on society and the world.
              </p>
            </div>

            <div className="card-glow p-8 text-center animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">M</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 gradient-text">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide a platform for sharing groundbreaking ideas, fostering meaningful 
                connections, and inspiring our community to pursue excellence in their personal 
                and professional endeavors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="section-padding">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold mb-8">
            Our <span className="gradient-text">Impact</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed mb-12">
            Over the years, TEDxAUC has been instrumental in creating lasting change within our community. 
            Our events have sparked new initiatives, fostered collaborations, and inspired countless 
            individuals to pursue their passions and make a difference.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Innovation Hub", description: "Sparking new ideas and creative solutions" },
              { title: "Community Building", description: "Connecting like-minded individuals" },
              { title: "Knowledge Sharing", description: "Facilitating learning and growth" }
            ].map((impact, index) => (
              <div key={index} className="card-glow p-6 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <h3 className="text-xl font-bold mb-3 gradient-text">{impact.title}</h3>
                <p className="text-muted-foreground">{impact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;