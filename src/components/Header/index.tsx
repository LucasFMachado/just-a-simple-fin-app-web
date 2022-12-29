import {
  Flex,
  IconButton,
  Icon,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import { RiLogoutBoxRLine, RiMenuLine } from "react-icons/ri";
import { useAuth } from "../../contexts/AuthContext";
import { useSidebarDrawer } from "../../contexts/SidebarDrawerContext";
import { PageTitle } from "../PageTitle";
import { Logo } from "./Logo";
import { Profile } from "./Profile";

export function Header() {
  const { onOpen } = useSidebarDrawer();
  const { signOut } = useAuth();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <>
      <PageTitle title="Dashboard" />
      <Flex
        as="header"
        w="100%"
        maxWidth={1480}
        h="20"
        mx="auto"
        px="6"
        align="center"
      >
        {!isWideVersion && (
          <IconButton
            aria-label="Open navigation"
            icon={<Icon as={RiMenuLine} alignContent="center" />}
            fontSize="24"
            variant="unstyled"
            onClick={onOpen}
            mr="2"
            py="2"
          />
        )}
        <Logo />
        <Flex align="center" ml="auto">
          <Profile showProfileData={isWideVersion} />
          <Button
            rightIcon={<Icon as={RiLogoutBoxRLine} alignContent="center" />}
            variant="outline"
            onClick={signOut}
            mr="2"
            py="2"
          >
            Sair
          </Button>
        </Flex>
      </Flex>
    </>
  );
}
