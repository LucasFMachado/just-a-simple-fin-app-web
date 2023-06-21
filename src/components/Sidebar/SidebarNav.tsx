import { Stack } from "@chakra-ui/react";
import {
  MdAttachMoney,
  MdOutlinePerson,
  MdCategory,
  MdPassword,
  MdDashboard,
} from "react-icons/md";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function SidebarNav() {
  const { user } = useAuth();

  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="GERAL">
        <NavLink href="/dashboard" icon={MdDashboard}>
          Dashboard
        </NavLink>
        <NavLink href="/transactions" icon={MdAttachMoney}>
          Transações
        </NavLink>
        <NavLink href="/users" icon={MdOutlinePerson}>
          Usuários
        </NavLink>
        <NavLink href="/categories" icon={MdCategory}>
          Categorias
        </NavLink>
        <NavLink href={`/change-password/${user?.id}`} icon={MdPassword}>
          Alterar senha
        </NavLink>
      </NavSection>
    </Stack>
  );
}
