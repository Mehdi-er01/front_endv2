
"use client"

import React, { useState, useEffect } from "react"
import { GroupeDTO, ProjetDTO, UtilisateurDTO } from "@/lib/types"
import { groupeApi, projetApi } from "@/lib/api-client"
import { usePermissions } from "@/lib/usePermissions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  Plus,
  Loader2,
  LogOut,
  LogIn,
  Shield,
  Clock,
  CheckCircle2,
  Lock,
  Globe,
  MoreVertical,
  ArrowRight,
  UserPlus,
  Settings,
  FolderOpen,
  MessageCircle
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { FadeIn } from "@/components/motion/fade-in"

interface GroupeProjetDetailProps {
  groupeId: number
  currentUser: UtilisateurDTO | null
}

export function GroupeProjetDetail({ groupeId, currentUser }: GroupeProjetDetailProps) {
  const [groupe, setGroupe] = useState<GroupeDTO | null>(null)
  const [projets, setProjets] = useState<ProjetDTO[]>([])
  const [selectedProjet, setSelectedProjet] = useState<ProjetDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const permissions = usePermissions(currentUser, selectedProjet, groupe)

  useEffect(() => {
    loadGroupAndProjets()
  }, [groupeId])

  const loadGroupAndProjets = async () => {
    try {
      setLoading(true)
      setError(null)

      const groupeData = await groupeApi.getById(groupeId)
      setGroupe(groupeData)

      const allProjets = await projetApi.getAll()
      const groupeProjets = allProjets.filter((p: ProjetDTO) => p.groupe?.id === groupeId)
      setProjets(groupeProjets)

      if (groupeProjets.length > 0) {
        setSelectedProjet(groupeProjets[0])
      }
    } catch (err: any) {
      setError(err.message || "Échec du chargement du groupe et des projets")
    } finally {
      setLoading(false)
    }
  }

  const handleProjetSelect = async (projetId: number) => {
    try {
      const projetData = await projetApi.getById(projetId)
      setSelectedProjet(projetData)
    } catch (err: any) {
      setError(err.message || "Échec du chargement des détails du projet")
    }
  }

  const handleJoinGroup = async () => {
    if (!currentUser || !groupe) return
    try {
      setActionLoading(true)
      await groupeApi.addMember(groupe.id, currentUser.id)
      await loadGroupAndProjets()
    } catch (err: any) {
      setError(err.message || "Échec de l'adhésion au groupe")
    } finally {
      setActionLoading(false)
    }
  }

  const handleLeaveGroup = async () => {
    if (!currentUser || !groupe) return
    try {
      setActionLoading(true)
      await groupeApi.removeMember(groupe.id, currentUser.id)
      await loadGroupAndProjets()
    } catch (err: any) {
      setError(err.message || "Échec du départ du groupe")
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto"></div>
          <p className="text-muted-foreground font-medium">Chargement du groupe...</p>
        </div>
      </div>
    )
  }

  if (!groupe) {
    return (
      <Alert variant="destructive" className="rounded-xl">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Groupe introuvable</AlertDescription>
      </Alert>
    )
  }

  const isGroupMember = groupe.membres?.some((m) => m.id === currentUser?.id)

  return (
    <div className="space-y-8">
      {/* Group Header Card */}
      <FadeIn direction="up">
        <Card className="border-border/50 shadow-xl overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/10 relative">
            <div className="absolute inset-0 bg-grid-white/10"></div>
          </div>
          <CardHeader className="relative pt-12">
            <div className="absolute -top-12 left-8">
              <div className="w-24 h-24 rounded-2xl bg-card border-4 border-background shadow-2xl flex items-center justify-center text-primary">
                <Users className="w-12 h-12" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-3xl font-bold">{groupe.nom}</CardTitle>
                  <Badge variant={groupe.estSysteme ? "default" : "secondary"} className="rounded-full">
                    {groupe.estSysteme ? "Système" : "Personnalisé"}
                  </Badge>
                </div>
                <CardDescription className="text-base max-w-2xl">
                  {groupe.description}
                </CardDescription>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {!isGroupMember && permissions.canJoinGroup && (
                  <Button onClick={handleJoinGroup} disabled={actionLoading} className="rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
                    {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                    Rejoindre le groupe
                  </Button>
                )}
                {isGroupMember && permissions.canLeaveGroup && (
                  <Button onClick={handleLeaveGroup} disabled={actionLoading} variant="outline" className="rounded-xl h-11 px-6">
                    {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <LogOut className="h-4 w-4 mr-2" />}
                    Quitter le groupe
                  </Button>
                )}
                {permissions.canCreateProject && (
                  <Button variant="secondary" className="rounded-xl h-11 px-6">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un projet
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 border-t border-border/50 bg-secondary/5">
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Créé le {new Date(groupe.dateCreation).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{groupe.nombreMembres || groupe.membres?.length || 0} membres</span>
              </div>
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{projets.length} projets</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Projects Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              Projets du groupe
            </h3>
            <Badge variant="secondary" className="rounded-full">{projets.length}</Badge>
          </div>
          
          <div className="space-y-3">
            {projets.length === 0 ? (
              <Card className="border-dashed bg-secondary/10">
                <CardContent className="p-8 text-center">
                  <p className="text-sm text-muted-foreground italic">Aucun projet dans ce groupe</p>
                </CardContent>
              </Card>
            ) : (
              projets.map((projet, index) => (
                <FadeIn key={projet.id} delay={index * 0.05} direction="right">
                  <button
                    onClick={() => handleProjetSelect(projet.id)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 group relative overflow-hidden ${
                      selectedProjet?.id === projet.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border/50 hover:border-primary/30 hover:bg-accent/50"
                    }`}
                  >
                    {selectedProjet?.id === projet.id && (
                      <motion.div layoutId="active-indicator" className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <p className={`font-bold transition-colors ${selectedProjet?.id === projet.id ? "text-primary" : "text-foreground"}`}>
                        {projet.nomCourt}
                      </p>
                      {projet.estPublic ? <Globe className="w-3 h-3 text-muted-foreground" /> : <Lock className="w-3 h-3 text-muted-foreground" />}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-3">{projet.theme || "Sans thème"}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-bold uppercase px-1.5 py-0">
                        {projet.statutProjet}
                      </Badge>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </button>
                </FadeIn>
              ))
            )}
          </div>
        </div>

        {/* Project Details Main Area */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedProjet ? (
              <motion.div
                key={selectedProjet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/50 shadow-xl overflow-hidden flex flex-col h-full">
                  <CardHeader className="pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold">{selectedProjet.nomLong}</h2>
                          <Badge className="bg-primary/10 text-primary border-none">{selectedProjet.statutProjet}</Badge>
                        </div>
                        <p className="text-muted-foreground">{selectedProjet.description}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-5 p-1 bg-secondary/50 rounded-xl h-12">
                        <TabsTrigger value="overview" className="rounded-lg data-[state=active]:shadow-sm">Aperçu</TabsTrigger>
                        <TabsTrigger value="members" className="rounded-lg data-[state=active]:shadow-sm gap-2">
                          <Users className="h-4 w-4" />
                          <span className="hidden sm:inline">Membres</span>
                        </TabsTrigger>
                        <TabsTrigger value="tasks" className="rounded-lg data-[state=active]:shadow-sm gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="hidden sm:inline">Tâches</span>
                        </TabsTrigger>
                        <TabsTrigger value="meetings" className="rounded-lg data-[state=active]:shadow-sm gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="hidden sm:inline">Réunions</span>
                        </TabsTrigger>
                        <TabsTrigger value="docs" className="rounded-lg data-[state=active]:shadow-sm gap-2">
                          <MessageCircle className="h-4 w-4" />
                          <span className="hidden sm:inline">Docs</span>
                        </TabsTrigger>
                      </TabsList>

                      {/* Overview Tab */}
                      <TabsContent value="overview" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            { label: "Thème", value: selectedProjet.theme, icon: Shield },
                            { label: "Type", value: selectedProjet.type, icon: Settings },
                            { label: "Licence", value: selectedProjet.license, icon: FileText },
                            { label: "Créé le", value: new Date(selectedProjet.dateCreation).toLocaleDateString(), icon: Clock },
                          ].map((item) => (
                            <div key={item.label} className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/20 border border-border/50">
                              <div className="p-2 rounded-lg bg-background shadow-sm">
                                <item.icon className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{item.label}</p>
                                <p className="font-semibold">{item.value || "N/A"}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-3 pt-4 border-t border-border/50">
                          {permissions.canEditProject && (
                            <Button variant="outline" className="rounded-xl">Modifier le projet</Button>
                          )}
                          {permissions.canJoinProject && (
                            <Button className="rounded-xl shadow-lg shadow-primary/20">Rejoindre le projet</Button>
                          )}
                          {permissions.canCloseProject && selectedProjet.statutProjet !== "CLOTURE" && (
                            <Button variant="outline" className="rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50">Clôturer</Button>
                          )}
                        </div>
                      </TabsContent>

                      {/* Members Tab */}
                      <TabsContent value="members" className="space-y-6 mt-6">
                        {permissions.canViewMembersAndTasks ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Administrateurs</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {selectedProjet.admins?.map((admin) => (
                                  <div key={admin.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                      {admin.displayName?.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-sm truncate">{admin.displayName}</p>
                                      <p className="text-xs text-muted-foreground truncate">{admin.email}</p>
                                    </div>
                                    <Badge className="bg-primary/10 text-primary border-none text-[10px]">Admin</Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Membres de l'équipe</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {selectedProjet.membres?.length ? selectedProjet.membres.map((member) => (
                                  <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-bold">
                                      {member.displayName?.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-sm truncate">{member.displayName}</p>
                                      <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                                    </div>
                                    {member.activeAndConnected && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>}
                                  </div>
                                )) : (
                                  <p className="text-sm text-muted-foreground italic col-span-2 text-center py-4">Aucun membre pour le moment</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="py-12 text-center space-y-4">
                            <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto">
                              <Lock className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground font-medium">
                              {selectedProjet.estPublic 
                                ? "Ce projet est public. Connectez-vous pour voir les membres." 
                                : "Vous n'avez pas la permission de voir les membres."}
                            </p>
                          </div>
                        )}
                      </TabsContent>

                      {/* Tasks Tab */}
                      <TabsContent value="tasks" className="space-y-4 mt-6">
                        {permissions.canViewMembersAndTasks ? (
                          <div className="space-y-3">
                            {selectedProjet.taches?.length ? selectedProjet.taches.map((tache) => (
                              <div key={tache.id} className="p-4 rounded-2xl border border-border/50 bg-card hover:shadow-md transition-all group">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="space-y-1">
                                    <p className="font-bold group-hover:text-primary transition-colors">{tache.titre}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{tache.description}</p>
                                  </div>
                                  <Badge variant="outline" className="text-[10px] font-bold uppercase">{tache.etat}</Badge>
                                </div>
                                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/50">
                                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
                                    <Clock className="w-3 h-3" />
                                    <span>Priorité: {tache.priorite}</span>
                                  </div>
                                </div>
                              </div>
                            )) : (
                              <div className="py-12 text-center">
                                <p className="text-muted-foreground italic">Aucune tâche pour le moment</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="py-12 text-center">
                            <p className="text-muted-foreground">Permission insuffisante pour voir les tâches.</p>
                          </div>
                        )}
                      </TabsContent>

                      {/* Meetings Tab */}
                      <TabsContent value="meetings" className="space-y-4 mt-6">
                        {permissions.canViewMembersAndTasks ? (
                          <div className="space-y-3">
                            {selectedProjet.reunions?.length ? selectedProjet.reunions.map((reunion) => (
                              <div key={reunion.id} className="p-4 rounded-2xl border border-border/50 bg-card hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary">
                                    <span className="text-[10px] font-bold uppercase">{new Date(reunion.dateDebut).toLocaleString('fr-FR', { month: 'short' })}</span>
                                    <span className="text-lg font-bold leading-none">{new Date(reunion.dateDebut).getDate()}</span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-bold">{reunion.titre}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                      <Clock className="w-3 h-3" /> {new Date(reunion.dateDebut).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} • {reunion.lieu}
                                    </p>
                                  </div>
                                  <Button size="sm" variant="secondary" className="rounded-lg">Détails</Button>
                                </div>
                              </div>
                            )) : (
                              <div className="py-12 text-center">
                                <p className="text-muted-foreground italic">Aucune réunion prévue</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="py-12 text-center">
                            <p className="text-muted-foreground">Permission insuffisante pour voir les réunions.</p>
                          </div>
                        )}
                      </TabsContent>

                      {/* Docs Tab */}
                      <TabsContent value="docs" className="space-y-4 mt-6">
                        {permissions.canViewMembersAndTasks ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedProjet.depotDocuments?.length ? selectedProjet.depotDocuments.map((doc) => (
                              <div key={doc.id} className="p-4 rounded-2xl border border-border/50 bg-card hover:shadow-md transition-all flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm truncate">{doc.nom}</p>
                                  <p className="text-[10px] text-muted-foreground uppercase font-bold">{new Date(doc.dateUpload).toLocaleDateString()}</p>
                                </div>
                              </div>
                            )) : (
                              <div className="py-12 text-center col-span-2">
                                <p className="text-muted-foreground italic">Aucun document déposé</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="py-12 text-center">
                            <p className="text-muted-foreground">Permission insuffisante pour voir les documents.</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border/50 rounded-3xl bg-secondary/5">
                <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center shadow-sm mb-6">
                  <FolderOpen className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Sélectionnez un projet</h3>
                <p className="text-muted-foreground max-w-xs">
                  Choisissez un projet dans la liste de gauche pour voir ses détails, membres et activités.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
