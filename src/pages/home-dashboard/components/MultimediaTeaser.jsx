import React from 'react';
import Icon from 'components/AppIcon';


const MultimediaTeaser = () => {
  return (
    <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-700 text-white">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-32 h-32 border border-white rounded-full"></div>
        <div className="absolute bottom-4 right-4 w-24 h-24 border border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white rounded-full"></div>
      </div>

      <div className="relative z-10 px-6 py-12 lg:px-12 lg:py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Coming Soon Badge */}
          <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Icon name="Sparkles" size={16} />
            <span className="text-sm font-medium">Coming Soon</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-4">
            Multimedia Democracy
          </h2>
          
          <p className="text-lg lg:text-xl text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
            Experience government transparency through immersive video content, live town halls, and interactive audio briefings. Democracy has never been this engaging.
          </p>

          {/* Feature Preview Icons */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Icon name="Video" size={24} />
              </div>
              <span className="text-sm font-medium">Live Streams</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Icon name="Mic" size={24} />
              </div>
              <span className="text-sm font-medium">Audio Briefings</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Icon name="Users" size={24} />
              </div>
              <span className="text-sm font-medium">Town Halls</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button className="w-full sm:w-auto px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2">
              <Icon name="Bell" size={20} />
              <span>Notify Me</span>
            </button>
            <button className="w-full sm:w-auto px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-200 flex items-center justify-center space-x-2">
              <Icon name="Play" size={20} />
              <span>Watch Preview</span>
            </button>
          </div>

          {/* Timeline */}
          <div className="mt-8 pt-6 border-t border-white border-opacity-20">
            <p className="text-sm text-white text-opacity-80">
              Expected Launch: Q2 2024 • Beta Testing: Q1 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultimediaTeaser;