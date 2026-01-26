import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Code2,
  MessageSquare,
  TrendingUp,
  GraduationCap,
  Users,
  Zap,
  Target,
  BookOpen,
  CheckCircle2,
  Award,
  Clock,
  Flame,
  Star,
  ArrowRight,
  Play,
  Lightbulb,
  Brain,
  Puzzle,
  Rocket,
  Shield,
  GitBranch,
  Database,
  Globe,
  Lock,
  Sparkles,
  Cpu,
  FileCode,
  Terminal,
  Bug,
  BarChart,
} from 'lucide-react';

const features = [
  {
    icon: Code2,
    title: 'Interactive Code Editor',
    description: 'Write and execute Python code directly in your browser with our Monaco-powered editor. Get instant feedback on your code.',
    details: ['Syntax highlighting', 'Auto-completion', 'Error detection', 'Code formatting'],
  },
  {
    icon: MessageSquare,
    title: 'AI-Powered Tutoring',
    description: 'Chat with our AI assistant that adapts to your learning level. Get explanations, hints, and guidance 24/7.',
    details: ['24/7 availability', 'Adaptive learning', 'Context-aware help', 'Multiple languages'],
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Monitor your mastery scores across modules. Track streaks, activity, and see your skills improve over time.',
    details: ['Mastery scores', 'Learning streaks', 'Activity history', 'Performance analytics'],
  },
  {
    icon: GraduationCap,
    title: 'Structured Curriculum',
    description: 'Learn Python from basics to advanced OOP through carefully designed modules with hands-on exercises.',
    details: ['8 comprehensive modules', '29 topics', '120+ exercises', 'Progressive difficulty'],
  },
  {
    icon: Users,
    title: 'Teacher Dashboard',
    description: 'Educators can monitor student progress, identify struggles, and provide targeted assistance.',
    details: ['Class overview', 'Struggle alerts', 'Progress reports', 'Student insights'],
  },
  {
    icon: Zap,
    title: 'Real-Time Feedback',
    description: 'Get instant code review, error debugging, and personalized suggestions as you learn.',
    details: ['Instant execution', 'Code review', 'Bug detection', 'Optimization tips'],
  },
];

const howItWorks = [
  {
    step: '1',
    title: 'Choose a Module',
    description: 'Start with Python Basics or jump to advanced topics based on your skill level. Our adaptive placement test suggests the best starting point.',
    icon: BookOpen,
    extra: '8 modules available',
  },
  {
    step: '2',
    title: 'Learn & Practice',
    description: 'Read interactive lessons, work through hands-on exercises, and write real Python code. Each exercise builds on previous concepts.',
    icon: Code2,
    extra: '120+ exercises',
  },
  {
    step: '3',
    title: 'Get AI Help',
    description: 'Stuck? Chat with our AI tutor for hints, explanations, and guidance. The AI understands your code and provides targeted assistance.',
    icon: MessageSquare,
    extra: 'Instant responses',
  },
  {
    step: '4',
    title: 'Track Progress',
    description: 'Master concepts through repetition. Build your streak, earn proficiency badges, and watch your mastery scores grow.',
    icon: Target,
    extra: 'Mastery scoring',
  },
];

const modules = [
  { name: 'Python Basics', difficulty: 'beginner', topics: 4, exercises: 10, description: 'Variables, data types, operators, and I/O' },
  { name: 'Control Flow', difficulty: 'beginner', topics: 3, exercises: 11, description: 'If statements, loops, and control structures' },
  { name: 'Functions', difficulty: 'intermediate', topics: 4, exercises: 14, description: 'Define functions, parameters, and scope' },
  { name: 'Data Structures', difficulty: 'intermediate', topics: 3, exercises: 14, description: 'Lists, dictionaries, tuples, and sets' },
  { name: 'File Operations', difficulty: 'intermediate', topics: 3, exercises: 9, description: 'Read, write, and manage files' },
  { name: 'Error Handling', difficulty: 'intermediate', topics: 3, exercises: 10, description: 'Try/except blocks and exceptions' },
  { name: 'Object-Oriented Programming', difficulty: 'advanced', topics: 4, exercises: 16, description: 'Classes, objects, and inheritance' },
  { name: 'Advanced Python', difficulty: 'advanced', topics: 4, exercises: 15, description: 'Decorators, generators, and more' },
];

const techStack = [
  'Next.js 15',
  'TypeScript',
  'Monaco Editor',
  'FastAPI',
  'OpenAI',
  'Dapr',
  'Kafka',
  'PostgreSQL',
  'Kubernetes',
];

