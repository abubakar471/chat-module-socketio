import { Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react"
import { useState } from "react";
import { ChatState } from "../../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../../user/UserListItem";

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const { user, chats, setChats } = ChatState();

    const handleSearch = async (query) => {
        setSearch(query);

        if (!query) {
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setSearchResult(data);
        } catch (err) {
            console.log(err);
            toast({
                title: "Error Occured!",
                description: "Failed to fectch users",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async () => {

    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User Already Added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        display="flex"
                        justifyContent="center"
                        fontSize="35px"
                        fontFamily="Work sans"
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                    >
                        <FormControl>
                            <Input
                                placeholder="Group Name"
                                mb={3}
                                _hover={{
                                    border: "2px solid teal"
                                }}
                                _focus={{
                                    border: "1px solid teal"
                                }}
                                onChange={e => setGroupChatName(e.target.value)} />
                        </FormControl>

                        <FormControl>
                            <Input
                                placeholder="Add Users"
                                mb={1}
                                _hover={{
                                    border: "2px solid teal"
                                }}
                                _focus={{
                                    border: "1px solid teal"
                                }}
                                onChange={e => handleSearch(e.target.value)} />
                        </FormControl>

                        {/* render search users */}
                        {
                            loading ? (
                                <div>Loading...</div>
                            ) : (
                                searchResult?.slice(0, 4)?.map((user) => (
                                    <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                                ))
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="teal" onClick={handleSubmit}>create</Button>
                    </ModalFooter>
                </ModalContent>

            </Modal>
        </>
    )
}

export default GroupChatModal