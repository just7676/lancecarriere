"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { prepareInterview, type PrepareInterviewOutput } from "@/ai/flows/prepare-interview";
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
  jobTitle: z.string().min(2, {
    message: "Le titre du poste doit contenir au moins 2 caractères.",
  }),
  requiredSkills: z.string().min(2, {
    message: "Les compétences doivent contenir au moins 2 caractères.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function InterviewPrep() {
  const [result, setResult] = useState<PrepareInterviewOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      requiredSkills: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await prepareInterview(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Une erreur est survenue.",
        description: "Impossible de générer la préparation. Veuillez réessayer.",
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
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poste visé</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Développeur Web, Comptable" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requiredSkills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compétences demandées</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: React, NodeJS, Excel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Générer la préparation
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <Card>
            <CardHeader>
                <CardTitle>Questions et réponses</CardTitle>
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
            <CardTitle>Questions et réponses</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {result.questionsAndAnswers.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-left font-semibold">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-grow space-y-4">
                            <h4 className="font-semibold text-muted-foreground">Exemple de réponse :</h4>
                            <p className="whitespace-pre-wrap">{item.exampleAnswer}</p>
                        </div>
                        <CopyButton textToCopy={`Question: ${item.question}\n\nRéponse: ${item.exampleAnswer}`} />
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