const stats = [
  { value: '8+', label: 'Comprehensive Modules', icon: BookOpen },
  { value: '29', label: 'Learning Topics', icon: FileCode },
  { value: '120+', label: 'Coding Exercises', icon: Code2 },
  { value: '24/7', label: 'AI Tutor Availability', icon: MessageSquare },
  { value: '100%', label: 'Browser-Based', icon: Globe },
  { value: 'Free', label: 'Forever', icon: Sparkles },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Developer',
    content: 'LearnFlow transformed how I learn Python. The AI tutor explains concepts in a way that finally makes sense. I went from zero to building my own projects in just 6 weeks.',
    rating: 5,
    achievement: 'Built 3 projects',
  },
  {
    name: 'Marcus Johnson',
    role: 'Data Analyst',
    content: 'The interactive exercises are incredible. Being able to write and run code directly in the browser while getting instant feedback accelerated my learning significantly.',
    rating: 5,
    achievement: 'Mastered pandas',
  },
  {
    name: 'Emily Rodriguez',
    role: 'CS Student',
    content: 'As a student, this platform filled gaps in my university courses. The struggle detection helped my professor identify where I needed extra help.',
    rating: 5,
    achievement: 'Improved grades',
  },
  {
    name: 'David Kim',
    role: 'Career Switcher',
    content: 'I went from marketing to software development thanks to LearnFlow. The structured curriculum and AI support made the transition smooth and achievable.',
    rating: 5,
    achievement: 'Landed developer job',
  },
];

const learningOutcomes = [
  {
    category: 'Fundamentals',
    icon: Target,
    skills: ['Variables & Data Types', 'Operators & Expressions', 'Input/Output Operations', 'Comments & Documentation'],
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    category: 'Control Flow',
    icon: GitBranch,
    skills: ['If/Else Statements', 'For/While Loops', 'Break & Continue', 'Pattern Matching'],
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    category: 'Functions',
    icon: Code2,
    skills: ['Function Definition', 'Parameters & Arguments', 'Return Values', 'Lambda Functions', 'Scope & Closures'],
    color: 'from-green-500/20 to-emerald-500/20',
  },
  {
    category: 'Data Structures',
    icon: Database,
    skills: ['Lists & List Methods', 'Dictionaries & Hash Maps', 'Tuples & Sets', 'Comprehensions'],
    color: 'from-orange-500/20 to-yellow-500/20',
  },
  {
    category: 'File Operations',
    icon: FileCode,
    skills: ['Reading Files', 'Writing Files', 'File Modes', 'Context Managers'],
    color: 'from-red-500/20 to-rose-500/20',
  },
  {
    category: 'Error Handling',
    icon: Bug,
    skills: ['Try/Except Blocks', 'Exception Types', 'Raising Exceptions', 'Custom Exceptions'],
    color: 'from-indigo-500/20 to-violet-500/20',
  },
  {
    category: 'OOP',
    icon: Puzzle,
    skills: ['Classes & Objects', 'Methods & Attributes', 'Inheritance', 'Polymorphism', 'Encapsulation'],
    color: 'from-teal-500/20 to-cyan-500/20',
  },
  {
    category: 'Advanced',
    icon: Rocket,
    skills: ['Decorators', 'Generators & Yield', 'Iterators', 'Context Managers', 'Metaprogramming'],
    color: 'from-fuchsia-500/20 to-pink-500/20',
  },
];

const faqs = [
  {
    question: 'Is LearnFlow really free?',
    answer: 'Yes! LearnFlow is completely free to use. We believe programming education should be accessible to everyone. All modules, exercises, and AI tutoring features are available at no cost.',
  },
  {
    question: 'Do I need to install anything?',
    answer: 'No installation required! LearnFlow runs entirely in your web browser. Our code editor lets you write and execute Python code directly without setting up a local environment.',
  },
  {
    question: 'How does the AI tutor work?',
    answer: 'Our AI tutor is powered by advanced language models trained specifically for Python education. It understands your code, explains errors, provides hints, and adapts explanations to your skill level.',
  },
  {
    question: 'Can I use LearnFlow alongside my courses?',
    answer: 'Absolutely! LearnFlow complements university courses, bootcamps, and self-study. Many teachers use our platform to supplement their teaching with interactive exercises.',
  },
  {
    question: 'What Python version do you teach?',
    answer: 'We teach Python 3.x, the current industry standard. All code examples and exercises use modern Python syntax and best practices.',
  },
  {
    question: 'How long does it take to complete?',
    answer: 'The full curriculum takes approximately 40-60 hours to complete, depending on your prior experience. You can learn at your own pace and focus on specific modules as needed.',
  },
  {
    question: 'Is there a certificate?',
    answer: 'While we don\'t offer formal certificates, you\'ll build a portfolio of working Python code. Completing all modules demonstrates proficiency equivalent to intermediate Python developers.',
  },
  {
    question: 'Can teachers track student progress?',
    answer: 'Yes! Our teacher dashboard provides real-time insights into student progress, identifies learning struggles, and helps provide targeted assistance.',
  },
];

