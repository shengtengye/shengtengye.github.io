languagePluginLoader.then(function () {
console.log(pyodide.runPython(`

from js import document
import random, os, js, time, sys

# python part

sys.setrecursionlimit(10000)

timer_start = 0
timer_end = 0
first = True
width, height, mines = 10, 10, 10
field = [ [ 0 for i_ in range(width) ] for i in range(height) ]
mine_coordinates = []
uncovered = [ [ False for i_ in range(width) ] for i in range(height) ]
flag_coordinates = []
status = ""

def change_field():
  global first, width, height, mines, field, mine_coordinates, uncovered, flag_coordinates, status
  first = True
  width_str = document.forms['size']['width'].value
  height_str = document.forms['size']['height'].value
  mines_str = document.forms['size']['mines'].value
  try:
    int(width_str)
    int(height_str)
    int(mines_str)
  except:
    pass
  else:
    try:
      width, height, mines = int(width_str), int(height_str), int(mines_str)
      field = [ [ 0 for i_ in range(height) ] for i in range(width) ]
      mine_coordinates = []
      uncovered = [ [ False for i_ in range(height) ] for i in range(width) ]
      flag_coordinates = []
      status = ""
      generate_field(1, 1)
    except:
      pass
    else:
      width, height, mines = int(width_str), int(height_str), int(mines_str)
      field = [ [ 0 for i_ in range(height) ] for i in range(width) ]
      mine_coordinates = []
      uncovered = [ [ False for i_ in range(height) ] for i in range(width) ]
      flag_coordinates = []
      status = ""
      generate_field_html()

def find_around(targets: list, x: int, y: int) -> int: # find_mine_or_flag 1 for flag and 0 for mine 
  global width, height
  number = 0
  for w in range(x - 1, x + 2):
    for h in range(y - 1, y + 2):
      if w < width and h < height and w >= 0 and h >= 0:
        if (w, h) in targets:
          number += 1
  return number

def generate_field(click_x: int, click_y: int) -> None:
  global width, height, mines, mine_coordinates, field
  print("click!", click_x, click_y)
  possibilities = [ [ (w, h) for h in range(height) ] for w in range(width) ]
  for w in range(click_x - 1, click_x + 2):
    for h in range(click_y - 1, click_y + 2):
      for obj in possibilities:
        if (w, h) in obj:
          obj.remove((w, h))
  print(1)
  # to ensure that the first click on isn't mine
  removed = []
  for i in range(mines):
    mine = random.choice(random.choice(possibilities))
    mine_coordinates.append(mine)
    mine0 = mine[0]
    for i in removed:
      if mine[0] > i:
        mine0 -= 1
    possibilities[mine0].remove(mine)
    if [] in possibilities:
      removed.append(possibilities.index([]))
      possibilities.remove([])
  for mine in mine_coordinates:
    mine0, mine1 = mine[0], mine[1]
    field[mine[0]][mine[1]] = 9
    for w in range(mine0 - 1, mine0 + 2):
      for h in range(mine1 - 1, mine1 + 2):
        if w < width and h < height and w >= 0 and h >= 0 and field[w][h] != 9:
          field[w][h] += 1

def click_event(event: int, click_x: int, click_y: int, first: bool = False, direct_click: bool = True, fill: bool = True) -> None: # direct click stops unflags with left and right clicks
  global width, height, field, uncovered, flag_coordinates, mine_coordinates, status, timer_start
  if event == 0: # left click
    if first: # first click
      timer_start = time.perf_counter()
      generate_field(click_x, click_y)
    if field[click_x][click_y] == 0: # uncover around
      for w in range(click_x - 1, click_x + 2):
        for h in range(click_y - 1, click_y + 2):
          if w < width and h < height and w >= 0 and h >= 0:
            if not uncovered[w][h]:
              uncovered[w][h] = True
              click_event(0, w, h, fill = False)
    if (click_x, click_y) in flag_coordinates and direct_click: # unflag
      flag_coordinates.remove((click_x, click_y))
    elif (click_x, click_y) in mine_coordinates and not (click_x, click_y) in flag_coordinates: # is mine
      status = "Game over!"
    elif not (click_x, click_y) in flag_coordinates: # uncover
      uncovered[click_x][click_y] = True
  elif event == 1: # right click
    if not uncovered[click_x][click_y]:
      if (click_x, click_y) in flag_coordinates: # already flagged, unflag
        flag_coordinates.remove((click_x, click_y))
      else: # flag
        flag_coordinates.append((click_x, click_y))
  elif event == 2: # left and right click
    if field[click_x][click_y] == find_around(flag_coordinates, click_x, click_y): # uncover around
      for w in range(click_x - 1, click_x + 2):
        for h in range(click_y - 1, click_y + 2):
          if w < width and h < height and w >= 0 and h >= 0:
            click_event(0, w, h, direct_click = False, fill = False)
  if fill:
    fill_field() # uses js module

def not_uncovered_coordinates():
  not_uncovered = []
  global uncovered
  for w, ls in enumerate(uncovered):
    for h, boolean in enumerate(ls):
      if not boolean:
        not_uncovered.append((w, h))
  return not_uncovered

# js module part

def generate_field_html() -> None:
  global field, width, height
  html = ""
  for h in range(height):
    html += "<tr>"
    for w in range(width):
      html += f"""<td id="{h}-{w}" oncontextmenu="return false;" onmousedown="pyodide.runPython('mouse_clicked(js.event, {w}, {h})'); return false;"></td>"""
    html += "</tr>"
  document.getElementById('table').innerHTML = html
  document.getElementById('loading').style.display = 'none'
  document.getElementById('container').style.display = 'block'
  document.forms['size'].style.display = 'block'

def fill_field(new: bool = False) -> None:
  global field, height, width, uncovered, flag_coordinates, status
  colors = {
    0: [192, 192, 192],
    1: [1, 0, 254],
    2: [1, 127, 1],
    3: [254, 0, 0],
    4: [1, 0, 128],
    5: [129, 1, 2],
    6: [0, 128, 129],
    7: [0, 0, 0],
    8: [128, 128, 128],
    9: [128, 0, 0],
  }
  for h in range(height):
    for w in range(width):
      if uncovered[w][h]:
        color = colors[field[w][h]]
        document.getElementById(f'{h}-{w}').innerHTML = field[w][h]
        document.getElementById(f'{h}-{w}').style.color = f'rgb({color[0]}, {color[1]}, {color[2]})'
        document.getElementById(f'{h}-{w}').style.backgroundColor = '#c0c0c0'
      elif (w, h) in flag_coordinates:
        document.getElementById(f'{h}-{w}').innerHTML = "🚩"
      elif document.getElementById(f'{h}-{w}').innerHTML == "🚩":
        document.getElementById(f'{h}-{w}').innerHTML = ""
      elif status == "Game over!" and (w, h) in mine_coordinates:
        document.getElementById(f'{h}-{w}').innerHTML = "💣"

def mouse_clicked(event, click_x: int, click_y: int): # event is js.proxy
  global first, mines, status, timer_start, timer_end
  if status == "":
    if event.button == 0: # left click
      click_event(0, click_x, click_y, first)
      if first:
        first = False
    elif event.button == 2: # right click
      click_event(1, click_x, click_y)
    if event.buttons == 3: # left and right click
      click_event(2, click_x, click_y)

  if sorted(not_uncovered_coordinates()) == sorted(mine_coordinates):
    timer_end = time.perf_counter()
    status = "You win!"
    print(f"Time: {timer_end - timer_start}")
  document.getElementById('message_container').innerHTML = status

generate_field_html()
fill_field()
    `));
});
