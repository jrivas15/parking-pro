from global_utils.data.data_fe import tributos
import json
from apps.ventas.models import Ventas as VentasDB
medio_pago_code = {
    'Efectivo' : '10',
    'Transferencia Débito Bancaria' : '47',
    'Tarjeta crédito o débito' : '47',
    'Transferencia': '47',
    'Mixto': '47'
    }


class Venta():
    def __init__(self, medio_pago:str, precio_sin_iva:float, total_impuesto:float, porcentaje:float, 
                 total_valor_base:float, subtotal:float, total:float, total_pagar:float, productos, tipo_impuesto ='IVA') -> None:
        self.medio_pago_name = medio_pago
        self.medio_pago = '1' #1: Contado 2:Crédito
        self.medio_pago_code = medio_pago_code[medio_pago]
        self.taxable_amount = precio_sin_iva # precio sin iva
        self.tax_amount = total_impuesto # total del impuesto generado
        self.tax_amount_inc = 0.00
        self.tax_amount_iva = 0.00
        self.porcentaje = porcentaje # porcentaje del impuesto 
        #tipo de impuesto
        self.tax_scheme_name = tipo_impuesto
        self.tax_scheme_ID = tributos[self.tax_scheme_name]
        if self.tax_scheme_name == 'INC':
            self.tax_amount_inc = self.tax_amount
        else:
            self.tax_amount_iva = self.tax_amount

        self.line_extension_amount = total_valor_base#total del valor de los productos SIN IMPUESTO
        self.tax_exclusive_amout = subtotal # Subtotal
        self.tax_inclusive_amout = total # TOTAL
        self.charge_total_amout = 0.00 # TOTAL de los cargos
        self.paylable_amount = total_pagar # suma de los totales

        self.productos = self.get_products_dict(productos, porcentaje)
        # print(self.productos)
    
    def get_products_dict(self, productos, porcentaje) -> dict:
        productos_output = {}
        if type(productos) == list:
            for i,producto in enumerate(productos):
                _id = producto[0]
                nombre = producto[1]
                cantidad = producto[2]
                precio_u = producto[3]
                total = producto[4]

                precio_sin_impuesto = Venta.calcular_precio_sin_impuesto(precio_u, porcentaje)

                productos_output[i] = {
                    'id': _id,
                    'cant': cantidad,
                    'precio': precio_sin_impuesto,
                    'descuento_per' : 0,
                    'descuento_valor': 0.00,
                    'impuesto_valor': Venta.calcular_total_impuesto(precio_sin_impuesto, porcentaje, cantidad),
                    'total_sin_impuesto': precio_sin_impuesto *  cantidad,
                    'impuesto_per': porcentaje,
                    'descripcion': nombre,
                    'total': total,
                    'precio_u': precio_u
                }
        else:
            productos_output = productos
        
        return productos_output

    @staticmethod
    def calcular_precio_sin_impuesto(precio, porcentaje_impuesto:int):
        return precio/( 1 + (porcentaje_impuesto/100) )
    
    @staticmethod
    def calcular_total_impuesto(precio, porcentaje_impuesto:int, cantidad):
        return precio * (porcentaje_impuesto/100) * cantidad     

    def to_json_str(self) -> str:
        return json.dumps({
            'medio_pago': self.medio_pago_name,
            'precio_sin_iva': self.taxable_amount,
            'total_impuesto': self.tax_amount,
            'porcentaje': self.porcentaje,
            'total_valor_base': self.line_extension_amount,
            'subtotal': self.tax_exclusive_amout,
            'total': self.tax_inclusive_amout,
            'total_pagar': self.paylable_amount,
            'productos': self.productos,
            'tipo_impuesto':self.tax_scheme_name
        })

    @staticmethod
    def venta_from_json(data_dict:dict):
        print(data_dict)
        #*obligatorios
        medio_pago = data_dict['medio_pago']
        productos = data_dict['productos']
        # try:
        tipo_impuesto = data_dict['tipo_impuesto'] #todo hacerlo de acuerdo al producto
        # print(tipo_impuesto)
        precio_sin_iva = data_dict['precio_sin_iva']
        total_impuesto = data_dict['total_impuesto']
        porcentaje = data_dict['porcentaje']
        total_valor_base = data_dict['total_valor_base']
        subtotal = data_dict['subtotal']
        total = data_dict['total']
        total_pagar = data_dict['total_pagar']
        return Venta(medio_pago, precio_sin_iva, total_impuesto, porcentaje, total_valor_base, subtotal, total, total_pagar, productos,tipo_impuesto)
        # except:
            # venta = Venta(medio_pago = medio_pago, productos= ) #TODO: venta más simple
            # pass

    @staticmethod
    def venta_from_data(data):
        return Venta(data[8],data[10],data[11], 19, data[10],data[10],data[12],data[12])
    
    @staticmethod
    def venta_from_db(venta:VentasDB, impuesto:int):
        producto = [[1, 'Servicio de parqueadero', 1, venta.total, venta.total],]

        return Venta(medio_pago = venta.medio_pago, 
                     precio_sin_iva= venta.valor_base,
                     total_impuesto = venta.valor_iva,
                     porcentaje = impuesto,
                     total_valor_base= venta.valor_base,
                     subtotal = venta.valor_base,
                     total= venta.total,
                     total_pagar=venta.total,
                     productos= producto    
                    )

    @staticmethod
    def venta_to_dict(venta):
        return {
            'medio_pago': venta.medio_pago_name,
            'precio_sin_iva': float(venta.taxable_amount),
            'total_impuesto': float(venta.tax_amount),
            'porcentaje': venta.porcentaje,
            'total_valor_base': float(venta.line_extension_amount),
            'subtotal': float(venta.tax_exclusive_amout),
            'total': float(venta.tax_inclusive_amout),
            'total_pagar': float(venta.paylable_amount)
        }