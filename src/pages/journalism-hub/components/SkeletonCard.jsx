import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-secondary-200" />
      
      {/* Content Skeleton */}
      <div className="p-6">
        {/* Author Info Skeleton */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-secondary-200 rounded-full" />
          <div className="space-y-1">
            <div className="h-3 bg-secondary-200 rounded w-20" />
            <div className="h-2 bg-secondary-200 rounded w-16" />
          </div>
        </div>

        {/* Headline Skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-secondary-200 rounded w-full" />
          <div className="h-4 bg-secondary-200 rounded w-3/4" />
        </div>

        {/* Excerpt Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-secondary-200 rounded w-full" />
          <div className="h-3 bg-secondary-200 rounded w-full" />
          <div className="h-3 bg-secondary-200 rounded w-2/3" />
        </div>

        {/* Funding Info Skeleton */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-secondary-200 rounded" />
            <div className="h-3 bg-secondary-200 rounded w-24" />
          </div>
          <div className="h-2 bg-secondary-200 rounded w-full" />
        </div>

        {/* Progress Bar Skeleton */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <div className="h-2 bg-secondary-200 rounded w-16" />
            <div className="h-2 bg-secondary-200 rounded w-20" />
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2" />
        </div>

        {/* Donation Buttons Skeleton */}
        <div className="flex space-x-2 mb-4">
          <div className="flex-1 h-8 bg-secondary-200 rounded-lg" />
          <div className="flex-1 h-8 bg-secondary-200 rounded-lg" />
          <div className="flex-1 h-8 bg-secondary-200 rounded-lg" />
        </div>

        {/* Meta Info Skeleton */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-2 bg-secondary-200 rounded w-12" />
          <div className="h-2 bg-secondary-200 rounded w-8" />
          <div className="h-4 bg-secondary-200 rounded-full w-16" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex space-x-2">
          <div className="flex-1 h-10 bg-secondary-200 rounded-lg" />
          <div className="w-20 h-10 bg-secondary-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;