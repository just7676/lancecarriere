"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { generateCvAndCoverLetter, type GenerateCvAndCoverLetterOutput } from "@/ai/flows/generate-cv-and-cover-letter";
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
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function CvGenerator() {
  const [result, setResult] = useState<GenerateCvAndCoverLetterOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateCvAndCoverLetter(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Une erreur est survenue.",
        description: "Impossible de générer les documents. Veuillez réessayer.",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Générer CV et Lettre
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="space-y-4">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-64 w-full" />
        </div>
      )}

      {result && (
        <Tabs defaultValue="cv" className="w-full">
          <TabsList>
            <TabsTrigger value="cv">CV</TabsTrigger>
            <TabsTrigger value="cover-letter">Lettre de motivation</TabsTrigger>
          </TabsList>
          <TabsContent value="cv">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>CV Généré</CardTitle>
                <CopyButton textToCopy={result.cv} />
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">{result.cv}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cover-letter">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Lettre de motivation générée</CardTitle>
                <CopyButton textToCopy={result.coverLetter} />
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">{result.coverLetter}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
