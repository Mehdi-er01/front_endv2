
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { tacheApi, type TacheDTO } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search, AlertCircle, Clock, CheckCircle2, Filter, Calendar, MoreHorizontal, GripVertical } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { FadeIn } from "@/components/motion/fade-in"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function TasksContent() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [tasks, setTasks] = useState<TacheDTO[]>([])
  const [filteredTasks, setFilteredTasks] = useState<TacheDTO[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [stateFilter, setStateFilter] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true)
        const data = await tacheApi.getAll()
        setTasks(data || [])
      } catch (err: any) {
        setError(err.message || "Échec du chargement des tâches")
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchTasks()
    }
  }, [user])

  useEffect(() => {
    let filtered = tasks

    if (searchQuery) {
      filtered = filtered.filter((t) => t.titre.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (stateFilter) {
      filtered = filtered.filter((t) => t.etat === stateFilter)
    }

    setFilteredTasks(filtered)
  }, [tasks, searchQuery, stateFilter])

  const getPriorityConfig = (priority: string) => {
    const configs: Record<string, { color: string, label: string }> = {
      HAUTE: { color: "bg-rose-500/10 text-rose-600 border-rose-200", label: "Haute" },
      MOYENNE: { color: "bg-amber-500/10 text-amber-600 border-amber-200", label: "Moyenne" },
      BASSE: { color: "bg-emerald-500/10 text-emerald-600 border-emerald-200", label: "Basse" },
    }
    return configs[priority] || { color: "bg-slate-500/10 text-slate-600 border-slate-200", label: priority }
  }

  const getStateConfig = (state: string) => {
    switch (state) {
      case "TERMINE":
        return { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Terminé" }
      case "EN_COURS":
        return { icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10", label: "En cours" }
      case "A_FAIRE":
        return { icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10", label: "À faire" }
      default:
        return { icon: AlertCircle, color: "text-slate-500", bg: "bg-slate-500/10", label: state }
    }
  }

  if (loading) return null

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Tâches</h1>
          <p className="text-muted-foreground">Organisez et suivez vos tâches quotidiennes.</p>
        </div>
        <Button className="shadow-lg shadow-primary/20 h-11 px-6 rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Tâche
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 flex-col md:flex-row items-center">
        <div className="w-full md:flex-1 relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="text"
            placeholder="Rechercher une tâche..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-card border-border/50 rounded-xl focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="pl-9 pr-8 h-11 rounded-xl border border-border/50 bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 appearance-none w-full"
            >
              <option value="">Tous les états</option>
              <option value="A_FAIRE">À faire</option>
              <option value="EN_COURS">En cours</option>
              <option value="TERMINE">Terminé</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <FadeIn direction="up">
          <div className="bg-rose-500/10 border border-rose-200 text-rose-600 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        </FadeIn>
      )}

      {/* Tasks Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {["A_FAIRE", "EN_COURS", "TERMINE"].map((state, stateIndex) => {
          const stateTasks = filteredTasks.filter((t) => t.etat === state)
          const config = getStateConfig(state)
          const Icon = config.icon

          return (
            <div key={state} className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${config.bg}`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                    {config.label}
                  </h3>
                </div>
                <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs font-bold">
                  {stateTasks.length}
                </Badge>
              </div>

              <div className="flex-1 space-y-4 min-h-[200px] p-2 rounded-2xl bg-secondary/30 border border-dashed border-border/50">
                <AnimatePresence mode="popLayout">
                  {stateTasks.map((task, index) => {
                    const priority = getPriorityConfig(task.priorite)
                    return (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <Card className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-border/50 cursor-pointer overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="mt-1 text-muted-foreground/30 group-hover:text-primary/50 transition-colors">
                                <GripVertical className="w-4 h-4" />
                              </div>
                              <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                    {task.titre}
                                  </h4>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </div>
                                
                                {task.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {task.description}
                                  </p>
                                )}

                                <div className="flex items-center justify-between pt-2">
                                  <Badge variant="outline" className={`text-[10px] font-bold uppercase px-1.5 py-0 ${priority.color}`}>
                                    {priority.label}
                                  </Badge>
                                  
                                  {task.dateEcheance && (
                                    <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                                      <Calendar className="w-3 h-3" />
                                      <span>{new Date(task.dateEcheance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                                    </div>
                                  )}
                                </div>

                                {task.nombreSousTaches > 0 && (
                                  <div className="space-y-1.5 pt-1">
                                    <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase">
                                      <span>Sous-tâches</span>
                                      <span>{task.sousTachesTerminees}/{task.nombreSousTaches}</span>
                                    </div>
                                    <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(task.sousTachesTerminees / task.nombreSousTaches) * 100}%` }}
                                        className="h-full bg-primary rounded-full"
                                      ></motion.div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

                {stateTasks.length === 0 && !isLoading && (
                  <div className="h-32 flex flex-col items-center justify-center text-center p-4">
                    <div className={`p-2 rounded-full ${config.bg} mb-2`}>
                      <Icon className={`w-5 h-5 ${config.color} opacity-50`} />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Aucune tâche</p>
                  </div>
                )}
                
                {isLoading && (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-24 bg-card/50 rounded-xl animate-pulse border border-border/50"></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
