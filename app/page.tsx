import React from "react";
import Image from "next/image";
import { ChevronDown, Calendar } from "lucide-react";

export default function Home() {

  const upcomingEvents = [
    {
      title: "2025 SuMoth Challenge",
      date: "15 Giugno 2025",
      location: "Garda, Verona",
      image: "/sumoth.png",
    },
  ];

  return (
    <main className="relative min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        <Image
          src="/moth.jpg"
          alt="regatta"
          fill
          className="object-cover brightness-50"
          priority
        />
        
        <div className="relative z-10 text-center text-white px-4">
          <div className="transition-all duration-500">
            <h1 className="text-5xl md:text-7xl font-bold pb-4">
              Sapienza Sailing Team
            </h1>
            <p className="text-xl md:text-2xl italic">
              Il nostro impegno, la nostra passione.
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 w-full flex justify-center">
          <div className="animate-bounce">
            <ChevronDown className="text-white w-8 h-8" />
          </div>
        </div>
      </div>

     
      {/* Upcoming Events Section */}
      <div className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Prossimi Eventi
          </h2>
          <div className="grid md:grid-cols-1">
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="bg-gray-900 p-6  mx-auto rounded-xl transition-all duration-300 hover:transform hover:scale-105 md:grid md:grid-cols-2 gap-4"
            >
              {/* Contenuto del testo a sinistra */}
              <div className="flex flex-col justify-center">
                <Calendar className="text-blue-500 w-8 h-8 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
                <p className="text-gray-400">{event.date}</p>
                <p className="text-gray-400">{event.location}</p>
              </div>

              {/* Immagine a destra */}
              <div className="flex justify-center md:justify-end">
                <Image
                  className="rounded-xl mt-4"
                  src={event.image}
                  alt="sumoth"
                  width={400}
                  height={400}
                />
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Entra a far parte del team
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Cerchiamo persone appassionate che vogliono mettersi alla prova e crescere insieme a noi.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300">
            Contattaci
          </button>
        </div>
      </div>
     
    </main>
  );
}