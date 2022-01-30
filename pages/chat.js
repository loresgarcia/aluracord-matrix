import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js'
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';
import { ProfileHover } from '../src/components/ProfileHover';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMxMDk4NSwiZXhwIjoxOTU4ODg2OTg1fQ.pNsFtH-lB21nuGjPSf365XEDq3x1C3E7nWQapkbWdfo';
const SUPABASE_URL = 'https://hscmgaxfvofclsvhsfwk.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagensEmTempoReal(adicionaMensagem) {
    return supabaseClient
        .from('mensagens')
        .on('INSERT', (respostaLive) => {
            adicionaMensagem(respostaLive.new);
        })
        .subscribe();
}


export default function ChatPage() {
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

    React.useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                // console.log('Dados da consulta:', data);
                setListaDeMensagens(data);
            });
        const subscription = escutaMensagensEmTempoReal((novaMensagem) => {
            console.log('Nova mensagem:', novaMensagem);
            console.log('listaDeMensagens:', listaDeMensagens);
            // Quero reusar um valor de referencia (objeto/array) 
            // Passar uma função pro setState

            // setListaDeMensagens([
            //     novaMensagem,
            //     ...listaDeMensagens
            // ])
            setListaDeMensagens((valorAtualDaLista) => {
                console.log('valorAtualDaLista:', valorAtualDaLista);
                return [
                    novaMensagem,
                    ...valorAtualDaLista,
                ]
            });
        });

        return () => {
            subscription.unsubscribe();
        }

    }, []);

    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            // id: listaDeMensagens.length + 1,
            de: usuarioLogado,
            texto: novaMensagem,
        };

        supabaseClient
            .from('mensagens')
            .insert([
                // Tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
                mensagem
            ])
            .then(({ data }) => {

            });

        setMensagem('');
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://nhrwallpapers.com/wp-content/uploads/2021/05/Twice-Pictures.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList mensagens={listaDeMensagens} setMensagens={setListaDeMensagens} />
                    {/* {listaDeMensagens.map((mensagemAtual) => {
                    return (
                        <li key={mensagemAtual.id}>
                            {mensagemAtual.de}: {mensagemAtual.texto}
                        </li>
                    )
                })} */}
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <a href={`https://github.com/${usuarioLogado}`}>
                            <Image 
                                styleSheet={{
                                    height: '50px',
                                    width: '50px',
                                    borderRadius: '50%',
                                    marginRight: '15px',
                                    position: 'relative',
                                    top: '-5px',
                                    transition: '1s',
                                    hover: {
                                        transform: 'rotate(360deg)'
                                    }
                                }}
                                src={`https://github.com/${usuarioLogado}.png`}
                            />
                        </a>
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals['000'],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[999],
                            }}
                        />
                        {/* CallBack */}
                        <Button
                            label='Enviar'
                            styleSheet={{
                                marginRight: '10px',
                                marginBottom: '10px',
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                                hover: {
                                    backgroundColor: appConfig.theme.colors.neutrals[300]
                                }
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                handleNovaMensagem(mensagem);
                            }} />
                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                // console.log('[USANDO O COMPONENTE] Salva esse sticker no banco', sticker);
                                handleNovaMensagem(':sticker: ' + sticker);
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Qual sua música favorita do Twice? 🎧
                </Text>
                <Button
                    styleSheet={{
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        hover: {
                            backgroundColor: appConfig.theme.colors.neutrals[300]
                        }

                    }}
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    const [isOpen, setOpenState] = React.useState('');
    const [id, setId] = React.useState('');

    function DeletarMensagem(mensagem) {
        const novaListaDeMensagens = props.mensagens.filter((mensagemRemover) => {
            return mensagem.id !== mensagemRemover.id
        })
        props.setMensagens(novaListaDeMensagens);
    }
    // console.log(props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                                onMouseOver={(e) => {
                                    setId(mensagem.id);
                                    setOpenState(true);
                                }}
                            />
                            <ProfileHover
                                mensagem={mensagem}
                                open={isOpen}
                                setOpen={() => setOpenState(!isOpen)}
                                id={id}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    display: 'inline',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date(mensagem.created_at).toLocaleDateString())}
                            </Text>
                            <Image
                                onClick={(e) => {
                                    e.preventDefault();
                                    DeletarMensagem(mensagem)
                                }}
                                styleSheet={{
                                    width: '24px',
                                    display: 'inline',
                                    marginLeft: '90%',
                                    hover: {
                                        cursor: 'pointer',
                                    }
                                }}
                                src='https://i.imgur.com/sim3IY0.png' />
                        </Box>
                        {/* [Declarativo] */}
                        {/* Condicional: {mensagem.texto.startsWith(':sticker:').toString()} */}
                        {mensagem.texto.startsWith(':sticker:')
                            ? (
                                <Image
                                    styleSheet={{
                                        maxWidth: '100px'
                                    }}
                                    src={mensagem.texto.replace(':sticker:', '')} />
                            )
                            : (
                                mensagem.texto
                            )}
                        {/* if mensagem de texto possui stickers:
                           mostra a imagem
                        else 
                           mensagem.texto */}
                        {/* {mensagem.texto} */}
                    </Text>
                );
            })}
        </Box>
    )
}