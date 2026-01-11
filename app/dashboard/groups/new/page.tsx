"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { authApi, groupeApi } from "@/lib/api-client"

export default function NewGroupPage() {
  const router = useRouter()
  const [nom, setNom] = useState("")
  const [description, setDescription] = useState("")
  const [typeGroupe, setTypeGroupe] = useState<"PUBLIC" | "PRIVE">("PUBLIC")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!nom.trim()) {
      setError("Le nom du groupe est requis")
      return
    }

    try {
      setLoading(true)
      const user = await authApi.me()
      const payload = { nom, description, type: typeGroupe }
      const created = await groupeApi.create(payload, user?.id)
      const newId = created?.id || created?.idGroupe
      if (newId) {
        router.push(`/dashboard/groups/${newId}`)
      } else {
        router.push(`/dashboard/groups`)
      }
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la création du groupe")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Créer un groupe</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full rounded-md border px-3 py-2 min-h-[100px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select className="rounded-md border px-3 py-2" value={typeGroupe} onChange={(e) => setTypeGroupe(e.target.value as any)}>
            <option value="PUBLIC">Public</option>
            <option value="PRIVE">Privé</option>
          </select>
        </div>

        {error && <p className="text-sm text-rose-500">{error}</p>}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading}>{loading ? "Création..." : "Créer le groupe"}</Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/groups')}>Annuler</Button>
        </div>
      </form>
    </div>
  )
}
