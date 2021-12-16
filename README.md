# GUI-HW5
Scrabble

Link to Website: https://csofya.github.io/GUI-HW5/
Link to Repo: https://github.com/csofya/GUI-HW5


Two key features of implementing Scrabble is handling two events:
-> When a letter tile is dropped on the gameboard [drop_on_board()]
-> When a letter tile is dropped on the rack [drop_on_rack()]

******************************
**	generate_seven_tiles()  **
******************************
To create the game board, I created seven <div>s  and declared them as jQuery droppables. The letter tiles are generated randomly by choosing an index number that matches with the keys of the associative array that contains information on the letter tiles. After instantiating a letter tile by creating a jQuery object, I assigned an id according to the letter value. The rack is represented as one <div> with the rack background image and declared as a jQuery droppable as well. In order to format the seven tiles in a row, you can declare the positioning of the dropped draggables, and in this case, float to the left of each tile. Each time a tile is added onto the rack, the remaining tiles get decremented by one.

******************************
**	    drop_on_board()     **
******************************
Each time a letter tile is dropped onto a board square, the board square assigns itself the same id as the letter tile. A for loop reads each child within each of the seven divs in order to generate a full word. This is used to generate the word displayed in the scoreboard and to also keep track of whether the word is consecutive. A separate function, check_single_word(), uses regex to determine whether the word is invalid and if it is, return the letter tile to the rack. This function also handles consecutive words by reverting letters that attempt to break a whole word when a user moves a letter from within the game board. This is done by assigning an additional class of “innerletter” because the accept() function will return false if the user tries to move an inner letter. However, class “innterletter” gets dynamically updated whenever a tile is placed somewhere else.

******************************
**	    drop_on_rack()      **
******************************
Since the word and score displayed on the scoreboard has to dynamically change when a letter tile is dropped on the rack as well, this function deals with this behavior as well. Similar to drop_on_board(), a for loop will traverse through objects of class “droppable_tiles” to grab the children of each <div> and determine the total word. Since the “innerletter” may change, remove this id if so. The algorithm for drop_on_rack() is very similar to drop_on_board() since each time a letter tile is moved, the same behavior should be produced.

The remaining functions deal with updating the scoreboard and requires HTML DOM document objects to be called and to update its values using basic arithmetic. All functionalities should be complete.
