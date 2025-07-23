import { MapPin, Users, Settings, TrendingUp } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Request Area Cleanup',
      description: 'Easily report areas that need attention and track cleanup progress in real-time.',
      benefits: ['GPS location tracking', 'Photo documentation', 'Priority assignment']
    },
    {
      icon: Users,
      title: 'Volunteer Participation',
      description: 'Join cleanup events, connect with local volunteers, and make a difference.',
      benefits: ['Event scheduling', 'Team coordination', 'Impact tracking']
    },
    {
      icon: Settings,
      title: 'Admin Dashboard Control',
      description: 'Comprehensive management tools for administrators to oversee all operations.',
      benefits: ['Resource allocation', 'Performance analytics', 'User management']
    },
    {
      icon: TrendingUp,
      title: 'Live Progress Tracking',
      description: 'Monitor cleanup activities and environmental impact with detailed analytics.',
      benefits: ['Real-time updates', 'Impact metrics', 'Progress reports']
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful <span className="text-green-600">Features</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform provides everything you need to organize, 
            participate in, and track environmental cleanup efforts.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 p-8 rounded-3xl border hover:shadow-md transition duration-300"
            >
              <div className="flex space-x-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-green-600" />
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>

                  <ul className="space-y-1">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <div className="bg-green-50 border border-green-200 p-10 rounded-2xl">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Ready to Make a Difference?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Join thousands of environmental heroes who are already using CleanCity 
              to transform their communities.
            </p>
            <button className="px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg text-lg font-medium">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;










