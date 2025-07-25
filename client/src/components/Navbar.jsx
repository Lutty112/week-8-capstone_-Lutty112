import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from "@/components/ui/dropdown-menu"
import { Bell } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate()

  const handleProfileClick = () => {
    console.log("Navigating to profile")
    navigate("/profile")
  }

  const handleLogoutClick = () => {
    console.log("Logging out...")
    onLogout() // Passed from parent
  }

  return (
    <header className="bg-white border-b px-4 py-2 flex items-center justify-between shadow-sm">
      <div className="text-2xl font-bold text-purple-700">Dime Allies Hub</div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5 text-gray-700" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar>
                <AvatarImage src={user?.avatar || "/default-avatar.png"} />
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-700">{user?.name}</span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="mr-4">
            <DropdownMenuItem onSelect={handleProfileClick}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleLogoutClick}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default Navbar
