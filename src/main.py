import eel

eel.init("front-end")

if __name__ == '__main__':
    eel.start("templates/index.html", jinja_templates="templates", mode="chrome", size=(1500, 800))
