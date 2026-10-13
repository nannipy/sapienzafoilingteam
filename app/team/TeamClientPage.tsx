'use client';

import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { people, leadership, departments } from './roster';
import PersonCard from './components/PersonCard';

export default function TeamClientPage() {
  const { language } = useLanguage();
  const it = language === 'it';
  return <main className="sft-root sft-team-page">
    <div className="sft-team-container">
      <header className="sft-team-intro">
        <h1 className="sft-display">{it ? 'Il team' : 'The team'}</h1>
        <nav aria-label={it ? 'Reparti del team' : 'Team departments'} className="sft-team-index">
          {departments.map(department => <a key={department.id} href={`#${department.id}`}>{department.name[language]}</a>)}
        </nav>
      </header>
      <section className="sft-team-leadership" aria-labelledby="team-leadership">
        <h2 id="team-leadership" className="sft-eyebrow">{it ? 'Guida del team' : 'Team leadership'}</h2>
        <div className="sft-team-leaders-grid">
          {leadership.map(({person, role}) => <PersonCard key={person} person={people[person]} role={role[language]} />)}
        </div>
      </section>
    </div>
    <div className="sft-team-departments">
      <div className="sft-team-container">
        {departments.map(department => <section key={department.id} id={department.id} className="sft-team-department" aria-labelledby={`${department.id}-heading`}>
          <div className="sft-team-department-heading">
            <Image className="sft-department-icon" src={department.icon} alt="" width={64} height={64} sizes="64px" />
            <p className="sft-eyebrow">{it ? 'Reparto' : 'Department'}</p>
            <h2 id={`${department.id}-heading`} className="sft-display">{department.name[language]}</h2>
            <p className="sft-team-department-description">{department.description[language]}</p>
          </div>
          <div className="sft-team-heads-grid">
            {department.heads.map(person => <PersonCard key={person} person={people[person]} role={it ? 'Capo reparto' : 'Department Head'} />)}
          </div>
        </section>)}
      </div>
    </div>
  </main>;
}
