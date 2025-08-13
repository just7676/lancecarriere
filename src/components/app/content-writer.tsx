"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { writeProfessionalContent, type WriteProfessionalContentOutput } from "@/ai/flows/write-professional-content";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "./copy-button";
import { Skeleton } from "../ui/skeleton";

const formSchema = z.object({
  topic: z.string().min(10, {
    message: "Le sujet doit contenir au moins 10 caractères.",
  }),
  platform: z.string({
    required_error: "Veuillez sélectionner une plateforme.",
  }),
  audience: z.string().min(2, {
    message: "L'audience doit contenir au moins 2 caractères.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContentWriter() {
  const [result, setResult] = useState<WriteProfessionalContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      audience: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await writeProfessionalContent(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Une erreur est survenue.",
        description: "Impossible de générer le contenu. Veuillez réessayer.",
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
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plateforme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une plateforme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Twitter">Twitter (X)</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                        <SelectItem value="Email de candidature">Email de candidature</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sujet ou demande</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ex: Rédiger un post sur l'importance du networking..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="audience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audience cible</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Recruteurs, jeunes diplômés" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Générer le contenu
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
          <Card>
              <CardHeader>
                  <CardTitle>Contenu généré</CardTitle>
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
            <CardTitle>Contenu généré</CardTitle>
            <CopyButton textToCopy={result.content} />
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">{result.content}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
