import { render, screen, fireEvent, within } from '@testing-library/react';
import BoatClientPage from '../../boat/BoatClientPage';
jest.mock('../../context/LanguageContext',()=>({useLanguage:()=>({language:'it'})}));
jest.mock('posthog-js/react',()=>({usePostHog:()=>({capture:jest.fn()})}));

it('la selezione aggiorna nome e immagine del componente, mantenendo la foto del rig',()=>{
  const {container}=render(<BoatClientPage />);
  const navigation=screen.getByRole('navigation',{name:'Componenti della barca'});
  const expected=[['Foil','Foils','foils.png'],['Terrazze','Terrazze','wings.jpeg'],['Elettronica','Elettronica & PCB di Bordo','electronics.JPG'],['Sartie e albero','Sartie e albero','sponsor-05-full-sail-partners.jpg'],['Scafo','Scafo','hull.jpg']];
  for(const [button,title,photo] of expected){
    const trigger=within(navigation).getByRole('button',{name:button});
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-pressed','true');
    expect(screen.getByRole('heading',{name:title})).toBeInTheDocument();
    expect(container.querySelector('.sft-boat-part-photo')?.getAttribute('src')).toContain(photo);
  }
});
