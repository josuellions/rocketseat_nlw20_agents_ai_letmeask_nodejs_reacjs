import { Wand } from 'lucide-react';
import { Button } from '../components/ui/button';

export function ExamplesComponents() {
  return (
    <div>
      <h1>Let me Ask - AI</h1>
      <div className="flex flex-row gap-4">
        <Button>Bottom</Button>
        <Button variant="secondary">Bottom</Button>
        <Button variant="outline">Bottom</Button>
        <Button variant="ghost">Bottom</Button>
        <Button variant="destructive">Bottom</Button>
      </div>
      <br />
      <div className="flex flex-row gap-4">
        <Button size="sm">Small</Button>
        <Button size="lg">Langer</Button>
        <Button size="icon">
          <Wand />
        </Button>
      </div>
    </div>
  );
}
