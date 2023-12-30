import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChatContext = createContext();

const ChatProvixer = ({ children }) => {
    const [user, setUser] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState(null);
    const [notification, setNotification] = useState([]);



    const navigate = useNavigate();
    axios.defaults.baseURL = process.env.REACT_APP_API_URL;
    // axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;

    axios.interceptors.response.use(
        function (response) {
            return response;
        },
        function (error) {
            let res = error.response;
            if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
                setUser(null);
                setSelectedChat(null);
                setChats(null);
                window.localStorage.removeItem("userInfo");
                navigate("/");
            }
        }
    )

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        // const userNotification = JSON.parse(localStorage.getItem("userNotification"));

        // if (userNotification?.length > 0) {
        //     setNotification(userNotification);
        // }

        if (userInfo) {
            const fetchNotifications = async () => {

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userInfo.token}`
                    }
                }

                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/notifications`, config);

                console.log(data);

                if (data?.length > 0) {
                    setNotification(data);
                }
            }

            fetchNotifications();
        }


        setUser(userInfo);

        if (!userInfo) {
            navigate("/");
        }

    }, [navigate]);

    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification }}>{children}</ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(ChatContext);
}


export default ChatProvixer