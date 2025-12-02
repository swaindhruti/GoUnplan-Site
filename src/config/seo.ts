export const siteConfig = {
  name: 'GoUnplan',
  title: 'GoUnplan - Discover Authentic Travel Experiences with Local Hosts',
  description:
    'Book unique travel experiences and vacation trips with verified local hosts. Explore curated destinations, authentic adventures, and personalized trip planning. Start your journey with GoUnplan today.',
  url: 'https://gounplan.com', // Update with actual domain
  ogImage: 'https://gounplan.com/og-image.jpg', // Update with actual OG image
  keywords: [
    'travel booking',
    'vacation booking',
    'trip planning',
    'local hosts',
    'authentic travel experiences',
    'adventure travel',
    'travel destinations',
    'vacation rentals',
    'trip booking platform',
    'explore destinations',
    'travel with locals',
    'unique travel experiences',
    'personalized trips',
    'travel itinerary',
    'holiday planning',
  ],
  authors: [
    {
      name: 'GoUnplan Team',
      url: 'https://gounplan.com',
    },
  ],
  creator: 'GoUnplan',
  publisher: 'GoUnplan',
  category: 'Travel & Tourism',
  locale: 'en_US',
  social: {
    twitter: '@gounplan', // Dummy - update later
    facebook: 'https://facebook.com/gounplan', // Dummy - update later
    instagram: 'https://instagram.com/gounplan', // Dummy - update later
    linkedin: 'https://linkedin.com/company/gounplan', // Dummy - update later
    youtube: 'https://youtube.com/@gounplan', // Dummy - update later
  },
  contact: {
    email: 'hello@gounplan.com', // Update with actual email
    phone: '+1-XXX-XXX-XXXX', // Update with actual phone
  },
};

export const jsonLdWebsite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteConfig.url}/trips?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  description: siteConfig.description,
  contactPoint: {
    '@type': 'ContactPoint',
    email: siteConfig.contact.email,
    contactType: 'Customer Service',
    availableLanguage: ['English'],
  },
  sameAs: [
    siteConfig.social.facebook,
    siteConfig.social.twitter,
    siteConfig.social.instagram,
    siteConfig.social.linkedin,
    siteConfig.social.youtube,
  ],
};

export const jsonLdTravelAgency = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  priceRange: '$$',
  areaServed: 'Worldwide',
  availableLanguage: 'English',
};
