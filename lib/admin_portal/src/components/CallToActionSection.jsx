const CallToActionSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of volunteers and city administrators working together for a cleaner future.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/admin/login"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition-colors"
          >
            Admin Account
          </a>
          <a
            href="#"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition-colors"
          >
            Use Application
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;