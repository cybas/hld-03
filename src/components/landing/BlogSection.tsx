
'use client';

import React, { useState, useEffect } from 'react';
import { BLOG_ARTICLES } from '@/app/blog/data';
import { BlogCard } from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/button';
import { Loader, Plus } from 'lucide-react';

export const BlogSection = () => {
  const [visibleArticles, setVisibleArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [articlesPerLoad] = useState(4); 
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedArticles, setSortedArticles] = useState([]);

  useEffect(() => {
    const sorted = [...BLOG_ARTICLES].sort((a, b) => {
      if (a.priority && b.priority) return a.priority - b.priority;
      if (a.priority) return -1;
      if (b.priority) return 1;
      // Fallback to date sorting if no priority
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    setSortedArticles(sorted);
    setVisibleArticles(sorted.slice(0, 8)); // Initially load 8
    setCurrentPage(2); // The next page to load will be page 2 (index 1 * 8)
  }, []);

  const loadMoreArticles = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const startIndex = (currentPage) * articlesPerLoad + 4; // Start after the initial 8
      const endIndex = startIndex + articlesPerLoad;
      const newArticles = sortedArticles.slice(visibleArticles.length, visibleArticles.length + articlesPerLoad);
      
      if (newArticles.length > 0) {
        setVisibleArticles(prev => [...prev, ...newArticles]);
      }
      
      setIsLoading(false);
    }, 800);
  };

  const hasMoreArticles = visibleArticles.length < sortedArticles.length;

  return (
    <section id="blog" className="py-16 md:py-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl leading-[1.1] sm:text-4xl md:text-5xl text-foreground">
            From the HairlossDoctor.AI Blog
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Evidence-based insights for your hair recovery journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {visibleArticles.map((article) => (
            <BlogCard key={article.id} article={article} />
          ))}
        </div>

        {hasMoreArticles && (
          <div className="text-center">
            <Button
              onClick={loadMoreArticles}
              disabled={isLoading}
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary/5 hover:text-primary"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  View More
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
