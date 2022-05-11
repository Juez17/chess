import { gameBoard } from "./GameBoard.js";
export class VirtualGameBoard {
    constructor(board) {
        // making a shallow copy not to overwrite old arrays
        // this.board = [...board];
        // console.log('HERE');
        // console.log(board);
        let newAr = [];
        for (let i = 0; i < board.length; i++) {
            newAr.push([board[i][0], board[i][1]]);
            // console.log('petla');
            // console.log(board[i][0]);
            // console.log(board[i][1]);
        }
        // console.log(VirtualGameBoard.counter);
        VirtualGameBoard.virtualGameBoardsArray.push(newAr);
        // console.log('Tworze nowa tablice:');
        // console.log(VirtualGameBoard.virtualGameBoardsArray);
        // console.log('============================');
        // console.log(`Length: ${VirtualGameBoard.virtualGameBoardsArray.length}`);
        VirtualGameBoard.counter++;
    }
    //returns the index of a figure before its last movement
    //takes index of a figure which it has in VirtualGameBoard
    // static whereWasLastTime(index: number) {
    //     let lastAr = this.virtualGameBoardsArray[this.virtualGameBoardsArray.length - 1];
    //     console.log('suspected pawn2:', this.virtualGameBoardsArray[this.virtualGameBoardsArray.length - 2][index]);
    //     // this.virtualGameBoardsArray[this.virtualGameBoardsArray.length - 2][index]
    //     // if(this.virtualGameBoardsArray[this.virtualGameBoardsArray.length - 2].length === lastAr.length) {
    //     // }
    //     // else return index;
    //     return 11;
    // }
    static updateIndexesOfPieces(piece, newIndex) {
        let lastAr = this.virtualGameBoardsArray[this.virtualGameBoardsArray.length - 1];
        // console.log(lastAr);
        // console.log('updateIndexesOfPieces - piece.currentIndex: ' , piece.currentIndex)
        for (let i = 0; i < lastAr.length; i++) {
            // console.log(lastAr[i][1])
            if (piece.currentIndex === lastAr[i][1]) {
                // console.log('FOUND YOUUUUUUUUUUUUUU i = ' + i)
                lastAr[i][1] = newIndex;
                break;
            }
        }
    }
    static isFieldEmpty(index) {
        let lastAr = this.virtualGameBoardsArray[this.virtualGameBoardsArray.length - 1];
        // console.log('ISFIELDEMPTY:', lastAr);
        let is = true;
        lastAr.find((ar) => {
            // console.log('ISFIELDEMPTY:', ar[1], ' INDEX: ', index);
            if (ar[1] === index) {
                // console.log('ISFIELDEMPTY: NIE JEST PSUTE');
                is = false;
                return false;
            }
        });
        // console.log('ISFIELDEMPTY:  JEST PSUTE');
        return is;
    }
    //index w szachownicy danego pionka (ten co pozostaje taki sam w tablicy)
    static findPieceInVirtualBoard(index) {
        let lastAr = this.virtualGameBoardsArray[this.virtualGameBoardsArray.length - 1];
        // console.log('lastAr:', lastAr);
        for (let i = 0; i < lastAr.length; i++) {
            // console.log('szukam elementu: ' + index, ', teraz patrze na element: ', lastAr[i][1], lastAr[i][0]);
            if (lastAr[i][1] === index) {
                // console.log('TO TEN!!! ZWRACAM:', i);
                return i;
            }
        }
        return -1;
    }
    //TODO: when you finish all the classes, change pieceType to:  pieceType: King | Pawn | Knight | Rook | Bishop
    static getArOfPiecesOfSpecifiedType(pieceType, color) {
        let lastAr = this.virtualGameBoardsArray[this.virtualGameBoardsArray.length - 1];
        const piecesAr = [];
        // console.log(pieceType);
        for (let i = 0; i < lastAr.length; i++) {
            // console.log('GETAROFPIECESOFSPECIFIEDTYPE['+ i+'][0]', lastAr[i][0] );
            if ((lastAr[i][0].pieceType === pieceType) && lastAr[i][0].pieceColor === color) {
                // console.log('ZNALAZLEM');
                piecesAr.push([lastAr[i][0], i]);
            }
        }
        // else if(pieceType === 'Pawn') {
        //     for(let i = 0; i < lastAr.length; i++) {
        //         console.log(lastAr[i][0] );
        //         if((lastAr[i][0] instanceof Pawn) && lastAr[i][0].pieceColor === color) {
        //             piecesAr.push([lastAr[i][0], lastAr[i][1]]);
        //         }
        //     }
        // }
        // console.log('PIECESAR:', piecesAr)
        return piecesAr;
    }
    static deletePieceFromVirtualBoard(index) {
        let lastAr = this.virtualGameBoardsArray[this.virtualGameBoardsArray.length - 1];
        lastAr.splice(index, 1);
        console.log('AFTER DELETING', lastAr);
    }
    static addToDeadStack(pieceIndex) {
        let lastAr = this.virtualGameBoardsArray[this.virtualGameBoardsArray.length - 1];
        this.deadStack.push(lastAr[pieceIndex][0]);
        // console.log('DEADSTACK', this.deadStack);
    }
    static renderDeadStack() {
        const imgDeadStack = document.querySelector('.dead-stack');
        imgDeadStack.innerHTML = ``;
        for (const piece of this.deadStack) {
            const img = document.createElement('img');
            img.src = piece.image;
            imgDeadStack === null || imgDeadStack === void 0 ? void 0 : imgDeadStack.appendChild(img);
        }
    }
    /***
     * @param possibleIndexes  index which is possible in theory
     *                         (in theory because we don't know if the moving player's king will be checked)
     * @returns true if a move can't be made because a king would be checked, false otherwise
    */
    static mapVirtualBoardToGameBoard(board) {
        for (const box of gameBoard) {
            box.innerHTML = '';
        }
        // console.log(board);
        for (let i = 0; i < board.length; i++) {
            board[i][0].appendPieceToBoard(board[i][1]);
            board[i][0].appendImgToBoard(board[i][1]);
            // console.log(board[i][0]);
            // console.log(board[i][1]);
        }
        // console.log('cala AR:', VirtualGameBoard.virtualGameBoardsArray)
        // console.log(VirtualGameBoard.virtualGameBoardsArray[0][0] === VirtualGameBoard.virtualGameBoardsArray[1][0]);
        // console.log(VirtualGameBoard.virtualGameBoardsArray[0][0]);
        // console.log(VirtualGameBoard.virtualGameBoardsArray[1][0]);
        // for(const piece of board) {
        //     piece.appendPieceToBoard(piece.currentIndex);    
        //     piece.appendImgToBoard(piece.currentIndex);   
        // }
    }
}
// private board: Piece[];
VirtualGameBoard.virtualGameBoardsArray = [];
VirtualGameBoard.counter = 0;
VirtualGameBoard.deadStack = [];
