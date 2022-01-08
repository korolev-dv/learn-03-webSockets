import React, {useEffect, useRef, useState} from "react";

const WebSockets = () => {

    const [messages, setMessages] = useState([])
    const [value, setValue] = useState('')
    const [connected, setConnected] = useState(false)
    const [username, setUsername] = useState('')
    const socket = useRef()

    function connect() {
        socket.current = new WebSocket('ws://localhost:5000')

        // Слушатель отработает в момент подключения
        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))  
        }

        // Отработает при получении какого либо сообщения
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }

        // Отработает при закрытии подключения
        socket.current.onclose = () => {

        }

        // Отработает когда произошла ошибка
        socket.current.onerror = () => {

        }
    }

    const sendMessage = async () => {

        const message = {
            event: 'message',
            username,
            id: Date.now(),
            message: value
        }

        socket.current.send(JSON.stringify(message))
        setValue('')
    }
 
    if (!connected) {
        return(
            <div className="center">
                <div className="form">
                    <input 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        type="text"
                        placeholder="введите ваше имя" />
                    <button onClick={connect}>Войти</button>
                </div>
            </div>
        )
    }

    return(
        <div className="center">
            <div>
                <div className="form">
                    <input value ={value} type="text" onChange={e => setValue(e.target.value)} />
                    <button onClick={sendMessage}>Отправить</button>
                </div>
                <div className="messages">
                    {messages.map(mess => 
                        <div key = {mess.id}>
                            {mess.event === 'connection'
                                ? <div className="connection_message">Пользователь {mess.username} подключился к чату</div>
                                : <div className="message">{mess.username}: {mess.message}</div>
                                }
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default WebSockets