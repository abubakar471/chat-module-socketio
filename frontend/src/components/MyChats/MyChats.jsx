import { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider"
import { Box, Button, Stack, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "../loading/ChatLoding";
import { getSender } from "../../config/chatLogics";
import GroupChatModal from "../modals/group-chat-modal/GroupChatModal";

const MyChats = () => {
    const [loggedInUser, setLoggedInUser] = useState(false);
    const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();
    const toast = useToast();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get("/api/chat", config);
            setChats(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    useEffect(() => {
        setLoggedInUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [])

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            w={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                w="100%"
                fontFamily="Work sans"
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
            >
                My Chats
                <GroupChatModal>
                    <Button
                        display="flex"
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}>
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>

            <Box
                display="flex"
                flexDir="column"
                p={3}
                bg="#F8F8F8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {
                    chats ? (
                        <Stack overflowY="scroll">
                            {
                                chats.map((chat) => (
                                    <Box
                                        key={chat._id}
                                        onClick={() => setSelectedChat(chat)}
                                        cursor="pointer"
                                        borderRadius="lg"
                                        px={3}
                                        py={2}
                                        color={selectedChat === chat ? "white" : "black"}
                                        bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                    >
                                        {
                                            !chat.isGroupChat ? (
                                                getSender(loggedInUser, chat.users)
                                            ) : (
                                                chat.chatName
                                            )
                                        }
                                    </Box>
                                ))
                            }
                        </Stack>
                    ) : (
                        <ChatLoading />
                    )
                }
            </Box>
        </Box>
    )
}

export default MyChats