import { UtilisateurDTO, ProjetDTO, GroupeDTO } from "./types"

export interface PermissionFlags {
  canCreateProject: boolean
  canEditProject: boolean
  canDeleteProject: boolean
  canViewProjectDetails: boolean
  canManageMembers: boolean
  canManageAdmins: boolean
  canJoinGroup: boolean
  canLeaveGroup: boolean
  canViewGroup: boolean
  canEditGroup: boolean
  canDeleteGroup: boolean
  canAcceptProjectRequest: boolean
  canRejectProjectRequest: boolean
  canCloseProject: boolean
  canReopenProject: boolean
  canJoinProject: boolean
  canViewMembersAndTasks: boolean
}

/**
 * Hook to determine user permissions based on strictly defined logic:
 * 1. user.activeAndConnected && !user.guest for actions
 * 2. user.projectAdmin || user.admin || user.validForAdminOperation for modification
 * 3. projet.estPublic && !user.validForProjectOperation for joining
 * 4. projet.estPublic || user.validForProjectOperation for viewing members/tasks
 */
export function usePermissions(
  user: UtilisateurDTO | null,
  projet?: ProjetDTO | null,
  groupe?: GroupeDTO | null
): PermissionFlags {
  if (!user) {
    return {
      canCreateProject: false,
      canEditProject: false,
      canDeleteProject: false,
      canViewProjectDetails: false,
      canManageMembers: false,
      canManageAdmins: false,
      canJoinGroup: false,
      canLeaveGroup: false,
      canViewGroup: false,
      canEditGroup: false,
      canDeleteGroup: false,
      canAcceptProjectRequest: false,
      canRejectProjectRequest: false,
      canCloseProject: false,
      canReopenProject: false,
      canJoinProject: false,
      canViewMembersAndTasks: false,
    }
  }

  // Core flags from DTO
  const isActiveAndConnected = user.activeAndConnected
  const isNotGuest = !user.guest
  const canPerformActions = isActiveAndConnected && isNotGuest
  
  const isAdmin = user.admin || user.role === "ADMIN"
  const isProjectAdmin = user.projectAdmin || isAdmin || user.validForAdminOperation
  const isValidForProjectOp = user.validForProjectOperation

  // Group-specific checks
  const isGroupMember = groupe ? groupe.membres?.some((m) => m.id === user.id) : false

  return {
    // 🔹 Afficher “Créer un projet”: user.activeAndConnected && !user.guest
    canCreateProject: canPerformActions,

    // 🔹 Modifier un projet: user.projectAdmin || user.admin || user.validForAdminOperation
    canEditProject: isProjectAdmin && canPerformActions,

    // Delete project: same as edit
    canDeleteProject: isProjectAdmin && canPerformActions,

    // View project details: public or has project operation rights
    canViewProjectDetails: projet ? (projet.estPublic || isValidForProjectOp || isAdmin) : false,

    // Manage members: project admin or global admin
    canManageMembers: isProjectAdmin && canPerformActions,

    // Manage admins: project admin or global admin
    canManageAdmins: isProjectAdmin && canPerformActions,

    // Join group: user must be active, connected, and not already a member
    canJoinGroup: groupe ? canPerformActions && !isGroupMember : false,

    // Leave group: user must be a member
    canLeaveGroup: groupe ? isGroupMember && canPerformActions : false,

    // View group: public groups or member
    canViewGroup: groupe ? (groupe.estSysteme || isGroupMember || isAdmin) : true,

    // Edit group: global admin only
    canEditGroup: isAdmin && canPerformActions,

    // Delete group: global admin only
    canDeleteGroup: isAdmin && canPerformActions,

    // Accept project requests: project admin or global admin
    canAcceptProjectRequest: isProjectAdmin && canPerformActions,

    // Reject project requests: project admin or global admin
    canRejectProjectRequest: isProjectAdmin && canPerformActions,

    // Close project: project admin or global admin
    canCloseProject: isProjectAdmin && canPerformActions,

    // Reopen project: project admin or global admin
    canReopenProject: isProjectAdmin && canPerformActions,

    // 🔹 Rejoindre un projet: projet.estPublic && !user.validForProjectOperation
    canJoinProject: projet ? (projet.estPublic && !isValidForProjectOp && canPerformActions) : false,

    // 🔹 Voir membres / tâches: projet.estPublic || user.validForProjectOperation
    canViewMembersAndTasks: projet ? (projet.estPublic || isValidForProjectOp || isAdmin) : false,
  }
}
