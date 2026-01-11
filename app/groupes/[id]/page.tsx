"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { GroupeProjetDetail } from "@/components/groupe/GroupeProjetDetail"
import { authApi } from "@/lib/api-client"
import { UtilisateurDTO } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function GroupePage() {
  const params = useParams()
  const groupeId = parseInt(params.id as string, 10)
  const [currentUser, setCurrentUser] = useState<UtilisateurDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCurrentUser()
  }, [])

  const loadCurrentUser = async () => {
    try {
      setLoading(true)
      const user = await authApi.me()
      setCurrentUser(user)
    } catch (err: any) {
      setError(err.message || "Failed to load user information")
      console.error("Error loading current user:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <GroupeProjetDetail groupeId={groupeId} currentUser={currentUser} />
    </div>
  )
}
