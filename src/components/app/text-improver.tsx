"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { improveText } from "@/ai/flows/improve-text";
import type { ImproveTextOutput } from "@/ai/types/improve-text-types";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "./copy-button";
import { Skeleton } from "../ui/skeleton";
import { Input } from "../ui/input";

const formSchema = z.object({
  text: z.string().min(10, {
    message: "Le texte doit contenir au moins 10 caractères.",
  }),
  problem: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function TextImprover() {
  const [result, setResult] = useState<ImproveTextOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      problem: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await improveText(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Une erreur est survenue.",
        description: "Impossible d'améliorer le texte. Veuillez réessayer.",
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
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Votre texte à améliorer</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Collez ou écrivez votre texte ici..." {...field} rows={8} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="problem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Problème spécifique (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Rendre le ton plus formel, vérifier la clarté..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Améliorer le texte
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
          <Card>
              <CardHeader>
                  <CardTitle>Texte amélioré</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-3/4" />
              </CardContent>
          </Card>
      )}

      {result && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Texte amélioré</CardTitle>
            <CopyButton textToCopy={result.improvedText} />
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">{result.improvedText}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
