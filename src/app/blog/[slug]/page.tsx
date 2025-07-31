
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getArticleBySlug } from '../utils';
import { 
  Play, ArrowLeft, Share2, BookOpen, ChevronRight, Calendar,
  Clock, Eye, Mail, CheckCircle, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BlogArticle } from '@/app/blog/data';

const BlogPostPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [article, setArticle] = useState<BlogArticle | null | undefined>(null);

  useEffect(() => {
    if (slug) {
      const foundArticle = getArticleBySlug(slug);
      setArticle(foundArticle);
    }
  }, [slug]);

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
    }
  };

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
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const renderContent = (item: any, index: number) => {
    if (!item) return null;
    switch (item.type) {
      case 'heading':
        return (
          <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            {item.text}
          </h2>
        );
      case 'paragraph':
        return (
          <p key={index} className="text-gray-700 leading-relaxed mb-6">
            {item.text}
          </p>
        );
      case 'callout':
        return (
          <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
            <p className="text-blue-900 font-medium">{item.text}</p>
          </div>
        );
      case 'list':
        return (
          <ul key={index} className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            {item.items.map((listItem: string, listIndex: number) => (
              <li key={listIndex}>{listItem}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  if (article === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Loading article...</p>
      </div>
    );
  }
  
  if (article === undefined) {
      return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Article not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
             <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 transition-colors">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button asChild className="bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                <Link href="/assessment/step1">
                  <Play className="w-3 h-3" />
                  Start Assessment
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/#blog" className="hover:text-gray-900">Blog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-gray-900">{article.category}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 truncate max-w-xs">{article.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${getCategoryColor(article.category)}`}>
              {article.category}
            </span>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {article.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {article.views} views
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>
          
          {article.subtitle && (
            <p className="text-xl text-gray-600 mb-6">
              {article.subtitle}
            </p>
          )}

          {/* Author Info */}
          {article.author && (
            <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{article.author}</p>
                <p className="text-sm text-gray-500">Hair Loss Specialist</p>
              </div>
            </div>
          )}
        </header>

        {/* Article Body */}
        <article className="prose prose-lg max-w-none">
          {article.content && article.content.map((item, index) => renderContent(item, index))}
        </article>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 mt-12 mb-8">
          <div className="flex items-start gap-4">
            <Mail className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Stay Updated on Hair Loss Research
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Get the latest evidence-based insights, treatment updates, and expert tips delivered to your inbox monthly.
              </p>
              
              {!subscribed ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                  />
                  <Button
                    onClick={handleSubscribe}
                    className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
                  >
                    Subscribe Free
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-800 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Thank you for subscribing! Check your email to confirm.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Articles */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <section className="border-t border-gray-100 pt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Continue Reading</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {article.relatedArticles.map((related) => (
                <Link href={related.url} key={related.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow block">
                  <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{related.title}</h4>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{related.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {related.readTime}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Final CTA */}
        <div className="bg-gray-50 rounded-lg p-8 mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Address Your Hair Loss?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Get a personalized assessment and treatment recommendations based on your specific situation. Our AI-powered analysis takes just 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button asChild size="lg" className="bg-primary text-white font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
                <Link href="/assessment/step1">
                    <Play className="w-4 h-4" />
                    Start Free Assessment
                </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-border text-foreground font-semibold hover:bg-accent transition-colors inline-flex items-center gap-2">
               <Link href="/#blog">
                    <FileText className="w-4 h-4" />
                    View All Articles
                </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPostPage;

    