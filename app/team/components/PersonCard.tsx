import Image from 'next/image';
import { Card, CardContent } from '@sft/design-system';
import type { TeamPerson } from '../roster';

export default function PersonCard({ person, role }: { person: TeamPerson; role: string }) {
  const initials = person.name.split(' ').filter(Boolean).map(word => word[0]).slice(0, 2).join('');
  return <Card className="sft-person-card">
    <div className="sft-person-portrait">
      {person.photo ? <Image src={person.photo} alt={person.name} fill sizes="(max-width: 767px) 80px, 112px" /> : <span className="sft-person-initials" aria-hidden="true">{initials}</span>}
    </div>
    <CardContent>
      <p className="sft-eyebrow">{role}</p>
      <h3>{person.name}</h3>
    </CardContent>
  </Card>;
}
