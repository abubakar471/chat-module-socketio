import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider"
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../config/chatLogics";
import ProfileModal from "../modals/profile-modal/ProfileModal";
import UpdateGroupChatModal from "../modals/update-group-chat-modal/UpdateGroupChatModal";
import { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "../scrollable-chat/ScrollableChat";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");

    const { user, selectedChat, setSelectedChat } = ChatState();
    const toast = useToast();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            setLoading(true);

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            console.log(data);
            setMessages(data);
        } catch (err) {
            console.log(err);
            toast({
                title: "Failed to load messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
        } finally {
            setLoading(false);
        }
    }

    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }

                setNewMessage("");

                const { data } = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config);
                console.log(data);

                setMessages([...messages, data]);
            } catch (err) {
                console.log(err);
                toast({
                    title: "Failed to send Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                })
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        // typing indicator logic
    }

    useEffect(() => {
        fetchMessages();
    }, [selectedChat]);

    return (
        <>
            {selectedChat ? (
                <>
                    <Text display="flex" alignItems="center" justifyContent={{ base: "space-between" }} fontFamily="Work sans" w="100%" pb={3} px={2} fontSize={{ base: "28px", md: "30px" }}>
                        <IconButton icon={<ArrowBackIcon />} display={{ base: "flex", md: "none" }} onClick={() => setSelectedChat(null)} />

                        {
                            !selectedChat.isGroupChat ? (
                                <>
                                    {getSender(user, selectedChat.users)}
                                    <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                                </>
                            ) : (
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                    <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                                </>
                            )
                        }
                    </Text>

                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hiddene"
                    >
                        {
                            loading ? (<Spinner
                                size="xl"
                                w={20}
                                h={20}
                                margin="auto"
                                alignSelf="center"
                            />) : (
                                <>
                                    {/* messages  */}
                                    <div className="messages">
                                        <ScrollableChat messages={messages} />
                                    </div>
                                </>
                            )
                        }

                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            <Input placeholder="what's on your mind..." variant="filled" bg="#E0E0E0" value={newMessage} onChange={typingHandler} />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                        Start a new chat
                    </Text>
                </Box>
            )
            }
        </>
    )
}

export default SingleChat