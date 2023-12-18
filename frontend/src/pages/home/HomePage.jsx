import { useNavigate } from "react-router-dom"
import SignIn from "../../components/authentication/SignIn/SignIn"
import SignUp from "../../components/authentication/SignUp/SignUp"
import styles from "./Home.styles.css"
import { Container, Box, Text, Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react"
import { useEffect } from "react"

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));

        if (user) {
            navigate("/chat");
        }

    }, [navigate]);
    
    return (
        <div className={styles.home__conatiner}>
            <Container maxW="xl" centerContent>
                <Box d="flex" alignItems="center" justifyContent="center" p={3} bg={"white"} w={"100%"} m="40px 0 15px 0" borderRadius="lg" borderWidth="1px">
                    <Text fontSize="2xl" fontFamily="Work sans" color="black">Chat App</Text>
                </Box>

                <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" color="black">
                    <Tabs variant='soft-rounded' colorScheme='yellow'>
                        <TabList mb={"1em"}>
                            <Tab width={"50%"}>Sign In</Tab>
                            <Tab width={"50%"}>Sign Up</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <SignIn />
                            </TabPanel>
                            <TabPanel>
                                <SignUp />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Container>
        </div>
    )
}

export default HomePage