"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { groupeApi } from "@/lib/api-client"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Shield } from "lucide-react"

export default function GroupDetailDashboardPage() {
  const params = useParams()
  const router = useRouter()
  const idStr = params.id as string
  const id = parseInt(idStr, 10)
  const [group, setGroup] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ nom: "", description: "", type: "PUBLIC" })

  useEffect(() => {
    if (!idStr || idStr === "undefined" || isNaN(id)) {
      router.replace('/dashboard/groups')
      return
    }

    const fetchGroup = async () => {
      try {
        setLoading(true)
        const g = await groupeApi.getById(id)
        setGroup(g)
        setForm({ nom: g.nom || "", description: g.description || "", type: g.type || "PUBLIC" })
      } catch (err: any) {
        setError(err?.message || "Erreur lors du chargement du groupe")
      } finally {
        setLoading(false)
      }
    }
    fetchGroup()
  }, [idStr, id, router])

  if (loading) return <div className="p-6 text-center">Chargement...</div>
  if (error) return <div className="p-6 text-center text-rose-500">{error}</div>
  if (!group) return <div className="p-6 text-center">Groupe introuvable</div>

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Détail du groupe</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push('/dashboard/groups')}>Retour</Button>
          {!editMode ? (
            <Button onClick={() => setEditMode(true)}>Éditer</Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => { setEditMode(false); setForm({ nom: group.nom || "", description: group.description || "", type: group.type || "PUBLIC" }) }}>Annuler</Button>
              <Button onClick={async () => {
                if (!form.nom.trim()) return
                try {
                  setSaving(true)
                  await groupeApi.update(id, { nom: form.nom, description: form.description, type: form.type })
                  const updated = await groupeApi.getById(id)
                  setGroup(updated)
                  setEditMode(false)
                } catch (err: any) {
                  setError(err?.message || "Erreur lors de la sauvegarde")
                } finally {
                  setSaving(false)
                }
              }} disabled={saving}>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</Button>
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              {!editMode ? (
                <>
                  <CardTitle>{group.nom}</CardTitle>
                  <CardDescription className="mt-1">{group.description}</CardDescription>
                </>
              ) : (
                <div className="space-y-2">
                  <input className="w-full rounded-md border px-3 py-2" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
                  <textarea className="w-full rounded-md border px-3 py-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  <select className="rounded-md border px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVE">Privé</option>
                  </select>
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {group.type || "-"}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{group.nombreMembres || group.membres?.length || 0} membre(s)</span>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Membres</h3>
              <div className="grid gap-2">
                {group.membres?.length ? (
                  group.membres.map((m: any) => (
                    <div key={m.id} className="flex items-center justify-between p-2 rounded-md border bg-card">
                      <div>
                        <div className="font-medium">{m.displayName || `${m.prenom || ''} ${m.nom || ''}`}</div>
                        <div className="text-xs text-muted-foreground">{m.email}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{m.role || ''}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">Aucun membre</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
