"use client";

import { useState } from "react";
import {
  Briefcase,
  FileText,
  Lightbulb,
  PenSquare,
  CheckCircle,
  PanelLeft,
} from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/app/logo";
import TfcIdeasGenerator from "@/components/app/tfc-ideas-generator";
import InterviewPrep from "@/components/app/interview-prep";
import CoverLetterGenerator from "@/components/app/cover-letter-generator";
import ContentWriter from "@/components/app/content-writer";
import TextImprover from "@/components/app/text-improver";

type Feature =
  | "tfc-ideas"
  | "interview-prep"
  | "cover-letter-generator"
  | "content-writer"
  | "text-improver";

const featureComponents = {
  "tfc-ideas": <TfcIdeasGenerator />,
  "interview-prep": <InterviewPrep />,
  "cover-letter-generator": <CoverLetterGenerator />,
  "content-writer": <ContentWriter />,
  "text-improver": <TextImprover />,
};

const featureInfo = {
  "tfc-ideas": {
    title: "Idées de TFC",
    description: "Générez des idées de sujets pour votre Travail de Fin de Cycle (TFC).",
    icon: Lightbulb,
  },
  "interview-prep": {
    title: "Préparation aux entretiens",
    description: "Préparez vos entretiens d'embauche avec des questions et réponses.",
    icon: Briefcase,
  },
  "cover-letter-generator": {
    title: "Lettre de motivation",
    description: "Générez une lettre de motivation percutante et obtenez des conseils pour votre CV.",
    icon: FileText,
  },
  "content-writer": {
    title: "Aide à la rédaction",
    description: "Rédigez des contenus professionnels pour LinkedIn, emails, etc.",
    icon: PenSquare,
  },
  "text-improver": {
    title: "Correcteur de texte",
    description: "Améliorez vos textes en corrigeant les fautes et le style.",
    icon: CheckCircle,
  },
};

const orderedFeatures: Feature[] = [
  "tfc-ideas",
  "interview-prep",
  "cover-letter-generator",
  "content-writer",
  "text-improver",
];

export function MainLayout() {
  const [activeFeature, setActiveFeature] = useState<Feature>("tfc-ideas");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const CurrentFeature = featureComponents[activeFeature];
  const currentInfo = featureInfo[activeFeature];

  const handleFeatureSelect = (feature: Feature) => {
    setActiveFeature(feature);
    setMobileMenuOpen(false); // Close mobile menu on selection
  };
  
  const SidebarContent = () => (
    <nav className="grid items-start px-4 text-sm font-medium">
      {orderedFeatures.map((key) => {
        const { title, icon: Icon } = featureInfo[key as Feature];
        return (
          <button
            key={key}
            onClick={() => handleFeatureSelect(key)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              activeFeature === key ? "bg-muted text-primary" : ""
            }`}
          >
            <Icon className="h-4 w-4" />
            {title}
          </button>
        );
      })}
    </nav>
  );


  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
             <Logo />
          </div>
          <div className="flex-1 overflow-auto py-2">
            <SidebarContent />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 lg:hidden"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
               <div className="flex h-[60px] items-center border-b px-6">
                <Logo />
              </div>
              <div className="mt-4">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex flex-col">
            <h1 className="font-headline text-xl md:text-2xl font-bold text-foreground">
                {currentInfo.title}
            </h1>
            <p className="text-muted-foreground mt-1 text-xs md:text-sm">{currentInfo.description}</p>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8 overflow-auto">
          {CurrentFeature}
        </main>
      </div>
    </div>
  );
}
