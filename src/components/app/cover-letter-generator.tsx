"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles } from "lucide-react";

import { generateCoverLetter } from "@/ai/flows/generate-cover-letter";
import type { GenerateCoverLetterOutput } from "@/ai/types/cover-letter-types";
import { generateCVAdvice } from "@/ai/flows/generate-cv-advice";
import type { GenerateCVAdviceInput, GenerateCVAdviceOutput } from "@/ai/types/cv-advice-types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "./copy-button";
import { Skeleton } from "../ui/skeleton";

const formSchema = z.object({
  name: z.string().min(2, "Le nom est requis."),
  academicBackground: z.string().min(10, "Le parcours académique est requis."),
  skills: z.string().min(10, "Les compétences sont requises."),
  experience: z.string().min(10, "L'expérience est requise."),
  jobMarket: z.string().min(10, "Les informations sur le marché sont requises."),
});

type FormValues = z.infer<typeof formSchema>;

export default function CoverLetterGenerator() {
  const [letterResult, setLetterResult] = useState<GenerateCoverLetterOutput | null>(null);
  const [cvAdviceResult, setCvAdviceResult] = useState<GenerateCVAdviceOutput | null>(null);
  const [isLetterLoading, setIsLetterLoading] = useState(false);
  const [isCvLoading, setIsCvLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      academicBackground: "",
      skills: "",
      experience: "",
      jobMarket: "Marché de l'emploi en RDC, particulièrement à Goma.",
    },
  });

  async function onLetterSubmit(values: FormValues) {
    setIsLetterLoading(true);
    setLetterResult(null);
    setCvAdviceResult(null);
    try {
      const response = await generateCoverLetter(values);
      setLetterResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Une erreur est survenue.",
        description: "Impossible de générer la lettre de motivation. Veuillez réessayer.",
      });
    }
    setIsLetterLoading(false);
  }

  async function onCvSubmit() {
    setIsCvLoading(true);
    setCvAdviceResult(null);
    const values: GenerateCVAdviceInput = form.getValues();
    try {
      const response = await generateCVAdvice(values);
      setCvAdviceResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Une erreur est survenue.",
        description: "Impossible de générer les conseils pour le CV. Veuillez réessayer.",
      });
    }
    setIsCvLoading(false);
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onLetterSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Jean Dupont" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="academicBackground"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parcours académique</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Master en Informatique" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compétences</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ex: JavaScript, React, Gestion de projet..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expérience professionnelle</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Décrivez vos expériences passées..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobMarket"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Infos sur le marché de l'emploi</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLetterLoading}>
                {isLetterLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Générer la Lettre de motivation
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLetterLoading && (
        <Card>
          <CardHeader>
              <CardTitle>Lettre de motivation générée</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      )}

      {letterResult && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Lettre de motivation générée</CardTitle>
            <CopyButton textToCopy={letterResult.coverLetter} />
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">{letterResult.coverLetter}</p>
            <Button onClick={onCvSubmit} disabled={isCvLoading}>
                {isCvLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                Rédiger mon CV
            </Button>
          </CardContent>
        </Card>
      )}
      
      {isCvLoading && (
        <Card>
            <CardHeader>
                <CardTitle>Conseils pour votre CV</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-1/3 mt-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </CardContent>
        </Card>
      )}

      {cvAdviceResult && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Conseils pour votre CV</CardTitle>
            <CopyButton textToCopy={cvAdviceResult.advice} />
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm" dangerouslySetInnerHTML={{ __html: cvAdviceResult.advice.replace(/\n/g, '<br />') }}/>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
