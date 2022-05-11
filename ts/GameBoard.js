import { Piece } from './Piece.js';
export const gameBoard = [...document.querySelectorAll('.box')];
// console.log(gameBoard);
for (const box of gameBoard) {
    box.addEventListener('click', (e) => {
        if (Piece.previewOnly)
            return;
        if (e.target !== e.currentTarget) {
            return;
        }
        if (Piece.selectedPiece !== null && Piece.selectedPiece !== undefined) {
            let boxIndex = getBoxIndex(box);
            Piece.selectedPiece.move(boxIndex);
            // console.log('Index:' + boxIndex);
        }
    });
}
function getBoxIndex(box) {
    return gameBoard.indexOf(box);
}
export function hideImpossibleMoves(possibleMovesIndexes) {
    for (const box of possibleMovesIndexes) {
        gameBoard[box].classList.remove('box--move-possible');
    }
}
export function showPossibleMoves(possibleMovesIndexes) {
    for (const box of possibleMovesIndexes) {
        gameBoard[box].classList.add('box--move-possible');
    }
}
