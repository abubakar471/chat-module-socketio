import { Box, IconButton, Text } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider"
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../config/chatLogics";
import ProfileModal from "../modals/profile-modal/ProfileModal";
import UpdateGroupChatModal from "../modals/update-group-chat-modal/UpdateGroupChatModal";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat } = ChatState();

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
                                    <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
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
                        {/* messages  */}
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