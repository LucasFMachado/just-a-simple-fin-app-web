import { Stack } from "@chakra-ui/react";
import { RiContactsLine, RiDashboardLine } from "react-icons/ri";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function SidebarNav() {
  const { user } = useAuth();

  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="GERAL">
        <NavLink href="/initial" icon={RiDashboardLine}>
          Dashboard
        </NavLink>
        <NavLink href="/users" icon={RiContactsLine}>
          Usuários
        </NavLink>
        <NavLink href={`/change-password/${user?.id}`} icon={RiContactsLine}>
          Alterar senha
        </NavLink>
      </NavSection>
    </Stack>
  );
}
