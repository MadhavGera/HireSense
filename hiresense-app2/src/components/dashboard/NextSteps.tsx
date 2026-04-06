import Link from "next/link";
import { GraduationCap, Mic, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { dashboardData } from "@/data/mockData";

const iconMap = {
  GraduationCap,
  Mic,
  Users,
};

export function NextSteps() {
  return (
    <div className="bg-surface-container-low p-6 rounded-2xl">
      <h2 className="text-lg font-bold font-headline text-on-surface mb-6">
        Next Steps
      </h2>
      <ul className="space-y-4">
        {dashboardData.nextSteps.map((step) => {
          const Icon = iconMap[step.icon as keyof typeof iconMap];
          return (
            <li key={step.title} className="flex gap-4 group">
              <div className="flex-shrink-0 w-8 h-8 rounded bg-surface-variant flex items-center justify-center group-hover:bg-primary transition-colors">
                <Icon className="w-4 h-4 text-primary group-hover:text-on-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">
                  {step.title}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <Link href="/interview" className="block w-full mt-8">
        <Button className="w-full py-3 hover:shadow-[0_0_30px_rgba(133,173,255,0.3)]">
          Schedule Mock Interview
        </Button>
      </Link>
    </div>
  );
}
