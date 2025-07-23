
import { Map, Users, Leaf } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: Map,
      title: 'Smart Mapping',
      description: 'Map-based waste reporting and route planning for effective cleanups'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Coordinate with local volunteers and neighborhoods for organized actions'
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Promoting sustainable habits and a cleaner environment through teamwork'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50 pt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="text-green-600">CleanCity</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            CleanCity is a collaborative platform that connects citizens, volunteers, and local authorities
            to improve city cleanliness. Through location-based tools and community engagement, we help
            residents report waste, organize cleanups, and build greener, more livable neighborhoods.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow hover:shadow-md transition duration-300 border"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-center mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="mt-20">
          <div className="bg-green-50 border border-green-200 p-10 rounded-2xl text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              "To empower communities with digital tools that simplify cleanup efforts, encourage civic
              participation, and foster long-term environmental care and awareness."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
