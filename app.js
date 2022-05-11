var _a, _b, _c;
import { Pawn } from './ts/Pawn.js';
import { VirtualGameBoard } from './ts/VirtualGameBoard.js';
import { King } from './ts/King.js';
import { Piece } from './ts/Piece.js';
import { WhiteKnight } from './ts/WhiteKnight.js';
import { BlackKnight } from './ts/BlackKnight.js';
// import { BlackRook } from './ts/BlackRook.js';
import { WhiteRook } from './ts/WhiteRook.js';
import { BlackRook } from './ts/BlackRook.js';
import { BlackBishop } from './ts/BlackBishop.js';
import { WhiteBishop } from './ts/WhiteBishop.js';
import { BlackQueen } from './ts/BlackQueen.js';
import { WhiteQueen } from './ts/WhiteQueen.js';
export let appVirtualGameBoard;
let counter = 0;
// let previewOnly = false;
function initGame() {
    const pb1 = new Pawn('BLACK');
    const pb2 = new Pawn('BLACK');
    const pb3 = new Pawn('BLACK');
    const pb4 = new Pawn('BLACK');
    const pb5 = new Pawn('BLACK');
    const pb6 = new Pawn('BLACK');
    const pb7 = new Pawn('BLACK');
    const pb8 = new Pawn('BLACK');
    const rb1 = new BlackRook();
    const rb2 = new BlackRook();
    const knb1 = new BlackKnight();
    const knb2 = new BlackKnight();
    const bb1 = new BlackBishop();
    const bb2 = new BlackBishop();
    const qb1 = new BlackQueen();
    const kb1 = new King('BLACK');
    const pw1 = new Pawn('WHITE');
    const pw2 = new Pawn('WHITE');
    const pw3 = new Pawn('WHITE');
    const pw4 = new Pawn('WHITE');
    const pw5 = new Pawn('WHITE');
    const pw6 = new Pawn('WHITE');
    const pw7 = new Pawn('WHITE');
    const pw8 = new Pawn('WHITE');
    const rw1 = new WhiteRook();
    const rw2 = new WhiteRook();
    const knw1 = new WhiteKnight();
    const knw2 = new WhiteKnight();
    const bw1 = new WhiteBishop();
    const bw2 = new WhiteBishop();
    const qw1 = new WhiteQueen();
    const kw1 = new King('WHITE');
    // saves the initial setting of all the created chess pieces
    appVirtualGameBoard = [[pb1, pb1.currentIndex], [pb2, pb2.currentIndex], [pb3, pb3.currentIndex], [pb4, pb4.currentIndex], [pb5, pb5.currentIndex], [pb6, pb6.currentIndex], [pb7, pb7.currentIndex], [pb8, pb8.currentIndex], [rb1, rb1.currentIndex], [rb2, rb2.currentIndex], [knb1, knb1.currentIndex], [knb2, knb2.currentIndex], [bb1, bb1.currentIndex], [bb2, bb2.currentIndex], [qb1, qb1.currentIndex], [kb1, kb1.currentIndex], [pw1, pw1.currentIndex], [pw2, pw2.currentIndex], [pw3, pw3.currentIndex], [pw4, pw4.currentIndex], [pw5, pw5.currentIndex], [pw6, pw6.currentIndex], [pw7, pw7.currentIndex], [pw8, pw8.currentIndex], [rw1, rw1.currentIndex], [rw2, rw2.currentIndex], [knw1, knw1.currentIndex], [bw1, bw1.currentIndex], [bw2, bw2.currentIndex], [knw2, knw2.currentIndex], [qw1, qw1.currentIndex], [kw1, kw1.currentIndex]];
    new VirtualGameBoard(appVirtualGameBoard);
    // VirtualGameBoard.virtualGameBoardsArray.push(virtualGameBoard);
    // VirtualGameBoard.virtualGameBoardsArray.push(virtualGameBoard);
    VirtualGameBoard.mapVirtualBoardToGameBoard(VirtualGameBoard.virtualGameBoardsArray[0]);
    //
    let lastIndex = VirtualGameBoard.virtualGameBoardsArray.length - 1;
}
// document.querySelector('.menu__new-game-btn')?.addEventListener('click', initGame);
(_a = document.querySelector('.menu__previous-move-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', showPreviousMove.bind(null, true));
(_b = document.querySelector('.menu__following-move-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', showNextMove);
(_c = document.querySelector('.menu__cancel-move-btn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', cancelMovement);
initGame();
function showPreviousMove(shouldBlock) {
    if (shouldBlock)
        Piece.previewOnly = true;
    if (VirtualGameBoard.virtualGameBoardsArray.length >= VirtualGameBoard.counter && VirtualGameBoard.counter > 1) {
        VirtualGameBoard.counter--;
        // console.log('VirtualGameBoard.counter',VirtualGameBoard.counter);
        showNthMove(VirtualGameBoard.counter);
    }
    else {
        alert('can\'t go any lesser, counter is ' + VirtualGameBoard.counter);
        // console.log('VirtualGameBoard.counter',VirtualGameBoard.counter);
        if (VirtualGameBoard.virtualGameBoardsArray.length === VirtualGameBoard.counter) {
            Piece.previewOnly = false;
        }
    }
    if (Piece.selectedPiece !== null && Piece.selectedPiece !== undefined) {
        Piece.selectedPiece.deselectPiece();
    }
}
function showNextMove() {
    if (VirtualGameBoard.virtualGameBoardsArray.length > VirtualGameBoard.counter) {
        VirtualGameBoard.counter++;
        showNthMove(VirtualGameBoard.counter);
    }
    else {
        alert('can\'t go any further, counter is ' + VirtualGameBoard.counter);
    }
    if (VirtualGameBoard.virtualGameBoardsArray.length === VirtualGameBoard.counter) {
        Piece.previewOnly = false;
    }
}
export function showNthMove(counter) {
    // console.log('showing NTH move:', counter - 1);
    // -1 because can't let sb go further than the last element
    VirtualGameBoard.mapVirtualBoardToGameBoard(VirtualGameBoard.virtualGameBoardsArray[counter - 1]);
}
function cancelMovement() {
    var _a, _b;
    if (Piece.previewOnly)
        return;
    showPreviousMove(false);
    if (Piece.lastMoved)
        Piece.lastMoved.doneMoves--;
    if (((_a = Piece.lastMoved) === null || _a === void 0 ? void 0 : _a.pieceColor) === 'BLACK')
        Piece.colorOfLastMoved = 'WHITE';
    else
        Piece.colorOfLastMoved = 'BLACK';
    if (Piece.lastMovingAr.length > 1)
        Piece.lastMoved = Piece.lastMovingAr[Piece.lastMovingAr.length - 2];
    else
        Piece.lastMoved = null;
    Piece.lastMovingAr.pop();
    if (VirtualGameBoard.virtualGameBoardsArray.length > 1) {
        VirtualGameBoard.virtualGameBoardsArray.pop();
    }
    // console.log('CURRENT:',VirtualGameBoard.virtualGameBoardsArray);
    if (Piece.appVirtualGameBoardCopy.length > 1) {
        appVirtualGameBoard = Piece.appVirtualGameBoardCopy[Piece.appVirtualGameBoardCopy.length - 1];
        Piece.appVirtualGameBoardCopy.pop();
    }
    let lastLogPair = document.querySelectorAll('.log-pair')[document.querySelectorAll('.log-pair').length - 1];
    let numberOfPairs = document.querySelectorAll('.log-pair').length;
    // console.log('numberOfPairs:',numberOfPairs);
    if ((lastLogPair.children.length === 1) && (numberOfPairs > 1)) {
        lastLogPair.remove();
    }
    else {
        (_b = lastLogPair.lastElementChild) === null || _b === void 0 ? void 0 : _b.remove();
    }
    // appVirtualGameBoard =  VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1]
}
