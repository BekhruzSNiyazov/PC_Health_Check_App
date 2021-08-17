import eel
import psutil

bytes_to_gb = lambda bytes: bytes / 1000000000


@eel.expose
def cpu_usage():
	return psutil.cpu_percent()


@eel.expose
def ram_usage():
	return psutil.virtual_memory().percent


@eel.expose
def ram_total():
	return bytes_to_gb(psutil.virtual_memory().total)


@eel.expose
def ram_gb_used():
	return ram_total() - bytes_to_gb(psutil.virtual_memory().available)


eel.init("front-end")

if __name__ == '__main__':
	eel.start("templates/index.html", jinja_templates="templates", mode="chrome", size=(1500, 800))
