import React from 'react'
import { Toaster } from './Toaster'
import { useReward } from "react-rewards";
import { useEffect, useState } from 'react';
export const ImageSplitter = () => {
    const [welcomeConf, setwelcomeConf] = useState(false)
    const [input, setInput] = React.useState('')
    const [imga, setImg] = React.useState('')
    const [toast, setToast] = React.useState(false)
    const [disable, setDisAble] = React.useState(false)
    const [seconds, setSeconds] = React.useState(0);
    const [minutes, setMinutes] = React.useState(0);
    const [isActive, setIsActive] = React.useState(false);

    const img1 = [
        {
            id: 1,
            img: './images/cat-g093a4942a_640.jpg'
        },
        {
            id: 2,
            img: './images/coffee-g1b6de59fb_640.jpg'
        },
        {
            id: 3,
            img: './images/duck-g4e80db883_640.jpg'
        },
        {
            id: 4,
            img: './images/italy-gc121ecdbc_640.jpg'
        },
        {
            id: 5,
            img: './images/venice-g63213db8d_640.jpg'
        },
    ]
    const img2 = [
        {
            id: 1,
            img: './images3/cat-g093a4942a_640.jpg'
        },
        {
            id: 2,
            img: './images3/coffee-g1b6de59fb_640.jpg'
        },
        {
            id: 3,
            img: './images3/duck-g4e80db883_640.jpg'
        },
        {
            id: 4,
            img: './images3/italy-gc121ecdbc_640.jpg'
        },
        {
            id: 5,
            img: './images3/venice-g63213db8d_640.jpg'
        },
    ]

    const PUZZLE_HOVER_TINT = "#009900";
    let img = new Image()
    const canvas = document.querySelector("#canvas");
    const stage = canvas?.getContext("2d");
    let difficulty = input;
    let pieces;
    let puzzleWidth;
    let puzzleHeight;
    let pieceWidth;
    let pieceHeight;
    let currentPiece;
    let currentDropPiece;
    let mouse;
    function images() {
        setImg('')
        let randomNu = Math.floor(Math.random() * 5) + 1
        if (window.matchMedia("(max-width: 548px)").matches) {
            imagfind(img2, randomNu)
        } else {
            imagfind(img1, randomNu)
        }
    }
    function imagfind(params, randomNu) {
        params.find((it) => {
            if (it.id == randomNu) {
                setImg(it)
            }
        })
    }
    React.useEffect(() => {
        if (input <= 1 || input === '') {
            setInput('')
            setImg('')
            setDisAble(false)
            document.getElementById('canvas').classList.add('kk')
        }
    }, [input])

    function reset() {
        setInput('')
        setImg('')
        setDisAble(false)
        window.location.replace('/')
        document.getElementById('canvas').classList.add('kk')
    }
    React.useEffect(() => {
        let interval;
        if (seconds > 59) {
            clearInterval(interval);
            setSeconds(0)
            setMinutes(pre => pre + 1)
        }
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((seconds) => seconds + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);
    React.useEffect(() => {
        img.src = ''
        images()
    }, [localStorage.getItem('seconds')])
    var handle = (e) => {
        e.preventDefault();
        document.getElementById('canvas').classList.remove('kk')
        images()
        if (input === '') {
            alert('Please Enter A Number from 2 to 5')
            window.location.replace('/')
        } else {

            img.addEventListener("load", onImage, false);
            img.src = imga.img
            function initPuzzle() {
                pieces = [];
                mouse = {
                    x: 0,
                    y: 0
                };
                currentPiece = null;
                currentDropPiece = null;
                stage.drawImage(
                    img,
                    0,
                    0,
                    puzzleWidth,
                    puzzleHeight,
                    0,
                    0,
                    puzzleWidth,
                    puzzleHeight
                );
                buildPieces();
            }

            function setCanvas() {
                canvas.width = puzzleWidth;
                canvas.height = puzzleHeight;
                canvas.style.border = "1px solid black";
            }

            function onImage() {
                pieceWidth = Math.floor(img.width / difficulty);
                pieceHeight = Math.floor(img.height / difficulty);
                puzzleWidth = pieceWidth * difficulty;
                puzzleHeight = pieceHeight * difficulty;
                setCanvas();
                initPuzzle();
            }
            function buildPieces() {
                let i;
                let piece;
                let xPos = 0;
                let yPos = 0;
                for (i = 0; i < difficulty * difficulty; i++) {
                    piece = {};
                    piece.sx = xPos;
                    piece.sy = yPos;
                    pieces.push(piece);
                    xPos += pieceWidth;
                    if (xPos >= puzzleWidth) {
                        xPos = 0;
                        yPos += pieceHeight;
                    }
                }
                document.getElementById('click').addEventListener('click', shufflePuzzle)

            }

            function shufflePuzzle() {
                pieces = shuffleArray(pieces);
                stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
                let xPos = 0;
                let yPos = 0;
                for (const piece of pieces) {
                    piece.xPos = xPos;
                    piece.yPos = yPos;
                    stage.drawImage(
                        img,
                        piece.sx,
                        piece.sy,
                        pieceWidth,
                        pieceHeight,
                        xPos,
                        yPos,
                        pieceWidth,
                        pieceHeight
                    );
                    stage.strokeRect(xPos, yPos, pieceWidth, pieceHeight);
                    xPos += pieceWidth;
                    if (xPos >= puzzleWidth) {
                        xPos = 0;
                        yPos += pieceHeight;
                    }
                }
                document.onpointerdown = onPuzzleClick;
            }

            function checkPieceClicked() {
                for (const piece of pieces) {
                    if (
                        mouse.x < piece.xPos ||
                        mouse.x > piece.xPos + pieceWidth ||
                        mouse.y < piece.yPos ||
                        mouse.y > piece.yPos + pieceHeight
                    ) {
                        //PIECE NOT HIT
                    } else {
                        return piece;
                    }
                }
                return null;
            }

            function updatePuzzle(e) {
                currentDropPiece = null;
                if (e.clientX || e.clientX == 0) {
                    mouse.x = e.clientX - canvas.offsetLeft;
                    mouse.y = e.clientY - canvas.offsetTop;
                } else if (e.offsetX || e.offsetX == 0) {
                    mouse.x = e.offsetX - canvas.offsetLeft;
                    mouse.y = e.offsetY - canvas.offsetTop;
                }
                stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
                for (const piece of pieces) {
                    if (piece == currentPiece) {
                        continue;
                    }
                    stage.drawImage(
                        img,
                        piece.sx,
                        piece.sy,
                        pieceWidth,
                        pieceHeight,
                        piece.xPos,
                        piece.yPos,
                        pieceWidth,
                        pieceHeight
                    );
                    stage.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);
                    if (currentDropPiece == null) {
                        if (
                            mouse.x < piece.xPos ||
                            mouse.x > piece.xPos + pieceWidth ||
                            mouse.y < piece.yPos ||
                            mouse.y > piece.yPos + pieceHeight
                        ) {
                            //NOT OVER
                        } else {
                            currentDropPiece = piece;
                            stage.save();
                            stage.globalAlpha = 0.4;
                            stage.fillStyle = PUZZLE_HOVER_TINT;
                            stage.fillRect(
                                currentDropPiece.xPos,
                                currentDropPiece.yPos,
                                pieceWidth,
                                pieceHeight
                            );
                            stage.restore();
                        }
                    }
                }
                stage.save();
                stage.globalAlpha = 0.6;
                stage.drawImage(
                    img,
                    currentPiece?.sx,
                    currentPiece?.sy,
                    pieceWidth,
                    pieceHeight,
                    mouse.x - pieceWidth / 2,
                    mouse.y - pieceHeight / 2,
                    pieceWidth,
                    pieceHeight
                );
                stage.restore();
                stage.strokeRect(
                    mouse.x - pieceWidth / 2,
                    mouse.y - pieceHeight / 2,
                    pieceWidth,
                    pieceHeight
                );
            }

            function onPuzzleClick(e) {
                if (e?.clientX || e?.clientX === 0) {
                    mouse.x = e?.clientX - canvas.offsetLeft;
                    mouse.y = e?.clientY - canvas.offsetTop;
                } else if (e?.offsetX || e?.offsetX === 0) {
                    mouse.x = e?.offsetX - canvas.offsetLeft;
                    mouse.y = e?.offsetY - canvas.offsetTop;
                }
                currentPiece = checkPieceClicked();
                if (currentPiece !== null) {
                    stage.clearRect(
                        currentPiece.xPos,
                        currentPiece.yPos,
                        pieceWidth,
                        pieceHeight
                    );
                    stage.save();
                    stage.globalAlpha = 0.9;
                    stage.drawImage(
                        img,
                        currentPiece.sx,
                        currentPiece.sy,
                        pieceWidth,
                        pieceHeight,
                        mouse.x - pieceWidth / 2,
                        mouse.y - pieceHeight / 2,
                        pieceWidth,
                        pieceHeight
                    );
                    stage.restore();
                    document.onpointermove = updatePuzzle;
                    document.onpointerup = pieceDropped;


                }
            }
            function gameOver() {
                document.onpointerdown = null;
                document.onpointermove = null;
                document.onpointerup = null;

                initPuzzle();
                setInput('')
            }

            function pieceDropped(e) {
                document.onpointermove = null;
                document.onpointerup = null;
                if (currentDropPiece !== null) {
                    let tmp = {
                        xPos: currentPiece.xPos,
                        yPos: currentPiece.yPos
                    };
                    currentPiece.xPos = currentDropPiece.xPos;
                    currentPiece.yPos = currentDropPiece.yPos;
                    currentDropPiece.xPos = tmp.xPos;
                    currentDropPiece.yPos = tmp.yPos;
                }
                resetPuzzleAndCheckWin();
            }

            function resetPuzzleAndCheckWin() {
                stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
                let gameWin = true;
                for (let piece of pieces) {
                    stage.drawImage(
                        img,
                        piece.sx,
                        piece.sy,
                        pieceWidth,
                        pieceHeight,
                        piece.xPos,
                        piece.yPos,
                        pieceWidth,
                        pieceHeight
                    );
                    stage.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);
                    if (piece.xPos != piece.sx || piece.yPos != piece.sy) {
                        gameWin = false;
                    }
                }
                if (gameWin) {
                    setTimeout(gameOver, 500);
                    setTimeout(() => {
                        setToast(true)
                    }, 200);
                    setwelcomeConf(true)
                    setSeconds(pre => localStorage.setItem('seconds', JSON.stringify(pre)))
                    setMinutes(pre => localStorage.setItem('min', JSON.stringify(pre)))
                    setTimeout(() => {
                        window.location.replace('/')
                    }, 5000);
                    setIsActive(false)
                }
            }

            function shuffleArray(o) {
                for (
                    var j, x, i = o.length;
                    i;
                    j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
                );
                return o;
            }

            function updateDifficulty(e) {
                difficulty = e.target.value;
                pieceWidth = Math.floor(img.width / difficulty);
                pieceHeight = Math.floor(img.height / difficulty);
                puzzleWidth = pieceWidth * difficulty;
                puzzleHeight = pieceHeight * difficulty;
                gameOver();
            }
            document.querySelector("#difficulty").oninput = updateDifficulty;
            setDisAble(true)
        }
    }
    const config = {
        elementCount: 200,
        elementSize: 8,
        spread: 150,
        zIndex: 9999,
        lifetime: 500,
        startVelocity: 30,
    };
    useEffect(() => {
        if (welcomeConf === true) {
            confettiReward();


        }
    }, [welcomeConf]);
    const { reward: confettiReward, isAnimating: isConfettiAnimating } =
        useReward("confettiReward", "confetti", config);

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', flex: '0' }}>
            <span
                id="confettiReward"
                className="z-[100] flex justify-center items-center"
            />
            {
                localStorage.getItem("seconds") && <div className='btn timer'>
                    Puzzel Solved In (0{localStorage.getItem('min')}m:{localStorage.getItem('seconds') >= 10 ? localStorage.getItem('seconds') : '0'.concat(localStorage.getItem('seconds'))}s)
                </div>
            }
            <h1>Puzzle Game</h1>
            <h3>Put Any number from 2 to 5</h3>
            <form onSubmit={handle} style={{ margin: '20px 0' }}>
                <input className="input" type="number" value={input} onChange={(e) => {
                    setInput('')
                    if (e.target.value === '') {
                        window.location.replace('/')

                    }
                    if (e.target.value > 5) {
                        return
                    } else {
                        setInput(e.target.value)
                    }
                }} id="difficulty" />
                {disable ? '' : <input disabled={toast} className="btn" type="submit" value="submit" />
                }
            </form>
            <canvas id="canvas" ></canvas>

            <div >
                <br />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {
                        disable && (!isActive ?
                            <>
                                <button id="click" className='btn btn2' onClick={() => {
                                    setIsActive(true)
                                }}>Start The Puzzel</button>
                                <button className='btn btn2' onClick={reset}>Reset</button>
                            </>
                            : <>
                                <p className='btn btn2'>Time  0{minutes.toString()}:{seconds > 9 ? seconds.toString() : '0'.concat(seconds.toString())}</p>
                                <button className='btn btn2' onClick={reset}>Reset</button>
                            </>)
                    }
                </div>
            </div>
            {toast && <Toaster toaster={toast} />}

        </div >
    )
}
