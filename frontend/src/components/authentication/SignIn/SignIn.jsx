import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from "@chakra-ui/react"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios"

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleShow = () => {
        setShow(!show);
    }


    const submitHandler = async (e) => {
        setIsLoading(true);

        if (email === "" || password === "") {
            toast({
                title: "Please fill all fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })

            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }
            const { data } = await axios.post("/api/user/signin", { email, password }, config);

            if (data) {
                toast({
                    title: "Sign in Completed",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                })
            }
            setIsLoading(false);
            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate("/chat");
        } catch (err) {
            console.log(err);
            toast({
                title: "Error Occured",
                description: err.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setIsLoading(false);
        }
    }


    return (
        <VStack spacing={"5px"}>
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Email" onChange={e => setEmail(e.target.value)} />
            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} placeholder="Password" onChange={e => setPassword(e.target.value)} />
                    <InputRightElement width={"4.5rem"}>
                        <Button h="1.75em" size="sm" onClick={handleShow}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button colorScheme="yellow" width={"100%"} style={{ marginTop: 15 }} onClick={submitHandler} isLoading={isLoading}>
                Sign In
            </Button>
        </VStack>
    )
}

export default SignIn