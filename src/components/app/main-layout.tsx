"use client";

import { useState } from "react";
import {
  Briefcase,
  FileText,
  Lightbulb,
  PenSquare,
  CheckCircle,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Logo } from "@/components/app/logo";
import TfcIdeasGenerator from "@/components/app/tfc-ideas-generator";
import TfeIdeasGenerator from "./tfe-ideas-generator";
import InterviewPrep from "@/components/app/interview-prep";
import CoverLetterGenerator from "@/components/app/cover-letter-generator";
import ContentWriter from "@/components/app/content-writer";
import TextImprover from "@/components/app/text-improver";

type Feature =
  | "tfc-ideas"
  | "tfe-ideas"
  | "interview-prep"
  | "cover-letter-generator"
  | "content-writer"
  | "text-improver";

const featureComponents = {
  "tfc-ideas": <TfcIdeasGenerator />,
  "tfe-ideas": <TfeIdeasGenerator />,
  "interview-prep": <InterviewPrep />,
  "cover-letter-generator": <CoverLetterGenerator />,
  "content-writer": <ContentWriter />,
  "text-improver": <TextImprover />,
};

const featureInfo = {
    "cover-letter-generator": {
    title: "Lettre de motivation & CV",
    description: "Générez une lettre de motivation percutante et obtenez des conseils pour votre CV.",
    icon: FileText,
  },
  "interview-prep": {
    title: "Préparation aux entretiens",
    description: "Préparez vos entretiens d'embauche avec des questions et réponses.",
    icon: Briefcase,
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
  "tfc-ideas": {
    title: "Idées de TFC",
    description: "Générez des idées de sujets pour votre Travail de Fin de Cycle (TFC).",
    icon: Lightbulb,
  },
  "tfe-ideas": {
    title: "Idées de TFE",
    description: "Générez des idées de sujets pour votre Travail de Fin d'Études (TFE).",
    icon: Lightbulb,
  },
};

export function MainLayout() {
  const [activeFeature, setActiveFeature] = useState<Feature>("cover-letter-generator");

  const CurrentFeature = featureComponents[activeFeature];
  const currentInfo = featureInfo[activeFeature];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {(Object.keys(featureInfo) as Feature[]).map((key) => {
              const { title, icon: Icon } = featureInfo[key];
              return (
                <SidebarMenuItem key={key}>
                  <SidebarMenuButton
                    onClick={() => setActiveFeature(key)}
                    isActive={activeFeature === key}
                    className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="truncate">{title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
         
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex flex-col">
                <h1 className="font-headline text-2xl md:text-4xl font-bold text-foreground">
                    {currentInfo.title}
                </h1>
                <p className="text-muted-foreground mt-1 text-sm md:text-base">{currentInfo.description}</p>
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="flex-grow">{CurrentFeature}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
