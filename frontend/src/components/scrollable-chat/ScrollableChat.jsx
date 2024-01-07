import ScrollableFeed from "react-scrollable-feed"
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../../config/chatLogics"
import { ChatState } from "../../context/ChatProvider"
import { Avatar, Image, Tooltip } from "@chakra-ui/react";
import PreviewFileModal from "../modals/preview-file-modal/PreviewFileModal";
import { IoDocuments } from "react-icons/io5";

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();

    const getExtension = (filename) => {
        const extension = filename.split('.').pop();
        // console.log(extension);

        switch (extension) {
            case 'png':
                return 'jpg';
            case 'gif':
                return 'jpg';
            case 'jpeg':
                return 'jpg';
            case 'zip':
                return 'doc';
            case 'rar':
                return 'doc';
            case 'mp4':
                return 'mp4';
            case 'flv':
                return 'mp4';
            case 'wmv':
                return 'mp4';
            case 'mkv':
                return 'mp4';
            case 'avi':
                return 'mp4';
            case 'webm':
                return 'mp4';
            case 'mp3':
                return 'mp3';
            case 'wav':
                return 'mp3';
            case 'mpeg':
                return 'mp3';
            case 'pdf':
                return 'doc';
            case 'pptx':
                return 'doc';
            case 'docx':
                return 'doc';
            case 'xlsx':
                return 'doc';
            case 'txt':
                return 'doc';
            default:
                return extension;
        }
    }

    return (
        <ScrollableFeed>
            {
                messages && messages.map((m, i) => (
                    <div key={m._id} style={{ display: "flex", marginBottom : "10px"}}>
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
                                    <>
                                        {getExtension(m.file) === "doc" && (
                                            <PreviewFileModal file={m.file} extension={getExtension(m.file)}>
                                                <IoDocuments size={200} className="!text-[24px]" />
                                            </PreviewFileModal>
                                        )}

                                        {getExtension(m.file) === "jpg" && (
                                            <PreviewFileModal file={m.file} extension={getExtension(m.file)}>
                                                <Image src={m.file} alt={m.file} width={250} height={180} className="w-[350px] h=[150px] object-cover rounded-md my-2" />

                                            </PreviewFileModal>
                                        )}

                                        {
                                            getExtension(m.file) === "mp4" && (
                                                <>
                                                    <video width="320" height="240" controls>
                                                        <source src={m.file} type="video/mp4" />
                                                        <source src={m.file} type="video/ogg" />
                                                        <source src={m.file} type="video/webm" />
                                                        <source src={m.file} type="video/flv" />
                                                        <source src={m.file} type="video/mkv" />
                                                        <source src={m.file} type="video/avi" />
                                                        <source src={m.file} type="video/wmv" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </>
                                            )

                                        }

                                        {
                                            getExtension(m.file) === "mp3" && (
                                                <>
                                                    <audio controls>
                                                        <source src={m.file} type="audio/ogg" />
                                                        <source src={m.file} type="audio/mpeg" />
                                                        <source src={m.file} type="audio/wav" />
                                                        <source src={m.file} type="audio/mp3" />
                                                        Your browser does not support the audio tag.
                                                    </audio>
                                                </>
                                            )

                                        }
                                    </>
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