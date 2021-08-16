import eel

import psutil

print(psutil.cpu_percent())

print(psutil.virtual_memory())

print(psutil.virtual_memory().percent)

print(psutil.virtual_memory().available * 100 / psutil.virtual_memory().total)

@eel.expose
def cpu_usage():
    return psutil.cpu_percent()

@eel.expose
def ram_usage():
    return psutil.virtual_memory().percent

@eel.expose
def free_ram():
    return psutil.virtual_memory().available * 100 / psutil.virtual_memory().total

eel.init("front-end")

if __name__ == '__main__':
    eel.start("templates/index.html", jinja_templates="templates", mode="chrome", size=(1500, 800))