const comparisonItems = [
  {
    feature: 'Interactive Code Editor',
    learnflow: true,
    others: false,
  },
  {
    feature: 'AI-Powered Tutoring',
    learnflow: true,
    others: false,
  },
  {
    feature: 'Instant Code Execution',
    learnflow: true,
    others: false,
  },
  {
    feature: 'Progress Tracking',
    learnflow: true,
    others: true,
  },
  {
    feature: '120+ Exercises',
    learnflow: true,
    others: false,
  },
  {
    feature: 'Completely Free',
    learnflow: true,
    others: false,
  },
  {
    feature: 'Teacher Dashboard',
    learnflow: true,
    others: false,
  },
  {
    feature: 'Struggle Detection',
    learnflow: true,
    others: false,
  },
  {
    feature: 'Browser-Based',
    learnflow: true,
    others: true,
  },
  {
    feature: 'Real-Time Feedback',
    learnflow: true,
    others: false,
  },
];

const codeExample = `# Learn Python by doing
def calculate_grade(scores):
    """Calculate average grade from list of scores"""
    if not scores:
        return "No scores provided"

    average = sum(scores) / len(scores)

    if average >= 90:
        return f"A ({average:.1f})"
    elif average >= 80:
        return f"B ({average:.1f})"
    elif average >= 70:
        return f"C ({average:.1f})"
    else:
        return f"Keep practicing! ({average:.1f})"

# Try it yourself
student_scores = [85, 92, 78, 95, 88]
grade = calculate_grade(student_scores)
print(f"Your grade: {grade}")`;

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-purple/5 via-transparent to-cosmic-blue/5" />
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20">
              <Zap className="h-4 w-4" />
              AI-Powered Python Learning Platform
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gradient md:text-6xl lg:text-7xl">
              Master Python with Interactive AI Assistance
            </h1>
            <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
              Learn Python programming through hands-on exercises, real-time code execution,
              and personalized AI tutoring that adapts to your learning pace. No installation required.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-cosmic-purple to-cosmic-blue hover:from-cosmic-purple/90 hover:to-cosmic-blue/90 text-white shadow-glow-purple/30"
              >
                <Link href="/login">
                  Start Learning Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/modules">
                  <Play className="mr-2 h-5 w-5" />
                  Explore Curriculum
                </Link>
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center">
                  <stat.icon className="mb-2 h-6 w-6 text-cosmic-purple" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat, index) => (
              <Card key={index} className="border-border bg-card/80 p-6 text-center shadow-elevated">
                <stat.icon className="mx-auto mb-3 h-8 w-8 text-cosmic-purple" />
                <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Everything You Need to Master Python
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Our platform combines cutting-edge AI with proven learning methods to deliver an
              unmatched coding education experience.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group border-border bg-card/80 p-6 shadow-elevated transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-purple/20"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cosmic-purple/20 to-cosmic-blue/20 text-cosmic-purple">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground group-hover:text-cosmic-purple transition-colors">
                  {feature.title}
                </h3>
                <p className="mb-4 text-muted-foreground">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example Preview */}
      <section className="border-y border-border bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Learn by Writing Real Code
              </h2>
              <p className="text-lg text-muted-foreground">
                Our interactive editor lets you write and execute Python code directly in your browser.
                Get instant feedback and see your code come to life.
              </p>
            </div>
            <Card className="overflow-hidden border-border bg-background shadow-elevated">
              <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                  <div className="h-3 w-3 rounded-full bg-warning" />
                  <div className="h-3 w-3 rounded-full bg-success" />
                </div>
                <div className="ml-4 text-sm text-muted-foreground">python_tutor.py</div>
              </div>
              <pre className="overflow-x-auto p-6 text-sm">
                <code className="font-mono">
                  {codeExample.split('\n').map((line, i) => (
                    <div key={i} className="hover:bg-muted/50">
                      <span className="mr-4 select-none text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-purple-400">def</span>
                      <span className="text-blue-400"> calculate_grade</span>
                      <span className="text-foreground">(</span>
                      <span className="text-orange-400">scores</span>
                      <span className="text-foreground">):</span>
                    </div>
                  ))}
                </code>
              </pre>
            </Card>
            <div className="mt-8 text-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-cosmic-purple to-cosmic-blue hover:from-cosmic-purple/90 hover:to-cosmic-blue/90 text-white shadow-glow-purple/30"
              >
                <Link href="/login">
                  Try It Yourself
                  <Terminal className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              How LearnFlow Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              A simple, effective learning path designed to take you from beginner to proficient Python developer.
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cosmic-purple to-cosmic-blue text-3xl font-bold text-white shadow-glow-purple/30 mx-auto">
                  {item.step}
                </div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mx-auto">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mb-3 text-sm text-muted-foreground">{item.description}</p>
                <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Sparkles className="h-3 w-3" />
                  {item.extra}
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="absolute left-[60%] top-10 hidden h-0.5 w-4/5 bg-gradient-to-r from-cosmic-purple/50 to-transparent lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Preview */}
      <section className="border-y border-border bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Comprehensive Python Curriculum
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              From fundamentals to advanced concepts, master Python at your own pace with 8 comprehensive modules.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((module, index) => (
              <Card
                key={index}
                className="group border-border bg-card/80 p-4 shadow-elevated transition-all duration-300 hover:-translate-y-1 hover:border-cosmic-purple/50"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-cosmic-purple transition-colors">
                      {module.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">{module.description}</p>
                  </div>
                  <span
                    className={`ml-2 flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      module.difficulty === 'beginner'
                        ? 'bg-success/20 text-success'
                        : module.difficulty === 'intermediate'
                        ? 'bg-warning/20 text-warning'
                        : 'bg-destructive/20 text-destructive'
                    }`}
                  >
                    {module.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{module.topics} topics</span>
                  <span>{module.exercises} exercises</span>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-cosmic-purple to-cosmic-blue hover:from-cosmic-purple/90 hover:to-cosmic-blue/90 text-white shadow-glow-purple/30"
            >
              <Link href="/login">
                Start Learning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Learning Outcomes */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              What You Will Learn
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Master essential Python skills through our comprehensive curriculum covering everything from basics to advanced topics.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {learningOutcomes.map((outcome, index) => (
              <Card
                key={index}
                className={`border-border bg-gradient-to-br ${outcome.color} p-5 shadow-elevated`}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
                  <outcome.icon className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">{outcome.category}</h3>
                <ul className="space-y-2">
                  {outcome.skills.map((skill, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-success flex-shrink-0" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-border bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Loved by Learners Worldwide
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Join thousands of successful Python developers who started their journey with LearnFlow.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border bg-card/80 p-6 shadow-elevated">
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 text-foreground italic">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-success/20 px-3 py-1 text-xs font-medium text-success">
                    <Award className="h-3 w-3" />
                    {testimonial.achievement}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Why Choose LearnFlow?
              </h2>
              <p className="text-lg text-muted-foreground">
                See how we compare to other learning platforms.
              </p>
            </div>
            <Card className="border-border bg-card/80 shadow-elevated overflow-hidden">
              <div className="grid grid-cols-3 border-b border-border bg-muted/50">
                <div className="p-4 font-semibold text-foreground">Feature</div>
                <div className="p-4 text-center font-semibold text-cosmic-purple">LearnFlow</div>
                <div className="p-4 text-center font-semibold text-muted-foreground">Others</div>
              </div>
              {comparisonItems.map((item, index) => (
                <div key={index} className="grid grid-cols-3 border-b border-border last:border-0">
                  <div className="p-4 text-foreground">{item.feature}</div>
                  <div className="p-4 text-center">
                    {item.learnflow ? (
                      <CheckCircle2 className="mx-auto h-6 w-6 text-success" />
                    ) : (
                      <div className="mx-auto h-6 w-6" />
                    )}
                  </div>
                  <div className="p-4 text-center">
                    {item.others ? (
                      <CheckCircle2 className="mx-auto h-6 w-6 text-success" />
                    ) : (
                      <div className="mx-auto h-6 w-6" />
                    )}
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-y border-border bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Find answers to common questions about LearnFlow.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-border bg-card/80 p-5 shadow-elevated">
                  <h3 className="mb-2 flex items-start gap-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-5 w-5 text-warning flex-shrink-0" />
                    {faq.question}
                  </h3>
                  <p className="ml-7 text-sm text-muted-foreground">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-foreground">Built with Modern Technology</h2>
            <p className="text-muted-foreground">Cloud-native, scalable, and AI-powered architecture</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {techStack.map((tech, index) => (
              <span
                key={index}
                className="rounded-lg bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm border border-border"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="border-t border-border py-24">
        <div className="container mx-auto px-4">
          <Card className="glass mx-auto max-w-4xl border-border bg-gradient-to-br from-cosmic-purple/10 to-cosmic-blue/10 p-12 text-center shadow-glow-purple/20">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20">
              <Flame className="h-4 w-4" />
              Start Your Journey Today
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Ready to Master Python?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of learners mastering Python with interactive exercises and AI-powered
              tutoring. Start for free, learn at your own pace, and build real coding skills.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-cosmic-purple to-cosmic-blue hover:from-cosmic-purple/90 hover:to-cosmic-blue/90 text-white shadow-glow-purple/30"
              >
                <Link href="/login">
                  Get Started Free
                  <Rocket className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/modules">
                  Browse Curriculum
                  <BookOpen className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Cancel anytime
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Learn at your own pace
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
