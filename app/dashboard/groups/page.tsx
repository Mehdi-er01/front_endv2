"use client"

import { useEffect, useState } from "react"
import { apiCall } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Users, Shield } from "lucide-react"

interface Groupe {
  idGroupe: number
  nom: string
  description: string
  typeGroupe: string
  idAdministrateur: number
  dateCreation: string
  membres?: Array<{ idUtilisateur: number; nom: string; role: string }>
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Groupe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await apiCall("/groupes")
        setGroups(Array.isArray(data) ? data : data.data || [])
      } catch (err) {
        setError("Erreur lors du chargement des groupes")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [])

  if (loading) return <div className="p-6 text-center">Chargement...</div>
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Groupes</h1>
        <Button asChild>
          <Link href="/dashboard/groups/new">Nouveau Groupe</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <Card key={group.idGroupe} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{group.nom}</CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </div>
                <Badge variant="outline">{group.typeGroupe}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                {group.membres?.length || 0} membre(s)
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                Créé le {new Date(group.dateCreation).toLocaleDateString("fr-FR")}
              </div>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href={`/dashboard/groups/${group.idGroupe}`}>Voir détails</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {groups.length === 0 && (
        <Card className="text-center p-12">
          <p className="text-gray-500 mb-4">Aucun groupe trouvé</p>
          <Button asChild>
            <Link href="/dashboard/groups/new">Créer votre premier groupe</Link>
          </Button>
        </Card>
      )}
    </div>
  )
}