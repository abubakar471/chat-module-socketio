import axios from "axios"
import { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../../components/misc/SideDrawer/SideDrawer";
import MyChats from "../../components/MyChats/MyChats";
import ChatBox from "../../components/ChatBox/ChatBox";

const ChatPage = () => {
    const { user } = ChatState();

    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box display="flex" justifyContent="space-between" p="10px" w="100%" h="91.5vh">
                {user && <MyChats />}
                {user && <ChatBox />}
            </Box>
        </div>
    )
}


export default ChatPage