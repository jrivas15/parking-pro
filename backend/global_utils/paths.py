import os

ruta_dir = os.path.dirname(os.path.abspath(__file__))
parentDirectory = os.path.dirname(ruta_dir)
print(parentDirectory)
path_cert = os.path.join(ruta_dir,'docs','cert.p12')
path_xml_signed = os.path.join(ruta_dir,'docs','xml_signed')
path_zip_xml = os.path.join(ruta_dir,'docs','zip_xml')
path_cufe = os.path.join(parentDirectory, 'docs', 'qr_cufe.png')
path_log = os.path.join(parentDirectory, 'logs', 'logs.log')
path_skadi = os.path.join(ruta_dir, 'docs', 'skadi.txt')

#*----DOCS
path_xml_unsigned = os.path.join(ruta_dir,'docs')
path_logo = os.path.join(parentDirectory,'static','assets', 'logo.png')
path_qr = os.path.join(ruta_dir, 'docs', 'qr.png')
path_qr_fe = os.path.join(ruta_dir, 'docs', 'qr_fe.png')
path_fac_fe = os.path.join(ruta_dir,'docs', 'fac_fe.pdf')

#*----ENV
path_env = os.path.join(parentDirectory, '.env')
