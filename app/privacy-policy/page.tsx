'use client';

import { useLanguage } from '../context/LanguageContext';
import { privacy } from '../translations/privacy';

const PrivacyPolicy = () => {
    const { language } = useLanguage();
    const content = privacy[language];

    return (
        <main className="bg-white text-black " data-testid="home-page">
            <div className="h-32"></div>
            <div className="container mx-auto px-4 py-8   max-w-4xl">
                <h1 className="text-3xl font-bold text-[#822433] mb-4">{content.title}</h1>
                <p className="text-sm text-gray-500 mb-8">{content.lastUpdate}</p>

                <div className="prose prose-sm max-w-none">
                    <p className="mb-8">{content.intro}</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-[#822433] mb-4">{content.controller.title}</h2>
                        <p>{content.controller.content}</p>
                        <p className="mt-2">{content.controller.email}</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-[#822433] mb-4">{content.dataCollected.title}</h2>
                        <p className="mb-2">{content.dataCollected.automatic}</p>
                        <ul className="list-disc pl-6 mb-4">
                            {content.dataCollected.automaticList.map((item, index) => (
                                <li key={index} className="mb-1">{item}</li>
                            ))}
                        </ul>
                        <p>{content.dataCollected.cookies}</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-[#822433] mb-4">{content.purpose.title}</h2>
                        <ul className="list-disc pl-6">
                            {content.purpose.list.map((item, index) => (
                                <li key={index} className="mb-1">{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-[#822433] mb-4">{content.rights.title}</h2>
                        <p className="mb-2">{content.rights.content}</p>
                        <ul className="list-disc pl-6">
                            {content.rights.list.map((item, index) => (
                                <li key={index} className="mb-1">{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-[#822433] mb-4">{content.cookies.title}</h2>
                        <p>{content.cookies.content}</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-[#822433] mb-4">{content.security.title}</h2>
                        <p>{content.security.content}</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-[#822433] mb-4">{content.analytics.title}</h2>
                        <p>{content.analytics.content}</p>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default PrivacyPolicy;