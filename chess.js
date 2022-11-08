jQuery(document).ready(function($) {
    var h = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    var v = [1,2,3,4,5,6,7,8] 
    let rows = 8;
    let boxes = 8;
    for (let i=rows - 1; i > -1; i-- ) {
        $("#chessboard").append('<div class="row" id=row' + `${i + 1}` + '></div>')
            for (var j = 0; j < boxes; j++) {
            $("#row" + `${i + 1}`).append(`<span class="box s${j + 1}" data-name="sqr-${h[j]}${v[i]}"></span>`)
        }
    }
    var squares = [];
    $('span[data-name]').each(function(index, value) {
        let key = $(this).data('name');
        let piece = '';
        var insert = [key, piece];
        squares.push(insert);
    });
    function changeDefaultPosition(a) {
        if (a == 'd') {
            squares[0][1] = 'br'
            squares[1][1] = 'bn'
            squares[2][1] = 'bb'
            squares[3][1] = 'bq'
            squares[4][1] = 'bk'
            squares[5][1] = 'bb'
            squares[6][1] = 'bn'
            squares[7][1] = 'br'
            for (var i = 8; i < 16; i++) {
                squares[i][1] = 'bp'
            }
            for (var i = 48; i < 56; i++) {
                squares[i][1] = 'wp'
            }
            squares[56][1] = 'wr'
            squares[57][1] = 'wn'
            squares[58][1] = 'wb'
            squares[59][1] = 'wq'
            squares[60][1] = 'wk'
            squares[61][1] = 'wb'
            squares[62][1] = 'wn'
            squares[63][1] = 'wr'
        } else {

        }
        for (var i = 0; i < squares.length; i++) {
            if (squares[i][1].length !== 0) {
                $(`[data-name="${squares[i][0]}"]`).append(`<img src="./images/${squares[i][1]}.png">`)
            }
        }
    }
    var alreadyClicked = false
    changeDefaultPosition('d')
    function evaluate() {
        var rSqrs = []
        var imgs = []
        var sqrs = document.getElementsByClassName('box')
        console.log(sqrs)
        for (var i = 0; i < sqrs.length; i++) {
            if (sqrs[i].getElementsByTagName('img').length == 0) {
                if (sqrs[i].getAttribute('listenedS') !== 'true') {
                    sqrs[i].removeEventListener('click', e => {clickedPiece(e)})
                    sqrs[i].setAttribute('listenedS', 'true')
                }
                rSqrs.push(sqrs[i])
            } else {
                imgs.push(sqrs[i])
            }
        }
        sqrs = rSqrs
        for (var i = 0; i < imgs.length; i++) {
            if (imgs[i].getAttribute('listenedS') !== 'false') {imgs[i].setAttribute('listenedS', 'false')}
            if (imgs[i].getAttribute('listenedI') !== 'true') {
                sqrs[i].removeEventListener('click', e => {squareClicked(e)})
                imgs[i].addEventListener('click', e=> {clickedPiece(e)})
                imgs[i].setAttribute('listenedI', 'true')
            }
        }
        for (var i = 0; i < sqrs.length; i++) {
            sqrs[i].addEventListener('click', e => {squareClicked(e)})
        }
        rSqrs = []
        console.log(imgs,sqrs)
    }
    var lastClicked = false
    function clickedPiece(event) {
        if (event.target.tagName == "SPAN" && event.target.getElementsByTagName('img').length == 0) {return}
        if (lastClicked == false) {
            if (event.target.tagName == 'IMG') {
                lastClicked = event.target.parentElement
                event.target.parentElement.style.backgroundColor = 'red'
            } else {
                lastClicked = event.target
                event.target.style.backgroundColor = 'red'
            }
            return
        } else {
            color = ''
            if (event.target.getElementsByTagName('img').length !== 0) {
                if (event.target.tagName == 'IMG') {
                    for (var i = 0; i < squares.length; i++) {
                        if (squares[i][0] == $(event.target.parentElement).data('name')) {
                            color = squares[i][1].slice(0,1)
                        }
                    }
                    for (var i = 0; i < squares.length; i++) {
                        if (squares[i][0] == $(lastClicked).data('name')) {
                            if (color == squares[i][1].slice(0,1)) {
                                lastClicked.style.backgroundColor = ''
                                lastClicked = false
                                return
                            }
                        }
                    }
            }
            } else {
                for (var i = 0; i < squares.length; i++) {
                    if (event.target.tagName == "IMG") {
                        if (squares[i][0] == $(event.target.parentElement).data('name')) {
                            console.log('good', lastClicked)
                            color = squares[i][1].slice(0,1)
                        } else {
                            if (squares[i][0] == $(event.target).data('name')) {
                                console.log('good', lastClicked)
                                color = squares[i][1].slice(0,1)
                            }
                        }
                    }
                }
                if (color == '') {
                    lastClicked.style.backgroundColor = ''
                    lastClicked = false
                    return
                }
                for (var i = 0; i < squares.length; i++) {
                    if (squares[i][0] == $(lastClicked).data('name')) {
                        console.log(squares[i][1].slice(0,1), color)
                        if (color == squares[i][1].slice(0,1)) {
                            lastClicked.style.backgroundColor = ''
                            lastClicked = false
                            return
                        }
                    }
                }
            }
            if (event.target.tagName == 'IMG') {
                // if (legalMove(lastClicked, ['x', event.target.parentElement])) {
                    var mem = ''
                    for (var i = 0; i < squares.length; i++) {
                        if (squares[i][0] == $(event.target.parentElement).data('name')) {
                            squares[i][1] = ''
                        }
                        if (squares[i][0] == $(lastClicked).data('name')) {
                            mem = squares[i][1]
                            squares[i][1] = ''
                        }
                    }
                    for (var i = 0; i < squares.length; i++) {
                        if (squares[i][0] == $(event.target.parentElement).data('name')) {
                            squares[i][1] = mem
                            mem = ''
                        }
                    }
                    var parEnt = event.target.parentElement
                    event.target.remove()
                    var img = lastClicked.getElementsByTagName('img')[0]
                    lastClicked.getElementsByTagName('img')[0].remove()
                    lastClicked.style.backgroundColor = ''
                    parEnt.append(img)
                    lastClicked = false
                    console.log(lastClicked)
                    evaluate()
                    console.log(squares)
                    // }
                } else {
                    // if (legalMove(lastClicked, ['x', event.target])) {
                        var mem = ''
                        for (var i = 0; i < squares.length; i++) {
                            if (squares[i][0] == $(event.target).data('name')) {
                                squares[i][1] = ''
                            }
                            if (squares[i][0] == $(lastClicked).data('name')) {
                                mem = squares[i][1]
                                squares[i][1] = ''
                            }
                        }
                        for (var i = 0; i < squares.length; i++) {
                            if (squares[i][0] == $(event.target).data('name')) {
                                squares[i][1] = mem
                                mem = ''
                            }
                        }
                        if (event.target.getElementsByTagName('img').length !== 0) {
                            event.target.getElementsByTagName('img')[0].remove()
                        }
                        var img = lastClicked.getElementsByTagName('img')[0]
                        lastClicked.getElementsByTagName('img')[0].remove()
                        lastClicked.style.backgroundColor = ''
                        event.target.append(img)
                        lastClicked = false
                        console.log(lastClicked)
                        evaluate()
                        console.log(squares)
                        // }
                    }
                }
            }
    function squareClicked(event) {
        // if (legalMove(lastClicked, ['p', event.target])) {
            if (event.target.tagName == 'IMG') {return}
            if (lastClicked == false) {return}
            var img = lastClicked.getElementsByTagName('img')[0]
            lastClicked.getElementsByTagName('img')[0].remove()
            event.target.append(img)
            lastClicked.style.backgroundColor = ''
            var mem = ''
            for (var i = 0; i < squares.length; i++) {
                if (squares[i][0] == $(lastClicked).data('name')) {mem = squares[i][1]; squares[i][1]=''}
            }
            for (var i = 0; i < squares.length; i++) {
                if (squares[i][0] == $(event.target).data('name')) {squares[i][1] = mem; mem = ''}
            }
            console.log(lastClicked, squares)
            lastClicked = false
            evaluate()
            return
        // }
    }        
    evaluate()
})