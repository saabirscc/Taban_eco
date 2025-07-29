import { Linkedin, Twitter, Github } from 'lucide-react';

// Using placeholder.cc service for consistent placeholder images
const team1 = 'https://i.pinimg.com/736x/a7/b8/65/a7b86534cfa9889a9dd72e99c10acbf3.jpg';
const team2 = 'https://i.pinimg.com/736x/4a/b2/af/4ab2af26e00092ca45805920666d5a3e.jpg';
const team3 = 'https://i.pinimg.com/736x/c1/4b/cf/c14bcffa07a72439ab9cba58811f94da.jpg';
const team4 = 'https://i.pinimg.com/736x/a1/18/2f/a1182f1dcb1e9afda517026981fa826e.jpg';

const TeamSection = () => {
  const teamMembers = [
    {
      name: 'Sabirin Mohamed Ali',
      role: 'fullstack Developer',
      image: team1,
      quote: 'Clean code, clean cities - that\'s my motto!',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      name: 'Anaz Abdi Dhowrane',
      role: 'Team Lead',
      image: team2,
      quote: 'Leading change, one cleanup at a time.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      name: 'Sabirin Mohamud Adan',
      role: 'Environmental Specialist',
      image: team3,
      quote: 'Every small action creates ripples of positive change.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      name: 'Isse Adam Abdirahman',
      role: 'tacbaan tacbaan lagu daray',
      image: team4,
      quote: 'Designing experiences that inspire environmental action.',
      social: {
        linkedin: 'https://www.linkedin.com/in/sabirin-mohamed-ali-4a4bb9261/',
        twitter: '#',
        github: 'https://github.com/SabirinMohamedAli'
      }
    }
  ];

  return (
    <section id="team" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Meet Our <span className="text-green-600">Team</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Passionate individuals dedicated to creating a cleaner, more sustainable world 
            through innovative technology and community engagement.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 text-center border border-gray-200 group hover:shadow-lg transition-all"
            >
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-green-200 group-hover:ring-green-300 transition-all duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Member Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-green-600 font-medium">
                    {member.role}
                  </p>
                </div>

                {/* Quote */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <p className="text-sm text-gray-600 italic">
                    "{member.quote}"
                  </p>
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-4">
                  <a 
                    href={member.social.linkedin}
                    className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition-all duration-200"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a 
                    href={member.social.twitter}
                    className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition-all duration-200"
                    aria-label={`${member.name} Twitter`}
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a 
                    href={member.social.github}
                    className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition-all duration-200"
                    aria-label={`${member.name} GitHub`}
                  >
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Values */}
        <div className="mt-16">
          <div className="bg-green-50 rounded-xl p-8 md:p-12 border border-green-100">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Our Values</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-green-600 mb-2">Innovation</h4>
                  <p className="text-gray-600">
                    Pushing boundaries with cutting-edge technology
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-green-600 mb-2">Sustainability</h4>
                  <p className="text-gray-600">
                    Creating lasting positive environmental impact
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-green-600 mb-2">Community</h4>
                  <p className="text-gray-600">
                    Building connections that drive collective action
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;