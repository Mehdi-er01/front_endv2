export interface ProjetDTO {
  id: number
  nomCourt: string
  nomLong: string
  description: string
  theme?: string
  type: string
  estPublic: boolean
  license?: string
  statutProjet: "EN_ATTENTE" | "ACCEPTE" | "REJETE" | "CLOTURE" | "ACTIF"
  dateAcceptation?: string
  dateRejet?: string
  dateCreation: string
  dateCloture?: string
  membres: UtilisateurDTO[]
  admins: UtilisateurDTO[]
  admin?: UtilisateurDTO // This seems to be a single admin, potentially the main one
  taches: TacheDTO[]
  reunions: ReunionDTO[]
  depotDocuments: DepotDocumentDTO[]
  listesDiffusion: ListeDiffusionDTO[]
  groupe?: GroupeDTO // Nested GroupeDTO
  sallesDiscussion: SalleDiscussionDTO[]
  demandeursEnAttente: UtilisateurDTO[]
  mainAdmin?: UtilisateurDTO
}

export interface TacheDTO {
  id: number
  titre: string
  description: string
  projetId: number
  etat: "A_FAIRE" | "EN_COURS" | "TERMINE"
  priorite: "BASSE" | "MOYENNE" | "HAUTE"
  dateCreation: string
  dateModification: string
  dateEcheance?: string
  assigneId?: number
  creatorId: number
  nombreSousTaches: number
  sousTachesTerminees: number
}

export interface SousTacheDTO {
  id: number
  titre: string
  description: string
  completed: boolean
  tacheId: number
  dateCreation: string
  dateEcheance: string
  creePar: UtilisateurDTO
}

export interface ReunionDTO {
  id: number
  titre: string
  description: string
  dateDebut: string
  dateFin: string
  lieu: string
  lienVisio?: string
  projetId: number
  projet: ProjetDTO
  organisateurId: number
  organisateur: UtilisateurDTO
  participants: UtilisateurDTO[]
  statut: "PLANIFIEE" | "EN_COURS" | "TERMINEE" | "ANNULEE"
  dateCreation: string
}

export interface UtilisateurDTO {
  id: number
  identifiant: string
  nom: string
  prenom: string
  email: string
  photoProfile?: string
  avatar?: string
  actif: boolean
  estEnLigne: boolean
  estConnecte: boolean
  derniereConnexion?: string
  motDePasse?: string
  role: "USER" | "ADMIN" | "GUEST"
  roleSecondaire?: string
  providerId?: string
  provider?: string
  refreshToken?: string
  dateInscription?: string
  dateCreation?: string
  dateModification?: string
  projetId?: number
  adminId?: number
  validForProjectOperation: boolean
  activeAndConnected: boolean
  validForAdminOperation: boolean
  connected: boolean
  admin: boolean
  projectAdmin: boolean
  guest: boolean
  oauth2User: boolean
  displayName: string
  fullName: string
}

export interface GroupeDTO {
  id: number
  nom: string
  description: string
  estSysteme: boolean
  dateCreation: string
  createur?: UtilisateurDTO
  membres?: UtilisateurDTO[]
  type?: "PUBLIC" | "PRIVE"
  nombreMembres?: number
}

export interface EvenementDTO {
  id: number
  titre: string
  description: string
  dateDebut: string
  dateFin: string
  lieu: string
  calendrierId: number
  calendrier: CalendrierDTO
  createurId: number
  createur: UtilisateurDTO
  participants: UtilisateurDTO[]
  type: "REUNION" | "SOUTENANCE" | "PRESENTATION" | "AUTRE"
  rappel: boolean
  delaiRappel?: number
  couleur: string
  recurrent: boolean
}

export interface CalendrierDTO {
  id: number
  nom: string
  description?: string
  couleur: string
  proprietaireId: number
  proprietaire: UtilisateurDTO
  evenements: EvenementDTO[]
  partage: boolean
  utilisateursPartages: UtilisateurDTO[]
  timezone: string
  visible: boolean
  nombreEvenements: number
}

export interface ListeDiffusionDTO {
  id: number
  nom: string
  description: string
  email: string
  membres: UtilisateurDTO[]
  administrateurs: UtilisateurDTO[]
  dateCreation: string
  active: boolean
  typeAcces: "PUBLIC" | "PRIVE"
  autorisationEnvoi: "TOUS" | "MEMBRES" | "ADMINISTRATEURS"
  nombreMembres: number
}

export interface SalleDiscussionDTO {
  id: number
  nom: string
  description: string
  type: "GENERALE" | "PROJET" | "GROUPE"
  dateCreation: string
  createurId: number
  createur: UtilisateurDTO
  membres: UtilisateurDTO[]
  projetId?: number
  groupeId?: number
  chiffree: boolean
  nombreMembres: number
  dernierMessage?: string
}

export interface DepotDocumentDTO {
  // Define properties for DepotDocumentDTO based on your backend if available
  // For now, I'll leave it as a placeholder or infer from context if needed.
  id: number;
  nom: string;
  url: string;
  type: string;
  dateUpload: string;
  uploader: UtilisateurDTO;
  projetId?: number;
  groupeId?: number;
}
