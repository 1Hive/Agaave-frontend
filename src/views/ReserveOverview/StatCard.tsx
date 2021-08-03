import React, { useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  StackDivider,
  Text,
  VStack,
  ModalBody,
  useMediaQuery,
} from "@chakra-ui/react";
import { ModalIcon } from "../../utils/icons";
import { fontSizes, spacings } from "../../utils/constants";

interface Props {
  title: string;
  color?: string;
  value: any;
  type?: string;
  enableModal?: boolean;
  modalOpen?: any;
}

const StatCard: React.FC<Props> = ({ ...props }) => {
  return (
    <React.Fragment>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="flex-start"
          position="relative"
        >
          <Text fontSize="xl">{props.title}</Text>
          {props.enableModal && (
            <ModalIcon
              position="relative"
              top="0"
              left={{ base: "0.5", md: "2" }}
              onOpen={() => props.modalOpen(props.title)}
            />
          )}
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Text
            fontSize="xl"
            fontWeight="extrabold"
            color={`${props.color}.100`}
          >
            {props.value}
            {props.type}
          </Text>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default StatCard;
