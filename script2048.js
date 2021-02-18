languagePluginLoader.then(function () {
console.log(pyodide.runPython(`
import js
import random
document = js.document
localStorage = js.localStorage

def save():
    global ls
    global score
    for i in range(16):
        localStorage.setItem(f'ls[{i}]', ls[i])
    localStorage.setItem('score', score)

def load():
    global score
    global ls
    ls = []
    for i in range(16):
        ls.append(int(localStorage.getItem(f'ls[{i}]')))
    score = int(localStorage.getItem('score'))
    renderGame(ls)

def color(tile: int, Id: int):
    tileColors = {
    	0: "cdc1b4",
        1: "999999",
    	2: "eee4da",
        4: "ede0c8",
        8: "f2b179",
    	16: "f59563",
    	32: "f67c5f",
    	64: "f65e3b",
    	128: "edcf72",
        256: "edcc61",
    	512: "edc850",
    	1024: "edc53f",
    	2048: "edc22e",
        4096: "000000",
        8192: "000000",
        16384: "000000",
        32768: "000000",
        65536: "000000",
        131072: "000000"
    }
    tileColor = tileColors[tile]
    jstile = document.getElementById(f"{Id}")
    jstile.style.backgroundColor = f"#{tileColor}"
    jstile.style.color = "white" if tile > 4 else "#776e65"
    jstile.style.fontSize = f"{[7, 6, 5, 4][len(f'{tile}') - 1]}vw"

def keyDown(event, ls: list) -> list:
    global score
    if event.keyCode >=37 and event.keyCode <= 40:
        arrow = [left, up, right, down][event.keyCode - 37]
        renderGame(arrow(ls))
        if arrow(ls) != ls and not gameOver(ls):
            lsAfter = addTiles(arrow(ls, True))
            renderGame(lsAfter)
        elif gameOver(ls): lsAfter = generateHTML()
        elif arrow(ls) == ls: renderGame(ls); lsAfter = ls
    else: lsAfter = ls
    return lsAfter

def gameOver(ls):
    if left(right(up(down(ls)))) == ls and availableSpots(ls) == []:
        return True
    return False


def move(ls, scoreAdd = False):
    global score
    lsCOPY = ls.copy()
    while 0 in lsCOPY:
        lsCOPY.remove(0)
    
    while len(lsCOPY) < 4:
        lsCOPY += [0]
    
    i = 1
    while True:
        j = i - 1
        if lsCOPY[i] == lsCOPY[j]:
            score += lsCOPY[j] * 2 if scoreAdd else 0
            lsCOPY[j] *= 2
            lsCOPY[i] = 0
            if i == 1: i = 3
            else: break
        elif i == 1: i = 2
        elif i == 2: i = 3
        else: break
    
    while 0 in lsCOPY:
        lsCOPY.remove(0)
    
    while len(lsCOPY) < 4:
        lsCOPY += [0]
    
    if int(localStorage.getItem('highScore')) < score:
        localStorage.setItem('highScore', score)
    
    return lsCOPY

def wholeMove(ls, scoreAdd = False):
    result = []
    for i in ls:
        result += move(i, scoreAdd)
    return result

def left(ls, scoreAdd = False):
    return wholeMove([ls[0:4], ls[4:8], ls[8:12], ls[12:16]], scoreAdd)

def right(ls, scoreAdd = False):
    x = wholeMove([ls[3:0:-1] + [ls[0]], ls[7:3:-1], ls[11:7:-1], ls[15:11:-1]], scoreAdd)
    return x[3:0:-1] + [x[0]] + x[7:3:-1] + x[11:7:-1] + x[15:11:-1]

def up(ls, scoreAdd = False):
    x = wholeMove([ls[3:16:4], ls[2:15:4], ls[1:14:4], ls[0:13:4]], scoreAdd)
    return x[12:0:-4]+ [x[0]] + x[13:0:-4] + x[14:1:-4] + x[15:2:-4]

def down(ls, scoreAdd = False):
    x = wholeMove([ls[12:0:-4] + [ls[0]], ls[13:0:-4], ls[14:1:-4], ls[15:2:-4]], scoreAdd)
    return x[3:16:4] + x[2:15:4] + x[1:14:4] + x[0:13:4]
def renderGame(ls: list) -> None:
    global score
    for pos, i in enumerate(ls, 1):
        document.getElementById(f"{pos}").innerHTML = str(i) if i != 0 else ""
        color(i, pos)
    document.getElementById('scoreNumber').innerHTML = score
    document.getElementById('highScoreNumber').innerHTML = localStorage.getItem('highScore')

def availableSpots(ls):
    lsCOPY = ls.copy()
    spots = []
    while 0 in lsCOPY:
        idx = lsCOPY.index(0)
        spots.append(idx)
        lsCOPY[idx] = "ZERO"
    return spots

def addTiles(ls):
    lsCOPY = ls.copy()
    x = random.choice(availableSpots(ls))
    lsCOPY[x] = 2 if random.random() < 0.9 else 4
    return lsCOPY

def generateHTML() -> list:
    global score
    score = 0
    html = ""
    for i in range(4):
        html += "<tr>"
        for j in range(1, 5):
            html += f'<td class="border" id="{4 * i + j}"></td>'
        html += "</tr>"
    document.getElementById("table").innerHTML = html
    ls = addTiles(addTiles([0 for i in range(16)]))
    renderGame(ls)
    return ls

if localStorage.getItem('highScore') == None:
    print(None)
    localStorage.setItem('highScore', 0)

document.getElementById('loading').style.display = "none"
document.getElementById('gameContent').style.display = "block"
ls = generateHTML()
    `));
});
