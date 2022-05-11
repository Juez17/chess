import * as CustomTypes from './CustomTypes.js';
import * as GameBoard from './GameBoard.js';
import { appVirtualGameBoard, showNthMove } from '../app.js';
import { VirtualGameBoard } from './VirtualGameBoard.js';
import { Pawn } from './Pawn.js';
export class Piece {
    constructor(color, img, pieceType) {
        this.color = color;
        this.img = img;
        this.pieceType = pieceType;
        this.moves = 0;
        this.index = -1;
    }
    get pieceColor() {
        return this.color;
    }
    appendPieceToBoard(index) {
        // this.appendImgToBoard(index);
        this.index = index;
    }
    appendImgToBoard(index) {
        const img = document.createElement('img');
        img.src = this.img;
        img.alt = `Image of a ${this.pieceType}`;
        GameBoard.gameBoard[index].appendChild(img);
        img.addEventListener('click', this.selectPiece.bind(this));
    }
    deselectPiece() {
        if (!Piece.selectedPiece)
            return;
        // console.log('deselecting');
        GameBoard.hideImpossibleMoves(Piece.currentPossibleMoves);
        Piece.currentPossibleMoves = [];
        Piece.selectedPiece = null;
    }
    selectPiece() {
        if (Piece.previewOnly)
            return;
        //uncomment to introduce round system
        if (!this.isThisColorsTurn()) {
            // alert('it\'s not your turn, buoy');
            return;
        }
        // if the piece is already selected, unselect it and hide its moves, return 
        if (Piece.selectedPiece === this) {
            this.deselectPiece();
            return;
        }
        // if sth was selected and we select sth else
        if (Piece.selectedPiece !== null && Piece.selectedPiece !== this) {
            // alert('ups')
            GameBoard.hideImpossibleMoves(Piece.currentPossibleMoves);
            Piece.selectedPiece = this;
            Piece.currentPossibleMoves = this.getPossibleMovesIndexes();
            GameBoard.showPossibleMoves.call(this, Piece.currentPossibleMoves);
            // console.log(`possible moves: ${Piece.currentPossibleMoves}`)
            return;
        }
        //if we select totally a new piece (without anything selected beforehand)
        if (Piece.selectedPiece === null) {
            Piece.selectedPiece = this;
            Piece.currentPossibleMoves = this.getPossibleMovesIndexes();
            GameBoard.showPossibleMoves.call(this, Piece.currentPossibleMoves);
            // console.log(`possible moves: ${Piece.currentPossibleMoves}`)
            return;
        }
    }
    isThisColorsTurn() {
        if (this.color === Piece.colorOfLastMoved)
            return false;
        return true;
    }
    appendMoveToLog(log) {
        var _a;
        (_a = document.querySelectorAll('.log-pair')[document.querySelectorAll('.log-pair').length - 1]) === null || _a === void 0 ? void 0 : _a.appendChild(log);
        log.scrollIntoView({ behavior: 'smooth' });
    }
    createLog(newIndex) {
        var _a;
        const par = document.createElement('p');
        par.textContent = `${VirtualGameBoard.virtualGameBoardsArray.length - 1}: ${newIndex}`;
        par.classList.add('log-pair__move');
        par.addEventListener('click', () => {
            var _a;
            const movementNumber = +((_a = par.textContent) === null || _a === void 0 ? void 0 : _a.split(':')[0]);
            // console.log(movementNumber);
            // console.log('counter', VirtualGameBoard.counter);
            // let numberOfBackMoves = (VirtualGameBoard.counter - movementNumber) - 1;
            VirtualGameBoard.counter = movementNumber + 1;
            let isLastMovePicked = (VirtualGameBoard.counter - 1) === (VirtualGameBoard.virtualGameBoardsArray.length - 1);
            // console.log('(VirtualGameBoard.virtualGameBoardsArray.length - 1):',VirtualGameBoard.virtualGameBoardsArray.length - 1);
            // console.log('VirtualGameBoard.counter',VirtualGameBoard.counter);
            // console.log('isLastMovePicked',isLastMovePicked);
            // console.log('numberOfBackMoves:', numberOfBackMoves);
            // for(let i = 0; i < numberOfBackMoves; i++) showPreviousMove(true);
            showNthMove(movementNumber + 1);
            if (!isLastMovePicked) {
                // console.log('TRUE');
                Piece.previewOnly = true;
            }
            else {
                Piece.previewOnly = false;
            }
            if (Piece.selectedPiece !== null && Piece.selectedPiece !== undefined) {
                Piece.selectedPiece.deselectPiece();
            }
        });
        if ((VirtualGameBoard.virtualGameBoardsArray.length - 1) % 2 !== 0) {
            const logPair = document.createElement('div');
            logPair.classList.add('log-pair');
            (_a = document.querySelector('.log-container')) === null || _a === void 0 ? void 0 : _a.appendChild(logPair);
        }
        if (Piece.selectedPiece !== null && Piece.selectedPiece !== undefined) {
            Piece.selectedPiece.deselectPiece();
        }
        return par;
    }
    move(newIndex) {
        if (!this.canMove(newIndex)) {
            // console.log('Sorry, cant move like that')
            return;
        }
        else {
            let killed = false;
            let killedPieceIndex = 0;
            //TODO: implement killPiece(), safeguard against king pawns
            if (!VirtualGameBoard.isFieldEmpty(newIndex)) {
                killed = true;
                killedPieceIndex = VirtualGameBoard.findPieceInVirtualBoard(newIndex);
            }
            let oldIndex = this.currentIndex;
            // console.log('Moving from index ' + this.currentIndex);
            this.currentIndex = newIndex;
            // console.log('To index ' + this.currentIndex);
            //changing a pawn into a queen - note that the currentIndex is already changed
            if (this instanceof Pawn) {
                if (this.shouldChangeIntoQueen()) {
                    // console.log('pionek, powinien sie zmienic w krolowa');
                    this.changeIntoQueen();
                }
                else if (this.pieceColor === 'WHITE') {
                    if (((this.currentIndex === oldIndex - 9) || (this.currentIndex === oldIndex - 7)) && VirtualGameBoard.isFieldEmpty(newIndex)) {
                        killed = true;
                        killedPieceIndex = VirtualGameBoard.findPieceInVirtualBoard(newIndex + 8);
                    }
                }
                else if (this.pieceColor === 'BLACK') {
                    if (((this.currentIndex === oldIndex + 9) || (this.currentIndex === oldIndex + 7)) && VirtualGameBoard.isFieldEmpty(newIndex)) {
                        killed = true;
                        killedPieceIndex = VirtualGameBoard.findPieceInVirtualBoard(newIndex - 8);
                    }
                }
            }
            else if (this.pieceType === CustomTypes.PieceType.KING) {
                if (this.currentIndex === oldIndex - 2) {
                    this.castleLong();
                }
                else if (this.currentIndex === oldIndex + 2) {
                    this.castleShort();
                }
            }
            for (let i = 0; i < appVirtualGameBoard.length; i++) {
                appVirtualGameBoard[i][1] = appVirtualGameBoard[i][0].currentIndex;
                // console.log(appVirtualGameBoard[i][0].currentIndex);
                // console.log(appVirtualGameBoard[i][1]);
            }
            // console.log('BEFORE DELETING', VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1]);
            Piece.appVirtualGameBoardCopy.push([...appVirtualGameBoard]);
            if (killed) {
                // this.killEnemyPiece(killedPieceIndex);
                appVirtualGameBoard.splice(killedPieceIndex, 1);
            }
            // console.log('COPY',Piece.appVirtualGameBoardCopy);
            // console.log('appVirtual:', appVirtualGameBoard);
            new VirtualGameBoard(appVirtualGameBoard);
            // new VirtualGameBoard(Piece.appVirtualGameBoardCopy[Piece.appVirtualGameBoardCopy.length - 1]);
            // console.log('NOW THEYRE IN THE SAME INDEX', VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1]);
            VirtualGameBoard.mapVirtualBoardToGameBoard(VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1]);
            // let threatenedKing = Piece.colorOfLastMoved === 'WHITE'? King.Kings[0]: King.Kings[1];
            // if(threatenedKing.isKingChecked()) {
            //     alert('check')
            // }
            Piece.lastMoved = this;
            // console.log(Piece.lastMoved);
            Piece.lastMovingAr.push(Piece.lastMoved);
            Piece.colorOfLastMoved = Piece.colorOfLastMoved === 'BLACK' ? 'WHITE' : 'BLACK';
            this.doneMoves = this.doneMoves + 1;
            // alert(this.doneMoves);
            this.deselectPiece();
        }
        // console.log(VirtualGameBoard.virtualGameBoardsArray);
        this.appendMoveToLog(this.createLog(newIndex));
    }
    findPieceLastMoving() {
        Piece.lastMovingAr[Piece.lastMovingAr.length - 1];
    }
    canMove(newIndex) {
        // console.log('current possibleeeeeeee: ' + Piece.currentPossibleMoves);
        if (Piece.currentPossibleMoves.indexOf(newIndex) !== -1) {
            return true;
        }
        else
            return false;
    }
    killEnemyPiece(index) {
        VirtualGameBoard.addToDeadStack(index);
        VirtualGameBoard.deletePieceFromVirtualBoard(index);
        VirtualGameBoard.renderDeadStack();
    }
    isBeingTaken() {
        // if() return false;
        let indexInVirtualAr = VirtualGameBoard.findPieceInVirtualBoard(this.currentIndex);
        // console.log('IS BEING TAKEN:');
        // console.log('IS BEING TAKEN:',VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1]);
        // console.log('IS BEING TAKEN:',VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1][indexInVirtualAr]);
        let counter = 0;
        for (let i = 0; i < VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1].length; i++) {
            // console.log('IS BEING TAKEN:',VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1][indexInVirtualAr][1]);
            // console.log('IS BEING TAKEN:',VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1][i][1]);
            if (VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1][indexInVirtualAr][1] === VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1][i][1])
                counter++;
        }
        // console.log('==========');
        if (counter > 1)
            return true;
        return false;
    }
    isYourFriendOnField(index) {
        // console.log('IS YOUR FRIEND HERE?',VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1])
        for (let i = 0; i < VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1].length; i++) {
            if (VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1][i][1] === index) {
                if (VirtualGameBoard.virtualGameBoardsArray[VirtualGameBoard.virtualGameBoardsArray.length - 1][i][0].pieceColor === this.pieceColor)
                    return true;
            }
        }
        return false;
    }
    get currentIndex() {
        return this.index;
    }
    set currentIndex(index) {
        this.index = index;
    }
    get doneMoves() {
        return this.moves;
    }
    set doneMoves(value) {
        this.moves = value;
    }
    get image() {
        return this.img;
    }
}
Piece.previewOnly = false;
Piece.appVirtualGameBoardCopy = [];
Piece.currentPossibleMoves = [];
Piece.colorOfLastMoved = 'BLACK';
Piece.lastMovingAr = [];
