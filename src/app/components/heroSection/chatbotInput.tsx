'use client';
import { useState, useRef, JSX } from 'react';
import axios from 'axios';
import styles from '../../chatbotInput.module.css';
import AttachmentRoundedIcon from '@mui/icons-material/AttachmentRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import WbIncandescentRoundedIcon from '@mui/icons-material/WbIncandescentRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatBotInput = () => {
    const [contractText, setContractText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'bot' }[]>([]);
    const [isShinyButtonSelected, setIsShinyButtonSelected] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContractText(e.target.value);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please upload a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('contractText', contractText);

        try {
            const response = await axios.post('http://localhost:3000/contracts/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Upload response:', response.data);
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    const handleAnalyze = async () => {
        setMessages([...messages, { text: contractText, sender: 'user' }]);
        try {
            const response = await axios.post('http://localhost:3000/contracts/analyze', {
                content: contractText,
            });
            console.log('Analyze response:', response.data);
            setMessages([...messages, { text: contractText, sender: 'user' }, { text: response.data, sender: 'bot' }]);
            setContractText('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto'; // Reset the height of the textarea
            }
        } catch (error) {
            console.error('Analyze error:', error);
        }
    };

    const highlightText = (text: string) => {
        const confidentialityKeywords = ['confidential', 'non-disclosure', 'privacy'];
        const highRiskKeywords = ['liability', 'indemnity', 'penalty'];
        const goodSideKeywords = ['benefit', 'advantage', 'opportunity'];
        const dateKeywords = ['date', 'effective', 'term'];

        const sentences = text.split(/(?<=\.)\s+/); // Split text into sentences
        const highlightedSentences = sentences.map(sentence => {
            let highlightedSentence = sentence;

            confidentialityKeywords.forEach(keyword => {
                const regex = new RegExp(`(${keyword})`, 'gi');
                if (regex.test(sentence)) {
                    highlightedSentence = `<span class="${styles['highlight-yellow']}">${sentence}</span>`;
                }
            });

            highRiskKeywords.forEach(keyword => {
                const regex = new RegExp(`(${keyword})`, 'gi');
                if (regex.test(sentence)) {
                    highlightedSentence = `<span class="${styles['highlight-red']}">${sentence}</span>`;
                }
            });

            goodSideKeywords.forEach(keyword => {
                const regex = new RegExp(`(${keyword})`, 'gi');
                if (regex.test(sentence)) {
                    highlightedSentence = `<span class="${styles['highlight-green']}">${sentence}</span>`;
                }
            });

            dateKeywords.forEach(keyword => {
                const regex = new RegExp(`(${keyword})`, 'gi');
                if (regex.test(sentence)) {
                    highlightedSentence = `<span class="${styles['highlight-blue']}">${sentence}</span>`;
                }
            });

            return highlightedSentence;
        });

        return highlightedSentences.join(' ');
    };

    const handleShinyButtonClick = () => {
        setIsShinyButtonSelected(!isShinyButtonSelected);
    };

    return (
        <div>
            <div className={styles['chat-container']} style={{ width: '1300px' }}>
                {messages.reduce<JSX.Element[]>((acc, message, index, array) => {
                    if (message.sender === 'user') {
                        const botMessage = array[index + 1] && array[index + 1].sender === 'bot' ? array[index + 1] : null;
                        acc.push(
                            <div key={index} className={styles['message-pair']}>
                                <div className={`${styles['message']} ${styles['user-message']}`}>
                                    <span dangerouslySetInnerHTML={{ __html: highlightText(message.text) }} />
                                </div>
                                {botMessage && (
                                    <div className={`${styles['message']} ${styles['bot-message']}`}>
                                        <span>{botMessage.text}</span>
                                    </div>
                                )}
                            </div>
                        );
                    }
                    return acc;
                }, [])}
            </div>
            <ScrollArea className='flex flex-col w-[910px] h-auto px-6 py-3 border border-zinc-800 rounded-xl'>
                <div className={styles['chatbot-input']}>
                    <textarea
                        ref={textareaRef}
                        placeholder="Paste or upload your contract here..."
                        className={styles['textarea-field']}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                        }}
                        rows={1}
                        value={contractText}
                        onChange={handleTextChange}
                    />
                    <input id="fileInput" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                </div>
                <div className='flex flex-row gap-3 mt-[10px]'>
                    <button className='cursor-pointer'><WbIncandescentRoundedIcon /> </button>
                    <button className='cursor-pointer'><LanguageRoundedIcon /></button>
                    <button onClick={() => document.getElementById('fileInput')?.click()} className='cursor-pointer'><AttachmentRoundedIcon /></button>
                    <button
                        className={`cursor-pointer ${styles['shiny-button']} ${isShinyButtonSelected ? styles['selected'] : ''}`}
                        onClick={handleShinyButtonClick}
                    >
                        <AutoAwesomeRoundedIcon />
                    </button>
                    <button onClick={handleAnalyze} className='ml-[600px] cursor-pointer'><SendRoundedIcon /> </button>
                </div>
            </ScrollArea>
        </div>
    );
};

export default ChatBotInput;