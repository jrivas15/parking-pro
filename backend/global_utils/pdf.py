from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from models.cliente import Cliente
from datetime import datetime
from reportlab.pdfgen import canvas
from global_utils.paths import path_fac_fe, path_logo, path_qr, path_qr_fe
# from apps.parking_settings.models import DatosParqueadero
from global_utils.barcode_qr import crear_qr
from models.recibos.fe import ReciboFeModel

DatosParqueadero = {}
def recibo_pago_fe(recibo_fe_model:ReciboFeModel, 
                year_ticket = datetime.now().year, 
                cliente = Cliente('NATURAL', '', '', '', '','', '', '','2222222222', 'NIT', '', '', 'No aplica', 'No aplica'),
                ambiente = 'PRUEBAS'):
    w,h =(220, 756)
    data_parking = DatosParqueadero.objects.all().first()
    c = canvas.Canvas(path_fac_fe, pagesize=(w,h))
    # configs = leer_sf_config()
    # logo_factura = configs[2] #TODO :  OBTENER CONFIG FROM DB
    logo_factura = True
    #*-------LOGO------
    if logo_factura:
        x = w/2 - 40
        y = h - 75
        c.drawImage(path_logo, x, y, width=80, height=80) 
    else:
         y = h - 20
    #*-------NOMBRE DEL PARQUEADERO------
    nombre_parqueadero = data_parking.razon_social
    x = w/2
    y -= 5
    c.setFont("Helvetica-Bold", 17)
    c.drawCentredString(x,y, nombre_parqueadero)
    #*-------ENCABEZADO------
    body_header = data_parking.encabezado.split("\n")
    y -= 15
    c.setFont("Helvetica", 8)
    for linea in body_header:
        c.drawCentredString(x, y, linea)
        y -= 9
    #*-------MENSAJE 1------
    if len( data_parking.enc_men_1 ) > 0:
        c.drawCentredString(x, y, data_parking.enc_men_1)
        y -= 9
    #*-------MENSAJE 2------
    if len( data_parking.enc_men_2 ) > 0:
        c.drawCentredString(x, y,  data_parking.enc_men_2)
        y -= 9

    c.setFont("Helvetica-Bold", 11)
    y -=10
    c.drawCentredString(x, y, f"FACTURA ELECTRÓNICA DE VENTA  ")
    y -=13
    c.drawCentredString(x, y, f"{recibo_fe_model.factura_id}")
    y -=15
    #*-----------QR----------
    crear_qr(recibo_fe_model.placa, path_qr)
    y -= 95
    x = w/2 - 50
    c.drawImage(path_qr,x, y, width=100, height=100)
    y -= 10
    
    y += 5

    #*-------INFO TICKET------
    x = w*.1
    c.setFont("Helvetica", 10)
    c.drawString(x, y, f"Concepto :  Servicio de parqueadero")
    y -=13
    c.drawString(x, y, f"Fecha de emisión : {recibo_fe_model.fecha_e}")
    y -=13
    c.drawString(x, y, f"Hora de emisión : {recibo_fe_model.hora_e}")
    y -=13
    c.drawString(x, y, f"Razón social:   {cliente.name}")
    y -=13
    c.drawString(x, y, f"T.DOC:   {cliente.t_doc}")
    y -=13
    c.drawString(x, y, f"No.DOC:   {cliente.id}")
    y -=13
    c.drawString(x, y, f"Email(@):   {cliente.email}")
    y -=13
    c.drawString(x, y, f"CUFE:  ")
    y -=29
    style_p = ParagraphStyle('my_style', 
                         fontName = 'Helvetica',
                         fontSize= 9,
                         alignment = 4,
                         leading=9
                         )
    reglamento = Paragraph(recibo_fe_model.cufe, style_p)
    reglamento.wrapOn(c, w*.85, 1)
    reglamento.drawOn(c,x,y)
    #*------ QR -----
    y -= 90
    x = w/2 - 40
    if ambiente == 'PRUEBAS':
        qr = f"https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey={recibo_fe_model.cufe}";
    else:
        qr = f"https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey={recibo_fe_model.cufe}";
    crear_qr(qr, path_qr_fe)
    c.drawImage(path_qr_fe, x, y, width=80, height=80) 

    #*-------INFO VENTA------
    y -= 13
    c.line(w*0.1, y, w*.9, y)
    x = w*0.9
    y -=13
    c.drawRightString(x, y, "Subtotal $ {:,.2f}".format(recibo_fe_model.subtotal))
    y -= 13
    c.drawRightString(x, y, "IVA $ {:,.2f}".format(recibo_fe_model.impuesto))
    y -= 13
    c.setFont("Helvetica-Bold", 13)
    c.drawRightString(x, y, "Total $ {:,.2f}".format(recibo_fe_model.total))
    y -=11
    c.line(w*0.1, y, w*.9, y)
    #* EMPRESA INFO
    y -= 15
    x = w/2
    year = year_ticket
    c.setFont("Helvetica", 11)
    c.drawCentredString(x, y ,f"Ambientes Seguros S.A.S © {year}")
    y -= 10
    c.setFont("Helvetica", 10)
    c.drawCentredString(x, y ,f"Software: AS-Parking")
    y -= 10
    c.drawCentredString(x, y ,f"www.ambientes-seguros.com")
    y -= 10
    c.drawCentredString(x, y ,f"NIT - 901697756-9")
    c.save()
    return True