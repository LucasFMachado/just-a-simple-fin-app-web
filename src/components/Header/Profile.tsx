import { Flex, Text, Box } from "@chakra-ui/react";
import { useAuth } from "../../contexts/AuthContext";

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps) {
  const { user } = useAuth();

  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>{user?.name}</Text>
          <Text color="gray.300" fontSize="sm">
            {user?.email}
          </Text>
        </Box>
      )}
    </Flex>
  );
}
