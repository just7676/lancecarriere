"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { generateTFEIdeas } from "@/ai/flows/generate-tfe-ideas";
import type { GenerateTFEIdeasOutput } from "@/ai/types/tfe-ideas-types";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CopyButton } from "./copy-button";
import { Skeleton } from "../ui/skeleton";

const formSchema = z.object({
  fieldOfStudy: z.string().min(2, {
    message: "Le domaine d'étude doit contenir au moins 2 caractères.",
  }),
  keywords: z.string().min(2, {
    message: "Les mots-clés doivent contenir au moins 2 caractères.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function TfeIdeasGenerator() {
  const [result, setResult] = useState<GenerateTFEIdeasOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldOfStudy: "",
      keywords: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const ideas = await generateTFEIdeas(values);
      setResult(ideas);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Une erreur est survenue.",
        description: "Impossible de générer des idées. Veuillez réessayer.",
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
              <FormField
                control={form.control}
                name="fieldOfStudy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domaine d'étude</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Informatique, Droit, Médecine" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mots-clés</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: technologie, problème social, innovation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Générer les idées
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
            <CardHeader>
                <CardTitle>Vos idées de TFE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Vos idées de TFE</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {result.ideas.map((idea, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-left font-semibold">
                    {idea.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex items-start justify-between gap-4">
                      <p className="flex-grow whitespace-pre-wrap">{idea.description}</p>
                      <CopyButton textToCopy={`${idea.title}\n\n${idea.description}`} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
