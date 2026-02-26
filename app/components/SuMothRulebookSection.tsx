'use client';

import React, { useState } from 'react';
import { BookOpen, ChevronDown, CheckCircle, Wrench, DollarSign, Scale, Zap, Trophy, Sailboat, Award, Users, Lightbulb, Target, Settings, TrendingUp, Shield } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { sumothRulebookTranslations } from '@/app/translations/sumothRulebook';

const SuMothRulebookSection = () => {
  const { language } = useLanguage();
  const t = sumothRulebookTranslations[language];
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  const sections = React.useMemo(() => [
    {
      id: 'technical-requirements',
      title: t.technicalRequirements.title,
      icon: <Settings className="w-8 h-8" />,
      content: (
        <div className="space-y-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-2">
            <h4 className="text-xl font-bold mb-4 flex items-center text-gray-800">
              <div className="p-2 rounded-lg bg-red-900/10 text-red-900 mr-3">
                <Scale className="w-5 h-5" />
              </div>
              {t.technicalRequirements.boxRule}
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{t.technicalRequirements.maxLength}</span>
                  <span className="font-bold text-red-900">3355 mm</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{t.technicalRequirements.maxBeam}</span>
                  <span className="font-bold text-red-900">2250 mm</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{t.technicalRequirements.maxLuff}</span>
                  <span className="font-bold text-red-900">5185 mm</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{t.technicalRequirements.maxMast}</span>
                  <span className="font-bold text-red-900">6250 mm</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{t.technicalRequirements.maxSailArea}</span>
                  <span className="font-bold text-red-900">8.25 m²</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-2">
            <h4 className="text-xl font-bold mb-4 flex items-center text-gray-800">
              <div className="p-2 rounded-lg bg-red-900/10 text-red-900 mr-3">
                <DollarSign className="w-5 h-5" />
              </div>
              {t.technicalRequirements.manufacturingBudget}
            </h4>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-red-900">10,000</div>
              <div>
                <p className="font-semibold text-gray-800">{t.technicalRequirements.budget}</p>
                <p className="text-gray-600">{t.technicalRequirements.budgetDesc}</p>
                <p className="text-sm text-green-600 font-medium">{t.technicalRequirements.ecoMaterials}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-2">
            <h4 className="text-xl font-bold mb-4 flex items-center text-gray-800">
              <div className="p-2 rounded-lg bg-red-900/10 text-red-900 mr-3">
                <Shield className="w-5 h-5" />
              </div>
              {t.technicalRequirements.buoyancy}
            </h4>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Zap className="w-6 h-6 text-red-900 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-2 text-gray-800">{t.technicalRequirements.unsinkable}</p>
                  <p className="text-gray-700">{t.technicalRequirements.unsinkableDesc}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h4 className="text-xl font-bold mb-4 flex items-center text-gray-800">
              <div className="p-2 rounded-lg bg-red-900/10 text-red-900 mr-3">
                <CheckCircle className="w-5 h-5" />
              </div>
              {t.technicalRequirements.sustainability}
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h5 className="font-semibold text-green-700 mb-2">{t.technicalRequirements.encouragedMaterials}</h5>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>{t.technicalRequirements.upcycled}</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>{t.technicalRequirements.recycled}</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>{t.technicalRequirements.lowCO2}</li>
                </ul>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h5 className="font-semibold text-orange-700 mb-2">{t.technicalRequirements.restrictedMaterials}</h5>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center"><span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>{t.technicalRequirements.minCarbon}</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>{t.technicalRequirements.massCaps}</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>{t.technicalRequirements.highCO2}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h4 className="text-xl font-bold mb-4 flex items-center text-gray-800">
              <div className="p-2 rounded-lg bg-red-900/10 text-red-900 mr-3">
                <Wrench className="w-5 h-5" />
              </div>
              {t.technicalRequirements.structuralLoads}
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-red-900">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{t.technicalRequirements.mainFoil}</span>
                    <span className="font-bold text-red-900">80kg</span>
                  </div>
                  <p className="text-sm text-gray-600">{t.technicalRequirements.totalLoad}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-red-900">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{t.technicalRequirements.wingbars}</span>
                    <span className="font-bold text-red-900">170kg</span>
                  </div>
                  <p className="text-sm text-gray-600">{t.technicalRequirements.wingbarsLoad}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-red-900">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{t.technicalRequirements.rudderGantry}</span>
                    <span className="font-bold text-red-900">50kg</span>
                  </div>
                  <p className="text-sm text-gray-600">{t.technicalRequirements.totalLoad}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-red-900">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{t.technicalRequirements.rigTension}</span>
                    <span className="font-bold text-red-900">300-450kg</span>
                  </div>
                  <p className="text-sm text-gray-600">{t.technicalRequirements.vangLoad}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'challenge-stages',
      title: t.challengeStages.title,
      icon: <Target className="w-8 h-8" />,
      content: (
        <div className="space-y-8">
          <div className="relative">
            <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-red-900 via-yellow-500 to-red-500 rounded-full"></div>

            <div className="space-y-8 mt-2">
              <div className="flex items-start space-x-6 relative">
                <div className="flex-shrink-0 w-16 h-16 bg-red-900 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg z-10">
                  S1
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex-1">
                  <h4 className="text-2xl font-bold mb-3 text-red-900">{t.challengeStages.design}</h4>
                  <p className="text-gray-700 mb-4">{t.challengeStages.designDesc}</p>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="p-3 bg-red-900/10 rounded-lg text-center">
                      <Lightbulb className="w-6 h-6 mx-auto mb-2 text-red-900" />
                      <p className="text-sm font-medium text-gray-800">{t.challengeStages.techReport}</p>
                    </div>
                    <div className="p-3 bg-red-900/10 rounded-lg text-center">
                      <Users className="w-6 h-6 mx-auto mb-2 text-red-900" />
                      <p className="text-sm font-medium text-gray-800">{t.challengeStages.presentation}</p>
                    </div>
                    <div className="p-3 bg-red-900/10 rounded-lg text-center">
                      <BookOpen className="w-6 h-6 mx-auto mb-2 text-red-900" />
                      <p className="text-sm font-medium text-gray-800">{t.challengeStages.designVlog}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-6 relative">
                <div className="flex-shrink-0 w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg z-10">
                  S2
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex-1">
                  <h4 className="text-2xl font-bold mb-3 text-yellow-600">{t.challengeStages.manufacturing}</h4>
                  <p className="text-gray-700 mb-4">{t.challengeStages.manufacturingDesc}</p>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="p-3 bg-yellow-500/10 rounded-lg text-center">
                      <Settings className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                      <p className="text-sm font-medium text-gray-800">{t.challengeStages.manufacturingTitle}</p>
                    </div>
                    <div className="p-3 bg-yellow-500/10 rounded-lg text-center">
                      <TrendingUp className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                      <p className="text-sm font-medium text-gray-800">{t.challengeStages.performance}</p>
                    </div>
                    <div className="p-3 bg-yellow-500/10 rounded-lg text-center">
                      <CheckCircle className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                      <p className="text-sm font-medium text-gray-800">{t.challengeStages.testingReport}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-6 relative">
                <div className="flex-shrink-0 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg z-10">
                  S3
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex-1">
                  <h4 className="text-2xl font-bold mb-3 text-red-600">{t.challengeStages.racing}</h4>
                  <p className="text-gray-700 mb-4">{t.challengeStages.racingDesc}</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-3 bg-red-500/10 rounded-lg text-center">
                      <Sailboat className="w-6 h-6 mx-auto mb-2 text-red-600" />
                      <p className="text-sm font-medium text-gray-800">{t.challengeStages.fleetRacing}</p>
                    </div>
                    <div className="p-3 bg-red-500/10 rounded-lg text-center">
                      <Trophy className="w-6 h-6 mx-auto mb-2 text-red-600" />
                      <p className="text-sm font-medium text-gray-800">{t.challengeStages.competition}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">{t.challengeStages.rulesGov}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'competition-scoring',
      title: t.scoring.title,
      icon: <Award className="w-8 h-8" />,
      content: (
        <div className="space-y-8 mt-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h4 className="text-2xl font-bold mb-6 text-center text-gray-800">{t.scoring.totalPoints}</h4>
            <div className="text-center mb-6">
              <div className="text-6xl font-bold bg-gradient-to-r from-red-900 to-yellow-500 bg-clip-text text-transparent">
                10,000
              </div>
              <p className="text-lg text-gray-600">{t.scoring.possiblePoints}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-red-900/5 rounded-xl">
                <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-red-900 mb-2">5,000</div>
                <h5 className="font-semibold text-gray-800 mb-1">{t.scoring.designPhase}</h5>
                <p className="text-sm text-gray-600">{t.scoring.staticPhase}</p>
              </div>

              <div className="text-center p-6 bg-yellow-500/5 rounded-xl">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">3,000</div>
                <h5 className="font-semibold text-gray-800 mb-1">{t.scoring.manufacturingPhase}</h5>
                <p className="text-sm text-gray-600">{t.scoring.dynamicPhase}</p>
              </div>

              <div className="text-center p-6 bg-red-500/5 rounded-xl">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">2,000</div>
                <h5 className="font-semibold text-gray-800 mb-1">{t.scoring.racingPhase}</h5>
                <p className="text-sm text-gray-600">{t.scoring.dynamicPhase}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h4 className="text-xl font-bold mb-6 flex items-center text-gray-800">
              <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-600 mr-3">
                <Award className="w-5 h-5" />
              </div>
              {t.scoring.bonusPoints}
            </h4>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h5 className="font-semibold text-green-700 mb-3">{t.scoring.bonusOpps}</h5>
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-medium text-gray-800">{t.scoring.fairPlay}</span>
                  </div>
                  <p className="text-sm text-gray-600">{t.scoring.fairPlayDesc}</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium text-gray-800">{t.scoring.equality}</span>
                  </div>
                  <p className="text-sm text-gray-600">{t.scoring.equalityDesc}</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-center mb-2">
                    <BookOpen className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="font-medium text-gray-800">{t.scoring.publications}</span>
                  </div>
                  <p className="text-sm text-gray-600">{t.scoring.publicationsDesc}</p>
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-orange-700 mb-3">{t.scoring.handicap}</h5>
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <div className="flex items-center mb-2">
                    <Scale className="w-5 h-5 text-orange-600 mr-2" />
                    <span className="font-medium text-gray-800">{t.scoring.selfBuilding}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{t.scoring.selfBuildingDesc}</p>
                  <div className="text-xs text-orange-700 font-medium">
                    {t.scoring.handicapDesc}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ], [t]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand via-[#a83545] to-brand rounded-2xl p-8 mb-16 text-white">
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl mr-4">
              <BookOpen className="w-16 h-16 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-2">{t.mainTitle}</h2>
              <div className="flex items-center space-x-2">
                <Sailboat className="w-5 h-5" />
                <span className="text-lg opacity-90">{t.mainSubtitle}</span>
              </div>
            </div>
          </div>
          <p className="text-xl text-center max-w-4xl mx-auto leading-relaxed opacity-95">
            {t.description}
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-500 ${openSection === section.id ? 'shadow-xl scale-[1.02]' : 'hover:shadow-md'}`}>
            <button
              className={`w-full flex justify-between items-center p-6 text-left font-bold text-xl transition-all duration-300 ${openSection === section.id ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
              onClick={() => toggleSection(section.id)}>
              <span className="flex items-center">
                <div className={`p-3 rounded-xl bg-red-900 text-white mr-4 transition-transform duration-300 ${openSection === section.id ? 'scale-110 rotate-3' : 'group-hover:scale-105'}`}>
                  {section.icon}
                </div>
                <span className={`transition-colors duration-300 ${openSection === section.id ? 'text-red-900' : 'text-gray-700'}`}>
                  {section.title}
                </span>
              </span>
              <div className={`transition-all duration-300 ${openSection === section.id ? 'rotate-180 text-red-900' : 'text-gray-400'}`}>
                <ChevronDown className="w-6 h-6" />
              </div>
            </button>

            <div className={`transition-all duration-500 ease-in-out ${openSection === section.id ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="p-6 pt-0 border-t border-gray-200">
                <div className={`transition-all duration-500 delay-100 ${openSection === section.id ? 'transform translate-y-0 opacity-100' : 'transform translate-y-4 opacity-0'}`}>
                  {section.content}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key Statistics */}
      <div className="mt-16 grid md:grid-cols-4 gap-6 mb-16">
        <div className="text-center p-6 bg-red-900 text-white rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="text-3xl font-bold mb-2">3</div>
          <div className="text-sm opacity-90">{t.stats.stages}</div>
          <Target className="w-8 h-8 mx-auto mt-3 opacity-75" />
        </div>
        <div className="text-center p-6 bg-yellow-500 text-white rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="text-3xl font-bold mb-2">10K</div>
          <div className="text-sm opacity-90">{t.stats.budget}</div>
          <DollarSign className="w-8 h-8 mx-auto mt-3 opacity-75" />
        </div>
        <div className="text-center p-6 bg-red-900 text-white rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="text-3xl font-bold mb-2">10K</div>
          <div className="text-sm opacity-90">{t.stats.points}</div>
          <Award className="w-8 h-8 mx-auto mt-3 opacity-75" />
        </div>
        <div className="text-center p-6 bg-red-500 text-white rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="text-3xl font-bold mb-2">8.25</div>
          <div className="text-sm opacity-90">{t.stats.sailArea}</div>
          <Sailboat className="w-8 h-8 mx-auto mt-3 opacity-75" />
        </div>
      </div>

      {/* Rules Summary Cards */}
      <div className="mt-16 mb-16">
        <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">{t.quickOverview.title}</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-900 rounded-xl text-white mr-4">
                <Scale className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-800">{t.quickOverview.designConstraints}</h4>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-900 rounded-full mr-3"></div>
                <span className="text-sm">{t.quickOverview.boxRule}</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-900 rounded-full mr-3"></div>
                <span className="text-sm">{t.quickOverview.sustainability}</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-900 rounded-full mr-3"></div>
                <span className="text-sm">{t.quickOverview.structuralLoads}</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-yellow-500 rounded-xl text-white mr-4">
                <Settings className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-800">{t.quickOverview.buildProcess}</h4>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm">{t.quickOverview.budget}</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm">{t.quickOverview.performance}</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm">{t.quickOverview.safety}</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-500 rounded-xl text-white mr-4">
                <Trophy className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-800">{t.quickOverview.competition}</h4>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm">{t.quickOverview.fleetRacing}</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm">{t.quickOverview.scoring}</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm">{t.quickOverview.bonus}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Timeline */}
      <div className="mt-16 mb-16">
        <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">{t.timeline.title}</h3>
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-0.5 h-full w-1 bg-gradient-to-b from-red-900 via-yellow-500 to-red-500 rounded-full"></div>

            <div className="space-y-16">
              {/* Design Phase */}
              <div className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h4 className="text-xl font-bold text-red-900 mb-2">{t.timeline.designPlanning}</h4>
                    <p className="text-gray-600 text-sm">{t.timeline.designPlanningDesc}</p>
                    <div className="mt-3 text-2xl font-bold text-red-900">5,000 pts</div>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-red-900 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                  1
                </div>
                <div className="w-1/2 pl-8">
                  <div className="text-sm text-gray-500">{t.timeline.phase1Duration}</div>
                </div>
              </div>

              {/* Manufacturing Phase */}
              <div className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="text-sm text-gray-500">{t.timeline.phase2Duration}</div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                  2
                </div>
                <div className="w-1/2 pl-8">
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h4 className="text-xl font-bold text-yellow-600 mb-2">{t.timeline.buildTest}</h4>
                    <p className="text-gray-600 text-sm">{t.timeline.buildTestDesc}</p>
                    <div className="mt-3 text-2xl font-bold text-yellow-600">3,000 pts</div>
                  </div>
                </div>
              </div>

              {/* Racing Phase */}
              <div className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h4 className="text-xl font-bold text-red-600 mb-2">{t.timeline.raceCompete}</h4>
                    <p className="text-gray-600 text-sm">{t.timeline.raceCompeteDesc}</p>
                    <div className="mt-3 text-2xl font-bold text-red-600">2,000 pts</div>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                  3
                </div>
                <div className="w-1/2 pl-8">
                  <div className="text-sm text-gray-500">{t.timeline.phase3Duration}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuMothRulebookSection;
