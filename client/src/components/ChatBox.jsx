import { Container, Divider, FormControl, Grid, IconButton, List, ListItem, ListItemText, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useRef, useState } from "react";

export default function ChatBox() {
    const webSocket = useRef(null);
    const scrollBottomRef = useRef(null)
    const [user, setUser] = useState("")
    const [inputMessage, setInputMessage] = useState("")
    const [messages, setMessages] = useState([]);

    const handleSendMessage = () => {
        console.log('Send!');
        webSocket.current.send(
            JSON.stringify({ user, message: inputMessage })
        );
        setInputMessage("")
    }

    useEffect(() => {
        console.log('Opening WebSocket');
        webSocket.current = new WebSocket('ws://localhost:5555/chat');
        const openWebSocket = () => {
            webSocket.current.onopen = (event) => {
                console.log('Open:', event);
            }
            webSocket.current.onclose = (event) => {
                console.log('Close:', event);
            }
        }
        openWebSocket();
        return () => {
            console.log('Closing WebSocket');
            webSocket.current.close();
        }
    }, []);

    useEffect(() => {
        webSocket.current.onmessage = (event) => {
            // event.data.text().then((e) => {
            const chatMessageDto = JSON.parse(event.data);
            console.log('Message:', chatMessageDto);
            setMessages([...messages, {
                user: chatMessageDto.user,
                message: chatMessageDto.message
            }]);
            // })

            if (scrollBottomRef.current) {
                scrollBottomRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [messages]);

    return (
        <>
            <Container>
                <Paper elevation={5}>
                    <Box p={3}>
                        <Typography variant="h4" gutterBottom>
                            Chat
                        </Typography>
                        <Divider />
                        <Grid container spacing={4} alignItems="center">
                            <Grid id="chat-window" xs={12} item>
                                <List id="chat-window-messages">
                                    {messages.map((chat, i) => {
                                        return (
                                            <ListItem key={i} className={chat?.user && chat?.user.toLowerCase() === user.toLowerCase() ? "chat-text self" : "chat-text friend"}>
                                                <ListItemText className={chat?.user && chat?.user.toLowerCase() === user.toLowerCase() ? "mine" : ""} primary={`${chat.user}: ${chat.message}`} />
                                            </ListItem>
                                        )
                                    })}
                                    <ListItemText ref={scrollBottomRef}></ListItemText>
                                </List>
                            </Grid>
                            <Grid xs={2} item>
                                <FormControl fullWidth>
                                    <TextField
                                        value={user.trimStart()}
                                        label="Nickname"
                                        variant="outlined" error={user.trim() === ""}
                                        onChange={(e) => setUser(e.target.value)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid xs={9} item>
                                <FormControl fullWidth>
                                    <TextField
                                        value={inputMessage.trimStart()}
                                        label="Type your message..."
                                        variant="outlined" error={inputMessage.trim() === ""}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid xs={1} item>
                                <IconButton
                                    aria-label="send"
                                    color="primary"
                                    disabled={user.trim() === "" || inputMessage.trim() === ""}
                                    onClick={handleSendMessage}
                                >
                                    <SendIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </>
    );
}