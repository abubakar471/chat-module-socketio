import ScrollableFeed from "react-scrollable-feed"
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../../config/chatLogics"
import { ChatState } from "../../context/ChatProvider"
import { Avatar, Image, Tooltip } from "@chakra-ui/react";
import PreviewFileModal from "../modals/preview-file-modal/PreviewFileModal";

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();

    return (
        <ScrollableFeed>
            {
                messages && messages.map((m, i) => (
                    <div key={m._id} style={{ display: "flex" }}>
                        {(isSameSender(messages, m, i, user._id) ||
                            isLastMessage(messages, i, user._id)) && (
                                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                    <Avatar
                                        mt="7px"
                                        mr={1}
                                        size="sm"
                                        cursor="pointer"
                                        name={m.sender.name}
                                        src={m.sender.pic}
                                    />
                                </Tooltip>
                            )}
                        <div style={{
                            backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                                }`,
                            marginLeft: isSameSenderMargin(messages, m, i, user._id),
                            marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                            borderRadius: "20px",
                            padding: "5px 15px",
                            maxWidth: "75%",
                        }}>
                            <div style={{ cursor: "pointer" }}>
                                {m.file && (
                                    <PreviewFileModal file={m.file}>
                                        <Image src={m.file} alt={m.file} width={150} height={150} className="w-[150px] h=[150px] object-cover rounded-md my-2" />
                                    </PreviewFileModal>
                                )}
                            </div>
                            <div>
                                <span >
                                    {m.content}
                                </span>
                            </div>
                        </div>
                    </div>

                ))
            }
        </ScrollableFeed>
    )
}

export default ScrollableChat