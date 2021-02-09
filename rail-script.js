backslash = "\\"

languagePluginLoader.then(function () {
console.log(pyodide.runPython(`
from js import document, backslash

# rail:
    # 1: ║
    # 2: ═
    # 3: ╝
    # 4: ╚
    # 5: ╗
    # 6: ╔
# redstone: 
    #7: •
    #8: │
    #9: ─
    #10: ┘
    #11: └
    #12: ┐
    #13: ┌
    #14: ┬
    #15: ├
    #16: ┤
    #17: ┴
    #18: ┼

def connectRails(worldLayer: list) -> list:
    # Connect rails (shown in list) to face the right way
    for r, i in enumerate(worldLayer[1:-1], 1):
        for c, v in enumerate(i[1:-1], 1):
            closeIdx = [[r - 1, c], [r, c - 1], [r , c + 1], [r + 1, c]]
            close = [worldLayer[x][y] for x, y in closeIdx]
            if worldLayer[r][c] >= 1 and worldLayer[r][c] <= 6:
                rails = [j <= 6 and j >= 1 for j in close]
                if rails.count(True) == 1:
                    worldLayer[r][c] = [1, 2, 2, 1][rails.index(True)]
                if rails.count(True) == 2:
                    trueIdx = rails.index(True)
                    if trueIdx == 0:
                        if rails.index(True, trueIdx + 1) == 1:
                            data = 3
                        elif rails.index(True, trueIdx + 1) == 2:
                            data = 4
                        else:
                            data = 1
                    elif trueIdx == 1: data = 2 if rails.index(True, trueIdx + 1) == 2 else 5
                    else: data = 6
                    worldLayer[r][c] = data
                if rails.count(True) == 3:
                    worldLayer[r][c] = [6, 6, 5, 4][rails.index(False)]
            elif worldLayer[r][c] >= 7 and worldLayer[r][c] <= 18:
                redstone = [j <= 18 and j >= 7 for j in close]
                if redstone.count(True) == 0:
                    worldLayer[r][c] = 7
                if redstone.count(True) == 1:
                    worldLayer[r][c] = [8, 9, 9, 8][redstone.index(True)]
                if redstone.count(True) == 2:
                    trueIdx = redstone.index(True)
                    if trueIdx == 0:
                        if redstone.index(True, trueIdx + 1) == 1:
                            data = 10
                        elif redstone.index(True, trueIdx + 1) == 2:
                            data = 11
                        else:
                            data = 8
                    elif trueIdx == 1: data = 9 if redstone.index(True, trueIdx + 1) == 2 else 12
                    else: data = 13
                    worldLayer[r][c] = data
                if redstone.count(True) == 3:
                    worldLayer[r][c] = [14, 15, 16, 17][redstone.index(False)]
                if redstone.count(True) == 4: 
                    worldLayer[r][c] = 18
    return worldLayer

def showHTML(worldLayer: list) -> list:
    HTML = []
    Types = [("blank", 0), ("straight", 1), ("straight", 0), ("curved", 2), ("curved", 3), ("curved", 1), ("curved", 0)]
    for i in worldLayer[1:-1]:
        Temp = i[1:-1]
        for p, char in enumerate(Types):
            Temp = [char if j == p else j for j in Temp]
        HTML.append(Temp)
    return HTML

def generateSVG(width: int, height: int) -> list:
    svg = f'<svg id="svg" width="{161 * width + 1}" height="{161 * height + 1}">'
    for r, y in enumerate(range(1, 161 * width + 1, 161), 1):
        for c, x in enumerate(range(1, 161 * height + 1, 161), 1):
            svg += f'''<image id="{x}-{y}-" x="{x}" y="{y}" href="Images/Rail-blank-0.png" width="160px" height="160px" onclick="pyodide.runPython('world = placeRail(world,{r}, {c})')" onmouseover="pyodide.runPython('addBorder({x}, {y})')" onmouseleave="pyodide.runPython('removeBorder()')"></image>'''
    svg += '<g id="border"></g></svg>'
    document.getElementById("svg").outerHTML = svg
    return [[0 for i in range(width + 2)] for i in range(height + 2)]

def renderRail(r: int, c: int, x: int, y: int, railType: str, rotation: int) -> None:
    document.getElementById(f'{x}-{y}-').outerHTML = f'''<image id="{x}-{y}-" x="{x}" y="{y}" href="Images/Rail-{railType}-{rotation}.png" width="160px" height="160px" onclick="pyodide.runPython('placeRail(world, {r}, {c})')" onmouseover="pyodide.runPython('addBorder({x}, {y})')" onmouseleave="pyodide.runPython('removeBorder()')"></image>'''

world = generateSVG(10, 10)
print(world)

def addBorder(x: int, y: int) -> None:
    document.getElementById("border").innerHTML = f'<rect id="border" x="{x - 1}" y="{y - 1}" width="162" height="162">'

def removeBorder() -> None:
    document.getElementById("border").innerHTML = ""

def placeRail(worldLayer: list, row: int, column: int) -> list:
    worldLayer[row][column] = 1
    worldLayer = connectRails(worldLayer)
    html = showHTML(worldLayer)
    for r, y in enumerate(range(1, 161 * (len(worldLayer) - 2), 161), 1):
        for c, x in enumerate(range(1, 161 * (len(worldLayer[0]) - 2), 161), 1):
            railType, rotation = html[r - 1][c - 1]
            try:
                renderRail(r, c, x, y, railType, rotation)
            except:
                pass
            else:
                renderRail(r, c, x, y, railType, rotation)
    return worldLayer



#for i in show(connectRails(world[0])): 
#    Temp = ""
#    for j in i:
#        Temp += str(j)
#    print(Temp)
    `));
});
