"use client";

import { useState } from "react";
import {
  Briefcase,
  FileText,
  Lightbulb,
  PenSquare,
  Github,
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
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import { Logo } from "@/components/app/logo";
import TfeIdeasGenerator from "@/components/app/tfe-ideas-generator";
import InterviewPrep from "@/components/app/interview-prep";
import CvGenerator from "@/components/app/cv-generator";
import ContentWriter from "@/components/app/content-writer";

type Feature =
  | "tfe-ideas"
  | "interview-prep"
  | "cv-generator"
  | "content-writer";

const featureComponents = {
  "tfe-ideas": <TfeIdeasGenerator />,
  "interview-prep": <InterviewPrep />,
  "cv-generator": <CvGenerator />,
  "content-writer": <ContentWriter />,
};

const featureInfo = {
  "tfe-ideas": {
    title: "Idées de TFE",
    description: "Générez des idées de sujets pour votre Travail de Fin d'Études.",
    icon: Lightbulb,
  },
  "interview-prep": {
    title: "Préparation aux entretiens",
    description: "Préparez vos entretiens d'embauche avec des questions et réponses.",
    icon: Briefcase,
  },
  "cv-generator": {
    title: "CV & Lettre de motivation",
    description: "Créez un CV et une lettre de motivation percutants.",
    icon: FileText,
  },
  "content-writer": {
    title: "Aide à la rédaction",
    description: "Rédigez des contenus professionnels pour LinkedIn, emails, etc.",
    icon: PenSquare,
  },
};

export function MainLayout() {
  const [activeFeature, setActiveFeature] = useState<Feature>("tfe-ideas");

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
              const { title } = featureInfo[key];
              const Icon = featureInfo[key].icon;
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
        <SidebarFooter className="mt-auto">
           <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                <a href="https://github.com/firebase/genkit/tree/main/studio/samples/lancecarriere" target="_blank" rel="noopener noreferrer">
                    <Github />
                    <span className="group-data-[collapsible=icon]:hidden">Code Source</span>
                </a>
            </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
                    {currentInfo.title}
                </h1>
                <p className="text-muted-foreground mt-2">{currentInfo.description}</p>
            </header>
            <div className="flex-grow">{CurrentFeature}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
