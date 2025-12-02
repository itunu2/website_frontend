import { Card } from "@/components/ui/card";

interface TestimonialCardProps {
  quote: string;
  attribution: string;
  role?: string;
}

export const TestimonialCard = ({ quote, attribution, role }: TestimonialCardProps) => {
  return (
    <Card 
      as="blockquote" 
      variant="glass" 
      className="flex-1 flex flex-col relative"
    >
      {/* Minimal quote mark */}
      <div className="mb-6">
        <span className="text-5xl font-serif text-accent-primary/30 leading-none" aria-hidden="true">
          "
        </span>
      </div>
      
      <div>
        <p className="mb-8 flex-1 text-body-lg leading-relaxed text-text-primary">
          {quote}
        </p>
        
        <footer className="pt-6 border-t border-border-subtle">
          <cite className="not-italic">
            <strong className="block font-semibold text-text-primary text-body">
              {attribution}
            </strong>
            {role && (
              <span className="block text-text-tertiary text-body-sm mt-1">
                {role}
              </span>
            )}
          </cite>
        </footer>
      </div>
    </Card>
  );
};
