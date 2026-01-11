
"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Lock, Mail, ArrowRight } from "lucide-react"
import { FadeIn } from "@/components/motion/fade-in"
import { motion } from "framer-motion"

export default function LoginPage() {
  const router = useRouter()
  const { login, error } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [localError, setLocalError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")
    setIsLoading(true)

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err: any) {
      setLocalError(err.message || "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background p-4">
      <div className="w-full max-w-md">
        <FadeIn direction="up" delay={0.1}>
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4 shadow-lg shadow-primary/20"
            >
              <Lock className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">Bon retour !</h1>
            <p className="text-muted-foreground">Connectez-vous pour accéder à votre espace</p>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.2}>
          <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/80">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
              <CardDescription>Entrez vos identifiants ci-dessous</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {(localError || error) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{localError || error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" /> Email
                  </label>
                  <Input
                    type="email"
                    placeholder="nom@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="h-11 bg-background/50 border-border focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Lock className="w-4 h-4 text-muted-foreground" /> Mot de passe
                    </label>
                    <Link href="#" className="text-xs text-primary hover:underline">
                      Oublié ?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="h-11 bg-background/50 border-border focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Connexion...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Se connecter <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Ou continuer avec</span>
                  </div>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Pas encore de compte ?{" "}
                  <Link href="/register" className="text-primary hover:text-primary/80 font-bold transition-colors">
                    S'inscrire gratuitement
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </FadeIn>
        
        <FadeIn direction="up" delay={0.3}>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Votre Application. Tous droits réservés.
          </p>
        </FadeIn>
      </div>
    </div>
  )
}
