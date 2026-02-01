export interface Article {
  description: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  title: string;
}

export const articles: Article[] = [
  {
    id: '1',
    title: 'Revolutionary AI Breakthrough Transforms Healthcare Industry',
    description: 'New machine learning algorithms achieve 99% accuracy in disease diagnosis',
    content: `In a groundbreaking development, researchers have unveiled a revolutionary AI system that achieves unprecedented accuracy in medical diagnosis. The system, trained on millions of patient records, can now detect diseases with 99% accuracy across multiple categories.

The breakthrough comes after years of research and collaboration between leading medical institutions and AI companies. The technology is expected to transform how healthcare professionals approach patient care and treatment planning.

Key highlights of the research include:
- Improved patient outcomes through early detection
- Reduced diagnostic errors by 95%
- Potential to save millions of lives globally
- Cost reduction in healthcare systems

The system is currently being tested in major hospitals across Europe and North America. Initial results show remarkable promise, with physicians reporting higher confidence in diagnoses and better patient satisfaction.`,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    author: 'Dr. Sarah Chen',
    date: '2024-01-15',
    category: 'Technology',
    location: 'USA',
    likes: 2451,
  },
  {
    id: '2',
    title: 'Global Climate Summit Reaches Historic Agreement',
    description: 'Nations commit to ambitious carbon reduction targets for 2030',
    content: `World leaders have reached a historic agreement at the Global Climate Summit, committing to unprecedented carbon reduction targets. The accord, signed by 195 nations, represents the most ambitious climate agreement since the Paris Agreement.

Under the new framework, countries have committed to:
- 50% reduction in carbon emissions by 2030
- Transition to 70% renewable energy by 2035
- Investment of $5 trillion in climate initiatives

The agreement addresses critical climate challenges including rising global temperatures, extreme weather events, and biodiversity loss. Experts believe this accord could be a turning point in humanity's fight against climate change.

Developing nations have received increased financial support and technology transfer commitments to help meet these targets.`,
    image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800',
    author: 'James Mitchell',
    date: '2024-01-14',
    category: 'Environment',
    location: 'Europe',
    likes: 3120,
  },
  {
    id: '3',
    title: 'Tech Giant Announces New Quantum Computing Milestone',
    description: 'Quantum processor solves previously impossible calculations in minutes',
    content: `A leading technology company has announced a major breakthrough in quantum computing, unveiling a processor capable of solving complex calculations that would take classical computers thousands of years.

The new quantum processor demonstrates practical applications in:
- Drug discovery and molecular simulation
- Optimization problems in logistics
- Financial modeling and risk analysis
- Materials science research

This development could accelerate innovation across multiple industries and scientific fields. The company plans to make the technology available to research institutions and select enterprise clients within the next fiscal year.

Industry analysts believe this milestone could spark a new era of computational capabilities and drive significant economic growth.`,
    image: 'https://images.unsplash.com/photo-1620712014215-c8a9f5b1b6b5?w=800',
    author: 'Alex Rodriguez',
    date: '2024-01-13',
    category: 'Technology',
    location: 'USA',
    likes: 2890,
  },
  {
    id: '4',
    title: 'Breakthrough in Renewable Energy Storage Technology',
    description: 'New battery technology stores 10x more energy at lower cost',
    content: `Scientists have developed a revolutionary battery technology that can store significantly more energy while reducing production costs by 70%. The breakthrough addresses one of the major challenges in renewable energy adoption: reliable energy storage.

The new battery features:
- 10x higher energy density than current lithium-ion batteries
- 90% charge retention after 5 years
- Safe, non-toxic materials
- Rapid charging capabilities

This innovation could enable widespread adoption of electric vehicles and renewable energy grids. Manufacturers have already announced plans to integrate the technology into commercial products within two years.

The development represents a crucial step toward achieving global sustainability goals and reducing dependence on fossil fuels.`,
    image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800',
    author: 'Emma Watson',
    date: '2024-01-12',
    category: 'Energy',
    location: 'Europe',
    likes: 2567,
  },
  {
    id: '5',
    title: 'Space Exploration Reaches New Heights with Mars Mission',
    description: 'Historic manned mission to Mars marks humanity\'s greatest achievement',
    content: `The first manned mission to Mars has successfully launched, marking a monumental achievement in space exploration. The crew of five astronauts is on their way to establish humanity's first permanent base on the Red Planet.

Mission objectives include:
- Establish research base for long-term habitation
- Conduct geological and atmospheric studies
- Search for evidence of past microbial life
- Test technologies for future deep space missions

The mission is expected to reach Mars in approximately 8 months. Once on the surface, the astronauts will spend 18 months conducting scientific research and preparing for future missions.

This achievement represents the culmination of decades of research and billions of dollars in investment from multiple space agencies and private companies.`,
    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
    author: 'Captain John Smith',
    date: '2024-01-11',
    category: 'Science',
    location: 'USA',
    likes: 5432,
  },
  {
    id: '6',
    title: 'AI-Powered Education Platform Transforms Learning Worldwide',
    description: 'Personalized learning system reaches 100 million students globally',
    content: `An innovative AI-powered education platform has reached a milestone of 100 million users worldwide, revolutionizing how students learn and teachers teach. The platform uses advanced algorithms to personalize educational content for each learner.

Key features include:
- Personalized learning paths based on individual needs
- Real-time progress tracking and feedback
- Access to courses in 50+ languages
- Affordable pricing for developing nations

The platform has demonstrated measurable improvements in student outcomes:
- 40% faster learning rates
- 85% improvement in retention
- 60% increase in student engagement

Educational institutions in over 150 countries have adopted the platform, with plans to expand to remote and underserved communities.`,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=800',
    author: 'Lisa Johnson',
    date: '2024-01-10',
    category: 'Education',
    location: 'India',
    likes: 1876,
  },
]
