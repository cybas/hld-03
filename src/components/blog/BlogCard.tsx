
'use client';

import Link from 'next/link';
import { ArrowRight, Clock, Eye } from 'lucide-react';
import type { BlogArticle } from '@/app/blog/data';

interface BlogCardProps {
  article: BlogArticle;
}

const getCategoryColor = (category: string) => {
  const colors = {
    "Women's Health": "bg-pink-100 text-pink-800",
    "Prevention": "bg-green-100 text-green-800", 
    "Science": "bg-blue-100 text-blue-800",
    "Lab Testing": "bg-purple-100 text-purple-800",
    "Quick Tips": "bg-yellow-100 text-yellow-800",
    "Treatments": "bg-indigo-100 text-indigo-800",
    "Hormones": "bg-red-100 text-red-800",
    "Medical": "bg-orange-100 text-orange-800",
    "Procedures": "bg-teal-100 text-teal-800"
  };
  return colors[category] || "bg-gray-100 text-gray-800";
};

export const BlogCard = ({ article }: BlogCardProps) => {
  return (
    <Link href={article.url} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group block">
      {/* Article Image */}
      <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          {article.icon}
        </div>
      </div>

      {/* Article Content */}
      <div className="p-6">
        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(article.category)}`}>
            {article.category}
          </span>
          <span className="text-gray-500 text-sm">{article.date}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Read More & Stats */}
        <div className="flex items-center justify-between">
          <div className="text-primary font-medium text-sm hover:underline inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            Read More
            <ArrowRight className="w-3 h-3" />
          </div>
          
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.views}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
