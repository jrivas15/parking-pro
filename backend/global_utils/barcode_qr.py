import qrcode
import barcode
from barcode.writer import ImageWriter
import os
ruta_dir = os.path.dirname(os.path.abspath(__file__))
parentDirectory = os.path.dirname(ruta_dir)
path_save_file = os.path.join(parentDirectory,"docs", 'cod.png')

def crear_qr(data: str, path = path_save_file):
    img = qrcode.make(data)
    guardar_qr(img=img, path= path)

def guardar_qr(img, path):
    file = open(path, "wb")
    img.save(file)
    file.close()

def crear_codigo_barras(data:str):
    codigo_barras = barcode.Code128(data, writer=ImageWriter())
    codigo_barras.render(text=None)
    codigo_barras.default_writer_options['module_width'] = 5
    codigo_barras.default_writer_options['module_height'] = 6
    codigo_barras.save(path_save_file)

if __name__ == "__main__":
    print(path_save_file)
    crear_qr("ICU006")