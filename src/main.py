import eel
import psutil
import shutil

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

@eel.expose
def disk_usage():
	total, used, free = shutil.disk_usage("/")
	total = total // (2 ** 30)
	used = used // (2 ** 30)
	free = free // (2 ** 30)
	return [total, used, free]


eel.init("front-end")

if __name__ == '__main__':
	eel.start("templates/index.html", jinja_templates="templates", mode="chrome", size=(1500, 800))
