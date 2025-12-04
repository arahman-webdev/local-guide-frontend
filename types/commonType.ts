export interface IUser {
  id: string
  name: string
  email: string
  role: "ADMIN" | "GUIDE" | "TOURIST"
  profilePic?: string
}