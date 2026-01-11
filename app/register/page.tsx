
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
import { AlertCircle, User, Mail, Lock, ArrowRight, CheckCircle2, UserCircle } from "lucide-react"
import { FadeIn } from "@/components/motion/fade-in"
import { motion } from "framer-motion"

export default function RegisterPage() {
  const router = useRouter()
  const { register, error } = useAuth()
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    identifiant: "",
    motDePasse: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [localError, setLocalError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")
    setIsLoading(true)

    try {
      await register(formData)
      router.push("/dashboard")
    } catch (err: any) {
      setLocalError(err.message || "Une erreur est survenue lors de l'inscription")
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
              <User className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">Créer un compte</h1>
            <p className="text-muted-foreground">Rejoignez-nous et commencez votre aventure</p>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.2}>
          <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/80">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Inscription</CardTitle>
              <CardDescription>Remplissez les informations ci-dessous</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Prénom</label>
                    <Input
                      name="prenom"
                      placeholder="Jean"
                      value={formData.prenom}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="h-11 bg-background/50 border-border focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Nom</label>
                    <Input
                      name="nom"
                      placeholder="Dupont"
                      value={formData.nom}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="h-11 bg-background/50 border-border focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <UserCircle className="w-4 h-4 text-muted-foreground" /> Identifiant
                  </label>
                  <Input
                    name="identifiant"
                    placeholder="jeandupont"
                    value={formData.identifiant}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="h-11 bg-background/50 border-border focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" /> Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="jean@exemple.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="h-11 bg-background/50 border-border focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Lock className="w-4 h-4 text-muted-foreground" /> Mot de passe
                  </label>
                  <Input
                    type="password"
                    name="motDePasse"
                    placeholder="••••••••"
                    value={formData.motDePasse}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="h-11 bg-background/50 border-border focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Création...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Créer mon compte <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Déjà un compte ?{" "}
                  <Link href="/login" className="text-primary hover:text-primary/80 font-bold transition-colors">
                    Se connecter
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn direction="up" delay={0.3}>
          <div className="mt-8 flex items-center justify-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-1 text-xs">
              <CheckCircle2 className="w-3 h-3 text-green-500" /> Sécurisé
            </div>
            <div className="flex items-center gap-1 text-xs">
              <CheckCircle2 className="w-3 h-3 text-green-500" /> Rapide
            </div>
            <div className="flex items-center gap-1 text-xs">
              <CheckCircle2 className="w-3 h-3 text-green-500" /> Gratuit
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
