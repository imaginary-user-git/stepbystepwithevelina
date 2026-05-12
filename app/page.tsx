"use client"



import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Award, Globe, ArrowRight, CheckCircle, Star, Play, Zap, Shield, Clock, Heart, Sparkles, Target, TrendingUp, Brain, Languages, Trophy, MessageCircle, GraduationCap } from "lucide-react"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const testimonials = [
    {
      name: "Marta Kazlauskienė",
      role: "Lithuanian Language Teacher",
      content: "This platform is perfect for English speakers learning Lithuanian. The cultural context and grammar explanations are exactly what my students need!",
      rating: 5,
      avatar: "MK",
      flag: "🇱🇹"
    },
    {
      name: "Jonas Petras",
      role: "Software Engineer", 
      content: "As a Lithuanian speaker, the English courses here address all the specific challenges I face. The grammar explanations are incredibly helpful.",
      rating: 5,
      avatar: "JP",
      flag: "🇱🇹"
    },
    {
      name: "Dr. Paulius Rimkus",
      role: "University Professor",
      content: "The specialized approach for Lithuanian-English learning is outstanding. My students show remarkable progress using this platform.",
      rating: 5,
      avatar: "PR",
      flag: "🇱🇹"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>


      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <div className={`flex flex-col md:flex-row items-center justify-between gap-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="md:w-1/2 text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mb-6 animate-pulse">
                <Sparkles className="h-4 w-4 mr-2" />
                Pradėk mokytis jau šiandien!
              </div>
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                Labas, aš Evelina — anglų kalbos mokytoja ir <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x">nuotolinės mokyklos kūrėja.</span> 👋
              </h1>
              
              <div className="space-y-4 mb-8 max-w-3xl">
                <p className="text-lg text-gray-600 leading-relaxed">
                  Padedu suaugusiems mokytis anglų kalbos aiškiai, praktiškai ir be baimės kalbėti. Tikiu, kad kiekvienas gali išmokti kalbėti angliškai, kai mokymasis tampa suprantamas, pritaikytas realiam gyvenimui ir paremtas palaikymu, o ne spaudimu.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Savo pamokose daug dėmesio skiriu ne tik gramatikai, bet ir pasitikėjimui savimi kalbant. Man svarbu, kad mokiniai jaustųsi jaukiai, nebijotų klysti ir matytų tikrą progresą.
                </p>
                <div className="text-lg text-gray-600 leading-relaxed bg-white/60 p-4 rounded-xl shadow-sm border border-indigo-50">
                  <p className="font-semibold text-gray-800 mb-2">Čia rasi:</p>
                  <ul className="space-y-1">
                    <li>✨ individualias anglų kalbos pamokas,</li>
                    <li>✨ praktišką ir šiuolaikišką mokymosi metodą,</li>
                    <li>✨ palaikančią aplinką augti ir tobulėti.</li>
                  </ul>
                </div>
                <p className="text-lg font-medium text-indigo-700 leading-relaxed">
                  Mano tikslas — padėti tau ne tik mokytis anglų kalbos, bet ir ja naudotis užtikrintai. 💌
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/auth/register">
                  <Button size="lg" className="text-base px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    Start Learning Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button className="btn-outline-primary text-base px-8 py-5">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-8 text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">14-Day Free Trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Cancel Anytime</span>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-center relative">
              <div className="relative w-80 h-80 md:w-[450px] md:h-[450px]">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400 to-purple-400 rounded-[3rem] rotate-6 opacity-50 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-pink-400 to-indigo-400 rounded-[3rem] -rotate-3 opacity-50 animation-delay-2000"></div>
                <img 
                  src="/portfolio-hero-image.jpg" 
                  alt="Language Teacher" 
                  className="relative z-10 w-full h-full object-cover rounded-[3rem] shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Step by Step English?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our specialized platform combines cutting-edge AI technology with proven learning methods 
              specifically designed for Lithuanian-English language pairs. Experience unparalleled learning that adapts to your pace and cultural context.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Lessons",
                description: "Personalized learning paths that adapt to your progress and learning style for maximum efficiency.",
                color: "blue",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Users,
                title: "Expert Instructors",
                description: "Learn from certified language teachers and native speakers with years of teaching experience.",
                color: "green",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Award,
                title: "Smart Progress Tracking",
                description: "Advanced analytics show your strengths, weaknesses, and personalized recommendations for improvement.",
                color: "purple",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Globe,
                title: "Global Community",
                description: "Connect with 50,000+ learners worldwide, practice conversations, and immerse in diverse cultures.",
                color: "orange",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your data is protected with enterprise-grade security. Learn with complete peace of mind.",
                color: "indigo",
                gradient: "from-indigo-500 to-blue-500"
              },
              {
                icon: Clock,
                title: "Flexible Learning",
                description: "Study anytime, anywhere with 24/7 access. Perfect for busy schedules and different time zones.",
                color: "pink",
                gradient: "from-pink-500 to-rose-500"
              }
            ].map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {feature.title}
                  </CardTitle>
            </CardHeader>
                <CardContent className="px-8 pb-8">
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
          </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Language Showcase */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Specialized Lithuanian ↔ English Learning
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Focused exclusively on Lithuanian and English language learning with courses designed specifically for both directions of learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center max-w-4xl mx-auto">
            {[
              { 
                name: "English to Lithuanian", 
                flag: "🇱🇹", 
                learners: "2,847", 
                description: "Master Lithuanian from English with comprehensive courses covering grammar, vocabulary, and cultural context.",
                courses: "4 courses available"
              },
              { 
                name: "Lithuanian to English", 
                flag: "🇺🇸", 
                learners: "2,153", 
                description: "Develop fluent English skills from Lithuanian with specialized lessons addressing common challenges for Lithuanian speakers.",
                courses: "4 courses available"
              }
            ].map((language, index) => (
              <div key={index} className="group hover:scale-105 transition-all duration-300 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-6xl mb-4 group-hover:scale-125 transition-transform">
                  {language.flag}
                </div>
                <div className="font-bold text-2xl mb-2">{language.name}</div>
                <div className="text-lg opacity-90 mb-4">{language.learners} active learners</div>
                <div className="text-sm opacity-75 mb-4">{language.courses}</div>
                <div className="text-sm opacity-90 leading-relaxed">{language.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Join Our Lithuanian-English Learning Community
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thousands of learners trust our specialized platform for Lithuanian-English language learning. 
              See what makes us the premier choice for this language pair.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Learners', value: '5,000+', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
              { label: 'Specialized Languages', value: '2', icon: Languages, color: 'text-green-600', bg: 'bg-green-100' },
              { label: 'Expert Courses', value: '8', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-100' },
              { label: 'Success Rate', value: '96%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' }
            ].map((stat, i) => (
              <div key={i} className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 ${stat.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Language Proficiency Levels Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
                Structured Learning for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Every Level of Mastery
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Whether you're speaking your first Lithuanian words or mastering complex English grammar, 
                our platform follows the international standard to ensure your progress is measurable and real.
              </p>
              <div className="space-y-6">
                {[
                  { level: 'A1-A2', title: 'Beginner', desc: 'Build your foundation with basic vocabulary and essential everyday phrases.' },
                  { level: 'B1-B2', title: 'Intermediate', desc: 'Achieve independence in communication and handle most travel situations.' },
                  { level: 'C1-C2', title: 'Advanced', desc: 'Master the nuances of the language for professional and academic success.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-indigo-50 transition-colors border border-transparent hover:border-indigo-100">
                    <div className="shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold">
                      {item.level}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-8">
                <img src="https://images.unsplash.com/photo-1523240715632-d984bc4b7906?w=400&h=500&fit=crop" className="rounded-2xl shadow-lg w-full object-cover h-64" alt="" />
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=400&fit=crop" className="rounded-2xl shadow-lg w-full object-cover h-48" alt="" />
              </div>
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=400&fit=crop" className="rounded-2xl shadow-lg w-full object-cover h-48" alt="" />
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=500&fit=crop" className="rounded-2xl shadow-lg w-full object-cover h-64" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What Our Learners Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our community has to say about their learning experience.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8 bg-white shadow-xl">
              <CardContent className="text-center">
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl text-gray-700 mb-6 italic">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 text-lg">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-gray-500">
                      {testimonials[currentTestimonial].role} {testimonials[currentTestimonial].flag}
                    </div>
                  </div>
                </div>
              </CardContent>
          </Card>

            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto text-center relative">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Master Lithuanian ↔ English?
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Join thousands of successful learners who have achieved fluency in Lithuanian and English with our specialized platform. 
              Start your journey today and see results in just 30 days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/auth/register">
                <Button size="lg" className="text-lg px-8 py-6 bg-white text-indigo-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <Heart className="mr-2 h-5 w-5" />
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button className="btn-outline-white text-lg px-8 py-6">
                  <Target className="mr-2 h-5 w-5" />
                  Explore Courses
                </Button>
              </Link>
            </div>
            <p className="text-sm opacity-75">
              ✨ No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-2xl">🇱🇹🇺🇸</span>
                <span className="font-bold text-2xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Step by Step English
                </span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering learners to master Lithuanian and English through 
                specialized, interactive, and culturally-aware learning experiences.
              </p>
              <div className="flex space-x-4">
                {[
                  { name: 'Instagram', url: 'https://www.instagram.com/evelina.anglu_kalba?igsh=NnV6bjU3N3V2cXdp&utm_source=qr' },
                  { name: 'Facebook', url: '#' },
                  { name: 'LinkedIn', url: '#' }
                ].map((social) => (
                  <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">
                    <span className="text-sm font-semibold text-white">{social.name[0]}</span>
                  </a>
                ))}
              </div>
            </div>
            
            {[
              {
                title: "Platform",
                links: ["Browse Courses", "Pricing", "About Us", "Contact", "Blog"]
              },
              {
                title: "Support",
                links: ["Help Center", "FAQ", "Community", "Tutorials", "Status"]
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR", "Accessibility"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4 text-lg">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 Step by Step English. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Made with ❤️ for Lithuanian-English learners</span>
            </div>
        </div>
      </div>
      </footer>
    </div>
  )
}
