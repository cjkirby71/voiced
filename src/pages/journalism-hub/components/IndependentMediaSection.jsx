import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

import ArticleCard from './ArticleCard';
import FilterBar from './FilterBar';
import SkeletonCard from './SkeletonCard';

const IndependentMediaSection = ({ onSendToRep }) => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFunding, setSelectedFunding] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock independent media data
  const mockArticles = [
    {
      id: 1,
      headline: "The Hidden Costs of Federal Contractor Relationships",
      author: "Sarah Chen",
      authorImage: "https://randomuser.me/api/portraits/women/32.jpg",
      publication: "Independent Policy Review",
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      category: "Government Transparency",
      fundingStatus: "Reader-Funded",
      fundingDetails: "100% reader donations, no corporate sponsors",
      excerpt: `An in-depth investigation reveals concerning patterns in federal contracting relationships that may compromise government accountability. Through extensive document analysis and interviews with former officials, this report uncovers potential conflicts of interest.

The investigation spans multiple agencies and highlights the need for stronger oversight mechanisms. Key findings suggest that current disclosure requirements may be insufficient to ensure transparency in government operations.`,
      imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop",
      url: "https://independentpolicyreview.com/federal-contractors",
      donationGoal: 500,
      donationCurrent: 342,
      isIndependent: true
    },
    {
      id: 2,
      headline: "Local Communities Push Back Against Federal Land Use Policies",
      author: "Marcus Rodriguez",
      authorImage: "https://randomuser.me/api/portraits/men/45.jpg",
      publication: "Grassroots Gazette",
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      category: "Local Government",
      fundingStatus: "Community-Supported",
      fundingDetails: "Funded by local community members and small businesses",
      excerpt: `Rural communities across three states are organizing to challenge new federal land use regulations they claim threaten local economic stability. Town halls and community meetings have drawn hundreds of concerned residents.

Local officials argue that federal policies fail to account for regional economic realities and environmental conditions. The grassroots movement has gained momentum through social media and community organizing efforts.`,
      imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop",
      url: "https://grassrootsgazette.org/land-use-policies",
      donationGoal: 300,
      donationCurrent: 178,
      isIndependent: true
    },
    {
      id: 3,
      headline: "Tech Industry Lobbying Influence on Privacy Legislation",
      author: "Dr. Jennifer Walsh",
      authorImage: "https://randomuser.me/api/portraits/women/28.jpg",
      publication: "Digital Rights Monitor",
      publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
      category: "Technology Policy",
      fundingStatus: "Grant-Funded",
      fundingDetails: "Supported by digital rights foundation grants",
      excerpt: `A comprehensive analysis of lobbying expenditures reveals how major technology companies are shaping federal privacy legislation. The investigation tracks millions in lobbying spending and identifies key influence networks.

Document analysis shows coordinated efforts to weaken consumer privacy protections while maintaining the appearance of supporting reform. The findings raise questions about the effectiveness of current lobbying disclosure requirements.`,
      imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop",
      url: "https://digitalrightsmonitor.org/tech-lobbying",
      donationGoal: 750,
      donationCurrent: 623,
      isIndependent: true
    },
    {
      id: 4,
      headline: "Small Town Mayor Challenges Federal Environmental Mandate",
      author: "Tom Bradley",
      authorImage: "https://randomuser.me/api/portraits/men/52.jpg",
      publication: "Local Voice News",
      publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000),
      category: "Environment",
      fundingStatus: "Subscriber-Funded",
      fundingDetails: "Supported entirely by monthly subscribers",
      excerpt: `Mayor Patricia Williams of Millfield (population 3,200) is taking on federal environmental regulations she says will bankrupt her town. The legal challenge has drawn support from similar communities facing compliance costs.

The case highlights tensions between federal environmental goals and local economic realities. Legal experts suggest the outcome could set important precedents for small community compliance requirements.`,
      imageUrl: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop",
      url: "https://localvoicenews.com/mayor-challenges-mandate",
      donationGoal: 200,
      donationCurrent: 156,
      isIndependent: true
    },
    {
      id: 5,
      headline: "Veterans Affairs Whistleblower Reveals Systemic Issues",
      author: "Lisa Park",
      authorImage: "https://randomuser.me/api/portraits/women/41.jpg",
      publication: "Accountability Watch",
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      category: "Veterans Affairs",
      fundingStatus: "Crowdfunded",
      fundingDetails: "Funded through crowdfunding campaigns",
      excerpt: `A former VA administrator speaks out about systemic problems in veterans' healthcare delivery that she says are being covered up by agency leadership. The whistleblower provides internal documents and testimony.

The revelations include delayed care, falsified records, and retaliation against employees who report problems. The story has prompted calls for congressional investigation and agency reform.`,
      imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
      url: "https://accountabilitywatch.org/va-whistleblower",
      donationGoal: 1000,
      donationCurrent: 834,
      isIndependent: true
    },
    {
      id: 6,
      headline: "Federal Education Funding Disparities Across Rural Districts",
      author: "Michael Thompson",
      authorImage: "https://randomuser.me/api/portraits/men/38.jpg",
      publication: "Education Equity Report",
      publishedAt: new Date(Date.now() - 15 * 60 * 60 * 1000),
      category: "Education",
      fundingStatus: "Foundation-Supported",
      fundingDetails: "Supported by education advocacy foundations",
      excerpt: `An extensive data analysis reveals significant disparities in federal education funding that disproportionately impact rural school districts. The investigation examines funding formulas and their real-world effects.

Rural districts receive substantially less per-pupil funding despite facing unique challenges including transportation costs and teacher recruitment. The findings suggest current funding mechanisms may perpetuate educational inequalities.`,
      imageUrl: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=400&fit=crop",
      url: "https://educationequityreport.org/rural-funding",
      donationGoal: 400,
      donationCurrent: 267,
      isIndependent: true
    }
  ];

  const fundingTypes = [
    { value: 'all', label: 'All Funding Types' },
    { value: 'Reader-Funded', label: 'Reader-Funded' },
    { value: 'Community-Supported', label: 'Community-Supported' },
    { value: 'Grant-Funded', label: 'Grant-Funded' },
    { value: 'Subscriber-Funded', label: 'Subscriber-Funded' },
    { value: 'Crowdfunded', label: 'Crowdfunded' },
    { value: 'Foundation-Supported', label: 'Foundation-Supported' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Government Transparency', label: 'Government Transparency' },
    { value: 'Local Government', label: 'Local Government' },
    { value: 'Technology Policy', label: 'Technology Policy' },
    { value: 'Environment', label: 'Environment' },
    { value: 'Veterans Affairs', label: 'Veterans Affairs' },
    { value: 'Education', label: 'Education' }
  ];

  useEffect(() => {
    // Simulate loading independent articles
    const loadArticles = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      setArticles(mockArticles);
      setFilteredArticles(mockArticles);
      setIsLoading(false);
    };

    loadArticles();
  }, []);

  useEffect(() => {
    let filtered = articles;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by funding type
    if (selectedFunding !== 'all') {
      filtered = filtered.filter(article => article.fundingStatus === selectedFunding);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    setFilteredArticles(filtered);
  }, [articles, searchTerm, selectedFunding, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-text-primary">
            Independent Media
          </h2>
          <p className="text-text-secondary mt-1">
            Curated articles from independent journalists with funding transparency
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-text-muted">
          <Icon name="Heart" size={16} />
          <span>Support Independent Journalism</span>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedSource={selectedFunding}
        onSourceChange={setSelectedFunding}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sources={fundingTypes}
        categories={categories}
        placeholder="Search by headline, content, or author..."
        sourceLabel="Funding Type"
      />

      {/* Articles Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : (
        <>
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onSendToRep={onSendToRep}
                  showBiasIndicator={false}
                  showSource={false}
                  showAuthor={true}
                  showFunding={true}
                  showDonation={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Search" size={24} className="text-text-muted" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">
                No articles found
              </h3>
              <p className="text-text-secondary">
                Try adjusting your search terms or filters
              </p>
            </div>
          )}
        </>
      )}

      {/* Load More Button */}
      {!isLoading && filteredArticles.length > 0 && (
        <div className="text-center pt-8">
          <button className="px-6 py-3 border border-border rounded-lg text-text-secondary hover:text-text-primary hover:bg-secondary-50 transition-colors duration-200 flex items-center space-x-2 mx-auto">
            <Icon name="RefreshCw" size={16} />
            <span>Load More Articles</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default IndependentMediaSection;